'use client';
import React from 'react';
import { RouteNamesEnum } from '@/localConstants';
import type {
  ExtensionLoginButtonPropsType,
  WebWalletLoginButtonPropsType,
  OperaWalletLoginButtonPropsType,
  LedgerLoginButtonPropsType,
  WalletConnectLoginButtonPropsType
} from '@multiversx/sdk-dapp/UI';
import {
  ExtensionLoginButton,
  LedgerLoginButton,
  WalletConnectLoginButton,
  WebWalletLoginButton as WebWalletUrlLoginButton,
  OperaWalletLoginButton,
  CrossWindowLoginButton,
} from '@/components';
import { nativeAuth } from '@/config';
import { AuthRedirectWrapper } from '@/wrappers';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Smartphone, Key, Globe} from 'lucide-react';

type CommonPropsType =
  | OperaWalletLoginButtonPropsType
  | ExtensionLoginButtonPropsType
  | WebWalletLoginButtonPropsType
  | LedgerLoginButtonPropsType
  | WalletConnectLoginButtonPropsType;

const USE_WEB_WALLET_CROSS_WINDOW = true;

const WebWalletLoginButton = USE_WEB_WALLET_CROSS_WINDOW
  ? CrossWindowLoginButton
  : WebWalletUrlLoginButton;

export default function Unlock() {
  const router = useRouter();
  const commonProps: CommonPropsType = {
    callbackRoute: RouteNamesEnum.dashboard,
    nativeAuth,
    onLoginRedirect: () => {
      router.push(RouteNamesEnum.dashboard);
    }
  };

  return (
    <AuthRedirectWrapper requireAuth={false}>
      <div className='flex justify-center items-center min-h-screen bg-transparent'>
        <Card className="w-full max-w-md bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader className="pb-4 pt-6">
            <CardTitle className="text-2xl font-bold text-center text-white">Login</CardTitle>
            <p className="text-gray-400 text-center text-sm">Choose a login method</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <WalletConnectLoginButton
              loginButtonText='xPortal App'
              {...commonProps}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center"
            >
              <Smartphone className="w-5 h-5 mr-2" />
              xPortal App
            </WalletConnectLoginButton>
            <LedgerLoginButton
              loginButtonText='Ledger'
              {...commonProps}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center"
            >
              <Key className="w-5 h-5 mr-2" />
              Ledger
            </LedgerLoginButton>
            <ExtensionLoginButton
              loginButtonText='DeFi Wallet'
              {...commonProps}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center"
            >
              <Wallet className="w-5 h-5 mr-2" />
              DeFi Wallet
            </ExtensionLoginButton>
            <OperaWalletLoginButton
              loginButtonText='Opera Crypto Wallet - Beta'
              {...commonProps}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center"
            >
              Opera Crypto Wallet - Beta
            </OperaWalletLoginButton>
            <WebWalletLoginButton
              loginButtonText='Web Wallet'
              data-testid='webWalletLoginBtn'
              {...commonProps}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center"
            >
              <Globe className="w-5 h-5 mr-2" />
              Web Wallet
            </WebWalletLoginButton>
          </CardContent>
        </Card>
      </div>
    </AuthRedirectWrapper>
  );
}