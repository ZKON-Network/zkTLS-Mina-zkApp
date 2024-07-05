import { Struct, Field } from 'o1js';
function argToField(name, x) {
    if (typeof x === 'number') {
        if (!Number.isInteger(x)) {
            throw new Error(`${name} expected integer argument. Got ${x}`);
        }
        return new Field(x);
    }
    else {
        return x.value;
    }
}
function numberToBits(n) {
    const bits = [];
    for (let i = 7; i >= 0; i--) {
        bits.push(((n >> i) & 1) === 1);
    }
    return bits;
}
function bitsToNumber(bits) {
    const xbits = bits.map(x => Number(Boolean(x)));
    const n = xbits.reduce((accumulator, currentValue) => accumulator << 1 | currentValue);
    return n;
}
export class UInt8 extends Struct({ value: Field }) {
    static get zero() {
        return new UInt8({ value: Field(0) });
    }
    toString() {
        return this.value.toString();
    }
    toNumber() {
        return Number(this.value.toString());
    }
    toChar() {
        return String.fromCharCode(Number(this.value.toString()));
    }
    toBits() {
        const n = this.toNumber();
        return numberToBits(n);
    }
    static MAXINT() {
        return new UInt8({ value: Field.fromJSON(((1n << 8n) - 1n).toString()) });
    }
    static fromNumber(x) {
        return new UInt8({ value: argToField('UInt8.fromNumber', x) });
    }
    static fromBits(bits) {
        return this.fromNumber(bitsToNumber(bits));
    }
}
UInt8.NUM_BITS = 8;
//# sourceMappingURL=UInt8.js.map