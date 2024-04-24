import { Field, SmartContract, state, State, method, PublicKey, Poseidon, UInt64, Signature, Reducer, assert } from 'o1js';
import { FungibleToken } from 'mina-fungible-token';
import { Request } from './Zkon-lib';

export class ZkonRequestCoordinator extends SmartContract {
  @state(PublicKey) oracle = State<PublicKey>();
  @state(PublicKey) zkonToken = State<PublicKey>();
  @state(PublicKey) treasury = State<PublicKey>();
  @state(UInt64) feePrice = State<UInt64>();
  @state(UInt64) requestCount = State<UInt64>();
  
  events = {
    requested: Field,
    fullfilled: Field
  };

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

  @method 
  async sendRequest(req: Request) {
    
    const ZkToken = new FungibleToken(this.zkonToken.getAndRequireEquals());    
    
    const amountToSend = this.feePrice.getAndRequireEquals();

    ZkToken.transfer(this.sender, this.treasury.getAndRequireEquals(), amountToSend);

    const currentRequestCount = this.requestCount.getAndRequireEquals();    
    const requestId = Poseidon.hash([currentRequestCount.toFields()[0],this.sender.toFields()[0]])
    //TODO save pending request    
    this.emitEvent('requested', requestId);
    
    this.requestCount.set(currentRequestCount.add(1));
  }

  @method
  async recordRequestFullfillment(requestId: Field,signature: Signature) {
    // Verify "ownership" of the request

    const fetchedEvents = await this.fetchEvents(); //ToDo check if if possible to limit events amount

    let requestEmited = fetchedEvents.some((req) => (req.type == 'requested' && req.event.data.toFields(null)[0] === requestId));
    assert(requestEmited,"RequestId not found");

    let requestFullfilled = fetchedEvents.some((req) => (req.type == 'fullfilled' && req.event.data.toFields(null)[0] === requestId));
    assert(!requestFullfilled,"RequestId already fullfilled");

    // Evaluate whether the signature is valid for the provided data
    this.oracle.requireEquals(this.oracle.get());
    const validSignature = signature.verify(this.oracle.get(),[]);
    // Check that the signature is valid
    validSignature.assertTrue("Signature is not valid");    

    this.emitEvent('fullfilled', requestId);
  }
}