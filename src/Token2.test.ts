import {
  AccountUpdate,
  AccountUpdateForest,
  Bool,
  DeployArgs,
  Int64,
  method,
  Mina,
  PublicKey,
  SmartContract,
  State,
  state,
  UInt64,
  UInt8,
} from "o1js"
import { TestPublicKey } from "o1js/dist/node/lib/mina/local-blockchain.js"
import {
  FungibleToken,
  FungibleTokenAdmin,
  FungibleTokenAdminBase,
  FungibleTokenAdminDeployProps,
} from "mina-fungible-token"
import { newTestPublicKey } from "./test_util.js"

const proofsEnabled = false

const localChain = await Mina.LocalBlockchain({
  proofsEnabled: proofsEnabled,
  enforceTransactionLimits: false,
})
Mina.setActiveInstance(localChain)

describe("token integration", () => {
  let deployer: TestPublicKey
  let sender: TestPublicKey
  let receiver: TestPublicKey
  let tokenAdmin: TestPublicKey
  let tokenAdminContract: FungibleTokenAdmin
  let newTokenAdmin: TestPublicKey
  let newTokenAdminContract: FungibleTokenAdmin
  let tokenA: TestPublicKey
  let tokenAContract: FungibleToken
  let tokenBAdmin: TestPublicKey
  let tokenB: TestPublicKey
  let tokenBContract: FungibleToken
  let thirdPartyA: TestPublicKey
  let thirdPartyB: TestPublicKey

  beforeAll(async () => {
    [deployer, sender, receiver] = localChain.testAccounts

    tokenAdmin = newTestPublicKey()
    tokenAdminContract = new FungibleTokenAdmin(tokenAdmin)
    newTokenAdmin = newTestPublicKey()
    newTokenAdminContract = new FungibleTokenAdmin(newTokenAdmin)

    tokenA = newTestPublicKey()
    tokenAContract = new FungibleToken(tokenA)

    tokenBAdmin = newTestPublicKey()
    tokenB = newTestPublicKey()
    tokenBContract = new FungibleToken(tokenB)


    if (proofsEnabled) {
      await FungibleToken.compile()
      await FungibleTokenAdmin.compile()
    }
  })

  describe("deploy", () => {
    it("should deploy token contract A", async () => {
      const tx = await Mina.transaction({
        sender: deployer,
        fee: 1e8,
      }, async () => {
        AccountUpdate.fundNewAccount(deployer, 2)
        await tokenAdminContract.deploy({
          adminPublicKey: tokenAdmin,
        })
        await tokenAContract.deploy({
          admin: tokenAdmin,
          symbol: "tokA",
          src: "",
          decimals: UInt8.from(9),
        })
      })

      tx.sign([
        deployer.key,
        tokenA.key,
        tokenAdmin.key,
      ])

      await tx.prove()
      await tx.send()
    })
  })

  describe("admin", () => {
    const mintAmount = UInt64.from(1000)
    const burnAmount = UInt64.from(100)

    it("should mint for the sender account", async () => {
      const initialBalance = (await tokenAContract.getBalanceOf(sender))
        .toBigInt()
      const initialCirculating = (await tokenAContract.getCirculating()).toBigInt()

      const tx = await Mina.transaction({
        sender: sender,
        fee: 1e8,
      }, async () => {
        AccountUpdate.fundNewAccount(sender, 1)
        await tokenAContract.mint(sender, mintAmount)
      })

      tx.sign([sender.key, tokenAdmin.key])
      await tx.prove()
      await tx.send()
      let ownerBalance = (await tokenAContract.getBalanceOf(sender)).toString();
    
      expect(ownerBalance).toEqual(mintAmount.toString());
    })

  })
})