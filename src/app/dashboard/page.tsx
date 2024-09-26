
import { AuthRedirectWrapper } from '@/wrappers';
import { ClientHooks } from '@/components/ClientHooks';
import NFTLaunchpadMain from './nft-launchpad-main';


export default function Dashboard() {
  return (
    <>
      <ClientHooks />
      <AuthRedirectWrapper>
        <NFTLaunchpadMain />
      </AuthRedirectWrapper>
    </>
  );
}
