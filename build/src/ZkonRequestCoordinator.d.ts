import { Field, SmartContract, State, PublicKey, UInt64, Proof, DeployArgs } from 'o1js';
export interface CoordinatorDeployProps extends Exclude<DeployArgs, undefined> {
    oracle: PublicKey;
    zkonToken: PublicKey;
    owner: PublicKey;
    feePrice: UInt64;
}
declare const RequestEvent_base: (new (value: {
    id: import("o1js/dist/node/lib/provable/field.js").Field;
    hash1: import("o1js/dist/node/lib/provable/field.js").Field;
    hash2: import("o1js/dist/node/lib/provable/field.js").Field;
    senderX: import("o1js/dist/node/lib/provable/field.js").Field;
    senderY: import("o1js/dist/node/lib/provable/field.js").Field;
}) => {
    id: import("o1js/dist/node/lib/provable/field.js").Field;
    hash1: import("o1js/dist/node/lib/provable/field.js").Field;
    hash2: import("o1js/dist/node/lib/provable/field.js").Field;
    senderX: import("o1js/dist/node/lib/provable/field.js").Field;
    senderY: import("o1js/dist/node/lib/provable/field.js").Field;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
    id: import("o1js/dist/node/lib/provable/field.js").Field;
    hash1: import("o1js/dist/node/lib/provable/field.js").Field;
    hash2: import("o1js/dist/node/lib/provable/field.js").Field;
    senderX: import("o1js/dist/node/lib/provable/field.js").Field;
    senderY: import("o1js/dist/node/lib/provable/field.js").Field;
}, {
    id: bigint;
    hash1: bigint;
    hash2: bigint;
    senderX: bigint;
    senderY: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field.js").Field[]) => {
        id: import("o1js/dist/node/lib/provable/field.js").Field;
        hash1: import("o1js/dist/node/lib/provable/field.js").Field;
        hash2: import("o1js/dist/node/lib/provable/field.js").Field;
        senderX: import("o1js/dist/node/lib/provable/field.js").Field;
        senderY: import("o1js/dist/node/lib/provable/field.js").Field;
    };
} & {
    fromValue: (value: {
        id: string | number | bigint | import("o1js/dist/node/lib/provable/field.js").Field;
        hash1: string | number | bigint | import("o1js/dist/node/lib/provable/field.js").Field;
        hash2: string | number | bigint | import("o1js/dist/node/lib/provable/field.js").Field;
        senderX: string | number | bigint | import("o1js/dist/node/lib/provable/field.js").Field;
        senderY: string | number | bigint | import("o1js/dist/node/lib/provable/field.js").Field;
    }) => {
        id: import("o1js/dist/node/lib/provable/field.js").Field;
        hash1: import("o1js/dist/node/lib/provable/field.js").Field;
        hash2: import("o1js/dist/node/lib/provable/field.js").Field;
        senderX: import("o1js/dist/node/lib/provable/field.js").Field;
        senderY: import("o1js/dist/node/lib/provable/field.js").Field;
    };
    toInput: (x: {
        id: import("o1js/dist/node/lib/provable/field.js").Field;
        hash1: import("o1js/dist/node/lib/provable/field.js").Field;
        hash2: import("o1js/dist/node/lib/provable/field.js").Field;
        senderX: import("o1js/dist/node/lib/provable/field.js").Field;
        senderY: import("o1js/dist/node/lib/provable/field.js").Field;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field.js").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field.js").Field, number][] | undefined;
    };
    toJSON: (x: {
        id: import("o1js/dist/node/lib/provable/field.js").Field;
        hash1: import("o1js/dist/node/lib/provable/field.js").Field;
        hash2: import("o1js/dist/node/lib/provable/field.js").Field;
        senderX: import("o1js/dist/node/lib/provable/field.js").Field;
        senderY: import("o1js/dist/node/lib/provable/field.js").Field;
    }) => {
        id: string;
        hash1: string;
        hash2: string;
        senderX: string;
        senderY: string;
    };
    fromJSON: (x: {
        id: string;
        hash1: string;
        hash2: string;
        senderX: string;
        senderY: string;
    }) => {
        id: import("o1js/dist/node/lib/provable/field.js").Field;
        hash1: import("o1js/dist/node/lib/provable/field.js").Field;
        hash2: import("o1js/dist/node/lib/provable/field.js").Field;
        senderX: import("o1js/dist/node/lib/provable/field.js").Field;
        senderY: import("o1js/dist/node/lib/provable/field.js").Field;
    };
    empty: () => {
        id: import("o1js/dist/node/lib/provable/field.js").Field;
        hash1: import("o1js/dist/node/lib/provable/field.js").Field;
        hash2: import("o1js/dist/node/lib/provable/field.js").Field;
        senderX: import("o1js/dist/node/lib/provable/field.js").Field;
        senderY: import("o1js/dist/node/lib/provable/field.js").Field;
    };
};
declare class RequestEvent extends RequestEvent_base {
}
declare const ExternalRequestEvent_base: (new (value: {
    id: import("o1js/dist/node/lib/provable/field.js").Field;
    hash1: import("o1js/dist/node/lib/provable/field.js").Field;
    hash2: import("o1js/dist/node/lib/provable/field.js").Field;
}) => {
    id: import("o1js/dist/node/lib/provable/field.js").Field;
    hash1: import("o1js/dist/node/lib/provable/field.js").Field;
    hash2: import("o1js/dist/node/lib/provable/field.js").Field;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
    id: import("o1js/dist/node/lib/provable/field.js").Field;
    hash1: import("o1js/dist/node/lib/provable/field.js").Field;
    hash2: import("o1js/dist/node/lib/provable/field.js").Field;
}, {
    id: bigint;
    hash1: bigint;
    hash2: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field.js").Field[]) => {
        id: import("o1js/dist/node/lib/provable/field.js").Field;
        hash1: import("o1js/dist/node/lib/provable/field.js").Field;
        hash2: import("o1js/dist/node/lib/provable/field.js").Field;
    };
} & {
    fromValue: (value: {
        id: string | number | bigint | import("o1js/dist/node/lib/provable/field.js").Field;
        hash1: string | number | bigint | import("o1js/dist/node/lib/provable/field.js").Field;
        hash2: string | number | bigint | import("o1js/dist/node/lib/provable/field.js").Field;
    }) => {
        id: import("o1js/dist/node/lib/provable/field.js").Field;
        hash1: import("o1js/dist/node/lib/provable/field.js").Field;
        hash2: import("o1js/dist/node/lib/provable/field.js").Field;
    };
    toInput: (x: {
        id: import("o1js/dist/node/lib/provable/field.js").Field;
        hash1: import("o1js/dist/node/lib/provable/field.js").Field;
        hash2: import("o1js/dist/node/lib/provable/field.js").Field;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field.js").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field.js").Field, number][] | undefined;
    };
    toJSON: (x: {
        id: import("o1js/dist/node/lib/provable/field.js").Field;
        hash1: import("o1js/dist/node/lib/provable/field.js").Field;
        hash2: import("o1js/dist/node/lib/provable/field.js").Field;
    }) => {
        id: string;
        hash1: string;
        hash2: string;
    };
    fromJSON: (x: {
        id: string;
        hash1: string;
        hash2: string;
    }) => {
        id: import("o1js/dist/node/lib/provable/field.js").Field;
        hash1: import("o1js/dist/node/lib/provable/field.js").Field;
        hash2: import("o1js/dist/node/lib/provable/field.js").Field;
    };
    empty: () => {
        id: import("o1js/dist/node/lib/provable/field.js").Field;
        hash1: import("o1js/dist/node/lib/provable/field.js").Field;
        hash2: import("o1js/dist/node/lib/provable/field.js").Field;
    };
};
export declare class ExternalRequestEvent extends ExternalRequestEvent_base {
}
declare const RequestPaidEvent_base: (new (value: {
    zkApp: PublicKey;
    requestsPaid: import("o1js/dist/node/lib/provable/field.js").Field;
    createdAt: UInt64;
}) => {
    zkApp: PublicKey;
    requestsPaid: import("o1js/dist/node/lib/provable/field.js").Field;
    createdAt: UInt64;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
    zkApp: PublicKey;
    requestsPaid: import("o1js/dist/node/lib/provable/field.js").Field;
    createdAt: UInt64;
}, {
    zkApp: {
        x: bigint;
        isOdd: boolean;
    };
    requestsPaid: bigint;
    createdAt: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field.js").Field[]) => {
        zkApp: PublicKey;
        requestsPaid: import("o1js/dist/node/lib/provable/field.js").Field;
        createdAt: UInt64;
    };
} & {
    fromValue: (value: {
        zkApp: PublicKey | {
            x: bigint | import("o1js/dist/node/lib/provable/field.js").Field;
            isOdd: boolean | import("o1js/dist/node/lib/provable/bool.js").Bool;
        };
        requestsPaid: string | number | bigint | import("o1js/dist/node/lib/provable/field.js").Field;
        createdAt: bigint | UInt64;
    }) => {
        zkApp: PublicKey;
        requestsPaid: import("o1js/dist/node/lib/provable/field.js").Field;
        createdAt: UInt64;
    };
    toInput: (x: {
        zkApp: PublicKey;
        requestsPaid: import("o1js/dist/node/lib/provable/field.js").Field;
        createdAt: UInt64;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field.js").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field.js").Field, number][] | undefined;
    };
    toJSON: (x: {
        zkApp: PublicKey;
        requestsPaid: import("o1js/dist/node/lib/provable/field.js").Field;
        createdAt: UInt64;
    }) => {
        zkApp: string;
        requestsPaid: string;
        createdAt: string;
    };
    fromJSON: (x: {
        zkApp: string;
        requestsPaid: string;
        createdAt: string;
    }) => {
        zkApp: PublicKey;
        requestsPaid: import("o1js/dist/node/lib/provable/field.js").Field;
        createdAt: UInt64;
    };
    empty: () => {
        zkApp: PublicKey;
        requestsPaid: import("o1js/dist/node/lib/provable/field.js").Field;
        createdAt: UInt64;
    };
};
declare class RequestPaidEvent extends RequestPaidEvent_base {
}
export declare let ZkonProof_: {
    new ({ proof, publicInput, publicOutput, maxProofsVerified, }: {
        proof: unknown;
        publicInput: import("o1js/dist/node/lib/provable/field.js").Field;
        publicOutput: void;
        maxProofsVerified: 0 | 1 | 2;
    }): {
        verify(): void;
        verifyIf(condition: import("o1js/dist/node/lib/provable/bool.js").Bool): void;
        publicInput: import("o1js/dist/node/lib/provable/field.js").Field;
        publicOutput: void;
        proof: unknown;
        maxProofsVerified: 0 | 1 | 2;
        shouldVerify: import("o1js/dist/node/lib/provable/bool.js").Bool;
        toJSON(): import("o1js").JsonProof;
    };
    publicInputType: typeof import("o1js/dist/node/lib/provable/field.js").Field & ((x: string | number | bigint | import("o1js/dist/node/lib/provable/field.js").Field | import("o1js/dist/node/lib/provable/core/fieldvar.js").FieldVar | import("o1js/dist/node/lib/provable/core/fieldvar.js").FieldConst) => import("o1js/dist/node/lib/provable/field.js").Field);
    publicOutputType: import("o1js/dist/node/lib/provable/types/struct.js").ProvablePureExtended<void, void, null>;
    tag: () => {
        name: string;
        publicInputType: typeof import("o1js/dist/node/lib/provable/field.js").Field & ((x: string | number | bigint | import("o1js/dist/node/lib/provable/field.js").Field | import("o1js/dist/node/lib/provable/core/fieldvar.js").FieldVar | import("o1js/dist/node/lib/provable/core/fieldvar.js").FieldConst) => import("o1js/dist/node/lib/provable/field.js").Field);
        publicOutputType: import("o1js/dist/node/lib/provable/types/struct.js").ProvablePureExtended<void, void, null>;
    };
    fromJSON<S extends (new (...args: any) => Proof<unknown, unknown>) & {
        prototype: Proof<any, any>;
        fromJSON: typeof Proof.fromJSON;
        dummy: typeof Proof.dummy;
        publicInputType: import("o1js").FlexibleProvablePure<any>;
        publicOutputType: import("o1js").FlexibleProvablePure<any>;
        tag: () => {
            name: string;
        };
    } & {
        prototype: Proof<unknown, unknown>;
    }>(this: S, { maxProofsVerified, proof: proofString, publicInput: publicInputJson, publicOutput: publicOutputJson, }: import("o1js").JsonProof): Promise<Proof<import("o1js").InferProvable<S["publicInputType"]>, import("o1js").InferProvable<S["publicOutputType"]>>>;
    dummy<Input, OutPut>(publicInput: Input, publicOutput: OutPut, maxProofsVerified: 0 | 1 | 2, domainLog2?: number | undefined): Promise<Proof<Input, OutPut>>;
};
export declare class ZkonProof extends ZkonProof_ {
}
export declare class ZkonRequestCoordinator extends SmartContract {
    oracle: State<PublicKey>;
    zkonToken: State<PublicKey>;
    owner: State<PublicKey>;
    feePrice: State<UInt64>;
    requestCount: State<UInt64>;
    deploy(props: CoordinatorDeployProps): Promise<void>;
    onlyOwner(): void;
    setFeePrice(feePrice: UInt64): Promise<void>;
    setOwner(owner: PublicKey): Promise<void>;
    setToken(zkonToken: PublicKey): Promise<void>;
    events: {
        requested: typeof RequestEvent;
        fullfilled: typeof import("o1js/dist/node/lib/provable/field.js").Field & ((x: string | number | bigint | import("o1js/dist/node/lib/provable/field.js").Field | import("o1js/dist/node/lib/provable/core/fieldvar.js").FieldVar | import("o1js/dist/node/lib/provable/core/fieldvar.js").FieldConst) => import("o1js/dist/node/lib/provable/field.js").Field);
        requestsPaid: typeof RequestPaidEvent;
    };
    sendRequest(requester: PublicKey, hash1: Field, hash2: Field): Promise<import("o1js/dist/node/lib/provable/field.js").Field>;
    prepayRequest(requestAmount: UInt64, beneficiary: PublicKey): Promise<void>;
    recordRequestFullfillment(requestId: Field, proof: ZkonProof): Promise<void>;
}
export {};
