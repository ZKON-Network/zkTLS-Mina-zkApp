import { FungibleToken } from 'mina-fungible-token';
import { ZkonRequestCoordinator } from './ZkonRequestCoordinator';
import { Field, Mina, PrivateKey, PublicKey, AccountUpdate, UInt64, Poseidon, CircuitString, provablePure} from 'o1js';
import { StringCircuitValue } from './utils/String';

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

    treasuryPrivateKey = PrivateKey.random();
    treasuryAddress = zkCoordinatorPrivateKey.toPublicKey();

    oracleAddress = PrivateKey.random().toPublicKey();

    feePrice = new UInt64(100);

    ipfsHash = 'bafybeibieq746jmc5ndf2fn24jhk4i2knzadbmb6eatvpnlhcrffzd46bi'

  });

  async function localDeploy() {
    const totalSupply = UInt64.from(10_000_000);
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount,2);
      token.deploy({
        owner: deployerAccount,
        supply: totalSupply,
        symbol: "ZKON",
        src: ""
      });
      coordinator.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zktPrivateKey, zkCoordinatorPrivateKey]).send();
  }

  async function initCoordinatorState(){
    const txn = await Mina.transaction(deployerAccount, () => {
      coordinator.initState(treasuryAddress, zktAddress, feePrice, oracleAddress);
    });
    await txn.prove();
    await txn.sign([deployerKey]).send();
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
      token.mint(requesterAccount, initialSupply);
    });
    await tx.prove();
    await tx.sign([deployerKey]).send();

    let requesterBalance = await Mina.getBalance(requesterAccount,tokenId).value.toString();
    expect(requesterBalance).toEqual(initialSupply.toString());

    const ipfsHashSegmented0 = segmentHash(ipfsHash)

    const txn = await Mina.transaction(requesterAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      coordinator.sendRequest(ipfsHashSegmented0.field1,ipfsHashSegmented0.field2);
    });
    await txn.prove();
    await txn.sign([requesterKey, deployerKey]).send();
    
    requesterBalance = await Mina.getBalance(requesterAccount,tokenId).value.toString();    
    expect(requesterBalance).toEqual((new UInt64(initialSupply).sub(feePrice)).toString());

    let treasuryBalance = await Mina.getBalance(treasuryAddress,tokenId).value.toString();    
    expect(treasuryBalance).toEqual(feePrice.toString());

    const events = await coordinator.fetchEvents();
    const requestEvent = provablePure(events[0].event.data).toFields(events[0].event.data);
    // console.log(requestEvent)
    const expectedRequestId = Poseidon.hash([Field(1),requesterAccount.toFields()[0]])    
    expect(requestEvent[0]).toEqual(expectedRequestId);
    expect(requestEvent[1]).toEqual(ipfsHashSegmented0.field1);
    expect(requestEvent[2]).toEqual(ipfsHashSegmented0.field2);
    // console.log(CircuitString.fromString(ipfsHash).toFields()[0])
  });

  it('Encode/decode hash', async () =>{
    const ipfsHashSegmented = segmentHash(ipfsHash)
    const segmentedHashPart1 = ipfsHashSegmented.field1
    const segmentedHashPart2 = ipfsHashSegmented.field2

    const segmentedString = CircuitString.fromString(ipfsHash.slice(0,30));
    const segmentedStringFields = segmentedString.toFields();

    console.log(ipfsHash.slice(0,30));
    console.log(StringCircuitValue.fromField(new StringCircuitValue(ipfsHash.slice(0,30)).toField()).toString());

    // console.log("Original hash: ",ipfsHash)
    // console.log("Segmented hash: ", segmentedString)
    // console.log("Segmented ToField: ", segmentedStringFields)
    // console.log("Segmented hash part 1: ", segmentedHashPart1)
    // console.log("Segmented hash part 2: ", segmentedHashPart2)


    // const decodedHashPart1 = CircuitString.fromFields().toString().replace(/\0/g, '')
    // console.log(decodedHashPart1)
    // const hash2 = CircuitString.fromCharacters(fieldHash2.toBits()).toString().replace(/\0/g, '')
    // console.log("Field 1", CircuitString.fromCharacters(fieldHash1.toBits()).values[5].toString())
    
  })

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
    // The StringCircuitValue only support 31 chars so we decided to segment in groups of 30 chars
    const ipfsHash0 = ipfsHashFile.slice(0,30) // first part of the ipfsHash
    const ipfsHash1 = ipfsHashFile.slice(30) // second part of the ipfsHash
  
    const ztring0 = CircuitString.fromString(ipfsHash0);
    const field1 = ztring0.toFields()[0];
  
    const ztring1 = CircuitString.fromString(ipfsHash1);
    const field2 = ztring1.toFields()[0];
  
    return {field1, field2}
  }
});
