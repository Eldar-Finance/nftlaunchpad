
'use client'

import { useState } from 'react'
import { ArrowLeft, Info, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useGetMinterInformation } from '@/hooks/useGetAddressInformation';
import { useGetAccountInfo } from '@/hooks';
import { useGetCollections } from '@/hooks/useGetCollections';
import { Address } from '@multiversx/sdk-core';
import { GAS_PRICE, VERSION } from '@/localConstants';
import {useGetNetworkConfig} from '@/hooks/sdkDappHooks';
import { newTransaction } from '@/helpers/sdkDappHelpers';
import { signAndSendTransactions } from '@/helpers/signAndSendTransactions';

interface CreateMinterProps {
  onBack: () => void;
}

export function CreateMinter({ onBack }: CreateMinterProps) {
  const { network } = useGetNetworkConfig();
  const { address: connectedAddress } = useGetAccountInfo();
  const { account } = useGetAccountInfo();
  const nonce = account.nonce;
  const minterInfo = useGetMinterInformation(connectedAddress);
  // console.log('Minter Information (Bech32):', minterInfo);
  const { collections } = useGetCollections(Array.isArray(minterInfo) ? minterInfo : []);

  const [selectedCollection, setSelectedCollection] = useState('')

  const handleCollectionChange = (value: string) => {
    setSelectedCollection(value);
   // console.log('Selected Collection:', value); // Debugging output
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log('Launchpad finalized for collection:', selectedCollection);

    const selectedCollectionAddress = collections.find(collection => collection.name === selectedCollection)?.address;

    const hexArguments = `issueCollection`;
    const valueSend = 0.05 * 1e18;

    const createCollectionTransaction = newTransaction({
        value: valueSend,
        data: hexArguments,
        receiver: selectedCollectionAddress, // Use selectedCollection.address here
        gasLimit: 80000000,
        gasPrice: GAS_PRICE,
        chainID: network.chainId,
        nonce: nonce,
        sender: new Address(connectedAddress),
        version: VERSION,
        arguments: []
    });

    try {
      const sessionId = await signAndSendTransactions({
        transactions: [createCollectionTransaction],
        callbackRoute: '',
        transactionsDisplayInfo: {
          processingMessage: 'Creating collection...',
          errorMessage: 'Failed to create collection',
          successMessage: 'collection created successfully',
        }
      })
       console.log(`Action completed, session ID:`, sessionId)
    } catch (error) {
        console.error('Collection creation failed:', error);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-b from-gray-900 to-black rounded-lg shadow-xl border border-gray-800">
      <CardHeader className="pb-4 pt-6">
        <CardTitle className="text-2xl font-bold text-center text-white">
          Finalize Launchpad
        </CardTitle>
        <p className="text-gray-400 text-center text-sm">Select your collection and launch your NFTs</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="flex items-center text-sm font-medium text-gray-300">
              <Rocket className="w-4 h-4 mr-2 text-blue-400" />
              Select Collection
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 ml-2 cursor-help text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-gray-800 text-white p-2 rounded-md text-xs">
                    <p>Choose an existing collection to finalize the launchpad.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select onValueChange={handleCollectionChange} value={selectedCollection}>
              <SelectTrigger className="mt-2 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {collections.map((collection) => (
                  <SelectItem key={collection.name} value={collection.name || 'default-value'}>
                    {collection.name || 'Unnamed Collection'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Display the address based on the selected collection */}
            {selectedCollection && (
              <p className="text-gray-300 mt-2">
                Minter Info Address: {collections.find(collection => collection.name === selectedCollection)?.address || 'Address not found'}
              </p>
            )}
          </div>

          <div className="flex justify-between pt-6">
            <Button onClick={onBack} variant="outline" className="text-gray-400 border-gray-600 hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button 
              onClick={handleSubmit}
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              disabled={!selectedCollection}
            >
              Finalize Launchpad
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-center w-full text-gray-500 mt-4">
          Note: Finalizing the launchpad will make your collection available for managing and enabling minting.
        </p>
      </CardFooter>
    </Card>
  )
}