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
   * @notice Creates a request
   * @param jobId The Job Specification ID that the request will be created for
   * @param callbackAddr address to operate the callback on
   * @param callbackFunctionSignature function signature to use for the callback
   * @param url the URL to perform the GET request on
   * @param path path to find the desired data in the API response
   * @return A Zkon Request struct in memory
   */
  @method
  buildRequest(
    jobId: UInt64,
    callbackAddr: PublicKey,
    callbackFunctionSignature: Bytes,
    url: string,
    path: string
  ) {
    return initialize(
      jobId,
      callbackAddr,
      callbackFunctionSignature,
      url,
      path
    );
  }

  /**
   * @notice Creates a request to the stored oracle address
   * @param req The initialized Zkon Request
   * @return requestId The request ID
   */
  @method
  async sendRequest(req: Request) {
    const coordinatorAddress = this.coordinator.getAndRequireEquals();
    const coordinator = new ZkonRequestCoordinator(coordinatorAddress);

    return await coordinator.sendRequest(req);
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