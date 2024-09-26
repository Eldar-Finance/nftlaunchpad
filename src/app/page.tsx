'use client';
import { AuthRedirectWrapper, PageWrapper } from '@/wrappers';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from './landpage';
export default function Home({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();

  useEffect(() => {
    if (searchParams && Object.keys(searchParams).length > 0) {
      router.replace('/');
    }
  }, [router, searchParams]);

  return (
    <AuthRedirectWrapper requireAuth={false}>
      <PageWrapper>
        <LandingPage />
      </PageWrapper>
    </AuthRedirectWrapper>
  );
}
