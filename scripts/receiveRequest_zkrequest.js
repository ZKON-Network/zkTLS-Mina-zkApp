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
import { ZkonRequest } from '../build/src/ZkonRequest.js';
import fs from 'fs-extra';
import { StringCircuitValue } from '../build/src/String.js';
import { ZkonRequestCoordinator } from '../build/src/ZkonRequestCoordinator.js';
import { P256Data, PublicArgumets, ZkonZkProgram } from '../build/src/zkProgram.js';
    
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
      if (!!localData.oracleKey){
        deployerKey = PrivateKey.fromBase58(localData.oracleKey)
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


  await ZkonZkProgram.compile();
    
  await ZkonRequestCoordinator.compile();
  // ZkRequest App
  await fetchAccount({ publicKey: zkRequestAddress }); // Ensure it exis...  

  await ZkonRequest.compile();
  console.log('Compiled');
  const zkRequest = new ZkonRequest(zkRequestAddress);
  console.log('');

  const D = Field(BigInt(`0x${'576308522f190f60ce8deb20267e42235e66199dffe338593f515235734e2566'}`));

  const p256data = new P256Data({
    signature: 'E158B0250E5F1070A07378F8AE847CD7E46FB5C5553A4FA3EA2861E28D267F72A3572292F38B6455F6993E433793065ABDC366503B45515A0DBDB2E3D73C2392',
    messageHex: 'be22c65b744f3a2f6db0c31e5fb7123dc9fcb524c87e62d86ab0d7819ca72009f5d377fc158f72685a76099c7c20afeca749b206c85c7e12311c3cd0778359820001000000000000c00300000000000089f39866000000000041045eeaed1d65c6b3303e8696f9c1bd83ddcaea047dcd8e4809f00e20524adcc81a077b94873adff996fc1e8b0d9316848bc586808485c07338393328b412db61987a2570f6245ff717ea152b02a1a1bc327eac92d345e42837deed432dac83eba5'
  });

  const publicArguments = new PublicArgumets({
    commitment: Field(BigInt(`0x${'576308522f190f60ce8deb20267e42235e66199dffe338593f515235734e2566'}`)),
    dataField: Field(7599633)
  })

  const proof = await ZkonZkProgram.verifySource(
    publicArguments,
    D,
    p256data
  );
  
  // Send request via zkRequest app
  console.log(`Sending request via zkRequest at ${zkRequestAddress.toBase58()}`);  
  let transaction = await Mina.transaction(
    { sender, fee: transactionFee },
    async () => {
      await zkRequest.receiveZkonResponse(Field(1),proof);
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