import { SmartContract, PublicKey, State, Field, DeployArgs } from 'o1js';
import { ExternalRequestEvent } from './ZkonRequestCoordinator.js';
export interface AppDeployProps extends Exclude<DeployArgs, undefined> {
    /** Address of the coordinator contract */
    coordinator: PublicKey;
}
export declare let ZkonProof_: {
    new ({ proof, publicInput, publicOutput, maxProofsVerified, }: {
        proof: unknown;
        publicInput: import("./zkProgram.js").PublicArgumets;
        publicOutput: void;
        maxProofsVerified: 0 | 2 | 1;
    }): {
        verify(): void;
        verifyIf(condition: import("o1js/dist/node/lib/provable/bool.js").Bool): void;
        publicInput: import("./zkProgram.js").PublicArgumets;
        publicOutput: void;
        proof: unknown;
        maxProofsVerified: 0 | 2 | 1;
        shouldVerify: import("o1js/dist/node/lib/provable/bool.js").Bool;
        toJSON(): import("o1js").JsonProof;
    };
    publicInputType: typeof import("./zkProgram.js").PublicArgumets;
    publicOutputType: import("o1js/dist/node/lib/provable/types/struct.js").ProvablePureExtended<void, void, null>;
    tag: () => {
        name: string;
        publicInputType: typeof import("./zkProgram.js").PublicArgumets;
        publicOutputType: import("o1js/dist/node/lib/provable/types/struct.js").ProvablePureExtended<void, void, null>;
    };
    fromJSON<S extends (new (...args: any) => import("o1js").Proof<unknown, unknown>) & {
        prototype: import("o1js").Proof<any, any>;
        fromJSON: typeof import("o1js").Proof.fromJSON;
        dummy: typeof import("o1js").Proof.dummy;
        publicInputType: import("o1js").FlexibleProvablePure<any>;
        publicOutputType: import("o1js").FlexibleProvablePure<any>;
        tag: () => {
            name: string;
        };
    } & {
        prototype: import("o1js").Proof<unknown, unknown>;
    }>(this: S, { maxProofsVerified, proof: proofString, publicInput: publicInputJson, publicOutput: publicOutputJson, }: import("o1js").JsonProof): Promise<import("o1js").Proof<import("o1js").InferProvable<S["publicInputType"]>, import("o1js").InferProvable<S["publicOutputType"]>>>;
    dummy<Input, OutPut>(publicInput: Input, publicOutput: OutPut, maxProofsVerified: 0 | 2 | 1, domainLog2?: number | undefined): Promise<import("o1js").Proof<Input, OutPut>>;
};
export declare class ZkonProof extends ZkonProof_ {
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
    receiveZkonResponse(requestId: Field, proof: ZkonProof): Promise<void>;
}
export default ZkonRequest;
