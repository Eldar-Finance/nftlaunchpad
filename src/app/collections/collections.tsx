'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {  Users, DollarSign, Clock } from 'lucide-react'

// Dummy data for collections (unchanged)
const dummyCollections = [
  {
    id: '1',
    name: 'Cosmic Creatures',
    description: 'A collection of otherworldly beings from across the universe.',
    totalSupply: 10000,
    minted: 3500,
    price: 0.1,
    currency: 'EGLD',
    endDate: '2024-12-31',
    image: '/placeholder.svg?height=400&width=400'
  },
  {
    id: '2',
    name: 'Digital Dreamscapes',
    description: 'Surreal landscapes crafted in the digital realm.',
    totalSupply: 5000,
    minted: 2800,
    price: 50,
    currency: 'USDC',
    endDate: '2024-11-15',
    image: '/placeholder.svg?height=400&width=400'
  },
  {
    id: '3',
    name: 'Pixel Pets',
    description: 'Adorable pixelated companions for your digital adventures.',
    totalSupply: 8000,
    minted: 6200,
    price: 0.05,
    currency: 'EGLD',
    endDate: '2024-10-01',
    image: '/placeholder.svg?height=400&width=400'
  },
  {
    id: '4',
    name: 'Neon Nights',
    description: 'Vibrant cityscapes inspired by cyberpunk aesthetics.',
    totalSupply: 3000,
    minted: 950,
    price: 75,
    currency: 'USDC',
    endDate: '2025-01-20',
    image: '/placeholder.svg?height=400&width=400'
  },
  {
    id: '5',
    name: 'Quantum Quests',
    description: 'Embark on interdimensional journeys with these unique NFTs.',
    totalSupply: 6000,
    minted: 1800,
    price: 0.15,
    currency: 'EGLD',
    endDate: '2024-09-30',
    image: '/placeholder.svg?height=400&width=400'
  }
]

interface CollectionsProps {
  onCollectionSelect: (collectionId: string) => void;
}

export default function Collections({ onCollectionSelect }: CollectionsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-200 p-8">
      <motion.h1 
        className="text-5xl font-bold mb-12 text-center text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Active Collections
      </motion.h1>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 [&>*]:mb-8">
        {dummyCollections.map((collection, index) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card 
              className="bg-gray-800 border-gray-700 overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
              onMouseEnter={() => setHoveredCard(collection.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative">
                <img 
                  src={collection.image} 
                  alt={collection.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-0 left-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-br-lg">
                  Hot
                </div>
                {hoveredCard === collection.id && (
                  <motion.div 
                    className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button 
                      variant="outline" 
                      className="text-white border-white hover:bg-white hover:text-black transition-colors"
                      onClick={() => onCollectionSelect(collection.id)}
                    >
                      View Collection
                    </Button>
                  </motion.div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">{collection.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{collection.description}</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-400" />
                      <span className="text-white">{collection.minted} / {collection.totalSupply}</span>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Progress value={(collection.minted / collection.totalSupply) * 100} className="w-24" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-white">{((collection.minted / collection.totalSupply) * 100).toFixed(1)}% minted</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                      <span className="text-white">{collection.price} {collection.currency}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                      <span className="text-white">{new Date(collection.endDate).toLocaleDateString()}</span>
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