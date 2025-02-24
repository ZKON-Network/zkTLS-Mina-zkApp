import dotenv from 'dotenv';
dotenv.config();
import {    
    Mina,
    fetchAccount,
    PublicKey,
  } from 'o1js';
import fs from 'fs-extra';
    
  // Network configuration
  const network = Mina.Network({
    mina: process.env.NODE,
    lightnetAccountManager: 'http://localhost:8181',
    archive: process.env.NODE_ARCHIVE,
});
  Mina.setActiveInstance(network);

  let localData;

  // Fee payer setup
  localData = fs.readJsonSync('./data/addresses.json');
  const coordinatorAddress = localData.coordinatorAddress;
  const oracleAddress = localData.oracleAddress;

  // zkApps deployment
  console.log(`Reading stat from coordinator in ${coordinatorAddress}`);
  console.log('Fetching zkAppAccount...');
  const accountInfo = await fetchAccount({publicKey: coordinatorAddress, network});
  
  if (accountInfo.account.zkapp) {
    const zkAppState = accountInfo.account.zkapp;
    const field1 =  zkAppState.appState[0];
    const field2 =  zkAppState.appState[1];
    console.log('Oracle address in coordinator state:', PublicKey.fromFields([field1,field2]).toBase58() );
  } else {
    console.log('No zkApp found for the given public key.');
  }