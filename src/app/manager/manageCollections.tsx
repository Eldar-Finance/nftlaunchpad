'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Info, Pause, Play, Trash2, DollarSign, Lock, Unlock } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useGetMinterInformation } from '@/hooks/useGetAddressInformation' 
import { useGetCollections } from '@/hooks/useGetCollections' 

import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks'
import { PageWrapper } from '@/wrappers'

// Define the interface for collectionDetails
interface CollectionDetails {
    name: string;
    identifier?: string; // Added 'identifier?: string;' to the CollectionDetails type definition
    address?: string; // Add this line
    // ... other properties if needed
}

export default function ManageCollections() {
const { address: connectedAddress } = useGetAccountInfo(); 
console.log('Connected Address:', connectedAddress);
  const  addressInformation  = useGetMinterInformation(connectedAddress)
  console.log('Address Information:', addressInformation);
  const { collections, loading } = useGetCollections(addressInformation)
  console.log('Collections:', collections);

  const [selectedCollection, setSelectedCollection] = useState('')
  const [collectionDetails, setCollectionDetails] = useState<CollectionDetails | null>(null)

  useEffect(() => {
    if (selectedCollection && collections) {
      const details = collections.find(c => c.identifier === selectedCollection) || null
      setCollectionDetails(details)
    }
  }, [selectedCollection, collections])

  const handleCollectionChange = (value: string) => {
    setSelectedCollection(value)
  }

  const handleAction = async (action: string) => {
    console.log(`Performing action: ${action} on collection: ${selectedCollection}`)
    // Here you would typically call your API to perform the action
    // For example:
    // if (action === 'pause') {
    //   await pauseCollection(selectedCollection)
    // }
    // Then you would refetch the collection details or update the local state
  }

  return (
    <PageWrapper>
    <div className="min-h-screen text-white p-8">
      <Card className="w-full max-w-4xl mx-auto bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Manage Your Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-300">Select Collection</Label>
              <Select onValueChange={handleCollectionChange} value={selectedCollection}>
                <SelectTrigger className="w-full mt-1 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Choose a collection" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  {collections && collections.map((collection) => (
                    <SelectItem key={collection.address} value={collection.address}>
                      {collection.name} ({collection.identifier})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {loading && <p className="text-center text-gray-400">Loading collection details...</p>}

            {collectionDetails && (
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">{collectionDetails?.name} Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-400">Identifier</Label>
                      <p className="text-white">{collectionDetails.identifier ?? 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-400">Address</Label>
                      <p className="text-white">{collectionDetails.address ?? 'N/A'}</p> // Use optional chaining
                    </div>
                    {/* Add more details as available from your API */}
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center mt-6">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction('pause')}
                            className="bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
                          >
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-gray-800 text-white">
                          <p>Pause the collection</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction('disableMinting')}
                            className="bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            Disable Minting
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-gray-800 text-white">
                          <p>Disable minting for this collection</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction('claimRoyalties')}
                            className="bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Claim Royalties
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-gray-800 text-white">
                          <p>Claim accumulated royalties for this collection</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear Collection
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 text-white border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">Confirm Clear Collection</DialogTitle>
                        </DialogHeader>
                        <p className="text-gray-300">Are you sure you want to clear this collection? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">Cancel</Button>
                          <Button variant="destructive" onClick={() => handleAction('clearCollection')}>Confirm</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </PageWrapper>
  )
}