import { SmartContract, PublicKey, state, State, method, Field } from 'o1js';

export class ZkAppTest extends SmartContract {
  @state(PublicKey) coordinator = State<PublicKey>();

  @method
  async initState(coordinator: PublicKey) {
    super.init();
    this.coordinator.set(coordinator);    
  }
}