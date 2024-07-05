import { Bool, Field } from 'o1js';
import { UInt8 } from './UInt8.js';
declare const StringCircuitValue_base: (new (value: {
    value: UInt8[];
}) => {
    value: UInt8[];
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
    value: UInt8[];
}, {
    value: {
        value: bigint;
    }[];
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field.js").Field[]) => {
        value: UInt8[];
    };
} & {
    fromValue: (value: {
        value: (UInt8 | {
            value: string | number | bigint | import("o1js/dist/node/lib/provable/field.js").Field;
        })[];
    }) => {
        value: UInt8[];
    };
    toInput: (x: {
        value: UInt8[];
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field.js").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field.js").Field, number][] | undefined;
    };
    toJSON: (x: {
        value: UInt8[];
    }) => {
        value: {
            value: string;
        }[];
    };
    fromJSON: (x: {
        value: {
            value: string;
        }[];
    }) => {
        value: UInt8[];
    };
    empty: () => {
        value: UInt8[];
    };
};
export declare class StringCircuitValue extends StringCircuitValue_base {
    constructor(data: string);
    repr(): number[];
    toString(): string;
    toBits(): boolean[];
    toField(): Field;
    static fromField(field: Field): StringCircuitValue;
    static fromBits(bits: Bool[]): StringCircuitValue;
    hash(): import("o1js/dist/node/lib/provable/field.js").Field;
}
export {};
