'use client';

import { Button } from '@/components/ui/button';
import { MxLink } from '@/components/MxLink';
import { environment } from '@/config';
import { logout } from '@/helpers';
import { useGetIsLoggedIn } from '@/hooks';
import { RouteNamesEnum } from '@/localConstants';
import mvxLogo from '../../../../public/assets/img/multiversx-logo.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getWindowLocation } from '@/utils/sdkDappUtils';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const router = useRouter();
  const isLoggedIn = useGetIsLoggedIn();
  const pathname = usePathname();

  const isUnlockRoute = Boolean(pathname === RouteNamesEnum.unlock);

  const ConnectButton = isUnlockRoute ? null : (
    <MxLink to={RouteNamesEnum.unlock}>
      <Button variant="outline" size="sm" className="text-gray-200 border-gray-700 hover:bg-gray-800 hover:text-white transition-colors">
        Connect
      </Button>
    </MxLink>
  );

  const onRedirect = () => {
    router.replace(RouteNamesEnum.unlock);
  };

  const handleLogout = () => {
    const { href } = getWindowLocation();
    sessionStorage.clear();
    logout(href, onRedirect, false);
  };

  const menuItems = [
    { label: 'Home', route: RouteNamesEnum.home },
    { label: 'Dashboard', route: RouteNamesEnum.dashboard },
    { label: 'Collections', route: RouteNamesEnum.collections },
  ];

  return (
    <header className='flex flex-row items-center justify-between px-2 sm:px-6 py-2 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 shadow-md w-full'>
      <div className="flex items-center">
        <MxLink
          to={isLoggedIn ? RouteNamesEnum.dashboard : RouteNamesEnum.home}
          className='flex items-center'
        >
          <Image src={mvxLogo} alt='MultiversX Logo' className='w-auto h-6 sm:h-8' />
        </MxLink>
      </div>

      {/* Desktop Menu */}
      <nav className='hidden md:flex items-center justify-center flex-1'>
        {menuItems.map((item) => (
          <MxLink key={item.label} to={item.route}>
            <div
              className={`px-4 py-2 mx-2 text-sm font-medium transition-colors
                ${pathname === item.route 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-gray-300'
                }`}
            >
              {item.label}
            </div>
          </MxLink>
        ))}
      </nav>

      {/* Mobile Menu */}
      <nav className='md:hidden flex items-center space-x-2'>
        {menuItems.map((item) => (
          <MxLink key={item.label} to={item.route}>
            <div
              className={`px-2 py-1 text-xs font-medium transition-colors
                ${pathname === item.route 
                  ? 'text-white border-b border-white' 
                  : 'text-gray-400 hover:text-white hover:border-b hover:border-gray-400'
                }`}
            >
              {item.label}
            </div>
          </MxLink>
        ))}
      </nav>

      {/* Login/Logout Button and Network Indicator */}
      <div className='flex flex-col items-end'>
        <div className='flex items-center'>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className='px-2 py-1 text-xs font-medium text-gray-300 hover:text-white transition-colors'
            >
              Logout
            </button>
          ) : (
            ConnectButton
          )}
        </div>
        
        {/* Environment indicator - now under the button */}
        <div className='flex items-center space-x-2 mt-1'>
          <div className='w-2 h-2 rounded-full bg-green-500' />
          <p className='text-gray-400 text-xs font-medium'>{environment}</p>
        </div>
      </div>
    </header>
  );
};