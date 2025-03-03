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
    }): import("o1js").Proof<import("./zkProgram.js").PublicArgumets, void>;
    fromJSON<S extends import("o1js/dist/node/lib/util/types.js").Subclass<typeof import("o1js").Proof>>(this: S, { maxProofsVerified, proof: proofString, publicInput: publicInputJson, publicOutput: publicOutputJson, }: import("o1js").JsonProof): Promise<import("o1js").Proof<import("o1js").InferProvable<S["publicInputType"]>, import("o1js").InferProvable<S["publicOutputType"]>>>;
    dummy<Input, OutPut>(publicInput: Input, publicOutput: OutPut, maxProofsVerified: 0 | 2 | 1, domainLog2?: number): Promise<import("o1js").Proof<Input, OutPut>>;
    readonly provable: {
        toFields: (value: import("o1js").Proof<any, any>) => import("o1js/dist/node/lib/provable/field.js").Field[];
        toAuxiliary: (value?: import("o1js").Proof<any, any> | undefined) => any[];
        fromFields: (fields: import("o1js/dist/node/lib/provable/field.js").Field[], aux: any[]) => import("o1js").Proof<any, any>;
        sizeInFields(): number;
        check: (value: import("o1js").Proof<any, any>) => void;
        toValue: (x: import("o1js").Proof<any, any>) => import("o1js/dist/node/lib/proof-system/proof.js").ProofValue<any, any>;
        fromValue: (x: import("o1js").Proof<any, any> | import("o1js/dist/node/lib/proof-system/proof.js").ProofValue<any, any>) => import("o1js").Proof<any, any>;
        toCanonical?: ((x: import("o1js").Proof<any, any>) => import("o1js").Proof<any, any>) | undefined;
    };
    publicInputType: import("o1js").FlexibleProvable<any>;
    publicOutputType: import("o1js").FlexibleProvable<any>;
    tag: () => {
        name: string;
    };
    publicFields(value: import("o1js").ProofBase<any, any>): {
        input: import("o1js/dist/node/lib/provable/field.js").Field[];
        output: import("o1js/dist/node/lib/provable/field.js").Field[];
    };
    _proofFromBase64(proofString: string, maxProofsVerified: 0 | 2 | 1): unknown;
    _proofToBase64(proof: unknown, maxProofsVerified: 0 | 2 | 1): string;
} & {
    provable: import("o1js").Provable<import("o1js").Proof<import("./zkProgram.js").PublicArgumets, void>, import("o1js/dist/node/lib/proof-system/proof.js").ProofValue<{
        commitment: bigint;
        dataField: bigint;
    }, void>>;
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
