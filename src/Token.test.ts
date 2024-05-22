import { FungibleToken } from 'mina-fungible-token';
import { Field, Mina, PrivateKey, PublicKey, AccountUpdate, UInt64, UInt8 } from 'o1js';

let proofsEnabled = false;

const Local = await Mina.LocalBlockchain({ 
  proofsEnabled
});
Mina.setActiveInstance(Local);

describe('Zkon Token Tests', () => {
  let deployerAccount: Mina.TestPublicKey,
    receiverAccount: Mina.TestPublicKey,
    adminAccount: Mina.TestPublicKey,
    zktAddress: PublicKey,
    zktPrivateKey: PrivateKey,
    token: FungibleToken,
    tokenId: Field;

  beforeAll(async () => {
    console.log('Before all');

    if (proofsEnabled) await FungibleToken.compile();

    deployerAccount = Local.testAccounts[0];
    receiverAccount = Local.testAccounts[1];
    adminAccount = Local.testAccounts[2];

    zktPrivateKey = PrivateKey.random();
    zktAddress = zktPrivateKey.toPublicKey();
    token = new FungibleToken(zktAddress);
    tokenId = token.deriveTokenId();


    const txn = await Mina.transaction({
      sender: deployerAccount,
      fee: 1e8,
    }, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await token.deploy({
        admin: adminAccount,
        decimals: UInt8.from(9),
        symbol: "ZKON",
        src: ""
      });
    });
    await txn.prove();
    await txn.sign([deployerAccount.key, adminAccount.key, zktPrivateKey]).send();
    console.log('sent');
  });

  const totalSupply = UInt64.from(10_000_000);

  it('Deploy and mint ZkonToken', async () => {

    let tx = await Mina.transaction({
      sender: receiverAccount,
      fee: 1e8,
    }, async () => {
      AccountUpdate.fundNewAccount(receiverAccount, 1);
      await token.mint(receiverAccount, totalSupply);
    });

    await tx.prove();
    await tx.sign([receiverAccount.key, adminAccount.key]).send();

    let ownerBalance = Mina.getBalance(deployerAccount,tokenId).value.toString();
    
    expect(ownerBalance).toEqual(totalSupply.toString());

    const trfAmount = new UInt64(1_000);
    let trfTx = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await token.transfer(deployerAccount, receiverAccount, trfAmount);
    });
    trfTx.sign([deployerAccount.key]);
    await trfTx.prove();
    await trfTx.send();

    ownerBalance = Mina.getBalance(deployerAccount,tokenId).value.toString();
    const receiverBalance = Mina.getBalance(receiverAccount,tokenId).value.toString();

    expect(ownerBalance).toEqual(totalSupply.sub(trfAmount).toString());
    expect(receiverBalance).toEqual(trfAmount.toString());
  })

});
