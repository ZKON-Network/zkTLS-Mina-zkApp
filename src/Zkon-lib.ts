import { PublicKey, Struct, UInt64, Bytes, Field } from 'o1js';
import { StringCircuitValue } from './utils/String';

//Request
// {
//   "callbackAddress": "callBackAdddress",
//   "callbackFunctionId": "callBackFcnSignature",
//   "baseUrl": "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD",
//   "path": "RAW,ETH,USD,VOLUME24HOUR"
// }


/**
 * @notice Segment IPFS Hash in to parts of type Field 
 * @param ipfsHash The ipfs hash pointing to the request 
 * @return The 2 parts of the hash
 */
export function segmentHash(
  ipfsHash: string  
) : {field1: Field;field2: Field} {
  const ipfsHash0 = ipfsHash.slice(0,30) // first part of the ipfsHash
  const ipfsHash1 = ipfsHash.slice(30) // second part of the ipfsHash
    
  const field1 = new StringCircuitValue(ipfsHash0).toField();
  
  const field2 = new StringCircuitValue(ipfsHash1).toField();

  return {field1, field2}
}