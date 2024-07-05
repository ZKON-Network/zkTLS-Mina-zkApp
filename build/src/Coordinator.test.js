import { Field, Mina, PrivateKey, PublicKey, AccountUpdate, UInt64, Poseidon, provablePure, UInt8, fetchAccount, } from 'o1js';
import { FungibleToken, FungibleTokenAdmin } from 'mina-fungible-token';
import { ZkonRequestCoordinator } from './ZkonRequestCoordinator.js';
import { StringCircuitValue } from './String.js';
let proofsEnabled = false;
describe('Zkon Token Tests', () => {
    let deployerAccount, deployerKey, requesterAccount, requesterKey, zktAddress, zktPrivateKey, token, zkCoordinatorAddress, zkCoordinatorPrivateKey, coordinator, tokenId, feePrice, treasuryAddress, treasuryPrivateKey, oracleAddress, oracleKey, ipfsHash, tokenAdmin, tokenAdminContract;
    beforeAll(async () => {
        if (proofsEnabled)
            await FungibleToken.compile();
    });
    beforeEach((done) => {
        Mina.LocalBlockchain({ proofsEnabled }).then((Local) => {
            Mina.setActiveInstance(Local);
            deployerKey = Local.testAccounts[0].key;
            deployerAccount = Local.testAccounts[0];
            requesterAccount = Local.testAccounts[1];
            requesterKey = Local.testAccounts[1].key;
            tokenAdmin = Local.testAccounts[2];
            oracleKey = Local.testAccounts[3].key;
            oracleAddress = Local.testAccounts[3];
            zktPrivateKey = PrivateKey.random();
            zktAddress = zktPrivateKey.toPublicKey();
            token = new FungibleToken(zktAddress);
            tokenId = token.deriveTokenId();
            zkCoordinatorPrivateKey = PrivateKey.random();
            zkCoordinatorAddress = zkCoordinatorPrivateKey.toPublicKey();
            coordinator = new ZkonRequestCoordinator(zkCoordinatorAddress);
            treasuryPrivateKey = PrivateKey.random();
            treasuryAddress = zkCoordinatorPrivateKey.toPublicKey();
            // oracleKey = PrivateKey.random();
            // oracleAddress = oracleKey.toPublicKey();
            feePrice = new UInt64(100);
            tokenAdminContract = new FungibleTokenAdmin(tokenAdmin);
            ipfsHash = 'QmbCpnprEGiPZfESXkbXmcXcBEt96TZMpYAxsoEFQNxoEV'; //Mock JSON Request
            done();
        });
    });
    async function localDeploy() {
        const txn = await Mina.transaction({
            sender: deployerAccount,
            fee: 1e8,
        }, async () => {
            AccountUpdate.fundNewAccount(deployerAccount, 2);
            await tokenAdminContract.deploy({
                adminPublicKey: tokenAdmin,
            });
            await token.deploy({
                admin: tokenAdmin,
                symbol: 'ZKON',
                src: '',
                decimals: UInt8.from(9),
            });
            await coordinator.deploy();
        });
        // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
        (await txn
            .sign([deployerKey, zktPrivateKey, tokenAdmin.key, zkCoordinatorPrivateKey])
            .prove()).send();
    }
    async function initCoordinatorState() {
        const txn = await Mina.transaction({
            sender: deployerAccount,
            fee: 1e8,
        }, async () => {
            await coordinator.initState(treasuryAddress, zktAddress, feePrice, oracleAddress);
        });
        txn.sign([deployerKey]);
        await txn.prove();
        await txn.send();
    }
    it('Deploy & init coordinator', async () => {
        await localDeploy();
        await initCoordinatorState();
    });
    it('Send request', async () => {
        await localDeploy();
        await initCoordinatorState();
        const initialSupply = new UInt64(1000);
        let tx = await Mina.transaction({
            sender: deployerAccount,
            fee: 1e8,
        }, async () => {
            AccountUpdate.fundNewAccount(deployerAccount, 1);
            await token.mint(requesterAccount, initialSupply);
        });
        tx.sign([deployerKey, tokenAdmin.key]);
        await tx.prove();
        await tx.send();
        let requesterBalance = (await token.getBalanceOf(requesterAccount)).toString();
        expect(requesterBalance).toEqual(initialSupply.toString());
        const ipfsHashSegmented0 = segmentHash(ipfsHash);
        const txn = await Mina.transaction({
            sender: requesterAccount,
            fee: 1e8,
        }, async () => {
            await coordinator.sendRequest(deployerAccount, ipfsHashSegmented0.field1, ipfsHashSegmented0.field2);
        });
        txn.sign([requesterKey, deployerKey]);
        await txn.prove();
        await txn.send();
        const events = await coordinator.fetchEvents();
        expect(events[0].type).toEqual('requested');
        const requestEvent = provablePure(events[0].event.data).toFields(events[0].event.data);
        const expectedRequestId = Poseidon.hash([
            Field(1),
            deployerAccount.toFields()[0],
        ]);
        expect(requestEvent[0]).toEqual(expectedRequestId);
        expect(requestEvent[1]).toEqual(ipfsHashSegmented0.field1);
        expect(requestEvent[2]).toEqual(ipfsHashSegmented0.field2);
        const dehashed = PublicKey.fromFields([requestEvent[3], requestEvent[4]]);
        expect(dehashed.toBase58()).toEqual(deployerAccount.toBase58());
        await fetchAccount({ publicKey: oracleAddress });
        console.log("Oracle Address: ", oracleAddress.toBase58());
        /*const fullfillTxn = await Mina.transaction(
          {
            sender: oracleAddress,
            fee: 1e8,
          },
          async () => {
            await coordinator.recordRequestFullfillment(expectedRequestId);
          }
        );
        await fullfillTxn.prove();
        await (await fullfillTxn.sign([oracleKey]).send()).wait;
    
        const newEvents = await coordinator.fetchEvents();
        console.log(newEvents)
        expect(newEvents.some((e) => e.type === 'fullfilled')).toEqual(true);
    */
    });
    // it('Fullfill request', async () => {
    //   await localDeploy();
    //   await initCoordinatorState();
    // let requesterBalance = await Mina.getBalance(requesterAccount,tokenId).value.toString();
    // expect(requesterBalance).toEqual(initialSupply.toString());
    // const ipfsHashSegmented0 = segmentHash(ipfsHash);
    // const txn = await Mina.transaction(
    //   {
    //     sender: requesterAccount,
    //     fee: 1e8,
    //   },
    //   async () => {
    //     await coordinator.sendRequest(
    //       deployerAccount,
    //       ipfsHashSegmented0.field1,
    //       ipfsHashSegmented0.field2
    //     );
    //   }
    // );
    // txn.sign([requesterKey, deployerKey]);
    // await txn.prove();
    // await txn.send();
    // requesterBalance = await Mina.getBalance(requesterAccount,tokenId).value.toString();
    // expect(requesterBalance).toEqual((new UInt64(initialSupply).sub(feePrice)).toString());
    // let treasuryBalance = await Mina.getBalance(treasuryAddress,tokenId).value.toString();
    // expect(treasuryBalance).toEqual(feePrice.toString());
    // const events = await coordinator.fetchEvents();
    // expect(events[0].type).toEqual('requested');
    // const requestEvent = provablePure(events[0].event.data).toFields(
    //   events[0].event.data
    // );
    // const expectedRequestId = Poseidon.hash([
    //   Field(1),
    //   deployerAccount.toFields()[0],
    // ]);
    // expect(requestEvent[0]).toEqual(expectedRequestId);
    // expect(requestEvent[1]).toEqual(ipfsHashSegmented0.field1);
    // expect(requestEvent[2]).toEqual(ipfsHashSegmented0.field2);
    // const dehashed = PublicKey.fromFields([requestEvent[3], requestEvent[4]]);
    // expect(dehashed.toBase58()).toEqual(deployerAccount.toBase58());  
    // const fullfillTxn = await Mina.transaction(requesterAccount, async () => {
    //   await coordinator.recordRequestFullfillment(expectedRequestId);
    // });
    // await fullfillTxn.prove();
    // await (await fullfillTxn.sign([requesterKey]).send()).wait;
    // const newEvents = await coordinator.fetchEvents();
    // console.log(newEvents)
    // expect(newEvents.some((e) => e.type === 'fullfilled')).toEqual(true);
    // });
    function segmentHash(ipfsHashFile) {
        const ipfsHash0 = ipfsHashFile.slice(0, 30); // first part of the ipfsHash
        const ipfsHash1 = ipfsHashFile.slice(30); // second part of the ipfsHash
        const field1 = new StringCircuitValue(ipfsHash0).toField();
        const field2 = new StringCircuitValue(ipfsHash1).toField();
        return { field1, field2 };
    }
});
//# sourceMappingURL=Coordinator.test.js.map