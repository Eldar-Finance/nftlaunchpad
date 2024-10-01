"use client";

import { useState } from 'react';
import { AuthRedirectWrapper } from '@/wrappers';
import { ClientHooks } from '@/components/ClientHooks';
import { CreateMinter } from './create';
import { useGetCollections } from '@/hooks/useGetCollections'; 
import { useGetMinterInformation } from '@/hooks/useGetAddressInformation'; 
import { useGetAccountInfo } from '@/hooks';

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

        <CreateMinter onBack={() => {}} />


        </div>
      </AuthRedirectWrapper>
    </>
  );
}