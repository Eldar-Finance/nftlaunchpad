import json from '@/contracts/nft_minter.abi.json';
import { AbiRegistry, Address, SmartContract } from './sdkDappCore';

const abi = AbiRegistry.create(json);

// Change notproxy to a function that accepts an address
export const notproxy = (address: string) => new SmartContract({
  address: new Address(address), // Use the provided address
  abi
});
