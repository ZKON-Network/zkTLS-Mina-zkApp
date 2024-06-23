import { SmartContract, PublicKey, state, State, method, Field, DeployArgs } from 'o1js';

export class ZkAppTestInitState extends SmartContract {
  @state(PublicKey) coordinator = State<PublicKey>();  
  
  init() {
    super.init()    
    this.coordinator.set(PublicKey.fromBase58("B62qodaburBdviosGYU6BzwAKTVRhfx8EeKyeAJEfcLDb8giLUHPh4X"))
  }
    
  @method.returns(PublicKey)
  async getPublicKey(){
    return this.coordinator.getAndRequireEquals();
  }
}