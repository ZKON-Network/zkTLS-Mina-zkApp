import { SmartContract, PublicKey, state, State, method, Field, DeployArgs } from 'o1js';

export interface AppDeployProps extends Exclude<DeployArgs, undefined> {
  /** Address of the coordinator contract */
  coordinator: PublicKey  
}

export class ZkAppTest extends SmartContract {
  @state(PublicKey) coordinator = State<PublicKey>();
  
  async deploy(props: AppDeployProps) {
    await super.deploy(props);
    this.coordinator.set(props.coordinator);
  }
  
  @method.returns(PublicKey)
  async getPublicKey(){
    return this.coordinator.getAndRequireEquals();
  }
}