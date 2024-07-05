import { Mina, PublicKey, UInt32,Field,  ZkProgram, Bytes, Hash, state, Bool, verify, Struct, Provable} from 'o1js';
import { p256, secp256r1 } from '@noble/curves/p256';
import { hexToBytes, bytesToHex } from '@noble/hashes/utils';

//Warning: Use zkProgram to only verify the prrof, not generate. 

class Commitments extends Struct({
    availableSupply: Field,
    timestamp: Field
  }){
    constructor(value:{
      availableSupply: Field,
      timestamp: Field}){
      super(value)
    }
}

// Load defaults to compile the zkProgram. ToDo: Move these to enviorment file.
const sig = p256.Signature.fromCompact('5DC98BBDADE4AF02EEC7879FB9E5DCB5390CFB86836389456EA58029A0978B1EDD01DD675DCCB7A0C45861A7F2C7C21AA71934C7A425AB93DE5CE6A7A7FA3CE4');
const value = '8af6b1b64bc2c65ff949d399771644d1b6028960ac2c984d3dfedf71c3d1a74045c542e41a9ec2adb453f22e98daf6401a82da38d48a09f802469e68cb7eab4e0001000000000000c00300000000000008c483660000000000410490549464638efbb830fc02fc54033ffe74f47989e97624632fa1229ded322bc174c1071ee60c9c4083ba91844f5bdc342c6d40a56cb808a1296c8a22eb6d46a3ead56387d4a223ccf594f7610ac214adcad5d71e22c39d8be63b4c4b3098240c'
const msgByteArray = hexToBytes(value)

const ZkonZkProgram = ZkProgram({
    name:'egrains-proof',
    publicInput: Commitments,

    methods:{
      verifySource:{
        privateInputs: [Commitments,Field,Field], 
        async method (
          commitment: Commitments,
          decommitment: Commitments,
          C: Field,
          D: Field
        ){
            //P256 Signature Verification
            const assert = Bool(true);
            const public_key_notary = hexToBytes('0206fdfa148e1916ccc96b40d0149df05825ef54b16b711ccc1b991a4de1c6a12c');
            assert.assertEquals(p256.verify(sig, 
            msgByteArray, 
            public_key_notary, 
            {prehash:true}));
          
            // Individual Commitment Verification
            D.assertEquals(C);
    
            // Committmenet verification of availableSupply & timestamp
            commitment.availableSupply.assertEquals(decommitment.availableSupply);
            commitment.timestamp.assertEquals(decommitment.timestamp);
        }
      }
    }
});

export {ZkonZkProgram};