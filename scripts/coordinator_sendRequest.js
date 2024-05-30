import dotenv from 'dotenv';
dotenv.config();
import {    
    Mina,
    PrivateKey,
    fetchAccount,
    PublicKey,
    Lightnet,
  } from 'o1js';
import { ZkonRequestCoordinator } from '../build/src/ZkonRequestCoordinator.js';
import { StringCircuitValue } from '../build/src/String.js';
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

  const ipfsHash = 'QmbCpnprEGiPZfESXkbXmcXcBEt96TZMpYAxsoEFQNxoEV'; //Mock JSON Request

  const ipfsHashSegmented0 = segmentHash(ipfsHash);

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
  console.log(`Send request via ZkonRequestCoordinator.`);
  let transaction = await Mina.transaction(
    { sender, fee: transactionFee },
    async () => {
      await coordinator.sendRequest(
        sender,
        ipfsHashSegmented0.field1,
        ipfsHashSegmented0.field2
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
    console.log(`Success! Request Sent.  
  Txn hash: ${pendingTx.hash}
  Block explorer hash: https://minascan.io/devnet/tx/${pendingTx.hash}`);  
  }
  console.log('Waiting for transaction inclusion in a block.');
  await pendingTx.wait({ maxAttempts: 90 });
  console.log('');

  if (!useCustomLocalNetwork){
    const events = await coordinator.fetchEvents();
    console.log(events);
    console.log(events[1].type);
    console.log(events[1].event.data);
    const requestEvent = provablePure(events[0].event.data).toFields(events[0].event.data);
    console.log('Sender from hash:', PublicKey.fromFields([requestEvent[3], requestEvent[4]]));
    console.log(sender);
  }

  function segmentHash(ipfsHashFile) {
    const ipfsHash0 = ipfsHashFile.slice(0, 30); // first part of the ipfsHash
    const ipfsHash1 = ipfsHashFile.slice(30); // second part of the ipfsHash

    const field1 = new StringCircuitValue(ipfsHash0).toField();

    const field2 = new StringCircuitValue(ipfsHash1).toField();

    return { field1, field2 };
  }