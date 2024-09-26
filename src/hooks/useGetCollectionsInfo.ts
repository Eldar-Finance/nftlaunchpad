import { useEffect, useState } from 'react';
import { useGetNetworkConfig } from '@/hooks';
import {
  ContractFunction,
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

          
          // Decode the returnData
          const decodedData = response.returnData.map((data: string) => Buffer.from(data, 'base64').toString('hex'));

          // Log the raw decoded data
          console.log(`Raw decoded data for address ${address}:`, response.returnData);

          // Convert hex to decimal for numeric fields
          const hexToDecimal = (hex: string) => parseInt(hex, 16);
          const hexToString = (hex: string) => Buffer.from(hex, 'hex').toString('utf-8');


          // Construct the collection info object
          const collectionInfo: CollectionInfo = {
            address,
            creatorAddress: hexToString(decodedData[0]),
            collectionIdentifier: hexToString(decodedData[1]),
            collectionName: hexToString(decodedData[2]),
            singleNftName: hexToString(decodedData[3]),
            ticker: hexToString(decodedData[4]),
            description: hexToString(decodedData[5]),
            ipfsCid: hexToString(decodedData[6]),
            fileEnding: hexToString(decodedData[7]),
            tags: hexToString(decodedData[8]),
            royalties: hexToDecimal(decodedData[9]) ,
            maxSupply: hexToDecimal(decodedData[10]),
            maxAmountPerMint: hexToDecimal(decodedData[11]),
            totalNftsMinted: hexToDecimal(decodedData[12]),
            hasJsonMetadata: decodedData[13] === 'true',
            isMintingEnabled: decodedData[14] === 'true',
            isPaused: decodedData[15] === 'true',
            mintCosts: decodedData.slice(16).map((cost, index, array) => {
                if (index % 2 === 0) {
                    return {
                        tokenIdentifier: hexToString(cost),
                        amount: hexToDecimal(array[index + 1] || '0')
                    };
                }
                return undefined;
            }).filter((item): item is { tokenIdentifier: string; amount: number } => item !== undefined),
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