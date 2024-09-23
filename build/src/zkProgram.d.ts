declare const ECDSAHelper_base: (new (value: {
    messageHash: import("o1js").AlmostForeignField;
    signature: import("o1js").EcdsaSignature;
    publicKey: import("o1js").ForeignCurve;
}) => {
    messageHash: import("o1js").AlmostForeignField;
    signature: import("o1js").EcdsaSignature;
    publicKey: import("o1js").ForeignCurve;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    messageHash: import("o1js").AlmostForeignField;
    signature: import("o1js").EcdsaSignature;
    publicKey: import("o1js").ForeignCurve;
}, {
    messageHash: bigint;
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
        messageHash: import("o1js").AlmostForeignField;
        signature: import("o1js").EcdsaSignature;
        publicKey: import("o1js").ForeignCurve;
    };
} & {
    fromValue: (value: {
        messageHash: bigint | import("o1js").AlmostForeignField;
        signature: import("o1js").EcdsaSignature | {
            r: bigint;
            s: bigint;
        };
        publicKey: import("o1js").ForeignCurve | {
            x: bigint;
            y: bigint;
        };
    }) => {
        messageHash: import("o1js").AlmostForeignField;
        signature: import("o1js").EcdsaSignature;
        publicKey: import("o1js").ForeignCurve;
    };
    toInput: (x: {
        messageHash: import("o1js").AlmostForeignField;
        signature: import("o1js").EcdsaSignature;
        publicKey: import("o1js").ForeignCurve;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        messageHash: import("o1js").AlmostForeignField;
        signature: import("o1js").EcdsaSignature;
        publicKey: import("o1js").ForeignCurve;
    }) => {
        messageHash: string;
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
        messageHash: string;
        signature: {
            r: string;
            s: string;
        };
        publicKey: {
            x: string;
            y: string;
        };
    }) => {
        messageHash: import("o1js").AlmostForeignField;
        signature: import("o1js").EcdsaSignature;
        publicKey: import("o1js").ForeignCurve;
    };
    empty: () => {
        messageHash: import("o1js").AlmostForeignField;
        signature: import("o1js").EcdsaSignature;
        publicKey: import("o1js").ForeignCurve;
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
        proofsEnabled?: boolean | undefined;
    } | undefined) => Promise<{
        verificationKey: {
            data: string;
            hash: import("o1js/dist/node/lib/provable/field").Field;
        };
    }>;
    verify: (proof: import("o1js").Proof<PublicArgumets, import("o1js/dist/node/lib/provable/bool").Bool>) => Promise<boolean>;
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
    publicOutputType: typeof import("o1js/dist/node/lib/provable/bool").Bool & ((x: boolean | import("o1js/dist/node/lib/provable/core/fieldvar").FieldVar | import("o1js/dist/node/lib/provable/bool").Bool) => import("o1js/dist/node/lib/provable/bool").Bool);
    privateInputTypes: {
        verifySource: [typeof import("o1js/dist/node/lib/provable/field").Field & ((x: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field | import("o1js/dist/node/lib/provable/core/fieldvar").FieldVar | import("o1js/dist/node/lib/provable/core/fieldvar").FieldConst) => import("o1js/dist/node/lib/provable/field").Field), typeof ECDSAHelper];
    };
    rawMethods: {
        verifySource: (publicInput: PublicArgumets, ...args: [import("o1js/dist/node/lib/provable/field").Field, ECDSAHelper] & any[]) => Promise<import("o1js/dist/node/lib/provable/bool").Bool>;
    };
    proofsEnabled: boolean;
    setProofsEnabled(proofsEnabled: boolean): void;
} & {
    verifySource: (publicInput: PublicArgumets, ...args: [import("o1js/dist/node/lib/provable/field").Field, ECDSAHelper] & any[]) => Promise<import("o1js").Proof<PublicArgumets, import("o1js/dist/node/lib/provable/bool").Bool>>;
};
export { ZkonZkProgram, PublicArgumets, ECDSAHelper };
