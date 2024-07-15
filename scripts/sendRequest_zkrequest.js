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
import { ZkonRequest } from '../build/src/ZkonRequest.js';
import fs from 'fs-extra';
import { StringCircuitValue } from '../build/src/String.js';
import { ZkonRequestCoordinator } from '../build/src/ZkonRequestCoordinator.js';
import { ZkonZkProgram } from '../build/src/zkProgram.js';
    
  // Network configuration
  const transactionFee = 100_000_000;
  const useCustomLocalNetwork = process.env.USE_CUSTOM_LOCAL_NETWORK === 'true';  
  const network = Mina.Network({
    mina: useCustomLocalNetwork
      ? 'http://localhost:8080/graphql'
      : 'https://api.minascan.io/node/devnet/v1/graphql',
    lightnetAccountManager: 'http://localhost:8181',
    archive: useCustomLocalNetwork
    ? 'http://localhost:8282' : 'https://api.minascan.io/archive/devnet/v1/graphql',
  });
  Mina.setActiveInstance(network);

  let senderKey;
  let sender;
  let localData;
  let zkCoordinatorAddress;
  let zkRequestAddress;

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

    zkCoordinatorAddress = localData.coordinatorAddress ? PublicKey.fromBase58(localData.coordinatorAddress) : (await Lightnet.acquireKeyPair()).publicKey;    
    zkRequestAddress = localData.zkRequestAddress ? PublicKey.fromBase58(localData.zkRequestAddress) : (await Lightnet.acquireKeyPair()).publicKey;    
    try {
      await fetchAccount({ publicKey: sender })
    } catch (error) {
      senderKey = (await Lightnet.acquireKeyPair()).privateKey
      sender = senderKey.toPublicKey();
    }
  }else{
    localData = fs.readJsonSync('./data/devnet/addresses.json');

    senderKey = PrivateKey.fromBase58(process.env.DEPLOYER_KEY);
    sender = senderKey.toPublicKey();

    zkRequestAddress = PublicKey.fromBase58(localData.zkRequestAddress)

  }
  
  console.log(`Fetching the fee payer account information.`);
  const accountDetails = (await fetchAccount({ publicKey: sender })).account;
  console.log(
    `Using the fee payer account ${sender.toBase58()} with nonce: ${
      accountDetails?.nonce      
    } and balance: ${accountDetails?.balance}.`
    );

  const ipfsHash = 'QmPqp2cFGfoqsGCQduXnHNPFGFj1Bx34MvbXGvWjAXVMqE';

  const ipfsHashSegmented0 = segmentHash(ipfsHash);

  await ZkonZkProgram.compile();
    
  await ZkonRequestCoordinator.compile();
  // ZkRequest App
  await fetchAccount({ publicKey: zkRequestAddress }); // Ensure it exis...  

  await ZkonRequest.compile();
  console.log('Compiled');
  const zkRequest = new ZkonRequest(zkRequestAddress);
  console.log('');
  
  // Send request via zkRequest app
  console.log(`Sending request via zkRequest at ${zkRequestAddress.toBase58()}`);  
  let transaction = await Mina.transaction(
    { sender, fee: transactionFee },
    async () => {
      await zkRequest.sendRequest(ipfsHashSegmented0.field1,ipfsHashSegmented0.field2);
    }
  );
  console.log('Generating proof');
  await transaction.prove()
  console.log('Proof generated');
  
  console.log('Signing');
  transaction.sign([senderKey]);
  console.log('');
  console.log(`Sending the transaction for deploying zkRequest to: ${zkRequestAddress.toBase58()}`);
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
    localData.zkRequest = zkRequestKey.toBase58();
    localData.zkRequestAddress = zkRequestAddress;
    fs.outputJsonSync(
      "./data/addresses.json",            
        localData,      
      { spaces: 2 }
    );
  }
  console.log('');

  if (useCustomLocalNetwork){
    console.log(`Reading from zkApp in ${zkRequestAddress.toBase58()}`);
    console.log('Fetching zkAppAccount...');
    const accountInfo = await fetchAccount({publicKey: zkRequestAddress.toBase58(), network});
    
    if (accountInfo.account.zkapp) {
      const zkAppState = accountInfo.account.zkapp;
      const field1 =  zkAppState.appState[0];
      const field2 =  zkAppState.appState[1];
      console.log(`Coordinator sent as paramenter: ${zkCoordinatorAddress.toBase58()}`);
      console.log('zkApp State:', PublicKey.fromFields([field1,field2]).toBase58() );
    } else {
      console.log('No zkApp found for the given public key.');
    }
    console.log('zkAppAccount fetched');
  }

  function segmentHash(ipfsHashFile) {
    const ipfsHash0 = ipfsHashFile.slice(0, 30); // first part of the ipfsHash
    const ipfsHash1 = ipfsHashFile.slice(30); // second part of the ipfsHash

    const field1 = new StringCircuitValue(ipfsHash0).toField();

    const field2 = new StringCircuitValue(ipfsHash1).toField();

    return { field1, field2 };
  }