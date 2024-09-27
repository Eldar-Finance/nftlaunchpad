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
import { Power, LogIn, Home, LayoutDashboard, Settings,DollarSign } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const Header = () => {
  const router = useRouter();
  const isLoggedIn = useGetIsLoggedIn();
  const pathname = usePathname();

  const isUnlockRoute = Boolean(pathname === RouteNamesEnum.unlock);

  const ConnectButton = isUnlockRoute ? null : (
    <MxLink to={RouteNamesEnum.unlock}>
      <Button variant="outline" size="sm" className="text-gray-200 border-gray-700 hover:bg-gray-800 hover:text-white transition-colors">
        <LogIn className="w-4 h-4 mr-2" />
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
    { icon: Home, label: 'Home', route: RouteNamesEnum.home },
    { icon: LayoutDashboard, label: 'Dashboard', route: RouteNamesEnum.dashboard },
    { icon: Settings, label: 'Manager', route: RouteNamesEnum.manager },
    { icon: DollarSign, label: 'Collections', route: RouteNamesEnum.collections },
  ];

  return (
    <header className='flex flex-row items-center justify-between px-6 py-3 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 shadow-md'>
      <MxLink
        to={isLoggedIn ? RouteNamesEnum.dashboard : RouteNamesEnum.home}
        className='flex items-center justify-between'
      >
        <Image src={mvxLogo} alt='MultiversX Logo' className='w-auto h-8' />
      </MxLink>

      {/* Centered Menu */}
      <nav className='hidden md:flex items-center justify-center flex-1'>
        {menuItems.map((item) => (
          <MxLink key={item.label} to={item.route}>
            <div
              className={`flex items-center px-4 py-2 mx-2 rounded-md text-sm font-medium transition-colors
                ${pathname === item.route 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <item.icon className="w-5 h-5 mr-2" />
              {item.label}
            </div>
          </MxLink>
        ))}
      </nav>

      {/* Mobile Menu */}
      <nav className='md:hidden flex items-center space-x-2'>
        <TooltipProvider>
          {menuItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <MxLink to={item.route}>
                  <div
                    className={`p-2 rounded-md transition-colors
                      ${pathname === item.route 
                        ? 'bg-gray-800 text-white' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                </MxLink>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-gray-800 text-white border-gray-700">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>

      <div className='flex items-center space-x-6'>
        <div className='hidden sm:flex items-center space-x-2'>
          <div className='w-2 h-2 rounded-full bg-green-500' />
          <p className='text-gray-400 text-xs font-medium'>{environment}</p>
        </div>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className='flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors'
          >
            <Power className="w-4 h-4 mr-2" />
            Logout
          </button>
        ) : (
          ConnectButton
        )}
      </div>
    </header>
  );
};