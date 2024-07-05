var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, SmartContract, state, State, method, PublicKey, Poseidon, UInt64, Struct, Proof, verify } from 'o1js';
import { ZkonZkProgram } from './zkProgram';
// DEV Note: 
// The requests zk-app makes use of the coordinator zk-app. 
// The oracle makes call to the ZkRequest zk-app and sends the proof(kimchi-proof), and API response. 
//ToDo: String might not work. Replace with circuit string.
class ApiResponseData extends Struct({
    lastUpdatedAt: Field,
    availableSupply: Field,
    circulatingSupply: Field,
    totalSupply: Field,
}) {
}
class ApiResponse extends Struct({
    data: ApiResponseData,
    timestamp: Field
}) {
}
class ResponseEvent extends Struct({
    id: Field,
    ApiResponseClient: ApiResponse
}) {
}
class RequestPaidEvent extends Struct({
    zkApp: PublicKey,
    requestsPaid: Field,
    createdAt: UInt64
}) {
}
//ToDo: Clean-up to import from utils file.
class Commitments extends Struct({
    availableSupply: Field, timestamp: Field
}) {
    constructor(value) {
        super(value);
    }
}
export class ZkonRequestCoordinator extends SmartContract {
    constructor() {
        super(...arguments);
        this.oracle = State();
        this.zkonToken = State();
        this.treasury = State();
        this.feePrice = State();
        this.responseCount = State();
        this.events = {
            requested: ResponseEvent,
            fullfilled: Field,
            requestsPaid: RequestPaidEvent
        };
    }
    async initState(treasury, zkTokenAddress, feePrice, oracle) {
        super.init();
        this.feePrice.set(feePrice);
        this.treasury.set(treasury);
        this.zkonToken.set(zkTokenAddress);
        this.oracle.set(oracle);
        this.responseCount.set(new UInt64(1));
    }
    async setFeePrice(feePrice) {
        this.feePrice.set(feePrice);
    }
    async setTreasury(treasury) {
        this.treasury.set(treasury);
    }
    async sendRequest(requester, proof, apiData) {
        const currentResponseCount = this.responseCount.getAndRequireEquals();
        const requestId = Poseidon.hash([currentResponseCount.toFields()[0], requester.toFields()[0]]);
        const { verificationKey } = await ZkonZkProgram.compile();
        const verifyProof = await verify(proof.toJSON(), verificationKey);
        //ToDo: Please check if logic is coorect. 
        if (verifyProof) {
            const event = new ResponseEvent({
                id: requestId,
                ApiResponseClient: apiData
            });
            this.emitEvent('requested', event);
            this.responseCount.set(currentResponseCount.add(1));
            return requestId;
        }
        else {
            return requestId;
        }
    }
    async fakeEvent() {
        // const fetchedEvents = await this.fetchEvents();
        // assert(fetchedEvents.length > 0);
        this.emitEvent('fullfilled', Field(1));
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
], ZkonRequestCoordinator.prototype, "treasury", void 0);
__decorate([
    state(UInt64),
    __metadata("design:type", Object)
], ZkonRequestCoordinator.prototype, "feePrice", void 0);
__decorate([
    state(UInt64),
    __metadata("design:type", Object)
], ZkonRequestCoordinator.prototype, "responseCount", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey, PublicKey, UInt64, PublicKey]),
    __metadata("design:returntype", Promise)
], ZkonRequestCoordinator.prototype, "initState", null);
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
], ZkonRequestCoordinator.prototype, "setTreasury", null);
__decorate([
    method.returns(Field),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey, Proof, ApiResponse]),
    __metadata("design:returntype", Promise)
], ZkonRequestCoordinator.prototype, "sendRequest", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ZkonRequestCoordinator.prototype, "fakeEvent", null);
//# sourceMappingURL=ZkonResponseCoordinator.js.map