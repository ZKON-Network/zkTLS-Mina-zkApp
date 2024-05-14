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

  /**
   * Multiplication with overflow checking.
   */
  mul(y: UInt8 | number): UInt8 {
    let z = this.value.mul(argToField('UInt8.mul', y));
    z.rangeCheckHelper(UInt8.NUM_BITS).assertEquals(z);
    return new UInt8({value: z});
  }

  /**
   * Addition with overflow checking.
   */
  add(y: UInt8 | number): UInt8 {
    let z = this.value.add(argToField('UInt8.add', y));
    z.rangeCheckHelper(UInt8.NUM_BITS).assertEquals(z);
    return new UInt8({value: z});
  }

  /**
   * Subtraction with underflow checking.
   */
  sub(y: UInt8 | number): UInt8 {
    let z = this.value.sub(argToField('UInt8.sub', y));
    z.rangeCheckHelper(UInt8.NUM_BITS).assertEquals(z);
    return new UInt8({value: z});
  }

  lte(y: UInt8): Bool {
    let xMinusY = this.value.sub(argToField('UInt8.lte', y)).seal();
    let xMinusYFits = xMinusY.rangeCheckHelper(UInt8.NUM_BITS).equals(xMinusY);
    let yMinusXFits = xMinusY
      .rangeCheckHelper(UInt8.NUM_BITS)
      .equals(xMinusY.neg());
    xMinusYFits.or(yMinusXFits).assertEquals(true);
    // x <= y if y - x fits in 64 bits
    return yMinusXFits;
  }

  assertLte(y: UInt8) {
    let yMinusX = argToField('UInt8.lt', y).sub(this.value).seal();
    yMinusX.rangeCheckHelper(UInt8.NUM_BITS).assertEquals(yMinusX);
  }

  lt(y: UInt8): Bool {
    return this.lte(y).and(this.value.equals(y.value).not());
  }

  assertLt(y: UInt8) {
    this.lt(y).assertEquals(true);
  }

  gt(y: UInt8): Bool {
    return y.lt(this);
  }

  assertGt(y: UInt8) {
    y.assertLt(this);
  }
}