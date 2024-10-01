"use client";

import { AuthRedirectWrapper } from '@/wrappers';
import { ClientHooks } from '@/components/ClientHooks';
import { CreateMinter } from './create';

export default function Manager() {


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