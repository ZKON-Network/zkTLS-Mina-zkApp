import dotenv from 'dotenv';
dotenv.config();
import {
    AccountUpdate,
    Mina,
    PrivateKey,
    fetchAccount,
    PublicKey,
    UInt8,
  } from 'o1js';
  import { FungibleToken, FungibleTokenAdmin } from 'mina-fungible-token';
  
  const zkAppKey = PrivateKey.random();
  const zkAppAddress = zkAppKey.toPublicKey();
  const transactionFee = 100_000_000;
  
  // Network configuration
  const network = Mina.Network({
    mina: 'https://api.minascan.io/node/devnet/v1/graphql',    
  });
  Mina.setActiveInstance(network);
  
  // Fee payer setup
  const senderKey = PrivateKey.fromBase58(process.env.DEPLOYER_KEY);
  const sender = PublicKey.fromBase58(process.env.DEPLOYER_ACCOUNT);
  if (process.env.NEED_FUNDING === true) {
    console.log(`Funding the fee payer account.`);
    await Mina.faucet(sender);
  }
  console.log(`Fetching the fee payer account information.`);
  const accountDetails = (await fetchAccount({ publicKey: sender })).account;
  console.log(
    `Using the fee payer account ${sender.toBase58()} with nonce: ${
      accountDetails?.nonce
    } and balance: ${accountDetails?.balance}.`
  );
  console.log('');
  
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
  console.log('');