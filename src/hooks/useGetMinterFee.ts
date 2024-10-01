"use client";

import { useEffect, useState } from 'react';
import { useGetNetworkConfig } from '@/hooks';
import {
  Address,
  ContractFunction,
  ProxyNetworkProvider,
  SmartContract,
} from '@/utils';
import { throttle } from 'lodash';


export const useGetCollectionCreationFee = () => {
  const { network } = useGetNetworkConfig();
  
  const [collectionCreationFee, setCollectionCreationFee] = useState<string | null>(null);
  const proxy = new ProxyNetworkProvider(network.apiAddress);
  const minterSc = new SmartContract({ address: new Address('erd1qqqqqqqqqqqqqpgq0vct9qkqcnr0vgj8hsvdmufzxy9nevppu7zs8qzs0r') });

  const getCollectionCreationFee = async () => {
    try {
      const query = minterSc.createQuery({
        func: new ContractFunction('getCollectionCreationFee'),
        args: []
      });
      const queryResponse = await proxy.queryContract(query);
      
      const encodedValue = queryResponse.returnData[0];
      const decodedValue = Buffer.from(encodedValue, 'base64');
      const feeValue = BigInt(`0x${decodedValue.toString('hex')}`).toString();
      
      setCollectionCreationFee(feeValue);
    } catch (err) {
      console.error('Unable to call getCollectionCreationFee', err);
    }
  };

  const throttledGetCollectionCreationFee = throttle(getCollectionCreationFee, 2000);

  useEffect(() => {
    if (collectionCreationFee === null) {
      throttledGetCollectionCreationFee();
    }
  }, [collectionCreationFee, throttledGetCollectionCreationFee]);

  return collectionCreationFee;
};