import dotenv from 'dotenv';
dotenv.config();
import {
    AccountUpdate,
    Mina,
    PrivateKey,
    fetchAccount,
    Lightnet,
    UInt8,
  } from 'o1js';
  import { FungibleToken, FungibleTokenAdmin } from 'mina-fungible-token';
  import fs from 'fs-extra';
  
  // Network configuration
  const transactionFee = 100_000_000;
  const useCustomLocalNetwork = process.env.USE_CUSTOM_LOCAL_NETWORK === 'true';  
  const network = Mina.Network({
    mina: process.env.NODE,
    lightnetAccountManager: 'http://localhost:8181',
    archive: process.env.NODE_ARCHIVE,
});
  Mina.setActiveInstance(network);

  let senderKey;
  let sender;
  let localData;

  // Fee payer setup
  if (useCustomLocalNetwork){
    localData = fs.readJsonSync('./data/addresses.json');
    let deployerKey = PrivateKey.fromBase58(process.env.DEPLOYER_KEY);
    if (!deployerKey){
      console.warn('No DEPLOYER_KEY, genereting one with Lighnet');
      deployerKey = (await Lightnet.acquireKeyPair()).privateKey
    }
    senderKey = deployerKey;
    sender = senderKey.toPublicKey();
    await fetchAccount({ publicKey: sender })
  }
  
  console.log(`Fetching the fee payer account information.`);
  console.log(sender.toBase58());
  const accountDetails = (await fetchAccount({ publicKey: sender })).account;
  console.log(
    `Using the fee payer account ${sender.toBase58()} with nonce: ${
      accountDetails?.nonce
    } and balance: ${accountDetails?.balance}.`
  );
  console.log('');

  const zkAppKey = PrivateKey.random();
  const zkAppAddress = zkAppKey.toPublicKey();
  
  // token admin compilation
  console.log('Compiling the token admin smart contract.');
  await FungibleTokenAdmin.compile();
  const tokenAdminContract = new FungibleTokenAdmin(sender);
  console.log('');
  
  // zkApp compilation
  console.log('Compiling the token smart contract.');
  await FungibleToken.compile();
  const zkApp = new FungibleToken(zkAppAddress);
  console.log('');
  
  // zkApps deployment
  console.log(`Deploying zkApp for public key ${zkAppAddress.toBase58()}.`);
  let transaction = await Mina.transaction(
    { sender, fee: transactionFee },
    async () => {
      AccountUpdate.fundNewAccount(sender,1);
      await tokenAdminContract.deploy({
        adminPublicKey: sender,
      })
      await zkApp.deploy({
        admin: tokenAdminContract.address,
        decimals: UInt8.from(9),
        symbol: "ZKON",
        src: ""
      });
    }
  );
  transaction.sign([senderKey, zkAppKey]);
  console.log('Sending the transaction.');
  let pendingTx = await transaction.send();
  if (pendingTx.status === 'pending') {
    console.log(`Success! Deploy transaction sent.
  Your smart contract will be deployed
  as soon as the transaction is included in a block.
  Txn hash: ${pendingTx.hash}
  Block explorer hash: https://minascan.io/devnet/tx/${pendingTx.hash}`);  
  }
  console.log('Waiting for transaction inclusion in a block.');
  await pendingTx.wait({ maxAttempts: 90 });
  if (useCustomLocalNetwork){
    localData.deployerKey = localData.deployerKey ? localData.deployerKey : senderKey.toBase58();
    localData.deployerAddress = localData.deployerAddress ? localData.deployerAddress : sender;
    localData.tokenAddress = zkAppAddress;    
    fs.outputJsonSync(
      "./data/addresses.json",            
        localData,      
      { spaces: 2 }
    );
  }
  console.log('');