# ZKON Mina Integration

## How to fetch off-chain provable data to your smart contract

Version v0.0.1-preview

### Devnet Addresses

**ZkonCoordinator**

B62qnmsn4Bm4MzPujKeN1faxedz4p1cCAwA9mKAWzDjfb4c1ysVvWeK

### Setup

First add the ZKON lib as a dependency in your zkapp project. 
package.json

```json
  "dependencies": {
    "zkon-zkapp": "git://github.com/ZKON-Network/zkapp.git#devnet"
  }
```

Import the deps in your zkapp

```tsx
import { ZkonZkProgram, ZkonRequestCoordinator, ExternalRequestEvent } from 'zkon-zkapp';
```

### Coding

Inside your zkapp call the sendRequest method of the coordinator, you will need to send your zkapp address and an ipfs hash (divided in two parts) with the json request. Will explain more later on the format. 

```tsx
  @method.returns(Field)
  async sendRequest(hashPart1: Field, hashPart2: Field) {
    const coordinator = new ZkonRequestCoordinator(coordinatorAddress);
    
    const requestId = await coordinator.sendRequest(this.address, hashPart1, hashPart2);

    const event = new ExternalRequestEvent({
      id: requestId,
      hash1: hashPart1,
      hash2: hashPart2,      
    });
    
    this.emitEvent('requested', event);

    return requestId;
  }
```

Note: It's important to emit the ExternalRequestEvent in your zkapp, if not the oracle will not respond to your requests. 

Then add a callback method for receiving the response, call it “receiveZkonResponse”:

```tsx
@method
  async receiveZkonResponse(requestId: Field, proof: ZkonProof) {
    const coordinator = new ZkonRequestCoordinator(coordinatorAddress);
    await coordinator.recordRequestFullfillment(requestId, proof);
    this.response.set(proof.publicInput.dataField); 
  }
```

Note: Don't forget to call “recordRequestFullfillment” to ensure that the proof is correct.

Note 2: Don't forget to export default your ZkApp. 

### IPFS Request

For requesting the offchain data you will need to create a json with the following format: 

```json
{
  "method": "GET",
  "baseURL": "api.kucoin.com/api/v1/market/stats?symbol=BTC-USDT",
  "path": "data,averagePrice",
  "zkapp": "your zkapp compiled in js"
}
```

Now you can upload the JSON to IPFS.

And here is a sample code on how to convert a IPFS hash to two Fields:

```tsx
import { StringCircuitValue } from 'zkon-zkapp';

function segmentHash(ipfsHashFile: string) {
    const ipfsHash0 = ipfsHashFile.slice(0,30) // first part of the ipfsHash
    const ipfsHash1 = ipfsHashFile.slice(30) // second part of the ipfsHash
      
    const field1 = new StringCircuitValue(ipfsHash0).toField();
    
    const field2 = new StringCircuitValue(ipfsHash1).toField();
  
    return {field1, field2}
}
```

### Prepay for the requests

Before doing any request you should prepay it with ZKON tokens. Call the "prepayRequest" method from the ZkonCoordinator, sending how many request you want to prepay and your zkapp public key as beneficiary (or any zkapp you may want to prepay request for).

```tsx
  @method 
  async prepayRequest(requestAmount: UInt64, beneficiary: PublicKey) {}
```