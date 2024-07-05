import { Bool } from 'o1js';
declare const UInt8_base: (new (value: {
    value: import("o1js/dist/node/lib/provable/field").Field;
}) => {
    value: import("o1js/dist/node/lib/provable/field").Field;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    value: import("o1js/dist/node/lib/provable/field").Field;
}, {
    value: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        value: import("o1js/dist/node/lib/provable/field").Field;
    };
} & {
    fromValue: (value: {
        value: string | number | bigint | import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        value: import("o1js/dist/node/lib/provable/field").Field;
    };
    toInput: (x: {
        value: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        value: import("o1js/dist/node/lib/provable/field").Field;
    }) => {
        value: string;
    };
    fromJSON: (x: {
        value: string;
    }) => {
        value: import("o1js/dist/node/lib/provable/field").Field;
    };
    empty: () => {
        value: import("o1js/dist/node/lib/provable/field").Field;
    };
};
export declare class UInt8 extends UInt8_base {
    static get zero(): UInt8;
    toString(): string;
    toNumber(): number;
    toChar(): string;
    toBits(): boolean[];
    static MAXINT(): UInt8;
    static fromNumber(x: number): UInt8;
    static fromBits(bits: Bool[] | boolean[]): UInt8;
    static NUM_BITS: number;
}
export {};
