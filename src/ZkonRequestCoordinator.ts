import { Field, SmartContract, state, State, method, PublicKey, PrivateKey, Mina } from 'o1js';

/** Mock data */
const treasuryPk = PrivateKey.random();
const treasury = treasuryPk.toPublicKey();

const zkTokenPk = PrivateKey.random();
const zkToken = zkTokenPk.toPublicKey();
/** Mock data */

export class ZkonRequestCoordinator extends SmartContract {
  @state(Field) zkonToken = State<PublicKey>();
  @state(Field) treasury = State<PublicKey>();
  @state(Field) feePrice = State<Field>();
  
  events = {
    'requested': Field,
  };  

  init() {
    super.init();
    this.feePrice.set(Field(1));
    this.treasury.set(treasury);
    this.zkonToken.set(zkToken);
  }

  @method setFeePrice(feePrice: number) {
    this.feePrice.set(Field(feePrice))    
  }

  @method setTreasury(treasury: PublicKey) {
    this.treasury.set(treasury)
  }

  @method sendRequest(treasury: PublicKey) {
    this.emitEvent('requested',this.zkonToken)    
  }

  encodeRequest(request:string) : String {
    return "Hello world";
  }
}