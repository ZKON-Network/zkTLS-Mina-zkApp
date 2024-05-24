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
    
  const transactionFee = 100_000_000;
  
  // Network configuration
  const network = Mina.Network({
    mina: 'https://api.minascan.io/node/devnet/v1/graphql',
  });
  Mina.setActiveInstance(network);

  const oracleAddress = PrivateKey.random().toPublicKey();//Mocked. Variable not used
  const feePrice = new UInt64(100);
  const ipfsHash = 'QmbCpnprEGiPZfESXkbXmcXcBEt96TZMpYAxsoEFQNxoEV'; //Mock JSON Request

  // const tokenAddress = process.env.TOKEN_ADDRESS;
  const tokenAddress = process.env.TOKEN_ADDRESS ?
  PublicKey.fromBase58(process.env.TOKEN_ADDRESS) : 
    PublicKey.fromBase58('B62qrqYtrQLQyudxG38HkLZ4GFB2Zy1z64DjqQaD7yv3pwGBQQQfSZ3');
  
  const treasuryAddress = process.env.TREASURY_ADDRESS ? 
    PublicKey.fromBase58(process.env.TREASURY_ADDRESS) : 
    PublicKey.fromBase58('B62qkaxsQG86VQRsHPqZBQe8Pfwj7TXH3dm7domVe44gL7EdMToetzd');
  
  //const Fee payer setup
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
  console.log('');
  
  // Coordinator compilation  
  await ZkonRequestCoordinator.compile();
  
  const zkCoordinatorAddress = PublicKey.fromBase58(process.env.COORDINATOR_ADDRESS);
  const coordinator = new ZkonRequestCoordinator(zkCoordinatorAddress);
  console.log('');
  
  // zkApps deployment
  console.log(`Init coordinator state.`);
  // console.log(treasuryAddress);
  // console.log(tokenAddress);
  // console.log(feePrice);
  // console.log(oracleAddress);
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