import { Field, ZkProgram, Struct } from 'o1js';
import { proveableECDSAreturnR } from './proveableECDSA.js';
class ECDSAHelper extends Struct({
    messageHash: BigInt,
    r: BigInt,
    s: BigInt,
    publicKeyX: BigInt,
    publicKeyY: BigInt
}) {
}
class PublicArgumets extends Struct({
    commitment: Field,
    dataField: Field
}) {
}
const ZkonZkProgram = ZkProgram({
    name: 'zkon-proof',
    publicInput: PublicArgumets,
    methods: {
        verifySource: {
            privateInputs: [Field, ECDSAHelper],
            async method(commitment, decommitment, ECDSASign) {
                const checkECDSASignature = await proveableECDSAreturnR(ECDSASign.messageHash, ECDSASign.s, ECDSASign.r, ECDSASign.publicKeyX, ECDSASign.publicKeyY);
                const Recovery_xAffine = Field(checkECDSASignature);
                Recovery_xAffine.assertEquals(Field(ECDSASign.r), "Proof Failed: Recovery Point x-affine not same as Signature-R, Invalid ECDSA Signature.");
                decommitment.assertEquals(commitment.commitment);
            }
        }
    }
});
export { ZkonZkProgram, PublicArgumets, ECDSAHelper };
//# sourceMappingURL=zkProgram.js.map