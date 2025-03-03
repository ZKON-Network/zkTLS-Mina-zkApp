import { Field, ForeignCurve } from 'o1js';
declare const ECDSAHelper_base: (new (value: {
    messageHash: import("o1js/dist/node/lib/provable/bytes").Bytes;
    signature: import("o1js").EcdsaSignature;
    publicKey: ForeignCurve;
}) => {
    messageHash: import("o1js/dist/node/lib/provable/bytes").Bytes;
    signature: import("o1js").EcdsaSignature;
    publicKey: ForeignCurve;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    messageHash: import("o1js/dist/node/lib/provable/bytes").Bytes;
    signature: import("o1js").EcdsaSignature;
    publicKey: ForeignCurve;
}, {
    messageHash: {
        bytes: {
            value: bigint;
        }[];
    };
    signature: {
        r: bigint;
        s: bigint;
    };
    publicKey: {
        x: bigint;
        y: bigint;
    };
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        messageHash: import("o1js/dist/node/lib/provable/bytes").Bytes;
        signature: import("o1js").EcdsaSignature;
        publicKey: ForeignCurve;
    };
} & {
    fromValue: (value: {
        messageHash: import("o1js/dist/node/lib/provable/bytes").Bytes | {
            bytes: {
                value: bigint;
            }[];
        };
        signature: import("o1js").EcdsaSignature | {
            r: bigint;
            s: bigint;
        };
        publicKey: ForeignCurve | {
            x: bigint;
            y: bigint;
        };
    }) => {
        messageHash: import("o1js/dist/node/lib/provable/bytes").Bytes;
        signature: import("o1js").EcdsaSignature;
        publicKey: ForeignCurve;
    };
    toInput: (x: {
        messageHash: import("o1js/dist/node/lib/provable/bytes").Bytes;
        signature: import("o1js").EcdsaSignature;
        publicKey: ForeignCurve;
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        messageHash: import("o1js/dist/node/lib/provable/bytes").Bytes;
        signature: import("o1js").EcdsaSignature;
        publicKey: ForeignCurve;
    }) => {
        messageHash: {
            bytes: {
                value: string;
            }[];
        };
        signature: {
            r: string;
            s: string;
        };
        publicKey: {
            x: string;
            y: string;
        };
    };
    fromJSON: (x: {
        messageHash: {
            bytes: {
                value: string;
            }[];
        };
        signature: {
            r: string;
            s: string;
        };
        publicKey: {
            x: string;
            y: string;
        };
    }) => {
        messageHash: import("o1js/dist/node/lib/provable/bytes").Bytes;
        signature: import("o1js").EcdsaSignature;
        publicKey: ForeignCurve;
    };
    empty: () => {
        messageHash: import("o1js/dist/node/lib/provable/bytes").Bytes;
        signature: import("o1js").EcdsaSignature;
        publicKey: ForeignCurve;
    };
};
declare class ECDSAHelper extends ECDSAHelper_base {
}
declare const PublicArgumets_base: (new (value: {
    commitment: import("o1js/dist/node/lib/provable/field").Field;
    dataField: import("o1js/dist/node/lib/provable/field").Field;
}) => {
    commitment: import("o1js/dist/node/lib/provable/field").Field;
    dataField: import("o1js/dist/node/lib/provable/field").Field;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    commitment: import("o1js/dist/node/lib/provable/field").Field;
    dataField: import("o1js/dist/node/lib/provable/field").Field;
}, {
    commitment: bigint;
    dataField: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        commitment: import("o1js/dist/node/lib/provable/field").Field;
        dataField: import("o1js/dist/node/lib/provable/field").Field;
    };
} & {
    fromValue: (value: {
        commitment: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        dataField: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        commitment: import("o1js/dist/node/lib/provable/field").Field;
        dataField: import("o1js/dist/node/lib/provable/field").Field;
    };
    toInput: (x: {
        commitment: import("o1js/dist/node/lib/provable/field").Field;
        dataField: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        fields?: Field[] | undefined;
        packed?: [Field, number][] | undefined;
    };
    toJSON: (x: {
        commitment: import("o1js/dist/node/lib/provable/field").Field;
        dataField: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        commitment: string;
        dataField: string;
    };
    fromJSON: (x: {
        commitment: string;
        dataField: string;
    }) => {
        commitment: import("o1js/dist/node/lib/provable/field").Field;
        dataField: import("o1js/dist/node/lib/provable/field").Field;
    };
    empty: () => {
        commitment: import("o1js/dist/node/lib/provable/field").Field;
        dataField: import("o1js/dist/node/lib/provable/field").Field;
    };
};
declare class PublicArgumets extends PublicArgumets_base {
}
declare const ZkonZkProgram: {
    name: string;
    maxProofsVerified(): Promise<0 | 1 | 2>;
    compile: (options?: {
        cache?: import("o1js").Cache;
        forceRecompile?: boolean;
        proofsEnabled?: boolean;
    }) => Promise<{
        verificationKey: {
            data: string;
            hash: Field;
        };
    }>;
    verify: (proof: import("o1js").Proof<PublicArgumets, void>) => Promise<boolean>;
    digest: () => Promise<string>;
    analyzeMethods: () => Promise<{
        verifySource: {
            proofs: import("o1js/dist/node/lib/proof-system/proof").ProofClass[];
            rows: number;
            digest: string;
            gates: import("o1js/dist/node/snarky").Gate[];
            publicInputSize: number;
            print(): void;
            summary(): Partial<Record<import("o1js/dist/node/snarky").GateType | "Total rows", number>>;
        };
    }>;
    publicInputType: typeof PublicArgumets;
    publicOutputType: import("o1js/dist/node/lib/provable/types/struct").ProvablePureExtended<void, void, null>;
    privateInputTypes: {
        verifySource: [typeof import("o1js/dist/node/lib/provable/field").Field & ((x: string | number | bigint | import("o1js/dist/node/lib/provable/core/fieldvar").FieldConst | import("o1js/dist/node/lib/provable/core/fieldvar").FieldVar | import("o1js/dist/node/lib/provable/field").Field) => import("o1js/dist/node/lib/provable/field").Field), typeof ECDSAHelper];
    };
    auxiliaryOutputTypes: {
        verifySource: undefined;
    };
    rawMethods: {
        verifySource: (publicInput: PublicArgumets, args_0: import("o1js/dist/node/lib/provable/field").Field, args_1: ECDSAHelper) => Promise<void>;
    };
    Proof: {
        new ({ proof, publicInput, publicOutput, maxProofsVerified, }: {
            proof: import("o1js/dist/node/snarky").Pickles.Proof;
            publicInput: PublicArgumets;
            publicOutput: void;
            maxProofsVerified: 0 | 1 | 2;
        }): import("o1js").Proof<PublicArgumets, void>;
        fromJSON<S extends import("o1js/dist/node/lib/util/types").Subclass<typeof import("o1js").Proof>>(this: S, { maxProofsVerified, proof: proofString, publicInput: publicInputJson, publicOutput: publicOutputJson, }: import("o1js").JsonProof): Promise<import("o1js").Proof<import("o1js").InferProvable<S["publicInputType"]>, import("o1js").InferProvable<S["publicOutputType"]>>>;
        dummy<Input, OutPut>(publicInput: Input, publicOutput: OutPut, maxProofsVerified: 0 | 1 | 2, domainLog2?: number): Promise<import("o1js").Proof<Input, OutPut>>;
        readonly provable: {
            toFields: (value: import("o1js").Proof<any, any>) => import("o1js/dist/node/lib/provable/field").Field[];
            toAuxiliary: (value?: import("o1js").Proof<any, any> | undefined) => any[];
            fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[], aux: any[]) => import("o1js").Proof<any, any>;
            sizeInFields(): number;
            check: (value: import("o1js").Proof<any, any>) => void;
            toValue: (x: import("o1js").Proof<any, any>) => import("o1js/dist/node/lib/proof-system/proof").ProofValue<any, any>;
            fromValue: (x: import("o1js").Proof<any, any> | import("o1js/dist/node/lib/proof-system/proof").ProofValue<any, any>) => import("o1js").Proof<any, any>;
            toCanonical?: ((x: import("o1js").Proof<any, any>) => import("o1js").Proof<any, any>) | undefined;
        };
        publicInputType: import("o1js").FlexibleProvable<any>;
        publicOutputType: import("o1js").FlexibleProvable<any>;
        tag: () => {
            name: string;
        };
        publicFields(value: import("o1js").ProofBase): {
            input: import("o1js/dist/node/lib/provable/field").Field[];
            output: import("o1js/dist/node/lib/provable/field").Field[];
        };
        _proofFromBase64(proofString: import("o1js/dist/node/snarky").Base64ProofString, maxProofsVerified: 0 | 1 | 2): unknown;
        _proofToBase64(proof: import("o1js/dist/node/snarky").Pickles.Proof, maxProofsVerified: 0 | 1 | 2): string;
    };
    proofsEnabled: boolean;
    setProofsEnabled(proofsEnabled: boolean): void;
} & {
    verifySource: (publicInput: PublicArgumets | {
        commitment: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        dataField: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
    }, args_0: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field, args_1: ECDSAHelper | {
        messageHash: import("o1js/dist/node/lib/provable/bytes").Bytes | {
            bytes: {
                value: bigint;
            }[];
        };
        signature: import("o1js").EcdsaSignature | {
            r: bigint;
            s: bigint;
        };
        publicKey: ForeignCurve | {
            x: bigint;
            y: bigint;
        };
    }) => Promise<{
        proof: import("o1js").Proof<PublicArgumets, void>;
        auxiliaryOutput: undefined;
    }>;
};
export { ZkonZkProgram, PublicArgumets, ECDSAHelper };
