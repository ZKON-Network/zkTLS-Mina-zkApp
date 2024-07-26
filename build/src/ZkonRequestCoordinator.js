var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, SmartContract, state, State, method, PublicKey, Poseidon, UInt64, Struct, ZkProgram, UInt32 } from 'o1js';
import { FungibleToken } from 'mina-fungible-token';
import { ZkonZkProgram } from './zkProgram.js';
class RequestEvent extends Struct({
    id: Field,
    hash1: Field,
    hash2: Field,
    senderX: Field,
    senderY: Field
}) {
}
export class ExternalRequestEvent extends Struct({
    id: Field,
    hash1: Field,
    hash2: Field
}) {
}
class RequestPaidEvent extends Struct({
    zkApp: PublicKey,
    requestsPaid: Field,
    createdAt: UInt32
}) {
}
export let ZkonProof_ = ZkProgram.Proof(ZkonZkProgram);
export class ZkonProof extends ZkonProof_ {
}
export class ZkonRequestCoordinator extends SmartContract {
    constructor() {
        super(...arguments);
        this.oracle = State();
        this.zkonToken = State();
        this.owner = State();
        this.feePrice = State();
        this.requestCount = State();
        this.events = {
            requested: RequestEvent,
            fullfilled: Field,
            requestsPaid: RequestPaidEvent
        };
    }
    async deploy(props) {
        await super.deploy(props);
        this.oracle.set(props.oracle);
        this.zkonToken.set(props.zkonToken);
        this.owner.set(props.owner);
        this.feePrice.set(props.feePrice);
        this.requestCount.set(new UInt64(1));
    }
    onlyOwner() {
        const currentOwner = this.owner.getAndRequireEquals();
        currentOwner.assertEquals(this.sender.getAndRequireSignature());
    }
    async setFeePrice(feePrice) {
        this.onlyOwner();
        this.feePrice.set(feePrice);
    }
    async setOwner(owner) {
        this.onlyOwner();
        this.owner.set(owner);
    }
    async setToken(zkonToken) {
        this.onlyOwner();
        this.zkonToken.set(zkonToken);
    }
    async sendRequest(requester, hash1, hash2) {
        const currentRequestCount = this.requestCount.getAndRequireEquals();
        const requestId = Poseidon.hash([currentRequestCount.toFields()[0], requester.toFields()[0]]);
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
    async prepayRequest(requestAmount, beneficiary) {
        const ZkToken = new FungibleToken(this.zkonToken.getAndRequireEquals());
        const feePrice = this.feePrice.getAndRequireEquals();
        const totalAmount = feePrice.mul(requestAmount);
        await ZkToken.transfer(this.sender.getAndRequireSignature(), this.owner.getAndRequireEquals(), totalAmount);
        //Get the Blockchain length
        const createdAt = this.self.network.blockchainLength;
        const event = new RequestPaidEvent({
            zkApp: beneficiary,
            requestsPaid: requestAmount.toFields()[0],
            createdAt: createdAt.getAndRequireEquals()
        });
        this.emitEvent('requestsPaid', event);
    }
    async recordRequestFullfillment(requestId, proof) {
        // Assert caller is the oracle
        const caller = this.sender.getAndRequireSignature();
        caller.assertEquals(this.oracle.getAndRequireEquals());
        await proof.verify();
        this.emitEvent('fullfilled', requestId);
    }
}
__decorate([
    state(PublicKey),
    __metadata("design:type", Object)
], ZkonRequestCoordinator.prototype, "oracle", void 0);
__decorate([
    state(PublicKey),
    __metadata("design:type", Object)
], ZkonRequestCoordinator.prototype, "zkonToken", void 0);
__decorate([
    state(PublicKey),
    __metadata("design:type", Object)
], ZkonRequestCoordinator.prototype, "owner", void 0);
__decorate([
    state(UInt64),
    __metadata("design:type", Object)
], ZkonRequestCoordinator.prototype, "feePrice", void 0);
__decorate([
    state(UInt64),
    __metadata("design:type", Object)
], ZkonRequestCoordinator.prototype, "requestCount", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UInt64]),
    __metadata("design:returntype", Promise)
], ZkonRequestCoordinator.prototype, "setFeePrice", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey]),
    __metadata("design:returntype", Promise)
], ZkonRequestCoordinator.prototype, "setOwner", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey]),
    __metadata("design:returntype", Promise)
], ZkonRequestCoordinator.prototype, "setToken", null);
__decorate([
    method.returns(Field),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey, Field, Field]),
    __metadata("design:returntype", Promise)
], ZkonRequestCoordinator.prototype, "sendRequest", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UInt64, PublicKey]),
    __metadata("design:returntype", Promise)
], ZkonRequestCoordinator.prototype, "prepayRequest", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, ZkonProof]),
    __metadata("design:returntype", Promise)
], ZkonRequestCoordinator.prototype, "recordRequestFullfillment", null);
export default ZkonRequestCoordinator;
//# sourceMappingURL=ZkonRequestCoordinator.js.map