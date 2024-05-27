import dotenv from 'dotenv';
dotenv.config();
import {    
    Mina,
    PrivateKey,
    fetchAccount,
    UInt64,
    Lightnet,
    AccountUpdate
  } from 'o1js';
import { ZkonRequestCoordinator } from '../build/src/ZkonRequestCoordinator.js';
    
  const transactionFee = 100_000_000;

  const useCustomLocalNetwork = process.env.USE_CUSTOM_LOCAL_NETWORK === 'true';
  
  // Network configuration
  const network = Mina.Network({
    mina: useCustomLocalNetwork
      ? 'http://localhost:8080/graphql'
      : 'https://api.minascan.io/node/devnet/v1/graphql',
    lightnetAccountManager: 'http://localhost:8181',
  });
  Mina.setActiveInstance(network);

  // Fee payer setup
  const senderKey = useCustomLocalNetwork
  ? (await Lightnet.acquireKeyPair()).privateKey
  : PrivateKey.fromBase58(process.env.DEPLOYER_KEY);
  const sender = senderKey.toPublicKey();
  
  if (process.env.USE_CUSTOM_LOCAL_NETWORK === 'false' && 
      process.env.NEED_FUNDING === 'true') {
    console.log(`Funding the fee payer account.`);
    await Mina.faucet(sender,network);
  }
  
  console.log(`Fetching the fee payer account information.`);
  let accountDetails = (await fetchAccount({ publicKey: sender })).account;
  console.log(
    `Using the fee payer account ${sender.toBase58()} with nonce: ${
      accountDetails?.nonce
    } and balance: ${accountDetails?.balance}.`
  );
  console.log('');
  
  // Coordinator compilation  
  await ZkonRequestCoordinator.compile();
  const coordinatorKey = PrivateKey.random();
  const coordinatorAddress = coordinatorKey.toPublicKey();
  const coordinator = new ZkonRequestCoordinator(coordinatorAddress);
  console.log('');

  // zkApps deployment
  console.log(`Init coordinator state.`);

  let transaction = await Mina.transaction(
    { sender, fee: transactionFee },
    async () => {
      AccountUpdate.fundNewAccount(sender)
      await coordinator.deploy();
    }
  );
  console.log('Signing');
  await transaction.sign([senderKey, coordinatorKey]);
  console.log('Generating proof');
  await transaction.prove()
  console.log('Proof generated');
  console.log('Sending the transaction.');
  console.log('');
  let pendingTx = await transaction.send();
  if (pendingTx.status === 'pending') {
    console.log(`Success! Deploy zkCoordinator transaction sent.  
  Txn hash: ${pendingTx.hash}
  Block explorer hash: https://minascan.io/devnet/tx/${pendingTx.hash}`);  
  }
  console.log('Waiting for transaction inclusion in a block.');
  await pendingTx.wait({ maxAttempts: 90 });
  console.log('');