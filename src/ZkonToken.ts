import { Field, state, State, method, TokenContract, AccountUpdateForest, PublicKey, UInt64, Signature } from 'o1js';

const tokenSymbol = 'ZKTKN';
const maxSupply = 1_000_000_000;

export class ZkonToken extends TokenContract {
  @state(UInt64) totalMinted = State<UInt64>();
  @state(UInt64) maxSupply = State<UInt64>();

  init() {
    super.init();
    this.account.tokenSymbol.set(tokenSymbol);
    this.maxSupply.set(new UInt64(maxSupply));
    this.totalMinted.set(UInt64.zero);
  }

  @method async mint(
    receiverAddress: PublicKey,
    amount: UInt64
  ) {
    const totalMinted = this.totalMinted.get();
    this.totalMinted.requireEquals(totalMinted);

    const newTotalMinted = totalMinted.add(amount);
    this.maxSupply.requireEquals(this.maxSupply.get());
    newTotalMinted.assertLessThanOrEqual(this.maxSupply.get(),"Mint amount exceeds max supply");

    this.internal.mint({ address: receiverAddress, amount });

    this.totalMinted.set(newTotalMinted);
  }

  @method async burn(
    burnerAddress: PublicKey,
    amount: UInt64
  ) {
    this.internal.burn({ address: burnerAddress, amount });
  }
  
  @method approveBase(forest: AccountUpdateForest) {
    this.checkZeroBalanceChange(forest);
  }

}
