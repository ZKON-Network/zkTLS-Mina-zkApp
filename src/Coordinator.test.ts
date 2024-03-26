import { ZkonToken } from './ZkonToken';
import { ZkonRequestCoordinator } from './ZkonRequestCoordinator';
import { Field, Mina, PrivateKey, PublicKey, AccountUpdate, UInt64 } from 'o1js';

let proofsEnabled = false;

describe('Zkon Token Tests', () => {
  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    requesterAccount: PublicKey,
    requesterKey: PrivateKey,
    zktAddress: PublicKey,
    zktPrivateKey: PrivateKey,
    token: ZkonToken,
    zkCoordinatorAddress: PublicKey,
    zkCoordinatorPrivateKey: PrivateKey,
    coordinator: ZkonRequestCoordinator,
    tokenId: Field,
    treasuryAddress: PublicKey,
    treasuryPrivateKey: PrivateKey;

  beforeAll(async () => {
    if (proofsEnabled) await ZkonToken.compile();
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
    token = new ZkonToken(zktAddress);
    tokenId = token.deriveTokenId();

    zkCoordinatorPrivateKey = PrivateKey.random();
    zkCoordinatorAddress = zkCoordinatorPrivateKey.toPublicKey();
    coordinator = new ZkonRequestCoordinator(zkCoordinatorAddress);

    treasuryPrivateKey = PrivateKey.random();
    treasuryAddress = zkCoordinatorPrivateKey.toPublicKey();

  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount,2);
      token.deploy();
      coordinator.deploy();      
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zktPrivateKey, zkCoordinatorPrivateKey]).send();
  }

  it('Deploy & init coordinator', async () => {
    await localDeploy();

    // const txn = await Mina.transaction(deployerAccount, () => {
    //   coordinator.initState(zktAddress, treasuryAddress, new UInt64(100));
    // });
    // await txn.prove();
    // console.log(txn.toPretty())    
    // await txn.sign([deployerKey]).send();
  })

});
