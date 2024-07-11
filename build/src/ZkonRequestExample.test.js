import { FungibleToken, FungibleTokenAdmin } from 'mina-fungible-token';
import { ZkonRequestCoordinator } from './ZkonRequestCoordinator.js';
import { ZkonRequest } from './ZkonRequest.js';
import { Field, Mina, PrivateKey, PublicKey, AccountUpdate, UInt64, Poseidon, provablePure, UInt8 } from 'o1js';
import { StringCircuitValue } from './String.js';
let proofsEnabled = false;
describe('Zkon Request Example', () => {
    let deployerAccount, deployerKey, requesterAccount, requesterKey, zktAddress, zktPrivateKey, token, zkCoordinatorAddress, zkCoordinatorPrivateKey, coordinator, tokenId, feePrice, treasuryAddress, treasuryPrivateKey, oracleAddress, ipfsHash, zkRequestAddress, zkRequestKey, zkRequest, tokenAdmin, tokenAdminContract;
    beforeAll(async () => {
        if (proofsEnabled)
            await FungibleToken.compile();
    });
    beforeEach((done) => {
        Mina.LocalBlockchain({ proofsEnabled }).then((Local) => {
            Mina.setActiveInstance(Local);
            deployerKey = Local.testAccounts[0].key;
            deployerAccount = Local.testAccounts[0];
            requesterKey = Local.testAccounts[1].key;
            requesterAccount = Local.testAccounts[1];
            zktPrivateKey = PrivateKey.random();
            zktAddress = zktPrivateKey.toPublicKey();
            token = new FungibleToken(zktAddress);
            tokenId = token.deriveTokenId();
            zkCoordinatorPrivateKey = PrivateKey.random();
            zkCoordinatorAddress = zkCoordinatorPrivateKey.toPublicKey();
            coordinator = new ZkonRequestCoordinator(zkCoordinatorAddress);
            zkRequestKey = PrivateKey.random();
            zkRequestAddress = zkRequestKey.toPublicKey();
            zkRequest = new ZkonRequest(zkRequestAddress);
            treasuryPrivateKey = PrivateKey.random();
            treasuryAddress = zkCoordinatorPrivateKey.toPublicKey();
            oracleAddress = PrivateKey.random().toPublicKey();
            tokenAdmin = Local.testAccounts[2];
            tokenAdminContract = new FungibleTokenAdmin(tokenAdmin);
            feePrice = new UInt64(100);
            ipfsHash = 'QmbCpnprEGiPZfESXkbXmcXcBEt96TZMpYAxsoEFQNxoEV'; //Mock JSON Request
            done();
        });
    });
    async function localDeploy() {
        const txn = await Mina.transaction(deployerAccount, async () => {
            AccountUpdate.fundNewAccount(deployerAccount, 3);
            await tokenAdminContract.deploy({
                adminPublicKey: tokenAdmin,
            });
            await token.deploy({
                admin: tokenAdmin,
                decimals: UInt8.from(9),
                symbol: "ZKON",
                src: ""
            });
            await coordinator.deploy({
                oracle: oracleAddress,
                zkonToken: zktAddress,
                owner: deployerAccount,
                feePrice: feePrice
            });
            await zkRequest.deploy({
                coordinator: zkCoordinatorAddress
            });
        });
        await txn.prove();
        // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
        await txn
            .sign([
            deployerKey,
            zktPrivateKey,
            zkCoordinatorPrivateKey,
            zkRequestKey,
            tokenAdmin.key,
        ])
            .send();
    }
    it('Deploy & init coordinator', async () => {
        await localDeploy();
    });
    it('Prepay 2 requests', async () => {
        await localDeploy();
        const coordinatorInitiated = zkRequest.coordinator.get();
        expect(coordinatorInitiated.equals(zkCoordinatorAddress));
        const initialSupply = new UInt64(1000);
        let tx = await Mina.transaction(deployerAccount, async () => {
            AccountUpdate.fundNewAccount(deployerAccount);
            await token.mint(requesterAccount, initialSupply);
        });
        await tx.prove();
        await tx.sign([deployerKey, tokenAdmin.key]).send();
        tx = await Mina.transaction(deployerAccount, async () => {
            AccountUpdate.fundNewAccount(deployerAccount);
            await token.mint(zkRequestAddress, initialSupply);
        });
        await tx.prove();
        await tx.sign([deployerKey, tokenAdmin.key]).send();
        const txn = await Mina.transaction(requesterAccount, async () => {
            AccountUpdate.fundNewAccount(requesterAccount);
            await coordinator.prepayRequest(new UInt64(2), zkRequestAddress);
        });
        await txn.prove();
        await txn.sign([requesterKey]).send();
        const events = await coordinator.fetchEvents();
        expect(events[0].type).toEqual('requestsPaid');
        const requestPaidEvent = provablePure(events[0].event.data).toFields(events[0].event.data);
        expect(Field(2)).toEqual(requestPaidEvent[2]);
        expect(zkRequestAddress.equals(PublicKey.fromFields([requestPaidEvent[0], requestPaidEvent[1]])));
    });
    it('Send request via example zkApp', async () => {
        await localDeploy();
        const initialSupply = new UInt64(1000);
        let tx = await Mina.transaction(deployerAccount, async () => {
            AccountUpdate.fundNewAccount(deployerAccount);
            await token.mint(requesterAccount, initialSupply);
        });
        await tx.prove();
        await tx.sign([deployerKey, tokenAdmin.key]).send();
        tx = await Mina.transaction(deployerAccount, async () => {
            AccountUpdate.fundNewAccount(deployerAccount);
            await token.mint(zkRequestAddress, initialSupply);
        });
        await tx.prove();
        await tx.sign([deployerKey, tokenAdmin.key]).send();
        let requesterBalance = await Mina.getBalance(requesterAccount, tokenId).value.toString();
        expect(requesterBalance).toEqual(initialSupply.toString());
        let zkRequestBalance = await Mina.getBalance(zkRequestAddress, tokenId).value.toString();
        expect(zkRequestBalance).toEqual(initialSupply.toString());
        const ipfsHashSegmented0 = segmentHash(ipfsHash);
        let requestId;
        const txn = await Mina.transaction(requesterAccount, async () => {
            // AccountUpdate.fundNewAccount(requesterAccount);
            requestId = await zkRequest.sendRequest(ipfsHashSegmented0.field1, ipfsHashSegmented0.field2);
        });
        await txn.prove();
        await (await txn.sign([requesterKey]).send()).wait();
        const events = await coordinator.fetchEvents();
        expect(events[0].type).toEqual('requested');
        const requestEvent = provablePure(events[0].event.data).toFields(events[0].event.data);
        const expectedRequestId = Poseidon.hash([
            Field(1),
            deployerAccount.toFields()[0],
        ]);
        // expect(requestEvent[0]).toEqual(expectedRequestId);
        expect(requestEvent[1]).toEqual(ipfsHashSegmented0.field1);
        expect(requestEvent[2]).toEqual(ipfsHashSegmented0.field2);
        const dehashed = PublicKey.fromFields([requestEvent[3], requestEvent[4]]);
        expect(dehashed.toBase58()).toEqual(zkRequestAddress.toBase58()); //The zkApp is the sender    
    });
    function segmentHash(ipfsHashFile) {
        const ipfsHash0 = ipfsHashFile.slice(0, 30); // first part of the ipfsHash
        const ipfsHash1 = ipfsHashFile.slice(30); // second part of the ipfsHash
        const field1 = new StringCircuitValue(ipfsHash0).toField();
        const field2 = new StringCircuitValue(ipfsHash1).toField();
        return { field1, field2 };
    }
});
//# sourceMappingURL=ZkonRequestExample.test.js.map