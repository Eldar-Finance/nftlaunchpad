'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Image as ArrowLeft, Coins, Percent } from 'lucide-react'

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
  const [isHovered, setIsHovered] = useState(false)
  const [randomImageNumber, setRandomImageNumber] = useState(3)
  const controls = useAnimation()
  
  const { collectionsInfo, loading } = useGetCollectionsInfo([collectionId]);
  const collectionData: CollectionInfo | undefined = collectionsInfo[0];

  useEffect(() => {
    // Generate a random number between 3 and 7 when the component mounts
    setRandomImageNumber(Math.floor(Math.random() * (7 - 3 + 1) + 3))
  }, [])

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
    console.log(`Minting ${mintAmount} NFTs from collection ${collectionId}`);
    // Implement minting logic here
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!collectionData) {
    return <div>Collection not found</div>;
  }

  const totalCost = formatPrice(collectionData.mintCosts.reduce((total, cost) => total + cost.amount, 0) * mintAmount);

  const imageUrl = `https://ipfs.io/ipfs/${collectionData.ipfsCid}/${randomImageNumber}.${collectionData.fileEnding}`

  return (
    <div className="min-h-screen bg-transparent text-gray-200 p-8 overflow-hidden">
      <motion.div 
        className="absolute top-0 left-0 w-full h-full opacity-50 pointer-events-none"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
          backgroundSize: ['100% 100%', '200% 200%'],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        style={{
          backgroundImage: 'radial-gradient(circle, #1a1b2e 10%, transparent 10%), radial-gradient(circle, #1a1b2e 10%, transparent 10%)',
          backgroundSize: '50px 50px',
        }}
      />

      <motion.div 
        className="flex items-center justify-between mb-8"
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
            className="relative group w-1/2"
          >
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <img 
                src={imageUrl}
                alt={collectionData.collectionName} 
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </Card>
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
            >
              <Button className="bg-white text-black hover:bg-gray-200 transition-colors">
                View Gallery
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 w-full"
        >
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-md w-full">
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-400" />
                  <span className="text-white text-lg">{collectionData.totalNftsMinted} / {collectionData.maxSupply} Minted</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Progress value={(collectionData.totalNftsMinted / collectionData.maxSupply) * 100} className="w-32 h-2" />
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
                  <span className="text-white text-lg">Mint Price</span>
                </div>
                <span className="text-white text-lg font-bold">
                  {collectionData.mintCosts.map(cost => `${formatPrice(cost.amount)} ${cost.tokenIdentifier}`).join(', ')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Percent className="w-6 h-6 mr-2 text-green-400" />
                  <span className="text-white text-lg">Royalties</span>
                </div>
                <span className="text-white text-lg font-bold">{(collectionData.royalties / 100).toFixed(2)}%</span>
              </div>

              <div className="flex items-center space-x-4">
                <Input 
                  type="number" 
                  min="1" 
                  max={collectionData.maxAmountPerMint}
                  value={mintAmount} 
                  onChange={(e) => setMintAmount(Number(e.target.value))}
                  className="w-24 bg-gray-700 text-white border-gray-600 text-lg"
                />
                <Button 
                  onClick={handleMint}
                  disabled={!collectionData.isMintingEnabled}
                  className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105 ${!collectionData.isMintingEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Mint Now
                </Button>
              </div>

              <p className="text-lg text-gray-300">
                Total Cost: {totalCost} {collectionData.mintCosts[0]?.tokenIdentifier || ''}
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-md">
                <CardContent className="p-6">
                  <p className="text-white">{collectionData.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-md">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Creator</span>
                    <span className="text-white">{collectionData.creatorAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ticker</span>
                    <span className="text-white">{collectionData.ticker}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Amount Per Mint</span>
                    <span className="text-white">{collectionData.maxAmountPerMint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Minting Enabled</span>
                    <span className="text-white">{collectionData.isMintingEnabled ? 'Yes' : 'No'}</span>
                  </div>
                  {/* Removed the Paused field */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}