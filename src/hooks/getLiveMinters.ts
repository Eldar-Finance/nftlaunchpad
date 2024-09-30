"use client";

import { useEffect, useState } from 'react';
import { useGetNetworkConfig } from '@/hooks';
import { Address, ResultsParser, AbiRegistry, ContractFunction } from '@multiversx/sdk-core';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers';
import { SmartContract } from '@multiversx/sdk-core/out';
import proxyAbyJson from '@/contracts/nft_minter_proxy.abi.json';

export interface LiveMinter {
  address: string;
  collectionName: string;
  collectionDescription: string;
  ipfsCid: string;
  minted: number;
  maxSupply: number;
  tokenIdentifier: string;
  cost: number;
}

export const useGetLiveMinters = () => {
  const [liveMinters, setLiveMinters] = useState<LiveMinter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { network } = useGetNetworkConfig();
  const proxy = new ProxyNetworkProvider(network.apiAddress);

  useEffect(() => {
    const fetchLiveMinters = async () => {
      const fetchedLiveMinters: LiveMinter[] = [];

      const contract = new SmartContract({
        address: new Address('erd1qqqqqqqqqqqqqpgq0vct9qkqcnr0vgj8hsvdmufzxy9nevppu7zs8qzs0r'),
        abi: AbiRegistry.create(proxyAbyJson)
      });

      try {
        const query = contract.createQuery({
          func: new ContractFunction('getLiveMinters'),
          args: []
        });
        const response = await proxy.queryContract(query);

        // Decode returned data
        const decodedData = response.returnData.map((data: string) => Buffer.from(data, 'base64').toString('hex'));

        // Convert hex to decimal for numeric fields
        const hexToDecimal = (hex: string) => parseInt(hex, 16);
        const hexToString = (hex: string) => Buffer.from(hex, 'hex').toString('utf-8');        

        // Construct LiveMinters from 8-tuples
        const minters = decodedData
          .filter((_, index) => index % 8 === 0)
          .map((_, index) => decodedData.slice(index * 8, (index + 1) * 8));
        
        minters.forEach((minter) => {
          fetchedLiveMinters.push({
            address: Address.fromHex(minter[0]).bech32(),
            collectionName: hexToString(minter[1]),
            collectionDescription: hexToString(minter[2]),
            ipfsCid: hexToString(minter[3]),
            minted: hexToDecimal(minter[4]),
            maxSupply: hexToDecimal(minter[5]),
            tokenIdentifier: hexToString(minter[6]),
            cost: hexToDecimal(minter[7])
          });
        });

        setLiveMinters(fetchedLiveMinters);
        setIsLoading(false);
      } catch (error: unknown) {
        console.error('Error fetching live minters:', error);
        setIsLoading(false);
        return;
      }
    };

    fetchLiveMinters();
  }, [network.apiAddress]); // Add dependency array with network.apiAddress

  return { liveMinters, isLoading };
};
