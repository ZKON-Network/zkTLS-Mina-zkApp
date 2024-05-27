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

  //Fee payer setup
  const senderKey = PrivateKey.fromBase58(process.env.DEPLOYER_KEY);
  const sender = PublicKey.fromBase58(process.env.DEPLOYER_ACCOUNT);
  
  if (process.env.NEED_FUNDING === true) {
    console.log(`Funding the fee payer account.`);
    await Mina.faucet(sender);
  }
  console.log(`Fetching the fee payer account information.`);
  const accountDetails = (await fetchAccount({ publicKey: sender })).account;
  console.log(
    `Using the fee payer account ${sender.toBase58()} with nonce: ${
      accountDetails?.nonce      
    } and balance: ${accountDetails?.balance}.`
  );
  
  const zkRequestAddress = process.env.ZQREQUEST_ADDRESS ?
    PublicKey.fromBase58(process.env.ZQREQUEST_ADDRESS) : 
    PublicKey.fromBase58('B62qpKt9QUBMEmq4Z95u2ymhsiQJkLLWBctw6NoTiSP9AzJZkR7Fxht');
  
  await ZkonRequest.compile();

  const zkCoordinatorAddress = PublicKey.fromBase58(process.env.COORDINATOR_ADDRESS);
  
  const zkRequest = new ZkonRequest(zkRequestAddress);
  console.log('');
    
  console.log(`Init zkRequest state.`);  
  let transaction = await Mina.transaction(
    { sender, fee: transactionFee },
    async () => {
      await zkRequest.initState(zkCoordinatorAddress);
    }
  );
  console.log('Generating proof');
  await transaction.prove()
  console.log('Proof generated');
  
  console.log('Signing');
  transaction.sign([senderKey]);
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