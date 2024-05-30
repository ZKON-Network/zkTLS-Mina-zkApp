import dotenv from 'dotenv';
dotenv.config();
import {    
    Mina,
    PrivateKey,
    fetchAccount,
    Lightnet,
    AccountUpdate
  } from 'o1js';
import { ZkonRequestCoordinator } from '../build/src/ZkonRequestCoordinator.js';
import fs from 'fs-extra';
    
  // // Network configuration
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

  // Fee payer setup
  if (useCustomLocalNetwork){
    localData = fs.readJsonSync('./data/addresses.json');
    let deployerKey;
    if (!!localData){
      if (!!localData.deployerKey){
        deployerKey = PrivateKey.fromBase58(localData.deployerKey)
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
  let accountDetails = (await fetchAccount({ publicKey: sender })).account;
  console.log(
    `Using the fee payer account ${sender.toBase58()} with nonce: ${
      accountDetails?.nonce
    } and balance: ${accountDetails?.balance}.`
  );
  console.log('');
  
  // // Coordinator compilation  
  await ZkonRequestCoordinator.compile();
  const coordinatorKey = PrivateKey.random();
  const coordinatorAddress = coordinatorKey.toPublicKey();
  const coordinator = new ZkonRequestCoordinator(coordinatorAddress);
  console.log('');

  // zkApps deployment
  console.log(`Init coordinator state.`);

  let transaction = await Mina.transaction(
    { sender, fee: transactionFee },
    async () => {
      AccountUpdate.fundNewAccount(sender)
      await coordinator.deploy();
    }
  );
  console.log('Signing');
  await transaction.sign([senderKey, coordinatorKey]);
  console.log('Generating proof');
  await transaction.prove()
  console.log('Proof generated');
  console.log('Sending the transaction.');
  console.log('');
  let pendingTx = await transaction.send();
  if (pendingTx.status === 'pending') {
    console.log(`Success! Deploy zkCoordinator transaction sent.  
    Txn hash: ${pendingTx.hash}
    Block explorer hash: https://minascan.io/devnet/tx/${pendingTx.hash}`);
  }
  console.log('Waiting for transaction inclusion in a block.');
  await pendingTx.wait({ maxAttempts: 90 });
  if (useCustomLocalNetwork){
    localData.deployerKey = localData.deployerKey ? localData.deployerKey : senderKey.toBase58();
    localData.deployerAddress = localData.deployerAddress ? localData.deployerAddress : sender;
    localData.coordinatorKey = coordinatorKey.toBase58();
    localData.coordinatorAddress = coordinatorAddress;
    fs.outputJsonSync(
      "./data/addresses.json",            
        localData,      
      { spaces: 2 }
    );
  }
  console.log('');