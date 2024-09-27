"use client";

import { useState } from 'react';
import { AuthRedirectWrapper } from '@/wrappers';
import { ClientHooks } from '@/components/ClientHooks';
import ManageCollections from './manageCollections';
import { useGetCollections } from '@/hooks/useGetCollections'; 
import { useGetMinterInformation } from '@/hooks/useGetAddressInformation'; 
import { useGetNetworkConfig } from '@/hooks/sdkDappHooks';
import { useGetAccountInfo } from '@/hooks';
import { Grid, ChevronRight } from 'lucide-react';

export default function Manager() {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const { address: connectedAddress } = useGetAccountInfo();

  const minterInfo = useGetMinterInformation(connectedAddress);
  const { collections } = useGetCollections(Array.isArray(minterInfo) ? minterInfo : []);

  return (
    <>
      <ClientHooks />
      <AuthRedirectWrapper>
        <div className="p-6 bg-transparent min-h-screen">
        <div className="text-center text-gray-400 mt-8">
              <Grid className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-6">Choose Collections to manage</h1>
            </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center ">
            {collections.map((collection) => (
              <button
                key={collection.address}
                onClick={() => setSelectedCollection(collection.address)}
                className={`
                  flex items-center justify-between
                  p-4 rounded-lg transition-all duration-200 ease-in-out
                  ${selectedCollection === collection.address
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center">
                  <Grid className="w-6 h-6 mr-3" />
                  <span className="font-medium">{collection.name}</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
            ))}
          </div>
          {collections.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              <Grid className="w-16 h-16 mx-auto mb-4" />
              <p>No collections found. Create a new collection to get started.</p>
            </div>
          )}
          {selectedCollection && (
            <div className="mt-8">
              <ManageCollections collectionAddress={selectedCollection} />
            </div>
          )}
        </div>
      </AuthRedirectWrapper>
    </>
  );
}