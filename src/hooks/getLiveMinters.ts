"use client";

import { useEffect, useState } from 'react';
import { useGetNetworkConfig } from '@/hooks';
import { Address, ResultsParser, AbiRegistry } from '@multiversx/sdk-core';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers';
import { SmartContract } from '@multiversx/sdk-core/out';

const resultsParser = new ResultsParser();

export interface LiveMinter {
  address: string;
  collectionName: string;
  collectionDescription: string;
  ipfsCid: string;
  minted: number;
  maxSupply: number;
  tokenIdentifier: string;
  cost: string;
}

export const useGetLiveMinters = () => {
  const { network } = useGetNetworkConfig();
  
  const [liveMinters, setLiveMinters] = useState<LiveMinter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getLiveMinters = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const proxy = new ProxyNetworkProvider(network.apiAddress);
      
      // Load ABI
      const abi = await AbiRegistry.create({
        name: 'NftMinterProxy',
        endpoints: require('src/app/contracts/nft_minter_proxy.abi.json')
      });
      const smartContractAbi = abi;
      
      // Create smart contract instance
      const contract = new SmartContract({
        address: new Address('erd1qqqqqqqqqqqqqpgq0vct9qkqcnr0vgj8hsvdmufzxy9nevppu7zs8qzs0r'),
        abi: smartContractAbi
      });

      // Query contract
      const interaction = contract.methods.getLiveMinters();
      const query = interaction.buildQuery();
      const queryResponse = await proxy.queryContract(query);
      
      // Decode response
      const endpointDefinition = interaction.getEndpoint();
      const { values } = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);

      // Parse results
      const parsedLiveMinters: LiveMinter[] = values.map((minter: any) => ({
        address: minter.address.bech32(),
        collectionName: minter.name.toString(),
        collectionDescription: minter.description.toString(),
        ipfsCid: minter.ipfsCid.toString(),
        minted: minter.minted.toNumber(),
        maxSupply: minter.maxSupply.toNumber(),
        tokenIdentifier: minter.tokenIdentifier.toString(),
        cost: minter.cost.toString()
      }));

      console.log("Parsed Live Minters:", parsedLiveMinters);
      setLiveMinters(parsedLiveMinters);
    } catch (error) {
      console.error("Error fetching live minters:", error);
      setError("Failed to fetch live minters");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLiveMinters();
  }, []);

  return { liveMinters, isLoading, error };
};
