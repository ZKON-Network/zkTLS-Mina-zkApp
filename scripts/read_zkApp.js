import dotenv from 'dotenv';
dotenv.config();
import {    
    Mina,
    PrivateKey,
    fetchAccount,
    AccountUpdate,
    Lightnet,
    PublicKey,
    Field,
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
  let zkAppAddress;

  // Fee payer setup
  if (useCustomLocalNetwork){
    localData = fs.readJsonSync('./data/addresses.json');
    let deployerKey;
    if (!!localData){
      if (!!localData.deployerKey){
        deployerKey = PrivateKey.fromBase58(localData.deployerKey)
        zkCoordinatorAddress = localData.coordinatorAddress ? PublicKey.fromBase58(localData.coordinatorAddress) : (await Lightnet.acquireKeyPair()).publicKey;
        zkAppAddress = localData.zkAppAddress ? PublicKey.fromBase58(localData.zkAppAddress) : (await Lightnet.acquireKeyPair()).publicKey;
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
  
  await ZkAppTest.compile();
  console.log('Compiled');
  const zkApp = new ZkAppTest(zkAppAddress);
  console.log('');
  
  // zkApps deployment
  console.log(`Reading from zkApp in ${zkAppAddress.toBase58()}`);
  console.log('Fetching zkAppAccount...');
  const accountInfo = await fetchAccount(zkAppAddress.toBase58());
  console.log(accountInfo);
  console.log('zkAppAccount fetched');

  console.log('Coordinator sent as parameter: ', zkCoordinatorAddress.toBase58())
  console.log('')

  const num0 = await zkApp.coordinator.get();
  console.log('Coordinator after state init:', num0.toBase58());