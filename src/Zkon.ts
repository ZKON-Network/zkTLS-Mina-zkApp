import { SmartContract, PublicKey, Struct, UInt64, Bytes } from 'o1js';

export class Request extends Struct({
   id: UInt64,
   callbackAddress: PublicKey,
   callbackFunctionId: Bytes.from
}) {}

export class Zkon extends SmartContract { 
  
  events = {
    requested: UInt64,
    fullfilled: UInt64
  };
  
  init() {
    super.init();
  }

  /**
   * @notice Initializes a request
   * @dev Sets the ID, callback address, and callback function signature on the request
   * @param self The uninitialized request
   * @param jobId The Job Specification ID
   * @param callbackAddr The callback address
   * @param callbackFunc The callback function signature
   * @return The initialized request
   */

  initialize(jobId: UInt64, callbackAddr: PublicKey, callbackFunc: Bytes) {
    let request = new Request({
      id: jobId,
      callbackAddress : callbackAddr,
      callbackFunctionId : callbackFunc
    })
    
  }
}