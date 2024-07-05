import { Field, SmartContract, state, State, method, PublicKey, Poseidon, UInt64, Struct, Permissions, Proof, JsonProof, verify} from 'o1js';
import { ZkonZkProgram } from './zkProgram';

// DEV Note: 
// The requests zk-app makes use of the coordinator zk-app. 
// The oracle makes call to the ZkRequest zk-app and sends the proof(kimchi-proof), and API response. 

//ToDo: String might not work. Replace with circuit string.
class ApiResponseData extends Struct({
  lastUpdatedAt:Field,
  availableSupply:Field,
  circulatingSupply:Field,
  totalSupply:Field,
}){}

class ApiResponse extends Struct ({
  data: ApiResponseData,
  timestamp: Field
}){}

class ResponseEvent extends Struct ({
  id: Field,
  ApiResponseClient: ApiResponse
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

export class ZkonRequestCoordinator extends SmartContract {
  @state(PublicKey) oracle = State<PublicKey>();
  @state(PublicKey) zkonToken = State<PublicKey>();
  @state(PublicKey) treasury = State<PublicKey>();
  @state(UInt64) feePrice = State<UInt64>();
  @state(UInt64) responseCount = State<UInt64>();

  @method
  async initState(treasury: PublicKey, zkTokenAddress: PublicKey, feePrice: UInt64, oracle: PublicKey) {
    super.init();
    this.feePrice.set(feePrice);
    this.treasury.set(treasury);
    this.zkonToken.set(zkTokenAddress);
    this.oracle.set(oracle);
    this.responseCount.set(new UInt64(1));
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
    requested: ResponseEvent,
    fullfilled: Field,
    requestsPaid: RequestPaidEvent
  };

  @method.returns(Field)
  async sendRequest(requester: PublicKey, proof: Proof<Commitments,void> , apiData:ApiResponse ) {
   
    const currentResponseCount = this.responseCount.getAndRequireEquals();    
    const requestId = Poseidon.hash([currentResponseCount.toFields()[0], requester.toFields()[0]])

    const {verificationKey} = await ZkonZkProgram.compile()
    const verifyProof = await verify(proof.toJSON(), verificationKey);

    //ToDo: Please check if logic is coorect. 
    if(verifyProof){
      const event = new ResponseEvent({
        id: requestId,
        ApiResponseClient: apiData
      })
      this.emitEvent('requested', event);
      this.responseCount.set(currentResponseCount.add(1));
      return requestId;
    }
    else{
      return requestId;
    }
  }  

  @method
  async fakeEvent() {
    // const fetchedEvents = await this.fetchEvents();
    // assert(fetchedEvents.length > 0);
    this.emitEvent('fullfilled', Field(1));
  }
}