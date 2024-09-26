/* eslint-disable @typescript-eslint/no-unused-vars */

import { AuthRedirectWrapper } from '@/wrappers';
import { ClientHooks } from '@/components/ClientHooks';
import ManageCollections from './manageCollections';


export default function Manager() {
  return (
    <>
      <ClientHooks />
      <AuthRedirectWrapper>
        <ManageCollections />
      </AuthRedirectWrapper>
    </>
  );
}
