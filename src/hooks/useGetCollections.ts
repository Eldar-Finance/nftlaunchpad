import { useEffect, useState } from 'react';
import { useGetNetworkConfig } from '@/hooks';
import {
    Address,
    AddressValue,
    ContractFunction,
    ResultsParser,
    ProxyNetworkProvider,
    notproxy, // Ensure the class name is capitalized
  } from '@/utils';

export const useGetCollections = (minterInfo: string[]) => {
  const [collections, setCollections] = useState<{ identifier: string; name: string; address: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { network } = useGetNetworkConfig();
  const proxy = new ProxyNetworkProvider(network.apiAddress);


  useEffect(() => {
    const fetchCollections = async () => {
      const fetchedCollections: { identifier: string; name: string; address: string }[] = []; // Updated type

      const fetchPromises = minterInfo.map(async (address) => {
        const adresspass=address
        const contract = notproxy(address); // Initialize your smart contract instance with the address

        try {
          // Query for collection identifier
          const identifierQuery = contract.createQuery({
            func: 'getCollectionIdentifier',
            args: [],
          });
          const identifierResponse = await proxy.queryContract(identifierQuery);
          const encodedidentifier = identifierResponse.returnData[0];
          const decodedIdentifier = atob(encodedidentifier)
          //console.log('Identifier', identifierResponse.returnData) // Adjust based on your response structure
          //console.log('Identifier:', identifier);
          //console.log('Identifier Response:', identifierResponse);
          //console.log('Identifier:', identifier);

          // Query for collection name
          const nameQuery = contract.createQuery({
            func: 'getName',
            args: [],
          });
          const nameResponse = await proxy.queryContract(nameQuery);
          const encodedName = nameResponse.returnData[0]; // Assuming the response is a base64 encoded string
          const decodedName = atob(encodedName); // Decode the base64 string to a regular string
          fetchedCollections.push({ identifier: decodedIdentifier, name: decodedName, address:adresspass }); // Include address
        } catch (error: unknown) {
          console.error(`Error fetching collection for address ${address}:`, (error as Error).message);
        }
      });

      await Promise.all(fetchPromises); // Wait for all fetches to complete
      setCollections(fetchedCollections);
      setLoading(false);
    };

    if (minterInfo && minterInfo.length > 0) { // Added check for minterInfo
      fetchCollections();
    }
  }, [minterInfo]);

  return { collections, loading };
};