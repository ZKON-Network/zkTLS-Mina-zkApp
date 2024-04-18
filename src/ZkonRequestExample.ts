import { SmartContract, PublicKey, Struct, UInt64, Bytes, state, State, method, PrivateKey, Signature, Field } from 'o1js';
import {ZkonRequestCoordinator} from './ZkonRequestCoordinator';
import {initialize, Request} from './Zkon-lib';
import { ZkonRequest } from './ZkonRequest';

export class ZkonRequestExample extends ZkonRequest {
  @state(Field) volume = State<Field>();
  @state(Field) jobId = State<Field>();

  events = {
    requestVolume: Field,
  };

  @method
  initState(coordinator: PublicKey) {
    super.init();
    super.initState(coordinator);
    this.jobId.set(Field(1));
  }

  /**
   * @notice Create a Zkon request to retrieve API response
   */
  @method
  async requestVolumeData() {
    const req = await initialize(
      new UInt64(this.jobId.getAndRequireEquals()),
      PrivateKey.random().toPublicKey(), //Review how to get own address
      Bytes.fromString(this.fullfill.toString()),
      'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD',
      'RAW,ETH,USD,VOLUME24HOUR'
    );

    return this.sendRequest(req);
  }

  /**
   * @notice Receive the response
   */
  @method
  async fullfill(requestId: Field, signature: Signature, volume: Field) {
    const coordinatorAddress = this.coordinator.getAndRequireEquals();
    const coordinator = new ZkonRequestCoordinator(coordinatorAddress);

    coordinator.recordRequestFullfillment(requestId, signature);

    this.volume.set(Field(volume));
    this.emitEvent("requestVolume",this.volume.getAndRequireEquals())
  }
}