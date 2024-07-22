import { Mina,Field, ZkProgram, Bool, Struct, Provable} from 'o1js';
import { p256, secp256r1 } from '@noble/curves/p256';
import { hexToBytes, bytesToHex } from '@noble/hashes/utils';

class P256Data extends Struct({
  signature: [Field,Field,Field,Field],
  messageHex: [Field,Field,Field,Field,Field,Field,Field,Field,Field,Field,Field,Field]
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
        p256_data: P256Data,
      ){
          const assert = Bool(true);
          
          Provable.asProver(()=>{
            let concatSignature = ``;
            let concatMessage=``;
            let fixedMessage:string[] = [];
            let fixedSignature:string[]=[];

            p256_data.messageHex.forEach((part, index)=>{
              let data:string = part.toBigInt().toString(16);

              if(data.length !=32 && index != 11){
                let padding = ``
                for(let i=0;i<(32 - data.length);i++){
                    padding+='0'
                }
                data=padding+data;
              }

              if(index == 11 && data.length != 22){
                  data = '0'+data;
              }

              fixedMessage.push(data);
            })

            p256_data.signature.forEach((part, index)=>{
              let data:string = part.toBigInt().toString(16);

              if(data.length !=32){
                  let padding = ``
                  for(let i=0;i<(32 - data.length);i++){
                      padding+='0'
                  }
                  data=padding+data;
              }

              fixedSignature.push(data);
            })

            fixedMessage.forEach((data,index)=>{
              concatMessage+=data
            })

            fixedSignature.forEach(data=>{
              concatSignature += data;
            })

            console.log(concatSignature)

            const messageHex:string = concatMessage;
            const signature: string = concatSignature;
            const checkECDSASignature = checkECDSA(messageHex, signature);
            assert.assertEquals(checkECDSASignature);
          })
          
          decommitment.assertEquals(commitment.commitment);
      }
    }
  }
});

export {ZkonZkProgram, P256Data, PublicArgumets};