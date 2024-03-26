import { Field, SmartContract, state, State, method, PublicKey, PrivateKey, Mina, Poseidon, Struct, UInt64 } from 'o1js';
import { ZkonToken } from './ZkonToken';

/** Mock data */
// const treasuryPk = PrivateKey.random();
// const treasury = treasuryPk.toPublicKey();

// const zkTokenPk = PrivateKey.random();
// const zkTokenAddress = zkTokenPk.toPublicKey();
/** Mock data */

class PendingRequest extends Struct({
   requestId: Field,
   requester: PublicKey   
}) {}

export class ZkonRequestCoordinator extends SmartContract {
  @state(Field) zkonToken = State<PublicKey>();
  @state(Field) treasury = State<PublicKey>();
  @state(UInt64) feePrice = State<UInt64>();
  @state(PendingRequest) pendingRequests = State<PendingRequest>();
  
  events = {
    'requested': Field,
  };

  @method
  initState(treasury: PublicKey, zkTokenAddress: PublicKey, feePrice: UInt64) {
    super.init();
    this.feePrice.set(feePrice);
    this.treasury.set(treasury);
    this.zkonToken.set(zkTokenAddress);
  }

  @method setFeePrice(feePrice: UInt64) {
    this.feePrice.set(new UInt64(feePrice))    
  }

  @method setTreasury(treasury: PublicKey) {
    this.treasury.set(treasury)
  }

  @method 
  async sendRequest() {
        
    this.emitEvent('requested',this.zkonToken)
    
    const ZkToken = new ZkonToken(this.zkonToken.get())
    
    ZkToken.send({to: this.treasury.get(), amount: this.feePrice.get()});
  }

  encodeRequest(request:string) : String {
    return "Hello world";
  }

}