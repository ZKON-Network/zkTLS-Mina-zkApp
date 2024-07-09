import dotenv from 'dotenv';
dotenv.config();
import { Mina, PrivateKey, fetchAccount, Lightnet, AccountUpdate, PublicKey } from 'o1js';
import { ZkonRequestCoordinator } from '../build/src/ZkonRequestCoordinator.js';
import { ZkonZkProgram } from '../build/src/zkProgram.js';
import fs from 'fs-extra';
// // Network configuration
const transactionFee = 100000000;
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
let senderKey, sender, localData, oracleAddress, oracleKey, treasuryAddress, tokenAddress, zkCoordinatorAddress;
// Fee payer setup
if (useCustomLocalNetwork) {
    localData = fs.readJsonSync('./data/addresses.json');
    let deployerKey;
    if (!!localData) {
        if (!!localData.deployerKey) {
            deployerKey = PrivateKey.fromBase58(localData.deployerKey);
        }
        else {
            deployerKey = (await Lightnet.acquireKeyPair()).privateKey;
        }
    }
    senderKey = deployerKey;
    sender = senderKey.toPublicKey();
    try {
        await fetchAccount({ publicKey: sender });
    }
    catch (error) {
        senderKey = (await Lightnet.acquireKeyPair()).privateKey;
        sender = senderKey.toPublicKey();
    }
}
else {
    senderKey = PrivateKey.fromBase58(process.env.DEPLOYER_KEY);
    sender = senderKey.toPublicKey();
    tokenAddress = process.env.TOKEN_ADDRESS ?
        PublicKey.fromBase58(process.env.TOKEN_ADDRESS) :
        PublicKey.fromBase58('B62qrqYtrQLQyudxG38HkLZ4GFB2Zy1z64DjqQaD7yv3pwGBQQQfSZ3');
    treasuryAddress = process.env.TREASURY_ADDRESS ?
        PublicKey.fromBase58(process.env.TREASURY_ADDRESS) :
        PublicKey.fromBase58('B62qkaxsQG86VQRsHPqZBQe8Pfwj7TXH3dm7domVe44gL7EdMToetzd');
    oracleKey = PrivateKey.random();
    oracleAddress = oracleKey.toPublicKey();
}
console.log(`Fetching the fee payer account information.`);
let accountDetails = (await fetchAccount({ publicKey: sender })).account;
console.log(`Using the fee payer account ${sender.toBase58()} with nonce: ${accountDetails?.nonce} and balance: ${accountDetails?.balance}.`);
console.log('');
// // Coordinator compilation
await ZkonZkProgram.compile();
await ZkonRequestCoordinator.compile();
const coordinatorKey = PrivateKey.random();
const coordinatorAddress = coordinatorKey.toPublicKey();
const coordinator = new ZkonRequestCoordinator(coordinatorAddress);
const feePrice = new UInt64(100);
console.log('');
// zkApps deployment
console.log(`Init coordinator state.`);
let transaction = await Mina.transaction({ sender, fee: transactionFee }, async () => {
    AccountUpdate.fundNewAccount(sender);
    await coordinator.deploy({
        oracle: oracleAddress,
        tokenAddress: tokenAddress,
        feePrice: feePrice,
        treasuryAddress: sender
    });
});
console.log('Signing');
await transaction.sign([senderKey, coordinatorKey]);
console.log('Generating proof');
await transaction.prove();
console.log('Proof generated');
console.log('Sending the transaction.');
console.log('');
let pendingTx = await transaction.send();
if (pendingTx.status === 'pending') {
    console.log(`Success! Deploy zkCoordinator transaction sent. Deploying to ${coordinatorAddress.toBase58()}  
    Txn hash: ${pendingTx.hash}
    Block explorer hash: https://minascan.io/devnet/tx/${pendingTx.hash}`);
}
console.log('Waiting for transaction inclusion in a block.');
await pendingTx.wait({ maxAttempts: 90 });
if (useCustomLocalNetwork) {
    localData.deployerKey = localData.deployerKey ? localData.deployerKey : senderKey.toBase58();
    localData.deployerAddress = localData.deployerAddress ? localData.deployerAddress : sender;
    localData.coordinatorKey = coordinatorKey.toBase58();
    localData.coordinatorAddress = coordinatorAddress;
    fs.outputJsonSync("./data/addresses.json", localData, { spaces: 2 });
}
else {
    localData.deployerKey = localData.deployerKey ? localData.deployerKey : senderKey.toBase58();
    localData.deployerAddress = localData.deployerAddress ? localData.deployerAddress : sender;
    localData.coordinatorKey = coordinatorKey.toBase58();
    localData.coordinatorAddress = coordinatorAddress.toBase58();
    localData.oracleKey = oracleKey.toBase58();
    localData.oracleAddress = oracleAddress.toBase58();
    fs.outputJsonSync("./data/devnet/addresses.json", localData, { spaces: 2 });
}
console.log('');
//# sourceMappingURL=deploy_coordinator.js.map