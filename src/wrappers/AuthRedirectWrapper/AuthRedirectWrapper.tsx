'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { useGetIsLoggedIn } from '@/hooks';
import { usePathname } from 'next/navigation';

interface AuthRedirectWrapperPropsType extends PropsWithChildren {
  requireAuth?: boolean;
}

export const AuthRedirectWrapper = ({
  children,
  requireAuth = true
}: AuthRedirectWrapperPropsType) => {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = useGetIsLoggedIn();

  useEffect(() => {
    if (isLoggedIn && !requireAuth && pathname === '/unlock') {
      router.push('/');
    } else if (!isLoggedIn && requireAuth) {
      router.push('/unlock');
    }
  }, [isLoggedIn, requireAuth, router, pathname]);

  return <>{children}</>;
};
