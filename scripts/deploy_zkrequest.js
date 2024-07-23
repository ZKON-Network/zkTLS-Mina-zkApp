import dotenv from 'dotenv';
dotenv.config();
import {    
    Mina,
    PrivateKey,
    fetchAccount,
    AccountUpdate,
    Lightnet,
    PublicKey,
    Proof,
    ZkProgram,
  } from 'o1js';
import { ZkonRequest } from '../build/src/ZkonRequest.js';
import fs from 'fs-extra';
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
    try {
      await fetchAccount({ publicKey: sender })
    } catch (error) {
      senderKey = (await Lightnet.acquireKeyPair()).privateKey
      sender = senderKey.toPublicKey();      
    }
  }else{
    senderKey = PrivateKey.fromBase58(process.env.DEPLOYER_KEY);
    sender = senderKey.toPublicKey();

    zkCoordinatorAddress = PublicKey.fromBase58(process.env.COORDINATOR_ADDRESS);
  }
  
  console.log(`Fetching the fee payer account information.`);
  const accountDetails = (await fetchAccount({ publicKey: sender })).account;
  console.log(
    `Using the fee payer account ${sender.toBase58()} with nonce: ${
      accountDetails?.nonce      
    } and balance: ${accountDetails?.balance}.`
    );  
    
    await ZkonZkProgram.compile();
  // ZkRequest App   
  const zkRequestKey = PrivateKey.random();
  const zkRequestAddress = zkRequestKey.toPublicKey();
  await ZkonRequest.compile();
  console.log('Compiled');
  const zkRequest = new ZkonRequest(zkRequestAddress);
  console.log('');
  
  // zkApps deployment
  console.log(`Deploy zkRequest to ${zkRequestAddress.toBase58()}, with coordinator ${zkCoordinatorAddress.toBase58()} as parameter`);  
  let transaction = await Mina.transaction(
    { sender, fee: transactionFee },
    async () => {
      AccountUpdate.fundNewAccount(sender)
      await zkRequest.deploy({
        coordinator: zkCoordinatorAddress
      });
    }
  );
  console.log('Generating proof');
  await transaction.prove()
  console.log('Proof generated');
  
  console.log('Signing');
  transaction.sign([senderKey, zkRequestKey]);
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
  }else{
    const localData = {
      deployerKey : senderKey.toBase58(),
      deployerAddress : sender,
      coordinatorAddress : zkCoordinatorAddress.toBase58(),
      zkRequest : zkRequestKey.toBase58(),
      zkRequestAddress : zkRequestAddress.toBase58()
    }
    fs.outputJsonSync(
      "./data/devnet/addresses.json",            
        localData,      
      { spaces: 2 }
    );
  }
  console.log('');