import { FungibleToken } from 'mina-fungible-token';
import { ZkonRequestCoordinator } from './ZkonRequestCoordinator';
import { ZkonRequest } from './ZkonRequest';
import { Field, Mina, PrivateKey, PublicKey, AccountUpdate, UInt64, Poseidon, provablePure} from 'o1js';
import { StringCircuitValue } from './String';

let proofsEnabled = false;

describe('Zkon Token Tests', () => {
  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    requesterAccount: PublicKey,
    requesterKey: PrivateKey,
    zktAddress: PublicKey,
    zktPrivateKey: PrivateKey,
    token: FungibleToken,
    zkCoordinatorAddress: PublicKey,
    zkCoordinatorPrivateKey: PrivateKey,
    coordinator: ZkonRequestCoordinator,
    tokenId: Field,
    feePrice: UInt64,
    treasuryAddress: PublicKey,
    treasuryPrivateKey: PrivateKey,
    oracleAddress: PublicKey,
    ipfsHash: string,
    zkRequestAddress: PublicKey,
    zkRequestKey: PrivateKey,
    zkRequest: ZkonRequest;

  beforeAll(async () => {
    if (proofsEnabled) await FungibleToken.compile();
  });

  beforeEach(() => {
    const Local = Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    ({ privateKey: deployerKey, publicKey: deployerAccount } =
      Local.testAccounts[0]);
    ({ privateKey: requesterKey, publicKey: requesterAccount } =
      Local.testAccounts[1]);    
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

    feePrice = new UInt64(100);

    ipfsHash = 'QmbCpnprEGiPZfESXkbXmcXcBEt96TZMpYAxsoEFQNxoEV'; //Mock JSON Request

  });

  async function localDeploy() {
    const totalSupply = UInt64.from(10_000_000);
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount,3);
      token.deploy({
        owner: deployerAccount,
        supply: totalSupply,
        symbol: "ZKON",
        src: ""
      });
      coordinator.deploy();
      zkRequest.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zktPrivateKey, zkCoordinatorPrivateKey, zkRequestKey]).send();
  }

  async function initCoordinatorState(){
    const txn = await Mina.transaction(deployerAccount, () => {
      coordinator.initState(treasuryAddress, zktAddress, feePrice, oracleAddress);
      zkRequest.initState(zkCoordinatorAddress);
    });
    await txn.prove();
    await txn.sign([deployerKey]).send();
  }

  it('Deploy & init coordinator', async () => {
    await localDeploy();
    await initCoordinatorState();
  });

  it('Prepay 2 requests', async () => {
    await localDeploy();
    await initCoordinatorState();

    const initialSupply = new UInt64(1_000);
        
    let tx = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      token.mint(requesterAccount, initialSupply);
    });
    await tx.prove();
    await tx.sign([deployerKey]).send();
    
    tx = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      token.mint(zkRequestAddress, initialSupply);
    });
    await tx.prove();
    await tx.sign([deployerKey]).send();    

    const txn = await Mina.transaction(requesterAccount, async () => {
      AccountUpdate.fundNewAccount(requesterAccount);
      coordinator.prepayRequest(new UInt64(2),zkRequestAddress);
    });
    await txn.prove();
    await (await txn.sign([requesterKey]).send()).wait();

    const events = await coordinator.fetchEvents();
    expect(events[0].type).toEqual('requestsPaid');
    console.log(events[0].event.data)
    const requestPaidEvent = provablePure(events[0].event.data).toFields(events[0].event.data);
    console.log(requestPaidEvent)
    console.log(zkRequestAddress.toBase58());
    console.log(PublicKey.fromFields([requestPaidEvent[0],requestPaidEvent[1]]).toBase58())
    expect(zkRequestAddress.equals(PublicKey.fromFields([requestPaidEvent[0],requestPaidEvent[1]])))    
  });

  it('Send request via example zkApp', async () => {
    await localDeploy();
    await initCoordinatorState();

    const initialSupply = new UInt64(1_000);
        
    let tx = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      token.mint(requesterAccount, initialSupply);
    });
    await tx.prove();
    await tx.sign([deployerKey]).send();
    
    tx = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      token.mint(zkRequestAddress, initialSupply);
    });
    await tx.prove();
    await tx.sign([deployerKey]).send();

    let requesterBalance = await Mina.getBalance(requesterAccount,tokenId).value.toString();
    expect(requesterBalance).toEqual(initialSupply.toString());

    let zkRequestBalance = await Mina.getBalance(zkRequestAddress,tokenId).value.toString();
    expect(zkRequestBalance).toEqual(initialSupply.toString());

    const ipfsHashSegmented0 = segmentHash(ipfsHash)
    let requestId;
    const txn = await Mina.transaction(requesterAccount, async () => {
      AccountUpdate.fundNewAccount(requesterAccount);
      requestId = zkRequest.sendRequest(ipfsHashSegmented0.field1,ipfsHashSegmented0.field2);
    });
    await txn.prove();
    await (await txn.sign([requesterKey]).send()).wait();

    requesterBalance = await Mina.getBalance(requesterAccount,tokenId).value.toString();    
    expect(requesterBalance).toEqual((new UInt64(initialSupply).sub(feePrice)).toString());

    // zkRequestBalance = await Mina.getBalance(zkRequestAddress,tokenId).value.toString();    
    // expect(zkRequestBalance).toEqual((new UInt64(initialSupply).sub(feePrice)).toString());
    // console.log(zkRequestBalance)

    const events = await coordinator.fetchEvents();
    expect(events[0].type).toEqual('requested');
    console.log(events[0].event.data);
    const requestEvent = provablePure(events[0].event.data).toFields(events[0].event.data);
    const expectedRequestId = Poseidon.hash([Field(1),requesterAccount.toFields()[0]]);
    expect(requestEvent[0]).toEqual(expectedRequestId);
    expect(requestEvent[1]).toEqual(ipfsHashSegmented0.field1);
    expect(requestEvent[2]).toEqual(ipfsHashSegmented0.field2);
    // expect(requestEvent[3]).toEqual(requesterAccount.toFields()[0]);
    // expect(requestEvent[3]).toEqual(zkRequestAddress.toFields()[0]);
    // console.log(StringCircuitValue.fromField(ipfsHashSegmented0.field1).toString());
  });

  function segmentHash(ipfsHashFile: string) {
    const ipfsHash0 = ipfsHashFile.slice(0,30) // first part of the ipfsHash
    const ipfsHash1 = ipfsHashFile.slice(30) // second part of the ipfsHash
      
    const field1 = new StringCircuitValue(ipfsHash0).toField();
    
    const field2 = new StringCircuitValue(ipfsHash1).toField();
  
    return {field1, field2}
  }
});
