/* eslint-disable @typescript-eslint/no-unused-vars */


"use client"; // Add this line at the top

import { useEffect, useState } from 'react';
import { useGetNetworkConfig } from '@/hooks';
import {
  Address,
  AddressValue,
  ContractFunction,
  ResultsParser,
  ProxyNetworkProvider,
  smartContract, // Ensure the class name is capitalized
} from '@/utils';
import { throttle } from 'lodash';
import { bech32 } from 'bech32';


const resultsParser = new ResultsParser();

export const useGetMinterInformation = (connectedAddress: string) => {
  const { network } = useGetNetworkConfig();
  
  const [minterInfo, setMinterInfo] = useState<unknown>(null); // Change 'any' to 'unknown'
  const proxy = new ProxyNetworkProvider(network.apiAddress);
  const minterSc = smartContract; // Cast to IAddress
  
  const getMinterInformation = async () => {
    try {
      const query = minterSc.createQuery({
        func: new ContractFunction('getAddressMinters'), // Change to getAddressMinters
        args: [new AddressValue(new Address(connectedAddress))]
      });

      const queryResponse = await proxy.queryContract(query);
      const bech32Addresses: string[] = []; // Array to hold Bech32 data

      queryResponse.returnData.forEach(async (base64String) => {
        const byteArray = Uint8Array.from(atob(base64String), c => c.charCodeAt(0)); // Decode Base64 to byte array
        const hexData = Array.from(byteArray) // Convert to array
          .map(byte => byte.toString(16).padStart(2, '0')) // Convert each byte to hex
          .join(''); // Join the hex values into a single string
        
        //console.log('Hex Data:', hexData);
        try {
          const byteArray1 = Uint8Array.from(hexData.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
          const words = bech32.toWords(byteArray1);
          const bech32Data = bech32.encode('erd', words); // Replace 'prefix' with your desired prefix
          bech32Addresses.push(bech32Data); // Store Bech32 data in the array
        } catch (error) {
        }
      });

      const endpointDefinition = minterSc.getEndpoint('getAddressMinters'); // Update endpoint definition

      const { firstValue: minterInfoData } = resultsParser.parseQueryResponse(
        queryResponse,
        endpointDefinition
      );

    
    
    } catch (err) {
      console.error('Unable to call getAddressMinters', err); // Update error message
    }
  };

  const throttledGetMinterInformation = throttle(getMinterInformation, 2000); // 2 seconds throttle

  useEffect(() => {
    if (!minterInfo) { // Check if minterInfo is null
      throttledGetMinterInformation();
    }
  }, [minterInfo, throttledGetMinterInformation]); // Use minterInfo and throttledGetMinterInformation as dependencies


  return minterInfo ? minterInfo : []; // Return an empty array if minterInfo is null
};
