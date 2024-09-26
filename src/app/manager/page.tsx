"use client"; // Add this directive at the top

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react';
import { AuthRedirectWrapper } from '@/wrappers';
import { ClientHooks } from '@/components/ClientHooks';
import ManageCollections from './manageCollections';
import { useGetCollections } from '@/hooks/useGetCollections'; 
import { useGetMinterInformation} from '@/hooks/useGetAddressInformation'; 
import {useGetNetworkConfig} from '@/hooks/sdkDappHooks';
import {useGetAccountInfo} from '@/hooks';


export default function Manager() {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const { network } = useGetNetworkConfig();
  const { address: connectedAddress } = useGetAccountInfo();
  const { account } = useGetAccountInfo();

  const minterInfo = useGetMinterInformation(connectedAddress);
  const { collections } = useGetCollections(Array.isArray(minterInfo) ? minterInfo : []);

  return (
    <>
      <ClientHooks />
      <AuthRedirectWrapper>
        {collections.map((collection) => (
          <button
            key={collection.address}
            onClick={() => setSelectedCollection(collection.address)}
          >
            {collection.name}
          </button>
        ))}
        {selectedCollection && (
          <ManageCollections collectionAddress={selectedCollection} />
        )}
      </AuthRedirectWrapper>
    </>
  );
}
