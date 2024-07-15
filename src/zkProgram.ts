import { Mina, PublicKey, UInt32,Field,  ZkProgram, Bytes, Hash, state, Bool, verify, Struct, Provable} from 'o1js';
import { p256, secp256r1 } from '@noble/curves/p256';
import { hexToBytes, bytesToHex } from '@noble/hashes/utils';

class P256Data extends Struct({
  signature: String,
  messageHex: String
}){}

class PublicArgumets extends Struct({
  commitment: Field,
  dataField:Field
}){}

const checkECDSA =(message:string, signature:string): Bool=>{
  const public_key_notary = hexToBytes('0206fdfa148e1916ccc96b40d0149df05825ef54b16b711ccc1b991a4de1c6a12c');
  const messageActual = hexToBytes(message);
  const signatureActual = p256.Signature.fromCompact(signature)
  const result = p256.verify(signatureActual, 
    messageActual, 
    public_key_notary, 
    {prehash:true})
  return new Bool(result);
}

const ZkonZkProgram = ZkProgram({
  name:'zkonProof',
  publicInput: PublicArgumets,

  methods:{
    verifySource:{
      privateInputs: [Field, P256Data], 
      async method (
        commitment: PublicArgumets,
        decommitment: Field,
        p256_data: P256Data
      ){
          //P256 Signature Verification
          const assert = Bool(true);
          Provable.asProver(()=>{
            const checkECDSASignature = checkECDSA(p256_data.messageHex, p256_data.signature);
            assert.assertEquals(checkECDSASignature);
          })
          
          // Check if the SH256 Hash commitment of the data-source is same 
          // as the response reconstructed from the MPC-Proof. 
          decommitment.assertEquals(commitment.commitment);
      }
    }
  }
});

export {ZkonZkProgram, P256Data, PublicArgumets};