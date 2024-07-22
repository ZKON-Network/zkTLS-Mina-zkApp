declare const P256Data_base: (new (value: {
    signature: import("o1js/dist/node/lib/provable/field").Field[];
    messageHex: import("o1js/dist/node/lib/provable/field").Field[];
}) => {
    signature: import("o1js/dist/node/lib/provable/field").Field[];
    messageHex: import("o1js/dist/node/lib/provable/field").Field[];
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    signature: import("o1js/dist/node/lib/provable/field").Field[];
    messageHex: import("o1js/dist/node/lib/provable/field").Field[];
}, {
    signature: bigint[];
    messageHex: bigint[];
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        signature: import("o1js/dist/node/lib/provable/field").Field[];
        messageHex: import("o1js/dist/node/lib/provable/field").Field[];
    };
} & {
    fromValue: (value: {
        signature: (string | number | bigint | import("o1js/dist/node/lib/provable/field").Field)[];
        messageHex: (string | number | bigint | import("o1js/dist/node/lib/provable/field").Field)[];
    }) => {
        signature: import("o1js/dist/node/lib/provable/field").Field[];
        messageHex: import("o1js/dist/node/lib/provable/field").Field[];
    };
    toInput: (x: {
        signature: import("o1js/dist/node/lib/provable/field").Field[];
        messageHex: import("o1js/dist/node/lib/provable/field").Field[];
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        signature: import("o1js/dist/node/lib/provable/field").Field[];
        messageHex: import("o1js/dist/node/lib/provable/field").Field[];
    }) => {
        signature: string[];
        messageHex: string[];
    };
    fromJSON: (x: {
        signature: string[];
        messageHex: string[];
    }) => {
        signature: import("o1js/dist/node/lib/provable/field").Field[];
        messageHex: import("o1js/dist/node/lib/provable/field").Field[];
    };
    empty: () => {
        signature: import("o1js/dist/node/lib/provable/field").Field[];
        messageHex: import("o1js/dist/node/lib/provable/field").Field[];
    };
};
declare class P256Data extends P256Data_base {
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
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
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
    compile: (options?: {
        cache?: import("o1js").Cache | undefined;
        forceRecompile?: boolean | undefined;
    } | undefined) => Promise<{
        verificationKey: {
            data: string;
            hash: import("o1js/dist/node/lib/provable/field").Field;
        };
    }>;
    verify: (proof: import("o1js").Proof<PublicArgumets, void>) => Promise<boolean>;
    digest: () => Promise<string>;
    analyzeMethods: () => Promise<{
        verifySource: {
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
        verifySource: [typeof import("o1js/dist/node/lib/provable/field").Field & ((x: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field | import("o1js/dist/node/lib/provable/core/fieldvar").FieldVar | import("o1js/dist/node/lib/provable/core/fieldvar").FieldConst) => import("o1js/dist/node/lib/provable/field").Field), typeof P256Data];
    };
    rawMethods: {
        verifySource: (publicInput: PublicArgumets, ...args: [import("o1js/dist/node/lib/provable/field").Field, P256Data] & any[]) => Promise<void>;
    };
} & {
    verifySource: (publicInput: PublicArgumets, ...args: [import("o1js/dist/node/lib/provable/field").Field, P256Data] & any[]) => Promise<import("o1js").Proof<PublicArgumets, void>>;
};
export { ZkonZkProgram, P256Data, PublicArgumets };
