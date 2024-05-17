import { Bool, Struct, Field } from 'o1js';

function argToField(name: string, x: { value: Field } | number): Field {
  if (typeof x === 'number') {
    if (!Number.isInteger(x)) {
      throw new Error(`${name} expected integer argument. Got ${x}`);
    }
    return new Field(x);
  } else {
    return x.value;
  }
}

function numberToBits(n: number): Array<boolean> {
  const bits = [];
  for (let i = 7; i >= 0; i--) {
    bits.push(((n >> i) & 1) === 1);
  }
  return bits;
}

function bitsToNumber(bits: Bool[] | boolean[]): number {
  const xbits = bits.map(x => Number(Boolean(x)));
  const n = xbits.reduce((accumulator: number, currentValue: number) => accumulator << 1 | currentValue);
  return n;
}

export class UInt8 extends Struct({value: Field}) {

  static get zero(): UInt8 {
    return new UInt8({value: Field(0)});
  }

  toString(): string {
    return this.value.toString();
  }

  toNumber(): number {
    return Number(this.value.toString());
  }

  toChar(): string {
    return String.fromCharCode(Number(this.value.toString()));
  }

  toBits(): boolean[] {
    const n = this.toNumber();
    return numberToBits(n);
  }

  static MAXINT(): UInt8 {
    return new UInt8({value: Field.fromJSON(((1n << 8n) - 1n).toString()) as Field});
  }

  static fromNumber(x: number): UInt8 {
    return new UInt8({value: argToField('UInt8.fromNumber', x)});
  }

  static fromBits(bits: Bool[] | boolean[]): UInt8 {
    return this.fromNumber(bitsToNumber(bits));
  }

  static NUM_BITS = 8;
}