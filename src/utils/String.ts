// @ts-nocheck

import { Bool, CircuitValue, Field, Poseidon, Struct, UInt8 } from "o1js";

const MAX_CHARS = 2 ** 5; // Field size: 2 ** 8, UInt8 size: 2 ** 3, Max UInt8s supported: 2 ** (8 - 3)

export class StringCircuitValue extends Struct {
  value: UInt8[];

  constructor(value: string) {
    super();
    if (value.length > MAX_CHARS) {
      throw new Error("string cannot exceed character limit");
    }
    const intArray = value.split('').map(x => UInt8.from(x.charCodeAt(0)))
    this.value = intArray;
  }

  repr(): number[] {
    return this.value.map(x => x.toNumber())
  }

  toString(): string {
    return this.value.map((x) => String.fromCharCode(Number(x.toString()))).join('')
  }

  toBits(): boolean[] {
    const bits = []
    this.value.forEach((uint) => {
      uint.toBits().forEach(bit => bits.push(bit));
    });
    return bits
  }

  toField(): Field {
    const values = this.value.map(x => x.value);
    let field = Field.zero;

    for (let i = 0, b = Field.one; i < Math.min(values.length, 31); i++, b = b.mul(256)) {
      field = field.add(values[i].mul(b));
    }
    return field;
  }

  static fromField(field: Field): StringCircuitValue {
    const values: UInt8[] = [];

    const fieldConstant = field.toConstant()

    fieldConstant.value[1].forEach((v) => {
      values.push(UInt8.fromNumber(v))
    });

    const stringVal = new StringCircuitValue('');
    stringVal.value = values;
    return stringVal;
  }

  static fromBits(bits: Bool[] | boolean[]): StringCircuitValue {
    if (typeof (bits[0]) != 'boolean') {
      bits = bits.map(x => x.toBoolean())
    }
    const intArray = []
    for (let i = 0; i < bits.length; i += 8) {
      const bitSubArray = bits.slice(i, i + 8);
      const uint = UInt8.fromBits(bitSubArray);
      intArray.push(uint);
    }
    const stringVal = new StringCircuitValue('');
    stringVal.value = intArray;
    return stringVal;
  }

  hash() {
    return Poseidon.hash(this.value.map(x => Field(x.toString())));
  }
}