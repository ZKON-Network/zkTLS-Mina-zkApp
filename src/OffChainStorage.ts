import {
    Field,
    SmartContract,
    state,
    State,
    method,
    PublicKey,
    Signature,
    MerkleMapWitness,
  } from 'o1js';
  
  export class OffChainStorage extends SmartContract {

    @state(Field) mapRoot = State<Field>();
    
    @method
    init(initialRoot: Field) {
      this.mapRoot.set(initialRoot);
    }
    
    @method
    async update(
      keyWitness: MerkleMapWitness,
      keyToChange: Field,
      valueBefore: Field,
      incrementAmount: Field,
    ) {
      const initialRoot = this.mapRoot.get();
      this.mapRoot.requireEquals(initialRoot);
  
      incrementAmount.assertLt(Field(10));
  
      // check the initial state matches what we expect
      const [ rootBefore, key ] = keyWitness.computeRootAndKey(valueBefore);
      rootBefore.assertEquals(initialRoot);
  
      key.assertEquals(keyToChange);
  
      // compute the root after incrementing
      const [ rootAfter, _ ] = keyWitness.computeRootAndKey(valueBefore.add(incrementAmount));
  
      // set the new root
      this.treeRoot.set(rootAfter);
    }
  }