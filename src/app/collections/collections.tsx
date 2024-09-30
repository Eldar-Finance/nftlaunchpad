'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Frame, Coins } from 'lucide-react'
import { useGetLiveMinters } from '@/hooks/getLiveMinters';
import Image from 'next/image';

interface CollectionsProps {
  onCollectionSelect: (collectionId: string) => void;
}

export default function Collections({ onCollectionSelect }: CollectionsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const { liveMinters, isLoading } = useGetLiveMinters();

  // Generate random numbers for each collection
  const randomNumbers = useMemo(() => 
    liveMinters.map(() => Math.floor(Math.random() * (8 - 3 + 1) + 3)),
    [liveMinters]
  );

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  const formatTokenIdentifier = (identifier: string) => {
    return identifier.split('-')[0];
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-200 p-8 overflow-x-hidden">
      <motion.h1 
        className="text-5xl font-bold mb-12 text-center text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Active Collections
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {liveMinters.map((collection, index) => (
          <motion.div
            key={collection.address}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card 
              className="bg-gray-800 border-gray-700 overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl h-full"
              onMouseEnter={() => setHoveredCard(collection.address)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative">
                <img 
                  src={`https://ipfs.io/ipfs/${collection.ipfsCid}/${randomNumbers[index]}.png`} 
                  alt={collection.collectionName} 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-0 left-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-br-lg">
                  Minting now
                </div>
                {hoveredCard === collection.address && (
                  <motion.div 
                    className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button 
                      variant="outline" 
                      className="text-white border-white hover:bg-white hover:text-black transition-colors"
                      onClick={() => onCollectionSelect(collection.address)}
                    >
                      View Collection
                    </Button>
                  </motion.div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">{collection.collectionName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{collection.collectionDescription}</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Frame className="w-5 h-5 mr-2 text-blue-400" />
                      <span className="text-white">{collection.minted} / {collection.maxSupply}</span>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Progress value={(collection.minted / collection.maxSupply) * 100} className="w-24" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-white">{((collection.minted / collection.maxSupply) * 100).toFixed(1)}% minted</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Coins className="w-5 h-5 mr-2 text-green-400" />
                      <span className="text-white flex items-center">
                        {collection.cost/1e18 || 'N/A'} {' '}
                        {formatTokenIdentifier(collection.tokenIdentifier)}
                        <Image 
                          src={collection.tokenIdentifier === 'EGLD' 
                            ? '/assets/img/multiversx-symbol.svg'
                            : `https://tools.multiversx.com/assets-cdn/devnet/tokens/${collection.tokenIdentifier}/icon.png`}
                          alt={collection.tokenIdentifier}
                          width={20}
                          height={20}
                          className="mx-1"
                        />
                        
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}