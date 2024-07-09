import { Field, ZkProgram, Bool, Struct, Provable } from 'o1js';
import { p256 } from '@noble/curves/p256';
import { hexToBytes } from '@noble/hashes/utils';
export class P256Data extends Struct({
    signature: String,
    messageHex: String
}) {
}
const checkECDSA = (message, signature) => {
    const public_key_notary = hexToBytes('0206fdfa148e1916ccc96b40d0149df05825ef54b16b711ccc1b991a4de1c6a12c');
    const messageActual = hexToBytes(message);
    const signatureActual = p256.Signature.fromCompact(signature);
    const result = p256.verify(signatureActual, messageActual, public_key_notary, { prehash: true });
    return new Bool(result);
};
const ZkonZkProgram = ZkProgram({
    name: 'egrains-proof',
    publicInput: Field,
    methods: {
        verifySource: {
            privateInputs: [Field, P256Data],
            async method(commitment, decommitment, p256_data) {
                //P256 Signature Verification
                const assert = Bool(true);
                Provable.asProver(() => {
                    const checkECDSASignature = checkECDSA(p256_data.messageHex, p256_data.signature);
                    assert.assertEquals(checkECDSASignature);
                });
                // Check if the SH256 Hash commitment of the data-source is same 
                // as the response reconstructed from the notary-proof file.
                decommitment.assertEquals(commitment);
            }
        }
    }
});
export { ZkonZkProgram };
//# sourceMappingURL=zkProgram.js.map