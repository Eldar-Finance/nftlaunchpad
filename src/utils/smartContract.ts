import { contractAddress } from '@/config';
import json from '@/contracts/nft_minter_proxy.abi.json';
import { AbiRegistry, Address, SmartContract } from './sdkDappCore';

const abi = AbiRegistry.create(json);

export const smartContract = () => new SmartContract({
  address: new Address(contractAddress),
  abi
});
