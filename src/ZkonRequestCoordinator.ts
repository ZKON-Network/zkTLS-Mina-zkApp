import { Field, SmartContract, state, State, method, PublicKey, Poseidon, UInt64, Struct, assert, Proof, DeployArgs, ZkProgram } from 'o1js';
import { FungibleToken } from 'mina-fungible-token';
import { ZkonZkProgram } from './zkProgram.js';

export interface CoordinatorDeployProps extends Exclude<DeployArgs, undefined> {
  oracle : PublicKey
  zkonToken : PublicKey
  treasury : PublicKey
  feePrice : UInt64
}

class RequestEvent extends Struct ({
  id: Field,
  hash1: Field,
  hash2: Field,
  senderX: Field,
  senderY: Field
}) {}

export class ExternalRequestEvent extends Struct ({
  id: Field,
  hash1: Field,
  hash2: Field  
}) {}

class RequestPaidEvent extends Struct ({
  zkApp: PublicKey,
  requestsPaid: Field,
  createdAt: UInt64
}) {}

export let ZkonProof_ = ZkProgram.Proof(ZkonZkProgram);
export class ZkonProof extends ZkonProof_ {}

export class ZkonRequestCoordinator extends SmartContract {
  @state(PublicKey) oracle = State<PublicKey>();
  @state(PublicKey) zkonToken = State<PublicKey>();
  @state(PublicKey) treasury = State<PublicKey>();
  @state(UInt64) feePrice = State<UInt64>();
  @state(UInt64) requestCount = State<UInt64>();

  async deploy(props: CoordinatorDeployProps) {
    await super.deploy(props);
    this.oracle.set(props.oracle);
    this.zkonToken.set(props.zkonToken);
    this.treasury.set(props.treasury);
    this.feePrice.set(props.feePrice);
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
  async sendRequest(requester: PublicKey,hash1: Field, hash2: Field) {
   
    const currentRequestCount = this.requestCount.getAndRequireEquals();    
    const requestId = Poseidon.hash([currentRequestCount.toFields()[0], requester.toFields()[0]])

    const sender = requester.toFields();

    const event = new RequestEvent({
      id: requestId,
      hash1: hash1,
      hash2: hash2,
      senderX: sender[0],
      senderY: sender[1]
    });

    this.emitEvent('requested', event);
    
    this.requestCount.set(currentRequestCount.add(1));

    return requestId;
  }  

  @method 
  async prepayRequest(requestAmount: UInt64, beneficiary: PublicKey) {
    
    const ZkToken = new FungibleToken(this.zkonToken.getAndRequireEquals());    
    
    const feePrice = this.feePrice.getAndRequireEquals();
    const totalAmount = feePrice.mul(requestAmount);

    await ZkToken.transfer(this.sender.getAndRequireSignature(), this.treasury.getAndRequireEquals(), totalAmount);
    
    //Get the current timestamp
    const timestamp = this.self.network.timestamp
    
    const event = new RequestPaidEvent({
      zkApp: beneficiary,
      requestsPaid: requestAmount.toFields()[0],
      createdAt: timestamp.getAndRequireEquals()
    });

    this.emitEvent('requestsPaid', event);    
  }  

  @method
  async recordRequestFullfillment(requestId: Field, proof: ZkonProof) {
    // Assert caller is the oracle
    const caller = this.sender.getAndRequireSignature();
    caller.assertEquals(this.oracle.getAndRequireEquals());

    await proof.verify();
    
    this.emitEvent('fullfilled', requestId);
  }
}