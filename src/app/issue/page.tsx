"use client";

import { AuthRedirectWrapper } from '@/wrappers';
import { ClientHooks } from '@/components/ClientHooks';
import { CreateMinter } from './create';
import { useGetAccountInfo } from '@/hooks';

export default function Manager() {
  const { address: connectedAddress } = useGetAccountInfo();


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