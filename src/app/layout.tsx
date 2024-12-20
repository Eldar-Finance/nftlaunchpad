import '../styles/globals.css';
import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Layout } from '@/components/Layout';
import App from './index';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QuantumX Launchpad',
  description:
    'A basic implementation of MultiversX dApp providing the basics for MultiversX authentication and TX signing.',
  icons: {
    icon: '/favicon.ico'
  }
};

// Move viewport configuration to a separate export
export const viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className={inter.className}>
      <body>
        <App>
          <Suspense>
            <Layout>{children}</Layout>
          </Suspense>
        </App>
      </body>
    </html>
  );
}
