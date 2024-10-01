"use client"

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Frame, Coins, ChevronRight } from 'lucide-react'
import { useGetLiveMinters } from '@/hooks/getLiveMinters'
import Image from 'next/image'

interface CollectionsProps {
  onCollectionSelect: (collectionId: string) => void
}

export default function Collections({ onCollectionSelect }: CollectionsProps) {
  const { liveMinters, isLoading } = useGetLiveMinters()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const yRange = useTransform(scrollYProgress, [0, 1], [0, 50])

  const [backgroundImages, setBackgroundImages] = useState<string[]>([])

  useEffect(() => {
    if (liveMinters.length > 0) {
      const images = liveMinters.map((collection) => 
        `https://ipfs.io/ipfs/${collection.ipfsCid}/${Math.floor(Math.random() * (8 - 3 + 1) + 3)}.png`
      )
      setBackgroundImages(images)
    }
  }, [liveMinters])

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="text-4xl font-bold text-white"
        >
          Loading...
        </motion.div>
      </div>
    )
  }

  const formatTokenIdentifier = (identifier: string) => {
    return identifier.split('-')[0]
  }

  return (
    <div className="relative min-h-screen w-screen  text-white overflow-hidden" ref={containerRef}>
     
      <motion.h1 
        className="text-4xl font-bold mb-6 pt-8 text-center text-white mix-blend-difference sticky top-0 z-50"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Active Collections
      </motion.h1>
      <motion.div 
        className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-8 px-4"
        style={{ y: yRange }}
      >
        {liveMinters.map((collection, index) => (
          <motion.div
            key={collection.address}
            className="w-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Card 
              className="bg-black/30 backdrop-blur-xl border-none overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 h-full flex flex-col"
            >
              <div className="relative aspect-square">
                <Image 
                  src={backgroundImages[index]}
                  alt={collection.collectionName}
                  layout="fill"
                  objectFit="cover"
                  className="transition-all duration-500 ease-in-out transform hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <div className="absolute bottom-0 left-0 p-2">
                  <h2 className="text-sm font-bold mb-1 line-clamp-1">{collection.collectionName}</h2>
                  <p className="text-xs text-gray-300 line-clamp-2">{collection.collectionDescription}</p>
                </div>
              </div>
              <CardContent className="p-2 space-y-2 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <Frame className="w-3 h-3 text-purple-400" />
                      <span className="text-xs font-semibold">{collection.minted}/{collection.maxSupply}</span>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Progress value={(collection.minted / collection.maxSupply) * 100} className="w-16 h-1" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs font-semibold">{((collection.minted / collection.maxSupply) * 100).toFixed(1)}% minted</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Coins className="w-3 h-3 text-green-400" />
                    <span className="text-xs font-semibold flex items-center space-x-1">
                      <span>{collection.cost/1e18 || 'N/A'}</span>
                      <span>{formatTokenIdentifier(collection.tokenIdentifier)}</span>
                      <Image 
                        src={collection.tokenIdentifier === 'EGLD' 
                          ? '/assets/img/multiversx-symbol.svg'
                          : `https://tools.multiversx.com/assets-cdn/devnet/tokens/${collection.tokenIdentifier}/icon.png`}
                        alt={collection.tokenIdentifier}
                        width={12}
                        height={12}
                      />
                    </span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="text-white border-white hover:bg-white hover:text-black transition-colors text-xs w-full mt-2 py-1 h-auto"
                  onClick={() => onCollectionSelect(collection.address)}
                >
                  View
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}