/* eslint-disable @typescript-eslint/no-unused-vars */


import { useEffect, useState } from 'react';
import { useGetNetworkConfig } from '@/hooks';
import {
    ProxyNetworkProvider,
    notproxy, // Ensure the class name is capitalized
  } from '@/utils';

export const useGetCollections = (minterInfo: string[]) => {
  const [collections, setCollections] = useState<{ name: string; address: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { network } = useGetNetworkConfig();
  const proxy = new ProxyNetworkProvider(network.apiAddress);


  useEffect(() => {
    const fetchCollections = async () => {
      const fetchedCollections: {name: string; address: string }[] = []; // Updated type

      const fetchPromises = minterInfo.map(async (address) => {
        const adresspass=address
        const contract = notproxy(address); // Initialize your smart contract instance with the address

        try {
          // Query for collection name
          const nameQuery = contract.createQuery({
            func: 'getCollectionName',
            args: [],
          });
          const nameResponse = await proxy.queryContract(nameQuery);
          const encodedName = nameResponse.returnData[0]; // Assuming the response is a base64 encoded string
          const decodedName = isValidBase64(encodedName) ? atob(encodedName) : ''; // Decode the base64 string to a regular string
          fetchedCollections.push({ name: decodedName, address: adresspass }); // Include address
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
  }, [minterInfo]); // Updated line to include minterInfo

  return { collections, loading };
};

// Helper function to check if a string is valid base64
const isValidBase64 = (str: string) => {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
};