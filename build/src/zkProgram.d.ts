declare const ECDSAHelper_base: (new (value: {
    messageHash: bigint;
    r: bigint;
    s: bigint;
}) => {
    messageHash: bigint;
    r: bigint;
    s: bigint;
}) & {
    _isStruct: true;
} & import("o1js").Provable<{
    messageHash: bigint;
    r: bigint;
    s: bigint;
}, {
    messageHash: bigint;
    r: bigint;
    s: bigint;
}> & {
    fromValue: (value: {
        messageHash: bigint;
        r: bigint;
        s: bigint;
    }) => {
        messageHash: bigint;
        r: bigint;
        s: bigint;
    };
    toInput: (x: {
        messageHash: bigint;
        r: bigint;
        s: bigint;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field.js").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field.js").Field, number][] | undefined;
    };
    toJSON: (x: {
        messageHash: bigint;
        r: bigint;
        s: bigint;
    }) => {
        messageHash: string;
        r: string;
        s: string;
    };
    fromJSON: (x: {
        messageHash: string;
        r: string;
        s: string;
    }) => {
        messageHash: bigint;
        r: bigint;
        s: bigint;
    };
    empty: () => {
        messageHash: bigint;
        r: bigint;
        s: bigint;
    };
};
declare class ECDSAHelper extends ECDSAHelper_base {
}
declare const PublicArgumets_base: (new (value: {
    commitment: import("o1js/dist/node/lib/provable/field.js").Field;
    dataField: import("o1js/dist/node/lib/provable/field.js").Field;
}) => {
    commitment: import("o1js/dist/node/lib/provable/field.js").Field;
    dataField: import("o1js/dist/node/lib/provable/field.js").Field;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
    commitment: import("o1js/dist/node/lib/provable/field.js").Field;
    dataField: import("o1js/dist/node/lib/provable/field.js").Field;
}, {
    commitment: bigint;
    dataField: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field.js").Field[]) => {
        commitment: import("o1js/dist/node/lib/provable/field.js").Field;
        dataField: import("o1js/dist/node/lib/provable/field.js").Field;
    };
} & {
    fromValue: (value: {
        commitment: string | number | bigint | import("o1js/dist/node/lib/provable/field.js").Field;
        dataField: string | number | bigint | import("o1js/dist/node/lib/provable/field.js").Field;
    }) => {
        commitment: import("o1js/dist/node/lib/provable/field.js").Field;
        dataField: import("o1js/dist/node/lib/provable/field.js").Field;
    };
    toInput: (x: {
        commitment: import("o1js/dist/node/lib/provable/field.js").Field;
        dataField: import("o1js/dist/node/lib/provable/field.js").Field;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field.js").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field.js").Field, number][] | undefined;
    };
    toJSON: (x: {
        commitment: import("o1js/dist/node/lib/provable/field.js").Field;
        dataField: import("o1js/dist/node/lib/provable/field.js").Field;
    }) => {
        commitment: string;
        dataField: string;
    };
    fromJSON: (x: {
        commitment: string;
        dataField: string;
    }) => {
        commitment: import("o1js/dist/node/lib/provable/field.js").Field;
        dataField: import("o1js/dist/node/lib/provable/field.js").Field;
    };
    empty: () => {
        commitment: import("o1js/dist/node/lib/provable/field.js").Field;
        dataField: import("o1js/dist/node/lib/provable/field.js").Field;
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
            hash: import("o1js/dist/node/lib/provable/field.js").Field;
        };
    }>;
    verify: (proof: import("o1js").Proof<PublicArgumets, void>) => Promise<boolean>;
    digest: () => Promise<string>;
    analyzeMethods: () => Promise<{
        verifySource: {
            rows: number;
            digest: string;
            gates: import("o1js/dist/node/snarky.js").Gate[];
            publicInputSize: number;
            print(): void;
            summary(): Partial<Record<import("o1js/dist/node/snarky.js").GateType | "Total rows", number>>;
        };
    }>;
    publicInputType: typeof PublicArgumets;
    publicOutputType: import("o1js/dist/node/lib/provable/types/struct.js").ProvablePureExtended<void, void, null>;
    privateInputTypes: {
        verifySource: [typeof import("o1js/dist/node/lib/provable/field.js").Field & ((x: string | number | bigint | import("o1js/dist/node/lib/provable/field.js").Field | import("o1js/dist/node/lib/provable/core/fieldvar.js").FieldVar | import("o1js/dist/node/lib/provable/core/fieldvar.js").FieldConst) => import("o1js/dist/node/lib/provable/field.js").Field), typeof ECDSAHelper];
    };
    rawMethods: {
        verifySource: (publicInput: PublicArgumets, ...args: [import("o1js/dist/node/lib/provable/field.js").Field, ECDSAHelper] & any[]) => Promise<void>;
    };
} & {
    verifySource: (publicInput: PublicArgumets, ...args: [import("o1js/dist/node/lib/provable/field.js").Field, ECDSAHelper] & any[]) => Promise<import("o1js").Proof<PublicArgumets, void>>;
};
export { ZkonZkProgram, PublicArgumets, ECDSAHelper };
