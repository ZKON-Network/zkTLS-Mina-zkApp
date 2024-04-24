import { FungibleToken } from 'mina-fungible-token';
import { ZkonRequestCoordinator } from './ZkonRequestCoordinator';
import { Field, Mina, PrivateKey, PublicKey, AccountUpdate, UInt64, Bytes, Poseidon } from 'o1js';
import { Request} from './Zkon-lib'

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
    oracleAddress: PublicKey;    

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

    const callbackFunc = Bytes.from(Bytes.fromString("callbackFunctionSignature()"));
    let request = new Request({
      id: new UInt64(1),
      callbackAddress: PrivateKey.random().toPublicKey(),
      callbackFunctionId: callbackFunc,
      url: "testUrl",
      path: "somePath"
    })

    const txn = await Mina.transaction(requesterAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      coordinator.sendRequest(request);
    });
    await txn.prove();
    await txn.sign([requesterKey, deployerKey]).send();
    
    requesterBalance = await Mina.getBalance(requesterAccount,tokenId).value.toString();    
    expect(requesterBalance).toEqual((new UInt64(initialSupply).sub(feePrice)).toString());

    let treasuryBalance = await Mina.getBalance(treasuryAddress,tokenId).value.toString();    
    expect(treasuryBalance).toEqual(feePrice.toString());

    const events = await coordinator.fetchEvents();
    const event = events[0].event.data.toFields(null)[0];
    console.log(events);
    const expectedRequestId = Poseidon.hash([Field(1),requesterAccount.toFields()[0]])
    expect(event).toEqual(expectedRequestId);

  });

});
