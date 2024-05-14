import { SmartContract, PublicKey, Struct, UInt64, Bytes, state, State, method, PrivateKey, Signature, Field } from 'o1js';
import {ZkonRequestCoordinator} from './ZkonRequestCoordinator';
import {initialize, Request} from './Zkon-lib';

export class ZkonRequest extends SmartContract {
  @state(PublicKey) coordinator = State<PublicKey>();

  @method
  initState(coordinator: PublicKey) {
    super.init();
    this.coordinator.set(coordinator);
  }

  /**
   * @notice Creates a request to the stored oracle address
   * @param req The initialized Zkon Request
   * @return requestId The request ID
   */
  @method
  async sendRequest(ipfsHash: string) {
    const coordinatorAddress = this.coordinator.getAndRequireEquals();
    const coordinator = new ZkonRequestCoordinator(coordinatorAddress);

    return await coordinator.sendRequest(ipfsHash);
  }

  /**
   * @notice Validates the request
   */
  @method
  async recordRequestFulfillment(requestId: Field, signature: Signature) {
    const coordinatorAddress = this.coordinator.getAndRequireEquals();
    const coordinator = new ZkonRequestCoordinator(coordinatorAddress);

    coordinator.recordRequestFullfillment(requestId, signature);
  }
}