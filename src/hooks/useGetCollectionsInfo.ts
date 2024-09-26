import { useEffect, useState } from 'react';
import { useGetNetworkConfig } from '@/hooks';
import {
  SmartContract,
  Address,
  ContractFunction,
  ResultsParser
} from '@multiversx/sdk-core';
import {
    ProxyNetworkProvider,
    notproxy, // Ensure the class name is capitalized
  } from '@/utils';

interface CollectionInfo {
  address: string;
  creatorAddress: string;
  collectionIdentifier: string;
  collectionName: string;
  singleNftName: string;
  ticker: string;
  description: string;
  ipfsCid: string;
  fileEnding: string;
  tags: string;
  royalties: number;
  maxSupply: number;
  maxAmountPerMint: number;
  totalNftsMinted: number;
  hasJsonMetadata: boolean;
  isMintingEnabled: boolean;
  isPaused: boolean;
  mintCosts: { tokenIdentifier: string; amount: number }[];
}

export const useGetCollectionsInfo = (collectionAddresses: string[]) => {
  const [collectionsInfo, setCollectionsInfo] = useState<CollectionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { network } = useGetNetworkConfig();
  const proxy = new ProxyNetworkProvider(network.apiAddress);

  useEffect(() => {
    const fetchCollectionsInfo = async () => {
      const fetchedCollectionsInfo: CollectionInfo[] = [];

      const fetchPromises = collectionAddresses.map(async (address) => {
        const contract = notproxy(address);

        try {
          const query = contract.createQuery({
            func: new ContractFunction('getMinterInfo'),
            args: []
          });
          const response = await proxy.queryContract(query);

          // Log the raw returned data
          console.log(`Raw returned data for address ${address}:`, response.returnData);

          // Helper function to decode base64 strings
          const decodeBase64 = (data: string) => Buffer.from(data, 'base64').toString('utf-8');

          // Helper function to convert hex to decimal
          const hexToDecimal = (hex: string) => parseInt(hex, 16);

          // Construct the collection info object
          const collectionInfo: CollectionInfo = {
            address,
            creatorAddress: new Address(decodeBase64(response.returnData[0])).bech32(),
            collectionIdentifier: decodeBase64(response.returnData[1]),
            collectionName: decodeBase64(response.returnData[2]),
            singleNftName: decodeBase64(response.returnData[3]),
            ticker: decodeBase64(response.returnData[4]),
            description: decodeBase64(response.returnData[5]),
            ipfsCid: decodeBase64(response.returnData[6]),
            fileEnding: decodeBase64(response.returnData[7]),
            tags: decodeBase64(response.returnData[8]),
            royalties: hexToDecimal(response.returnData[9]) / 100, // Assuming royalties are in percentage with 2 decimal places
            maxSupply: hexToDecimal(response.returnData[10]),
            maxAmountPerMint: hexToDecimal(response.returnData[11]),
            totalNftsMinted: hexToDecimal(response.returnData[12]),
            hasJsonMetadata: decodeBase64(response.returnData[13]) === 'true',
            isMintingEnabled: decodeBase64(response.returnData[14]) === 'true',
            isPaused: decodeBase64(response.returnData[15]) === 'true',
            mintCosts: response.returnData.slice(16).map((cost) => {
              const [tokenIdentifier, amount] = decodeBase64(cost).split(',');
              return {
                tokenIdentifier,
                amount: Number(hexToDecimal(amount))
              };
            })
          };

          fetchedCollectionsInfo.push(collectionInfo);
        } catch (error: unknown) {
          console.error(`Error fetching collection info for address ${address}:`, (error as Error).message);
        }
      });

      await Promise.all(fetchPromises);
      setCollectionsInfo(fetchedCollectionsInfo);
      setLoading(false);
    };

    if (collectionAddresses && collectionAddresses.length > 0) {
      fetchCollectionsInfo();
    } else {
      setLoading(false);
    }
  // Provide an empty dependency array to run the effect only once
  }, []);
  return { collectionsInfo, loading };
};