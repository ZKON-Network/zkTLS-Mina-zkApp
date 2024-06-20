import dotenv from 'dotenv';
dotenv.config();
import {    
    Mina,
    PrivateKey,
    fetchAccount,
    PublicKey,
    Lightnet,
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

  let senderKey,
      sender,
      localData,
      zkAppAddress,
      zkCoordinatorAddress

  // Fee payer setup
  if (useCustomLocalNetwork){
    console.log("Running in lightnet...")
    localData = fs.readJsonSync('./data/addresses.json');
    let deployerKey;
    if (!!localData){
      deployerKey = localData.deployerKey ? localData.deployerKey : (await Lightnet.acquireKeyPair()).privateKey
    }
    senderKey = PrivateKey.fromBase58(deployerKey);
    sender = senderKey.toPublicKey();

    zkAppAddress = localData.zkAppAddress ? PublicKey.fromBase58(localData.zkAppAddress) : (await Lightnet.acquireKeyPair()).publicKey;
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

    zkAppAddress = process.env.ZQREQUEST_ADDRESS ?
      PublicKey.fromBase58(process.env.ZQREQUEST_ADDRESS) : 
      PublicKey.fromBase58('B62qpKt9QUBMEmq4Z95u2ymhsiQJkLLWBctw6NoTiSP9AzJZkR7Fxht');

    zkCoordinatorAddress = PublicKey.fromBase58(process.env.COORDINATOR_ADDRESS);
  }
  
  // console.log(`Fetching the fee payer account information.`);
  // const accountDetails = (await fetchAccount({ publicKey: sender })).account;
  // console.log(
  //   `Using the fee payer account ${sender.toBase58()} with nonce: ${
  //     accountDetails?.nonce      
  //   } and balance: ${accountDetails?.balance}.`
  // );  
  
  await ZkAppTest.compile(); 
  
  const zkApp = new ZkAppTest(zkAppAddress);
  console.log('');
  
  console.log('Fetch zkAppAccount');
  await fetchAccount(zkAppAddress);
  console.log('Account fetched');

  console.log('Coordinator sent as parameter:', zkCoordinatorAddress.toBase58())
  console.log('')

  const num0 = await zkApp.coordinator.get();
  console.log('Coordinator after state init:', num0.toBase58());

      
  // console.log(`Set coordinator address.`);  
  // let transaction = await Mina.transaction(
  //   { sender, fee: transactionFee },
  //   async () => {
  //     await zkApp.setCoordinator(zkCoordinatorAddress);
  //   }
  // );
  // console.log('Generating proof');
  // await transaction.prove()
  // console.log('Proof generated');
  
  // console.log('Signing');
  // transaction.sign([senderKey]);
  // console.log('');
  // console.log('Sending the transaction for setting the coordinator address.');
  // let pendingTx = await transaction.send();
  // if (pendingTx.status === 'pending') {
  //   console.log(`Success! zkApp state initiated
  // as soon as the transaction is included in a block.
  // Txn hash: ${pendingTx.hash}
  // Block explorer hash: https://minascan.io/devnet/tx/${pendingTx.hash}`);
  // }
  // console.log('Waiting for transaction inclusion in a block.');
  // await pendingTx.wait({ maxAttempts: 90 });
  // console.log('');  

  
  // const pkFromGetter = await zkApp.getPublicKey();
  // console.log('Coordinator from getter:', pkFromGetter.toBase58());