import { FungibleToken } from 'mina-fungible-token';
import { ZkonRequestCoordinator } from './ZkonRequestCoordinator.js';
import { Field, Mina, PrivateKey, PublicKey, AccountUpdate, UInt64, Poseidon, provablePure, UInt8} from 'o1js';
import { StringCircuitValue } from './String.js';

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
    ipfsHash: string;

  beforeAll(async () => {
    if (proofsEnabled) await FungibleToken.compile();
  });

  beforeEach((done) => {
    Mina.LocalBlockchain({ proofsEnabled }).then((Local) => {
      Mina.setActiveInstance(Local);
      deployerKey = Local.testAccounts[0].key;
      deployerAccount = Local.testAccounts[0];
      requesterAccount = Local.testAccounts[1];
      requesterKey = Local.testAccounts[1].key;
      zktPrivateKey = PrivateKey.random();
      zktAddress = zktPrivateKey.toPublicKey();
      token = new FungibleToken(zktAddress);
      tokenId = token.deriveTokenId();
  
      zkCoordinatorPrivateKey = PrivateKey.random();
      zkCoordinatorAddress = zkCoordinatorPrivateKey.toPublicKey();
      coordinator = new ZkonRequestCoordinator(zkCoordinatorAddress);
  
      treasuryPrivateKey = PrivateKey.random();
      treasuryAddress = zkCoordinatorPrivateKey.toPublicKey();
  
      oracleAddress = PrivateKey.random().toPublicKey();
  
      feePrice = new UInt64(100);
  
      ipfsHash = 'QmbCpnprEGiPZfESXkbXmcXcBEt96TZMpYAxsoEFQNxoEV'; //Mock JSON Request
      done();

    });
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount,2);
      await token.deploy({
        admin: deployerAccount,
        symbol: "ZKON",
        src: "", 
        decimals: UInt8.from(9),
      });
      await coordinator.deploy();
    });
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    (await txn.sign([deployerKey, zktPrivateKey, zkCoordinatorPrivateKey]).prove()).send();
  }

  async function initCoordinatorState(){
    const txn = await Mina.transaction(deployerAccount, async () => {
      await coordinator.initState(treasuryAddress, zktAddress, feePrice, oracleAddress);
    });
    txn.sign([deployerKey])
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

    const initialSupply = new UInt64(1_000);
        
    let tx = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await token.mint(requesterAccount, initialSupply);
    });
    tx.sign([deployerKey])
    await tx.prove();
    await tx.send();

    let requesterBalance = await Mina.getBalance(requesterAccount,tokenId).value.toString();
    expect(requesterBalance).toEqual(initialSupply.toString());

    const ipfsHashSegmented0 = segmentHash(ipfsHash)

    const txn = await Mina.transaction(requesterAccount, async () => {
      // AccountUpdate.fundNewAccount(deployerAccount);
      await coordinator.sendRequest(deployerAccount, ipfsHashSegmented0.field1,ipfsHashSegmented0.field2);
    });
    txn.sign([requesterKey, deployerKey])
    await txn.prove();
    await txn.send();
    
    // requesterBalance = await Mina.getBalance(requesterAccount,tokenId).value.toString();    
    // expect(requesterBalance).toEqual((new UInt64(initialSupply).sub(feePrice)).toString());

    // let treasuryBalance = await Mina.getBalance(treasuryAddress,tokenId).value.toString();    
    // expect(treasuryBalance).toEqual(feePrice.toString());

    const events = await coordinator.fetchEvents();
    expect(events[0].type).toEqual('requested');
    const requestEvent = provablePure(events[0].event.data).toFields(events[0].event.data);
    const expectedRequestId = Poseidon.hash([Field(1),deployerAccount.toFields()[0]]);
    expect(requestEvent[0]).toEqual(expectedRequestId);
    expect(requestEvent[1]).toEqual(ipfsHashSegmented0.field1);
    expect(requestEvent[2]).toEqual(ipfsHashSegmented0.field2);
    expect(PublicKey.fromFields([requestEvent[3], requestEvent[4]])).toEqual(deployerAccount);

    // console.log(StringCircuitValue.fromField(ipfsHashSegmented0.field1).toString());
  });

  // it('Fullfill request', async () => {
    // await localDeploy();
    // await initCoordinatorState();

    // const initialSupply = new UInt64(1_000);
        
    // let tx = await Mina.transaction(deployerAccount, async () => {
    //   AccountUpdate.fundNewAccount(deployerAccount);
    //   token.mint(requesterAccount, initialSupply);
    // });
    // await tx.prove();
    // await tx.sign([deployerKey]).send();

    // let requesterBalance = await Mina.getBalance(requesterAccount,tokenId).value.toString();
    // expect(requesterBalance).toEqual(initialSupply.toString());

    // const ipfsHashSegmented0 = segmentHash(ipfsHashFile0)    

    // const txn = await Mina.transaction(requesterAccount, () => {
    //   AccountUpdate.fundNewAccount(deployerAccount);
    //   coordinator.sendRequest(ipfsHashSegmented0.field1,ipfsHashSegmented0.field2);
    // });
    // await txn.prove();
    // await txn.sign([requesterKey, deployerKey]).send();
    
    // requesterBalance = await Mina.getBalance(requesterAccount,tokenId).value.toString();    
    // expect(requesterBalance).toEqual((new UInt64(initialSupply).sub(feePrice)).toString());

    // let treasuryBalance = await Mina.getBalance(treasuryAddress,tokenId).value.toString();    
    // expect(treasuryBalance).toEqual(feePrice.toString());

    // const events = await coordinator.fetchEvents();
    // const requestEvent = provablePure(events[0].event.data).toFields(events[0].event.data) ;
    // console.log(requestEvent)
    // const expectedRequestId = Poseidon.hash([Field(1),requesterAccount.toFields()[0]])    
    // expect(requestEvent[0]).toEqual(expectedRequestId);
    // expect(requestEvent[1]).toEqual(ipfsHashSegmented0.field1);
    // expect(requestEvent[2]).toEqual(ipfsHashSegmented0.field2);

  //   // Provable.log(event);
  //   // Provable.log(expectedRequestId);    
  //   // Provable.log(event.assertEquals(expectedRequestId) == undefined ? true : false);
    
  //   const fullfillTxn = await Mina.transaction(requesterAccount, () => {
  //     // coordinator.recordRequestFullfillment(expectedRequestId);
  //     coordinator.fakeEvent();
  //   });
  //   await fullfillTxn.prove();
  //   await (await fullfillTxn.sign([requesterKey]).send()).wait;

  //   const newEvents = await coordinator.fetchEvents();
  //   console.log(newEvents)    
  //   // expect(newEvents.some((e) => e.type === 'fullfilled')).toEqual(true);

  // });

  function segmentHash(ipfsHashFile: string) {
    const ipfsHash0 = ipfsHashFile.slice(0,30) // first part of the ipfsHash
    const ipfsHash1 = ipfsHashFile.slice(30) // second part of the ipfsHash
      
    const field1 = new StringCircuitValue(ipfsHash0).toField();
    
    const field2 = new StringCircuitValue(ipfsHash1).toField();
  
    return {field1, field2}
  }
});
