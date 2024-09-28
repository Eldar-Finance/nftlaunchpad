'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, ArrowLeft, Coins, Percent, Plus, Minus } from 'lucide-react'

import { useGetCollectionsInfo } from '@/hooks/useGetCollectionsInfo'

interface CollectionInfo {
  address: string;
  creatorAddress: string;
  collectionIdentifier: string;
  collectionName: string;
  singleNftName: string;
  ticker: string;
  description: string;
  ipfsCid: string;
  fileEnding: string;
  tags: string;
  royalties: number;
  maxSupply: number;
  maxAmountPerMint: number;
  totalNftsMinted: number;
  hasJsonMetadata: boolean;
  isMintingEnabled: boolean;
  isPaused: boolean;
  mintCosts: { tokenIdentifier: string; amount: number }[];
}

interface SingleCollectionMintProps {
  collectionId: string;
  onBackClick: () => void;
}

export default function SingleCollectionMint({ collectionId, onBackClick }: SingleCollectionMintProps) {
  const [mintAmount, setMintAmount] = useState(1)
  const [selectedToken, setSelectedToken] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [randomImageNumber, setRandomImageNumber] = useState(3)
  const controls = useAnimation()
  
  const { collectionsInfo, loading } = useGetCollectionsInfo([collectionId]);
  const collectionData: CollectionInfo | undefined = collectionsInfo[0];

  useEffect(() => {
    setRandomImageNumber(Math.floor(Math.random() * (7 - 3 + 1) + 3))
    if (collectionData && collectionData.mintCosts.length > 0) {
      setSelectedToken(collectionData.mintCosts[0].tokenIdentifier)
    }
  }, [collectionData])

  useEffect(() => {
    controls.start({
      scale: isHovered ? 1.05 : 1,
      transition: { duration: 0.3 }
    })
  }, [isHovered, controls])

  const formatPrice = (amount: number) => {
    const formattedPrice = (amount / 1e18).toFixed(2);
    return isNaN(Number(formattedPrice)) ? '0.00' : formattedPrice;
  };

  const handleMint = () => {
    console.log(`Minting ${mintAmount} NFTs from collection ${collectionId} with token ${selectedToken}`);
    // Implement minting logic here
  };

  const incrementMintAmount = () => {
    if (mintAmount < (collectionData?.maxAmountPerMint || 1)) {
      setMintAmount(prev => prev + 1)
    }
  }

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(prev => prev - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= (collectionData?.maxAmountPerMint || 1)) {
      setMintAmount(value);
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"
      />
    </div>
  }

  if (!collectionData) {
    return <div className="text-center text-2xl text-red-500">Collection not found</div>;
  }

  const selectedCost = collectionData.mintCosts.find(cost => cost.tokenIdentifier === selectedToken);
  const totalCost = selectedCost ? formatPrice(selectedCost.amount * mintAmount) : '0.00';

  const imageUrl = `https://ipfs.io/ipfs/${collectionData.ipfsCid}/${randomImageNumber}.${collectionData.fileEnding}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200 p-8 overflow-hidden">
      <motion.div 
        className="flex items-center justify-between mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          onClick={onBackClick}
          className="bg-gray-800 hover:bg-gray-700 text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Collections
        </Button>
        <h1 className="text-6xl font-bold text-white relative">
          {collectionData.collectionName}
          <motion.span
            className="absolute -z-10 inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur-2xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full flex justify-center"
        >
          <motion.div
            animate={controls}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative group w-full max-w-md"
          >
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src={imageUrl}
                alt={collectionData.collectionName} 
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110 rounded-3xl"
              />
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 w-full"
        >
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 backdrop-blur-md w-full rounded-3xl shadow-2xl">
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center mt-6">
                  <Users className="w-6 h-6 mr-2 text-blue-400" />
                  <span className="text-white text-lg">{collectionData.totalNftsMinted} / {collectionData.maxSupply} Minted</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Progress value={(collectionData.totalNftsMinted / collectionData.maxSupply) * 100} className="w-32 h-3 rounded-full" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-white">{((collectionData.totalNftsMinted / collectionData.maxSupply) * 100).toFixed(1)}% minted</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Coins className="w-6 h-6 mr-2 text-yellow-400" />
                  <span className="text-white text-lg">Mint Token</span>
                </div>
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {collectionData.mintCosts.map((cost) => (
                      <SelectItem key={cost.tokenIdentifier} value={cost.tokenIdentifier}>
                        <div className="flex items-center">
                          <img 
                            src={`https://devnet-api.multiversx.com/${cost.tokenIdentifier}/logo/png`} 
                            alt={cost.tokenIdentifier}
                            className="w-6 h-6 mr-2"
                          />
                          {cost.tokenIdentifier}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white text-lg">Mint Price</span>
                <span className="text-white text-lg font-bold">
                  {selectedCost ? `${formatPrice(selectedCost.amount)} ${selectedToken}` : 'Select a token'}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-700 rounded-full">
                  <Button 
                    onClick={decrementMintAmount}
                    className="bg-transparent hover:bg-gray-600 text-white rounded-l-full px-3"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input 
                    type="number" 
                    min={1} 
                    max={collectionData.maxAmountPerMint}
                    value={mintAmount} 
                    onChange={handleInputChange}
                    className="w-16 bg-transparent text-white border-0 text-center text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button 
                    onClick={incrementMintAmount}
                    className="bg-transparent hover:bg-gray-600 text-white rounded-r-full px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button 
                  onClick={handleMint}
                  disabled={!collectionData.isMintingEnabled || !selectedToken}
                  className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105 ${(!collectionData.isMintingEnabled || !selectedToken) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Mint Now
                </Button>
              </div>

              <p className="text-lg text-gray-300">
                Total Cost: {totalCost} {selectedToken}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-900 p-1 rounded-t-3xl">
                <TabsTrigger value="description" className="rounded-2xl">Description</TabsTrigger>
                <TabsTrigger value="details" className="rounded-2xl">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="p-6">
                <p className="text-white">{collectionData.description}</p>
              </TabsContent>
              <TabsContent value="details" className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-400" />
                    <span className="text-gray-400">Creator</span>
                  </div>
                  <span className="text-white">{collectionData.creatorAddress.slice(0, 6)}...{collectionData.creatorAddress.slice(-4)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                    <span className="text-gray-400">Ticker</span>
                  </div>
                  <span className="text-white">{collectionData.ticker}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-400" />
                    <span className="text-gray-400">Max Amount Per Mint</span>
                  </div>
                  <span className="text-white">{collectionData.maxAmountPerMint}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Percent className="w-5 h-5 mr-2 text-purple-400" />
                    <span className="text-gray-400">Royalties</span>
                  </div>
                  <span className="text-white">{(collectionData.royalties / 100).toFixed(2)}%</span>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}