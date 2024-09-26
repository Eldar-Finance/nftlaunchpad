'use client';

import { PropsWithChildren } from 'react';
import { AuthenticatedRoutesWrapper } from '@multiversx/sdk-dapp/wrappers/AuthenticatedRoutesWrapper/AuthenticatedRoutesWrapper';
import { RouteNamesEnum } from '@/localConstants';
import { routes } from '@/routes';
import { Footer } from './Footer';
import { Header } from './Header';
import { motion } from 'framer-motion';

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex min-h-screen flex-col bg-black text-white'>
      <div className='relative z-10 bg-gray-900 shadow-md'>
        <Header />
      </div>
      <main className='flex flex-grow items-stretch justify-center p-6 relative z-10'>
        <AuthenticatedRoutesWrapper
          routes={routes}
          unlockRoute={`${RouteNamesEnum.unlock}`}
        >
          {children}
        </AuthenticatedRoutesWrapper>
      </main>
      <Footer />

      {/* Subtle animated background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-50"></div>
        <div className="absolute inset-0 opacity-5 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 bg-blue-500 rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * 5 - 2.5],
              y: [0, Math.random() * -10],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};