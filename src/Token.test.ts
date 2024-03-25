import { ZkonToken } from './ZkonToken';
import { Field, Mina, PrivateKey, PublicKey, AccountUpdate, UInt64 } from 'o1js';

let proofsEnabled = false;

describe('Zkon Token Tests', () => {
  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    senderAccount: PublicKey,
    senderKey: PrivateKey,
    zktAddress: PublicKey,
    zktPrivateKey: PrivateKey,
    token: ZkonToken,
    tokenId: Field;

  beforeAll(async () => {
    if (proofsEnabled) await ZkonToken.compile();
  });

  beforeEach(() => {
    const Local = Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    ({ privateKey: deployerKey, publicKey: deployerAccount } =
      Local.testAccounts[0]);
    ({ privateKey: senderKey, publicKey: senderAccount } =
      Local.testAccounts[1]);
    zktPrivateKey = PrivateKey.random();
    zktAddress = zktPrivateKey.toPublicKey();
    token = new ZkonToken(zktAddress);
    tokenId = token.deriveTokenId();
  });

  async function localDeploy() {
    console.log("Balance deployer pre deploy: ",Mina.getBalance(deployerAccount).value.toString());
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);      
      token.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zktPrivateKey]).send();
  }

  it('Transfer MINA tokens', async () => {
    await localDeploy();
    console.log("Balance deployer: ",Mina.getBalance(deployerAccount).value.toString());
    console.log("Balance token contract: ",Mina.getBalance(zktAddress).value.toString());
    
    const trfMina = await Mina.transaction(deployerAccount,()=>{
      let trfUpdate = AccountUpdate.create(deployerAccount)
      trfUpdate.send({ to: zktAddress, amount: new UInt64(1_000)})
      trfUpdate.requireSignature()
    })
    await trfMina.sign([zktPrivateKey,deployerKey]).send();
    // console.log("Balance token contract after: ",Mina.getBalance(zktAddress).value.toString());
  })

  // it('generates and deploys the `Token` smart contract', async () => {    
  //   await localDeploy();
  //   // let tx = await Mina.transaction(deployerAccount, async () => {
  //   //   token.mint(deployerAccount,new UInt64(1_000_000));
  //   // });
  //   // await tx.prove();
  //   // await tx.sign([deployerKey]).send();
  //   // const ownerBalance = Mina.getBalance(deployerAccount,tokenId).value.toString();
  //   // console.log(ownerBalance.toString());
  // });
});
