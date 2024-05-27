import dotenv from 'dotenv';
dotenv.config();
import {    
    Mina,
    PrivateKey,
    fetchAccount,
    PublicKey,
    AccountUpdate,
  } from 'o1js';
import { ZkonRequest } from '../build/src/ZkonRequest.js';
    
  const transactionFee = 100_000_000;
  
  // Network configuration
  const network = Mina.Network({
    mina: 'https://api.minascan.io/node/devnet/v1/graphql',
  });
  Mina.setActiveInstance(network);

  const ipfsHash = 'QmbCpnprEGiPZfESXkbXmcXcBEt96TZMpYAxsoEFQNxoEV'; //Mock JSON Request
  
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
  
  // Coordinator  
  const zkRequestKey = PrivateKey.random();
  const zkRequestAddress = zkRequestKey.toPublicKey();
  
  await ZkonRequest.compile();
  console.log('Compiled');
  const zkRequest = new ZkonRequest(zkRequestAddress);
  console.log('');
  
  // zkApps deployment
  console.log(`Deploy zkRequest.`);  
  let transaction = await Mina.transaction(
    { sender, fee: transactionFee },
    async () => {
      AccountUpdate.fundNewAccount(sender)
      await zkRequest.deploy();
    }
  );
  console.log('Generating proof');
  await transaction.prove()
  console.log('Proof generated');
  
  console.log('Signing');
  transaction.sign([senderKey, zkRequestKey]);
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
  console.log('');