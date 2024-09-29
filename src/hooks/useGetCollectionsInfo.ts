import { useEffect, useState } from 'react';
import { useGetNetworkConfig } from '@/hooks';
import {
  ContractFunction,
  Address
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
  phaseName: string;
  phaseId: number;
  userMaxMints: number;
  userMinted: number;
  maxMints: number;
  minted: number;
  isPhaseWlOnly: boolean;
  canUserTryToMint: boolean;
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

          // Convert hex to decimal for numeric fields
          const hexToDecimal = (hex: string) => parseInt(hex, 16);
          const hexToString = (hex: string) => Buffer.from(hex, 'hex').toString('utf-8');
          // console.log(`Enabled ?`, decodedData[14]);
          // Construct the collection info object
            const collectionInfo: CollectionInfo = {
            address,
            creatorAddress: Address.fromHex(decodedData[0]).bech32(),
            collectionIdentifier: hexToString(decodedData[1]),
            collectionName: hexToString(decodedData[2]),
            singleNftName: hexToString(decodedData[3]),
            ticker: hexToString(decodedData[4]),
            description: hexToString(decodedData[5]),
            ipfsCid: hexToString(decodedData[6]),
            fileEnding: hexToString(decodedData[7]),
            tags: hexToString(decodedData[8]),
            phaseName: hexToString(decodedData[9]),
            royalties: hexToDecimal(decodedData[10]),
            totalNftsMinted: hexToDecimal(decodedData[11]),
            maxSupply: hexToDecimal(decodedData[12]),
            maxAmountPerMint: hexToDecimal(decodedData[13]),
            phaseId: hexToDecimal(decodedData[14]),
            userMaxMints: hexToDecimal(decodedData[15]),
            userMinted: hexToDecimal(decodedData[16]),
            maxMints: hexToDecimal(decodedData[17]),
            minted: hexToDecimal(decodedData[18]),
            hasJsonMetadata: decodedData[19] === '01',
            isMintingEnabled: decodedData[20] === '01',
            isPaused: decodedData[21] === '01',
            isPhaseWlOnly: decodedData[22] === '01',
            canUserTryToMint: decodedData[23] === '01',
            mintCosts: decodedData // decodedData from 24 to end comes in 2-tuples of tokenIdentifier and amount
              .slice(24)
              .filter((_, index) => index % 2 === 0)
              .map((tokenIdentifier, index) => ({
                tokenIdentifier: hexToString(tokenIdentifier),
                amount: hexToDecimal(decodedData[24 + index * 2 + 1])
              })
            )
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