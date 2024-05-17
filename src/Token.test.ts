import { FungibleToken } from 'mina-fungible-token';
import { Field, Mina, PrivateKey, PublicKey, AccountUpdate, UInt64 } from 'o1js';

let proofsEnabled = false;

describe('Zkon Token Tests', () => {
  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    receiverAccount: PublicKey,
    receiverKey: PrivateKey,
    zktAddress: PublicKey,
    zktPrivateKey: PrivateKey,
    token: FungibleToken,
    tokenId: Field;

  beforeAll(async () => {
    if (proofsEnabled) await FungibleToken.compile();
  });

  const totalSupply = UInt64.from(10_000_000);

  beforeEach(() => {
    const Local = Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    ({ privateKey: deployerKey, publicKey: deployerAccount } =
      Local.testAccounts[0]);
    ({ privateKey: receiverKey, publicKey: receiverAccount } =
      Local.testAccounts[1]);
    zktPrivateKey = PrivateKey.random();
    zktAddress = zktPrivateKey.toPublicKey();
    token = new FungibleToken(zktAddress);
    tokenId = token.deriveTokenId();
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await token.deploy({
        owner: deployerAccount,
        supply: totalSupply,
        symbol: "ZKON",
        src: ""
      });
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zktPrivateKey]).send();
  }

  it('Deploy and mint ZkonToken', async () => {
    await localDeploy();

    let tx = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await token.mint(deployerAccount, totalSupply);
    });
    await tx.prove();
    await tx.sign([deployerKey]).send();

    let ownerBalance = Mina.getBalance(deployerAccount,tokenId).value.toString();
    
    expect(ownerBalance).toEqual(totalSupply.toString());

    const trfAmount = new UInt64(1_000);
    let trfTx = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await token.transfer(deployerAccount, receiverAccount, trfAmount);
    });
    await trfTx.prove();
    await trfTx.sign([deployerKey]).send();

    ownerBalance = Mina.getBalance(deployerAccount,tokenId).value.toString();
    const receiverBalance = Mina.getBalance(receiverAccount,tokenId).value.toString();

    expect(ownerBalance).toEqual(totalSupply.sub(trfAmount).toString());
    expect(receiverBalance).toEqual(trfAmount.toString());
  })

});
