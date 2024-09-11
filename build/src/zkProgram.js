import { Field, ZkProgram, Struct } from 'o1js';
import { proveableECDSAreturnR } from './proveableECDSA.js';
class ECDSAHelper extends Struct({
    messageHash: BigInt,
    r: BigInt,
    s: BigInt
}) {
}
class PublicArgumets extends Struct({
    commitment: Field,
    dataField: Field
}) {
}
const checkECDSA = async (e, s, r) => {
    const publicKey = {
        x: BigInt(59584560953242332934734563514771605484743832818030684748574986816321863477095n),
        y: BigInt(35772424464574968427090264313855970786042086272413829287792016132157953251778n)
    };
    const result = await proveableECDSAreturnR(e, s, r, publicKey.x, publicKey.y);
    return result;
};
const ZkonZkProgram = ZkProgram({
    name: 'zkon-proof',
    publicInput: PublicArgumets,
    methods: {
        verifySource: {
            privateInputs: [Field, ECDSAHelper],
            async method(commitment, decommitment, ECDSASign) {
                const checkECDSASignature = await checkECDSA(ECDSASign.messageHash, ECDSASign.s, ECDSASign.r);
                const Recovery_xAffine = Field(checkECDSASignature);
                Recovery_xAffine.assertEquals(Field(ECDSASign.r), "Proof Failed: Recovery Point x-affine not same as Signature-R, Invalid ECDSA Signature.");
                decommitment.assertEquals(commitment.commitment);
            }
        }
    }
});
export { ZkonZkProgram, PublicArgumets, ECDSAHelper };
export default ZkonZkProgram;
//# sourceMappingURL=zkProgram.js.map