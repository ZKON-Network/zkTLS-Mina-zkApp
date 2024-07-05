import { Field } from 'o1js';
declare const Commitments_base: (new (value: {
    response: import("o1js/dist/node/lib/provable/field").Field;
    timestamp: import("o1js/dist/node/lib/provable/field").Field;
}) => {
    response: import("o1js/dist/node/lib/provable/field").Field;
    timestamp: import("o1js/dist/node/lib/provable/field").Field;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    response: import("o1js/dist/node/lib/provable/field").Field;
    timestamp: import("o1js/dist/node/lib/provable/field").Field;
}, {
    response: bigint;
    timestamp: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        response: import("o1js/dist/node/lib/provable/field").Field;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    };
} & {
    fromValue: (value: {
        response: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
        timestamp: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        response: import("o1js/dist/node/lib/provable/field").Field;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    };
    toInput: (x: {
        response: import("o1js/dist/node/lib/provable/field").Field;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        response: import("o1js/dist/node/lib/provable/field").Field;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        response: string;
        timestamp: string;
    };
    fromJSON: (x: {
        response: string;
        timestamp: string;
    }) => {
        response: import("o1js/dist/node/lib/provable/field").Field;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    };
    empty: () => {
        response: import("o1js/dist/node/lib/provable/field").Field;
        timestamp: import("o1js/dist/node/lib/provable/field").Field;
    };
};
declare class Commitments extends Commitments_base {
    constructor(value: {
        response: Field;
        timestamp: Field;
    });
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
    verify: (proof: import("o1js").Proof<Commitments, void>) => Promise<boolean>;
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
    publicInputType: typeof Commitments;
    publicOutputType: import("o1js/dist/node/lib/provable/types/struct").ProvablePureExtended<void, void, null>;
    privateInputTypes: {
        verifySource: [typeof Commitments, typeof import("o1js/dist/node/lib/provable/field").Field & ((x: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field | import("o1js/dist/node/lib/provable/core/fieldvar").FieldVar | import("o1js/dist/node/lib/provable/core/fieldvar").FieldConst) => import("o1js/dist/node/lib/provable/field").Field), typeof import("o1js/dist/node/lib/provable/field").Field & ((x: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field | import("o1js/dist/node/lib/provable/core/fieldvar").FieldVar | import("o1js/dist/node/lib/provable/core/fieldvar").FieldConst) => import("o1js/dist/node/lib/provable/field").Field)];
    };
    rawMethods: {
        verifySource: (publicInput: Commitments, ...args: [Commitments, import("o1js/dist/node/lib/provable/field").Field, import("o1js/dist/node/lib/provable/field").Field] & any[]) => Promise<void>;
    };
} & {
    verifySource: (publicInput: Commitments, ...args: [Commitments, import("o1js/dist/node/lib/provable/field").Field, import("o1js/dist/node/lib/provable/field").Field] & any[]) => Promise<import("o1js").Proof<Commitments, void>>;
};
export { ZkonZkProgram, Commitments };
