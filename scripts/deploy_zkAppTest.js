import dotenv from 'dotenv';
dotenv.config();
import {    
    Mina,
    PrivateKey,
    fetchAccount,
    AccountUpdate,
    Lightnet,
    PublicKey,
  } from 'o1js';
import { ZkAppTest } from '../build/src/ZkAppTest.js';
import fs from 'fs-extra';
    
  // Network configuration
  const transactionFee = 100_000_000;
  const useCustomLocalNetwork = process.env.USE_CUSTOM_LOCAL_NETWORK === 'true';  
  const network = Mina.Network({
    mina: useCustomLocalNetwork
      ? 'http://localhost:8080/graphql'
      : 'https://api.minascan.io/node/devnet/v1/graphql',
    lightnetAccountManager: 'http://localhost:8181',
    // archive: useCustomLocalNetwork
    // ? '' : 'https://api.minascan.io/archive/devnet/v1/graphql',
  });
  Mina.setActiveInstance(network);

  let senderKey;
  let sender;
  let localData;
  let zkCoordinatorAddress;

  // Fee payer setup
  if (useCustomLocalNetwork){
    localData = fs.readJsonSync('./data/addresses.json');
    let deployerKey;
    if (!!localData){
      if (!!localData.deployerKey){
        deployerKey = PrivateKey.fromBase58(localData.deployerKey)
        zkCoordinatorAddress = localData.coordinatorAddress ? PublicKey.fromBase58(localData.coordinatorAddress) : (await Lightnet.acquireKeyPair()).publicKey;
      }else{
        deployerKey = (await Lightnet.acquireKeyPair()).privateKey
      }
    }
    senderKey = deployerKey;
    sender = senderKey.toPublicKey();
    try {
      await fetchAccount({ publicKey: sender })
    } catch (error) {
      senderKey = (await Lightnet.acquireKeyPair()).privateKey
      sender = senderKey.toPublicKey();
    }
  }else{
    senderKey = PrivateKey.fromBase58(process.env.DEPLOYER_KEY);
    sender = senderKey.toPublicKey();
  }
  
  console.log(`Fetching the fee payer account information.`);
  const accountDetails = (await fetchAccount({ publicKey: sender })).account;
  console.log(
    `Using the fee payer account ${sender.toBase58()} with nonce: ${
      accountDetails?.nonce      
    } and balance: ${accountDetails?.balance}.`
  );
  
  // ZkRequest App  
  const zkAppKey = PrivateKey.random();
  const zkAppAddress = zkAppKey.toPublicKey();
  
  await ZkAppTest.compile();
  console.log('Compiled');
  const zkApp = new ZkAppTest(zkAppAddress);
  console.log('');
  
  // zkApps deployment
  console.log(`Deploy zkApp to ${zkAppAddress.toBase58()}`);  
  let transaction = await Mina.transaction(
    { sender, fee: transactionFee },
    async () => {
      AccountUpdate.fundNewAccount(sender)
      await zkApp.deploy({
        coordinator: zkCoordinatorAddress
      });
    }
  );
  console.log('Generating proof');
  await transaction.prove()
  console.log('Proof generated');
  
  console.log('Signing');
  transaction.sign([senderKey, zkAppKey]);
  console.log('');
  console.log('Sending the transaction for deploying zkRequest.');
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
    localData.zkAPP = zkAppKey.toBase58();
    localData.zkAppAddress = zkAppAddress;
    fs.outputJsonSync(
      "./data/addresses.json",            
        localData,      
      { spaces: 2 }
    );
  }
  console.log('');

  console.log('Fetching zkAppAccount...');
  await fetchAccount(zkAppAddress);
  console.log('zkAppAccount fetched');

  console.log('Coordinator sent as parameter: ', zkCoordinatorAddress.toBase58())
  console.log('')

  const num0 = await zkApp.coordinator.get();
  console.log('Coordinator after state init:', num0.toBase58());