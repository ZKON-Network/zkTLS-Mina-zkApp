import { SmartContract, PublicKey, State, Field, DeployArgs, Proof } from 'o1js';
import { ExternalRequestEvent } from './ZkonRequestCoordinator.js';
import { Commitments } from './zkProgram.js';
export interface AppDeployProps extends Exclude<DeployArgs, undefined> {
    /** Address of the coordinator contract */
    coordinator: PublicKey;
}
export declare class ZkonRequest extends SmartContract {
    coordinator: State<PublicKey>;
    coinValue: State<import("o1js/dist/node/lib/provable/field.js").Field>;
    deploy(props: AppDeployProps): Promise<void>;
    events: {
        requested: typeof ExternalRequestEvent;
    };
    /**
     * @notice Creates a request to the stored coordinator address
     * @param req The initialized Zkon Request
     * @return requestId The request ID
     */
    sendRequest(hashPart1: Field, hashPart2: Field): Promise<import("o1js/dist/node/lib/provable/field.js").Field>;
    /**
     * @notice Validates the request
     */
    receiveZkonResponse(requestId: Field, proof: Proof<Commitments, void>): Promise<void>;
}
