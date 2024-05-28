import dotenv from 'dotenv';
dotenv.config();
import {    
    Mina,
    PrivateKey,
    fetchAccount,
    PublicKey,
    UInt64,    
  } from 'o1js';
import { ZkonRequestCoordinator } from '../build/src/ZkonRequestCoordinator.js';
import { StringCircuitValue } from '../build/src/String.js';
    
  const transactionFee = 100_000_000;
  
  // Network configuration
  const network = Mina.Network({
    mina: 'https://api.minascan.io/node/devnet/v1/graphql',
  });
  Mina.setActiveInstance(network);
  
  const ipfsHash = 'QmbCpnprEGiPZfESXkbXmcXcBEt96TZMpYAxsoEFQNxoEV'; //Mock JSON Request

  const ipfsHashSegmented0 = segmentHash(ipfsHash);
  
  //const Fee payer setup
  const senderKey = PrivateKey.fromBase58(process.env.DEPLOYER_KEY);
  const sender = PublicKey.fromBase58(process.env.DEPLOYER_ACCOUNT);

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
  
  const zkCoordinatorAddress = PublicKey.fromBase58(process.env.COORDINATOR_ADDRESS);
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

  function segmentHash(ipfsHashFile) {
    const ipfsHash0 = ipfsHashFile.slice(0, 30); // first part of the ipfsHash
    const ipfsHash1 = ipfsHashFile.slice(30); // second part of the ipfsHash

    const field1 = new StringCircuitValue(ipfsHash0).toField();

    const field2 = new StringCircuitValue(ipfsHash1).toField();

    return { field1, field2 };
  }