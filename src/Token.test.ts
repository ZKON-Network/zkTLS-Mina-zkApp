import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  UInt64,
  UInt8,
} from 'o1js';
import { FungibleToken, FungibleTokenAdmin } from 'mina-fungible-token';

let proofsEnabled = false;

const Local = await Mina.LocalBlockchain({ 
  proofsEnabled,
  enforceTransactionLimits: false,
});
Mina.setActiveInstance(Local);

describe('Zkon Token Tests', () => {
  let deployerAccount: Mina.TestPublicKey,
    receiverAccount: Mina.TestPublicKey,    
    zktAddress: PublicKey,
    zktPrivateKey: PrivateKey,
    token: FungibleToken,
    tokenId: Field,
    tokenAdmin: Mina.TestPublicKey,
    tokenAdminContract: FungibleTokenAdmin;

  beforeAll(async () => {
    deployerAccount = Local.testAccounts[0];
    receiverAccount = Local.testAccounts[1];    
    tokenAdmin = Local.testAccounts[2];
    
    zktPrivateKey = PrivateKey.random();
    zktAddress = zktPrivateKey.toPublicKey();
    token = new FungibleToken(zktAddress);

    tokenAdminContract = new FungibleTokenAdmin(tokenAdmin)
    
    if (proofsEnabled) await FungibleToken.compile();
  });

  it('Deploy',async ()=> {
    const txn = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount,1);
      await tokenAdminContract.deploy({
        adminPublicKey: tokenAdmin,
      })
      await token.deploy({
        admin: tokenAdmin,
        decimals: UInt8.from(9),
        symbol: "ZKON",
        src: ""
      });
    });
    await txn.prove();
    await txn.sign([deployerAccount.key, tokenAdmin.key, zktPrivateKey]).send();    
  })
  
  it('mint ZkonToken to receiver account', async () => {
    const initialSupply = UInt64.from(10000000);

    const tx = await Mina.transaction(receiverAccount, async () => {
      AccountUpdate.fundNewAccount(receiverAccount, 1);
      await token.mint(receiverAccount, initialSupply);
    });

    tx.sign([receiverAccount.key, tokenAdmin.key])
    await tx.prove()
    await tx.send()

    let receiverBalance = (await token.getBalanceOf(receiverAccount)).toString();
    
    expect(receiverBalance).toEqual(initialSupply.toString());

    const trfAmount = new UInt64(1000);
    let trfTx = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await token.transfer(receiverAccount, deployerAccount, trfAmount);
    });
    trfTx.sign([deployerAccount.key, receiverAccount.key]);
    await trfTx.prove();
    await trfTx.send();

    let deployerBalance = (await token.getBalanceOf(deployerAccount)).toString();
    
    expect(deployerBalance).toEqual(trfAmount.toString());
  })

});
