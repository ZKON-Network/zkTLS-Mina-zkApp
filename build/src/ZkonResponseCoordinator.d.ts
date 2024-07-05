import { Field, SmartContract, State, PublicKey, UInt64, Proof } from 'o1js';
declare const ApiResponseData_base: (new (value: {
    lastUpdatedAt: import("o1js/dist/node/lib/provable/field").Field;
    availableSupply: import("o1js/dist/node/lib/provable/field").Field;
    circulatingSupply: import("o1js/dist/node/lib/provable/field").Field;
    totalSupply: import("o1js/dist/node/lib/provable/field").Field;
}) => {
    lastUpdatedAt: import("o1js/dist/node/lib/provable/field").Field;
    availableSupply: import("o1js/dist/node/lib/provable/field").Field;
    circulatingSupply: import("o1js/dist/node/lib/provable/field").Field;
    totalSupply: import("o1js/dist/node/lib/provable/field").Field;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    lastUpdatedAt: import("o1js/dist/node/lib/provable/field").Field;
    availableSupply: import("o1js/dist/node/lib/provable/field").Field;
    circulatingSupply: import("o1js/dist/node/lib/provable/field").Field;
    totalSupply: import("o1js/dist/node/lib/provable/field").Field;
}, {
    lastUpdatedAt: bigint;
    availableSupply: bigint;
    circulatingSupply: bigint;
    totalSupply: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        lastUpdatedAt: import("o1js/dist/node/lib/provable/field").Field;
        availableSupply: import("o1js/dist/node/lib/provable/field").Field;
        circulatingSupply: import("o1js/dist/node/lib/provable/field").Field;
        totalSupply: import("o1js/dist/node/lib/provable/field").Field;
    };
} & {
    fromValue: (value: {
        lastUpdatedAt: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        availableSupply: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        circulatingSupply: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        totalSupply: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        lastUpdatedAt: import("o1js/dist/node/lib/provable/field").Field;
        availableSupply: import("o1js/dist/node/lib/provable/field").Field;
        circulatingSupply: import("o1js/dist/node/lib/provable/field").Field;
        totalSupply: import("o1js/dist/node/lib/provable/field").Field;
    };
    toInput: (x: {
        lastUpdatedAt: import("o1js/dist/node/lib/provable/field").Field;
        availableSupply: import("o1js/dist/node/lib/provable/field").Field;
        circulatingSupply: import("o1js/dist/node/lib/provable/field").Field;
        totalSupply: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        lastUpdatedAt: import("o1js/dist/node/lib/provable/field").Field;
        availableSupply: import("o1js/dist/node/lib/provable/field").Field;
        circulatingSupply: import("o1js/dist/node/lib/provable/field").Field;
        totalSupply: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        lastUpdatedAt: string;
        availableSupply: string;
        circulatingSupply: string;
        totalSupply: string;
    };
    fromJSON: (x: {
        lastUpdatedAt: string;
        availableSupply: string;
        circulatingSupply: string;
        totalSupply: string;
    }) => {
        lastUpdatedAt: import("o1js/dist/node/lib/provable/field").Field;
        availableSupply: import("o1js/dist/node/lib/provable/field").Field;
        circulatingSupply: import("o1js/dist/node/lib/provable/field").Field;
        totalSupply: import("o1js/dist/node/lib/provable/field").Field;
    };
    empty: () => {
        lastUpdatedAt: import("o1js/dist/node/lib/provable/field").Field;
        availableSupply: import("o1js/dist/node/lib/provable/field").Field;
        circulatingSupply: import("o1js/dist/node/lib/provable/field").Field;
        totalSupply: import("o1js/dist/node/lib/provable/field").Field;
    };
};
declare class ApiResponseData extends ApiResponseData_base {
}
declare const ApiResponse_base: (new (value: {
    data: ApiResponseData;
    timestamp: import("o1js/dist/node/lib/provable/field").Field;
}) => {
    data: ApiResponseData;
    timestamp: import("o1js/dist/node/lib/provable/field").Field;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    data: ApiResponseData;
    timestamp: import("o1js/dist/node/lib/provable/field").Field;
}, {
    data: {
        lastUpdatedAt: bigint;
        availableSupply: bigint;
        circulatingSupply: bigint;
        totalSupply: bigint;
    };
    timestamp: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        data: ApiResponseData;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    };
} & {
    fromValue: (value: {
        data: ApiResponseData | {
            lastUpdatedAt: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
            availableSupply: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
            circulatingSupply: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
            totalSupply: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        };
        timestamp: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        data: ApiResponseData;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    };
    toInput: (x: {
        data: ApiResponseData;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        data: ApiResponseData;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        data: {
            lastUpdatedAt: string;
            availableSupply: string;
            circulatingSupply: string;
            totalSupply: string;
        };
        timestamp: string;
    };
    fromJSON: (x: {
        data: {
            lastUpdatedAt: string;
            availableSupply: string;
            circulatingSupply: string;
            totalSupply: string;
        };
        timestamp: string;
    }) => {
        data: ApiResponseData;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    };
    empty: () => {
        data: ApiResponseData;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    };
};
declare class ApiResponse extends ApiResponse_base {
}
declare const ResponseEvent_base: (new (value: {
    id: import("o1js/dist/node/lib/provable/field").Field;
    ApiResponseClient: ApiResponse;
}) => {
    id: import("o1js/dist/node/lib/provable/field").Field;
    ApiResponseClient: ApiResponse;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    id: import("o1js/dist/node/lib/provable/field").Field;
    ApiResponseClient: ApiResponse;
}, {
    id: bigint;
    ApiResponseClient: {
        data: {
            lastUpdatedAt: bigint;
            availableSupply: bigint;
            circulatingSupply: bigint;
            totalSupply: bigint;
        };
        timestamp: bigint;
    };
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        id: import("o1js/dist/node/lib/provable/field").Field;
        ApiResponseClient: ApiResponse;
    };
} & {
    fromValue: (value: {
        id: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        ApiResponseClient: ApiResponse | {
            data: ApiResponseData | {
                lastUpdatedAt: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
                availableSupply: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
                circulatingSupply: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
                totalSupply: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
            };
            timestamp: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        };
    }) => {
        id: import("o1js/dist/node/lib/provable/field").Field;
        ApiResponseClient: ApiResponse;
    };
    toInput: (x: {
        id: import("o1js/dist/node/lib/provable/field").Field;
        ApiResponseClient: ApiResponse;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        id: import("o1js/dist/node/lib/provable/field").Field;
        ApiResponseClient: ApiResponse;
    }) => {
        id: string;
        ApiResponseClient: {
            data: {
                lastUpdatedAt: string;
                availableSupply: string;
                circulatingSupply: string;
                totalSupply: string;
            };
            timestamp: string;
        };
    };
    fromJSON: (x: {
        id: string;
        ApiResponseClient: {
            data: {
                lastUpdatedAt: string;
                availableSupply: string;
                circulatingSupply: string;
                totalSupply: string;
            };
            timestamp: string;
        };
    }) => {
        id: import("o1js/dist/node/lib/provable/field").Field;
        ApiResponseClient: ApiResponse;
    };
    empty: () => {
        id: import("o1js/dist/node/lib/provable/field").Field;
        ApiResponseClient: ApiResponse;
    };
};
declare class ResponseEvent extends ResponseEvent_base {
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
declare const Commitments_base: (new (value: {
    availableSupply: import("o1js/dist/node/lib/provable/field").Field;
    timestamp: import("o1js/dist/node/lib/provable/field").Field;
}) => {
    availableSupply: import("o1js/dist/node/lib/provable/field").Field;
    timestamp: import("o1js/dist/node/lib/provable/field").Field;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    availableSupply: import("o1js/dist/node/lib/provable/field").Field;
    timestamp: import("o1js/dist/node/lib/provable/field").Field;
}, {
    availableSupply: bigint;
    timestamp: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        availableSupply: import("o1js/dist/node/lib/provable/field").Field;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    };
} & {
    fromValue: (value: {
        availableSupply: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        timestamp: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        availableSupply: import("o1js/dist/node/lib/provable/field").Field;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    };
    toInput: (x: {
        availableSupply: import("o1js/dist/node/lib/provable/field").Field;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        availableSupply: import("o1js/dist/node/lib/provable/field").Field;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        availableSupply: string;
        timestamp: string;
    };
    fromJSON: (x: {
        availableSupply: string;
        timestamp: string;
    }) => {
        availableSupply: import("o1js/dist/node/lib/provable/field").Field;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    };
    empty: () => {
        availableSupply: import("o1js/dist/node/lib/provable/field").Field;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    };
};
declare class Commitments extends Commitments_base {
    constructor(value: {
        availableSupply: Field;
        timestamp: Field;
    });
}
export declare class ZkonRequestCoordinator extends SmartContract {
    oracle: State<PublicKey>;
    zkonToken: State<PublicKey>;
    treasury: State<PublicKey>;
    feePrice: State<UInt64>;
    responseCount: State<UInt64>;
    initState(treasury: PublicKey, zkTokenAddress: PublicKey, feePrice: UInt64, oracle: PublicKey): Promise<void>;
    setFeePrice(feePrice: UInt64): Promise<void>;
    setTreasury(treasury: PublicKey): Promise<void>;
    events: {
        requested: typeof ResponseEvent;
        fullfilled: typeof import("o1js/dist/node/lib/provable/field").Field & ((x: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field | import("o1js/dist/node/lib/provable/core/fieldvar").FieldVar | import("o1js/dist/node/lib/provable/core/fieldvar").FieldConst) => import("o1js/dist/node/lib/provable/field").Field);
        requestsPaid: typeof RequestPaidEvent;
    };
    sendRequest(requester: PublicKey, proof: Proof<Commitments, void>, apiData: ApiResponse): Promise<import("o1js/dist/node/lib/provable/field").Field>;
    fakeEvent(): Promise<void>;
}
export {};
