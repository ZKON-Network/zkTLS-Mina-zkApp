import { Field, SmartContract, state, State, method, PublicKey, Poseidon, UInt64, Signature, Reducer, assert, Struct, UInt32, Circuit, Provable, Bool, Proof } from 'o1js';
import { FungibleToken } from 'mina-fungible-token';
import { Request } from './Zkon-lib.js';

const MAX_BLOCKS_TO_CHECK = UInt32.from(50);

export class ZkonRequestCoordinator extends SmartContract {
  @state(PublicKey) oracle = State<PublicKey>();
  @state(PublicKey) zkonToken = State<PublicKey>();
  @state(PublicKey) treasury = State<PublicKey>();
  @state(UInt64) feePrice = State<UInt64>();
  @state(UInt64) requestCount = State<UInt64>();

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

  events = {
    requested: Field,
    fullfilled: Field
  };

  @method 
  async sendRequest(req: Request) {
    
    const ZkToken = new FungibleToken(this.zkonToken.getAndRequireEquals());    
    
    const amountToSend = this.feePrice.getAndRequireEquals();

    ZkToken.transfer(this.sender, this.treasury.getAndRequireEquals(), amountToSend);

    const currentRequestCount = this.requestCount.getAndRequireEquals();    
    const requestId = Poseidon.hash([currentRequestCount.toFields()[0],this.sender.toFields()[0]])
    this.emitEvent('requested', requestId);
    
    this.requestCount.set(currentRequestCount.add(1));
  }  

  @method
  // async recordRequestFullfillment(requestId: Field,proof: ZKProgramPoof) { 
  async recordRequestFullfillment(requestId: Field) {
    // Verify "ownership" of the request
    
    const fetchedEvents = await this.fetchEvents();

    // /* Checks if requestId exists */
    // assert(
    //   fetchedEvents.some(
    //     (req) =>
    //       req.type == 'requested' 
    //       // && (requestId.assertEquals(req.event.data.toFields(null)[0]) == undefined
    //       //   ? true
    //       //   : false) 
    //         // && requestId === req.event.data.toFields(null)[0]
    //         // && requestId.equals(req.event.data.toFields(null)[0])
    //   ),
    //   'RequestId not found'
    // );

    /* Checks if requestId has been fullfilled */
    // assert(
    //   fetchedEvents.some(
    //     (req) =>
    //       req.type == 'fullfilled' 
    //       // && (requestId.assertEquals(req.event.data.toFields(null)[0]) == undefined
    //       //   ? true
    //       //   : false) 
    //         // && requestId === req.event.data.toFields(null)[0]
    //         // && requestId.equals(req.event.data.toFields(null)[0])
    //   ),
    //   'RequestId already fullfilled'
    // );

    this.emitEvent('fullfilled', Field(1)); //ToDo parameter for the event
  }

  @method
  async fakeEvent() {
    // const fetchedEvents = await this.fetchEvents();
    this.emitEvent('fullfilled', Field(1)); 
  }
}