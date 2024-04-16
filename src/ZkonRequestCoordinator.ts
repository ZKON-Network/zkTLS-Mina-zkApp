import { Field, SmartContract, state, State, method, PublicKey, PrivateKey, Mina, Poseidon, Struct, UInt64, Signature, Keccak, Hash, Bytes } from 'o1js';
import { FungibleToken } from 'mina-fungible-token';

class PendingRequest extends Struct({
   requestId: Field,
   requester: PublicKey   
}) {}

export class ZkonRequestCoordinator extends SmartContract {
  @state(PublicKey) oracle = State<PublicKey>();
  @state(PublicKey) zkonToken = State<PublicKey>();
  @state(PublicKey) treasury = State<PublicKey>();
  @state(UInt64) feePrice = State<UInt64>();
  @state(UInt64) requestCount = State<UInt64>();
  
  events = {
    requested: UInt64,
    fullfilled: UInt64
  };

  @method
  initState(treasury: PublicKey, zkTokenAddress: PublicKey, feePrice: UInt64, oracle: PublicKey) {
    super.init();
    this.feePrice.set(feePrice);
    this.treasury.set(treasury);
    this.zkonToken.set(zkTokenAddress);
    this.oracle.set(oracle);
    this.requestCount.set(new UInt64(1));
  }

  @method setFeePrice(feePrice: UInt64) {
    this.feePrice.set(feePrice);
  }

  @method setTreasury(treasury: PublicKey) {
    this.treasury.set(treasury);
  }

  @method 
  async sendRequest() {

    this.zkonToken.requireEquals(this.zkonToken.get());    
    const ZkToken = new FungibleToken(this.zkonToken.get());
    
    this.feePrice.requireEquals(this.feePrice.get());
    const amountToSend = this.feePrice.get();
    
    this.treasury.requireEquals(this.treasury.get());
    ZkToken.transfer(this.sender, this.treasury.get(), amountToSend);

    //TODO save pending request    
    this.requestCount.set(this.requestCount.getAndRequireEquals().add(1));
    
    this.emitEvent('requested', this.requestCount.get());
  }

  @method
  async recordRequestFullfillment(requestId: UInt64,signature: Signature) {
    // Verify "ownership" of the request

    // Evaluate whether the signature is valid for the provided data
    this.oracle.requireEquals(this.oracle.get());
    const validSignature = signature.verify(this.oracle.get(),[]);
    // Check that the signature is valid
    validSignature.assertTrue("Signature is not valid");

    // ToDo delete pending request

    this.emitEvent('fullfilled', requestId);
  }

}