import { Field, SmartContract, State, PublicKey, UInt64, Proof, DeployArgs } from 'o1js';
import { Commitments } from './zkProgram';
export interface CoordinatorDeployProps extends Exclude<DeployArgs, undefined> {
    oracle: PublicKey;
    zkonToken: PublicKey;
    treasury: PublicKey;
    feePrice: UInt64;
}
declare const RequestEvent_base: (new (value: {
    id: import("o1js/dist/node/lib/provable/field").Field;
    hash1: import("o1js/dist/node/lib/provable/field").Field;
    hash2: import("o1js/dist/node/lib/provable/field").Field;
    senderX: import("o1js/dist/node/lib/provable/field").Field;
    senderY: import("o1js/dist/node/lib/provable/field").Field;
}) => {
    id: import("o1js/dist/node/lib/provable/field").Field;
    hash1: import("o1js/dist/node/lib/provable/field").Field;
    hash2: import("o1js/dist/node/lib/provable/field").Field;
    senderX: import("o1js/dist/node/lib/provable/field").Field;
    senderY: import("o1js/dist/node/lib/provable/field").Field;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    id: import("o1js/dist/node/lib/provable/field").Field;
    hash1: import("o1js/dist/node/lib/provable/field").Field;
    hash2: import("o1js/dist/node/lib/provable/field").Field;
    senderX: import("o1js/dist/node/lib/provable/field").Field;
    senderY: import("o1js/dist/node/lib/provable/field").Field;
}, {
    id: bigint;
    hash1: bigint;
    hash2: bigint;
    senderX: bigint;
    senderY: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        id: import("o1js/dist/node/lib/provable/field").Field;
        hash1: import("o1js/dist/node/lib/provable/field").Field;
        hash2: import("o1js/dist/node/lib/provable/field").Field;
        senderX: import("o1js/dist/node/lib/provable/field").Field;
        senderY: import("o1js/dist/node/lib/provable/field").Field;
    };
} & {
    fromValue: (value: {
        id: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        hash1: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        hash2: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        senderX: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        senderY: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        id: import("o1js/dist/node/lib/provable/field").Field;
        hash1: import("o1js/dist/node/lib/provable/field").Field;
        hash2: import("o1js/dist/node/lib/provable/field").Field;
        senderX: import("o1js/dist/node/lib/provable/field").Field;
        senderY: import("o1js/dist/node/lib/provable/field").Field;
    };
    toInput: (x: {
        id: import("o1js/dist/node/lib/provable/field").Field;
        hash1: import("o1js/dist/node/lib/provable/field").Field;
        hash2: import("o1js/dist/node/lib/provable/field").Field;
        senderX: import("o1js/dist/node/lib/provable/field").Field;
        senderY: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        id: import("o1js/dist/node/lib/provable/field").Field;
        hash1: import("o1js/dist/node/lib/provable/field").Field;
        hash2: import("o1js/dist/node/lib/provable/field").Field;
        senderX: import("o1js/dist/node/lib/provable/field").Field;
        senderY: import("o1js/dist/node/lib/provable/field").Field;
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
        id: import("o1js/dist/node/lib/provable/field").Field;
        hash1: import("o1js/dist/node/lib/provable/field").Field;
        hash2: import("o1js/dist/node/lib/provable/field").Field;
        senderX: import("o1js/dist/node/lib/provable/field").Field;
        senderY: import("o1js/dist/node/lib/provable/field").Field;
    };
    empty: () => {
        id: import("o1js/dist/node/lib/provable/field").Field;
        hash1: import("o1js/dist/node/lib/provable/field").Field;
        hash2: import("o1js/dist/node/lib/provable/field").Field;
        senderX: import("o1js/dist/node/lib/provable/field").Field;
        senderY: import("o1js/dist/node/lib/provable/field").Field;
    };
};
declare class RequestEvent extends RequestEvent_base {
}
declare const ExternalRequestEvent_base: (new (value: {
    id: import("o1js/dist/node/lib/provable/field").Field;
    hash1: import("o1js/dist/node/lib/provable/field").Field;
    hash2: import("o1js/dist/node/lib/provable/field").Field;
}) => {
    id: import("o1js/dist/node/lib/provable/field").Field;
    hash1: import("o1js/dist/node/lib/provable/field").Field;
    hash2: import("o1js/dist/node/lib/provable/field").Field;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    id: import("o1js/dist/node/lib/provable/field").Field;
    hash1: import("o1js/dist/node/lib/provable/field").Field;
    hash2: import("o1js/dist/node/lib/provable/field").Field;
}, {
    id: bigint;
    hash1: bigint;
    hash2: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        id: import("o1js/dist/node/lib/provable/field").Field;
        hash1: import("o1js/dist/node/lib/provable/field").Field;
        hash2: import("o1js/dist/node/lib/provable/field").Field;
    };
} & {
    fromValue: (value: {
        id: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        hash1: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        hash2: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        id: import("o1js/dist/node/lib/provable/field").Field;
        hash1: import("o1js/dist/node/lib/provable/field").Field;
        hash2: import("o1js/dist/node/lib/provable/field").Field;
    };
    toInput: (x: {
        id: import("o1js/dist/node/lib/provable/field").Field;
        hash1: import("o1js/dist/node/lib/provable/field").Field;
        hash2: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        id: import("o1js/dist/node/lib/provable/field").Field;
        hash1: import("o1js/dist/node/lib/provable/field").Field;
        hash2: import("o1js/dist/node/lib/provable/field").Field;
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
        id: import("o1js/dist/node/lib/provable/field").Field;
        hash1: import("o1js/dist/node/lib/provable/field").Field;
        hash2: import("o1js/dist/node/lib/provable/field").Field;
    };
    empty: () => {
        id: import("o1js/dist/node/lib/provable/field").Field;
        hash1: import("o1js/dist/node/lib/provable/field").Field;
        hash2: import("o1js/dist/node/lib/provable/field").Field;
    };
};
export declare class ExternalRequestEvent extends ExternalRequestEvent_base {
}
declare const RequestPaidEvent_base: (new (value: {
    zkApp: PublicKey;
    requestsPaid: import("o1js/dist/node/lib/provable/field").Field;
    createdAt: UInt64;
}) => {
    zkApp: PublicKey;
    requestsPaid: import("o1js/dist/node/lib/provable/field").Field;
    createdAt: UInt64;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    zkApp: PublicKey;
    requestsPaid: import("o1js/dist/node/lib/provable/field").Field;
    createdAt: UInt64;
}, {
    zkApp: {
        x: bigint;
        isOdd: boolean;
    };
    requestsPaid: bigint;
    createdAt: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        zkApp: PublicKey;
        requestsPaid: import("o1js/dist/node/lib/provable/field").Field;
        createdAt: UInt64;
    };
} & {
    fromValue: (value: {
        zkApp: PublicKey | {
            x: bigint | import("o1js/dist/node/lib/provable/field").Field;
            isOdd: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
        };
        requestsPaid: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        createdAt: bigint | UInt64;
    }) => {
        zkApp: PublicKey;
        requestsPaid: import("o1js/dist/node/lib/provable/field").Field;
        createdAt: UInt64;
    };
    toInput: (x: {
        zkApp: PublicKey;
        requestsPaid: import("o1js/dist/node/lib/provable/field").Field;
        createdAt: UInt64;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        zkApp: PublicKey;
        requestsPaid: import("o1js/dist/node/lib/provable/field").Field;
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
        requestsPaid: import("o1js/dist/node/lib/provable/field").Field;
        createdAt: UInt64;
    };
    empty: () => {
        zkApp: PublicKey;
        requestsPaid: import("o1js/dist/node/lib/provable/field").Field;
        createdAt: UInt64;
    };
};
declare class RequestPaidEvent extends RequestPaidEvent_base {
}
export declare class ZkonRequestCoordinator extends SmartContract {
    oracle: State<PublicKey>;
    zkonToken: State<PublicKey>;
    treasury: State<PublicKey>;
    feePrice: State<UInt64>;
    requestCount: State<UInt64>;
    deploy(props: CoordinatorDeployProps): Promise<void>;
    setFeePrice(feePrice: UInt64): Promise<void>;
    setTreasury(treasury: PublicKey): Promise<void>;
    events: {
        requested: typeof RequestEvent;
        fullfilled: typeof import("o1js/dist/node/lib/provable/field").Field & ((x: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field | import("o1js/dist/node/lib/provable/core/fieldvar").FieldVar | import("o1js/dist/node/lib/provable/core/fieldvar").FieldConst) => import("o1js/dist/node/lib/provable/field").Field);
        requestsPaid: typeof RequestPaidEvent;
    };
    sendRequest(requester: PublicKey, hash1: Field, hash2: Field): Promise<import("o1js/dist/node/lib/provable/field").Field>;
    prepayRequest(requestAmount: UInt64, beneficiary: PublicKey): Promise<void>;
    recordRequestFullfillment(requestId: Field, proof: Proof<Commitments, void>): Promise<void>;
}
export {};
