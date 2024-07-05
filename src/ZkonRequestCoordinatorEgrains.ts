import { Field, SmartContract, state, State, method, PublicKey, Poseidon, UInt64, Struct, Permissions, Proof } from 'o1js';

class RequestEvent extends Struct ({
  id: Field,
  hash1: Field,
  hash2: Field,
  senderX: Field,
  senderY: Field
}) {}

class RequestPaidEvent extends Struct ({
  zkApp: PublicKey,
  requestsPaid: Field,
  createdAt: UInt64
}) {}

//ToDo: Clean-up to import from utils file.
class Commitments extends Struct({
    availableSupply: Field, timestamp: Field
  }){
    constructor(value:{availableSupply: Field, timestamp: Field}){
      super(value)
    }
}

//ToDo: String might not work. Replace with circuit string.
class ApiResponseData extends Struct({
    symbol: String,
    name: String,
    website: String,
    twitter: String,
    lastUpdatedAt:Field,
    availableSupply:Field,
    circulatingSupply:Field,
    totalSupply:Field,
    networks:[String, String, String],
    icon: String
  }){}
  
class ApiResponse extends Struct ({
    status: String,
    data: ApiResponseData,
    timestamp: Field
  }){}

export class ZkonRequestCoordinator extends SmartContract {
  @state(PublicKey) oracle = State<PublicKey>();
  @state(PublicKey) zkonToken = State<PublicKey>();
  @state(PublicKey) treasury = State<PublicKey>();
  @state(UInt64) feePrice = State<UInt64>();
  @state(UInt64) requestCount = State<UInt64>();

  @method
  async initState(treasury: PublicKey, zkTokenAddress: PublicKey, feePrice: UInt64, oracle: PublicKey) {
    super.init();
    this.feePrice.set(feePrice);
    this.treasury.set(treasury);
    this.zkonToken.set(zkTokenAddress);
    this.oracle.set(oracle);
    this.requestCount.set(new UInt64(1));
  }

  @method 
  async setFeePrice(feePrice: UInt64) {
    this.feePrice.set(feePrice);
  }

  @method 
  async setTreasury(treasury: PublicKey) {
    this.treasury.set(treasury);
  }

  events = {
    requested: RequestEvent,
    fullfilled: Field,
    requestsPaid: RequestPaidEvent
  };

  @method.returns(Field)
  async sendRequest(requester: PublicKey,proof: Proof<Commitments,void> , apiData:ApiResponse ) {
   
    const currentRequestCount = this.requestCount.getAndRequireEquals();    
    const requestId = Poseidon.hash([currentRequestCount.toFields()[0], requester.toFields()[0]])

    const sender = requester.toFields();

    this.emitEvent('requested', event);
    this.requestCount.set(currentRequestCount.add(1));

    return requestId;
  }  

  @method
  async fakeEvent() {
    // const fetchedEvents = await this.fetchEvents();
    // assert(fetchedEvents.length > 0);
    this.emitEvent('fullfilled', Field(1));
  }
}