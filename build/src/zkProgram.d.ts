import { Provable } from 'o1js';
declare const P256Data_base: (new (value: {
    signature: string;
    messageHex: string;
}) => {
    signature: string;
    messageHex: string;
}) & {
    _isStruct: true;
} & Provable<{
    signature: string;
    messageHex: string;
}, {
    signature: string;
    messageHex: string;
}> & {
    fromValue: (value: {
        signature: string;
        messageHex: string;
    }) => {
        signature: string;
        messageHex: string;
    };
    toInput: (x: {
        signature: string;
        messageHex: string;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        signature: string;
        messageHex: string;
    }) => {
        signature: string;
        messageHex: string;
    };
    fromJSON: (x: {
        signature: string;
        messageHex: string;
    }) => {
        signature: string;
        messageHex: string;
    };
    empty: () => {
        signature: string;
        messageHex: string;
    };
};
export declare class P256Data extends P256Data_base {
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
    verify: (proof: import("o1js").Proof<import("o1js/dist/node/lib/provable/field").Field, void>) => Promise<boolean>;
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
    publicInputType: typeof import("o1js/dist/node/lib/provable/field").Field & ((x: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field | import("o1js/dist/node/lib/provable/core/fieldvar").FieldVar | import("o1js/dist/node/lib/provable/core/fieldvar").FieldConst) => import("o1js/dist/node/lib/provable/field").Field);
    publicOutputType: import("o1js/dist/node/lib/provable/types/struct").ProvablePureExtended<void, void, null>;
    privateInputTypes: {
        verifySource: [typeof import("o1js/dist/node/lib/provable/field").Field & ((x: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field | import("o1js/dist/node/lib/provable/core/fieldvar").FieldVar | import("o1js/dist/node/lib/provable/core/fieldvar").FieldConst) => import("o1js/dist/node/lib/provable/field").Field), typeof P256Data];
    };
    rawMethods: {
        verifySource: (publicInput: import("o1js/dist/node/lib/provable/field").Field, ...args: [import("o1js/dist/node/lib/provable/field").Field, P256Data] & any[]) => Promise<void>;
    };
} & {
    verifySource: (publicInput: import("o1js/dist/node/lib/provable/field").Field, ...args: [import("o1js/dist/node/lib/provable/field").Field, P256Data] & any[]) => Promise<import("o1js").Proof<import("o1js/dist/node/lib/provable/field").Field, void>>;
};
export { ZkonZkProgram };
