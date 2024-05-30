import dotenv from 'dotenv';
dotenv.config();
import {    
    Mina,
    PrivateKey,
    fetchAccount,
    PublicKey,
    UInt64,
    Lightnet,    
  } from 'o1js';
import { ZkonRequestCoordinator } from '../build/src/ZkonRequestCoordinator.js';
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
      oracleAddress,
      treasuryAddress,
      tokenAddress,
      zkCoordinatorAddress
  

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

    tokenAddress = localData.tokenAddress ? PublicKey.fromBase58(localData.tokenAddress) : (await Lightnet.acquireKeyPair()).publicKey
    treasuryAddress = sender
    oracleAddress = sender

    zkCoordinatorAddress = localData.coordinatorAddress ? PublicKey.fromBase58(localData.coordinatorAddress) : (await Lightnet.acquireKeyPair()).publicKey;
    try {
      await fetchAccount({ publicKey: sender })
    } catch (error) {
      senderKey = (await Lightnet.acquireKeyPair()).privateKey
      sender = senderKey.toPublicKey();
    }
  }else{
    tokenAddress = process.env.TOKEN_ADDRESS ?
    PublicKey.fromBase58(process.env.TOKEN_ADDRESS) : 
      PublicKey.fromBase58('B62qrqYtrQLQyudxG38HkLZ4GFB2Zy1z64DjqQaD7yv3pwGBQQQfSZ3');
    
    treasuryAddress = process.env.TREASURY_ADDRESS ? 
      PublicKey.fromBase58(process.env.TREASURY_ADDRESS) : 
      PublicKey.fromBase58('B62qkaxsQG86VQRsHPqZBQe8Pfwj7TXH3dm7domVe44gL7EdMToetzd');
      
    oracleAddress = PrivateKey.random().toPublicKey();//Mocked. Variable not used

    zkCoordinatorAddress = PublicKey.fromBase58(process.env.COORDINATOR_ADDRESS);
  }

  const feePrice = new UInt64(100);

  console.log(`Fetching the fee payer account information.`);
  const accountDetails = (await fetchAccount({ publicKey: sender })).account;
  console.log(
    `Using the fee payer account ${sender.toBase58()} with nonce: ${
      accountDetails?.nonce
    } and balance: ${accountDetails?.balance}.`
  );
  console.log('');
  
  // Coordinator compilation  
  await ZkonRequestCoordinator.compile();  
  
  const coordinator = new ZkonRequestCoordinator(zkCoordinatorAddress);
  console.log('');
  
  // zkApps deployment
  console.log(`Init coordinator state.`);
  let transaction = await Mina.transaction(
    { sender, fee: transactionFee },
    async () => {
      await coordinator.initState(
        treasuryAddress,
        tokenAddress,
        feePrice,
        oracleAddress
      );
    }
  );
  console.log('Signing');
  transaction.sign([senderKey]);
  console.log('Generating proof');
  await transaction.prove()
  console.log('Proof generated');
  console.log('');
  console.log('Sending the transaction.');
  let pendingTx = await transaction.send();
  if (pendingTx.status === 'pending') {
    console.log(`Success! Init state transaction sent.  
  Txn hash: ${pendingTx.hash}
  Block explorer hash: https://minascan.io/devnet/tx/${pendingTx.hash}`);  
  }
  console.log('Waiting for transaction inclusion in a block.');
  await pendingTx.wait({ maxAttempts: 90 });
  console.log('');