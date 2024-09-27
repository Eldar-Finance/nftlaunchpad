'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, DollarSign, Clock, Tag, FileText, Image as ImageIcon, Hash, ArrowLeft } from 'lucide-react'

// Dummy data for a single collection
const dummyCollectionData = {
  id: 'cosmic-creatures-001',
  name: 'Cosmic Creatures',
  description: 'Embark on an interstellar journey with our Cosmic Creatures collection. Each NFT represents a unique being from the far reaches of the universe, beautifully crafted and imbued with otherworldly characteristics. From ethereal star-born entities to bizarre alien lifeforms, this collection celebrates the diversity and wonder of cosmic life. Collect, trade, and showcase these extraordinary creatures in your digital galaxy.',
  totalSupply: 10000,
  minted: 3500,
  price: 0.1,
  currency: 'EGLD',
  endDate: '2024-12-31',
  image: 'https://media.xoxno.com/nftmedia/QXHR-9b0bc6/QXHR-9b0bc6-01a6.avif',
  creator: 'erd1qqqqqqqqqqqqqpgqp699jngundfqw07d8jzkepucvpzush6k3wvqyc44rx',
  royalties: '5%',
  traits: [
    { name: 'Background', values: ['Nebula', 'Black Hole', 'Starfield', 'Galaxy'] },
    { name: 'Body', values: ['Ethereal', 'Crystalline', 'Amorphous', 'Biomechanical'] },
    { name: 'Eyes', values: ['Glowing', 'Multifaceted', 'Void-like', 'Bioluminescent'] },
    { name: 'Special Feature', values: ['Tentacles', 'Energy Aura', 'Phasing', 'Constellation Pattern'] }
  ],
  rarity: {
    common: 60,
    rare: 30,
    epic: 9,
    legendary: 1
  },
  mintLimit: 5,
  blockchain: 'MultiversX',
  smartContractAddress: 'erd1qqqqqqqqqqqqqpgqd77fnev2qnnj8tyrwhz35c7lmx0qa5z8d8ss3pdkr3',
  socialLinks: {
    website: 'https://cosmiccreatures.example.com',
    twitter: 'https://twitter.com/cosmiccreatures',
    discord: 'https://discord.gg/cosmiccreatures'
  }
}

interface SingleCollectionMintProps {
  collectionId: string;
  onBackClick: () => void;
}

export default function SingleCollectionMint({ collectionId, onBackClick }: SingleCollectionMintProps) {
  const [mintAmount, setMintAmount] = useState(1)
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      scale: isHovered ? 1.05 : 1,
      transition: { duration: 0.3 }
    })
  }, [isHovered, controls])

  const handleMint = () => {
    console.log(`Minting ${mintAmount} NFTs from collection ${collectionId}`)
    // Implement minting logic here
  }

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
          {dummyCollectionData.name}
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
          className="w-full"
        >
          <motion.div
            animate={controls}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative group w-full"
          >
            <Card className="bg-gray-800 border-gray-700 overflow-hidden w-full">
              <img 
                src={dummyCollectionData.image} 
                alt={dummyCollectionData.name} 
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
                  <span className="text-white text-lg">{dummyCollectionData.minted} / {dummyCollectionData.totalSupply} Minted</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Progress value={(dummyCollectionData.minted / dummyCollectionData.totalSupply) * 100} className="w-32 h-2" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-white">{((dummyCollectionData.minted / dummyCollectionData.totalSupply) * 100).toFixed(1)}% minted</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <DollarSign className="w-6 h-6 mr-2 text-green-400" />
                  <span className="text-white text-lg">{dummyCollectionData.price} {dummyCollectionData.currency} per NFT</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-yellow-400" />
                  <span className="text-white text-lg">Ends {new Date(dummyCollectionData.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Input 
                  type="number" 
                  min="1" 
                  max={dummyCollectionData.mintLimit}
                  value={mintAmount} 
                  onChange={(e) => setMintAmount(Number(e.target.value))}
                  className="w-24 bg-gray-700 text-white border-gray-600 text-lg"
                />
                <Button 
                  onClick={handleMint}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Mint Now
                </Button>
              </div>

              <p className="text-lg text-gray-300">
                Total Cost: {(dummyCollectionData.price * mintAmount).toFixed(2)} {dummyCollectionData.currency}
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 backdrop-blur-md rounded-full p-1 mb-4">
              <TabsTrigger value="details" className="text-white rounded-full">Details</TabsTrigger>
              <TabsTrigger value="traits" className="text-white rounded-full">Traits</TabsTrigger>
              <TabsTrigger value="about" className="text-white rounded-full">About</TabsTrigger>
            </TabsList>
            <div className="h-[300px] overflow-y-auto">
              <TabsContent value="details" className="w-full h-full">
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-md w-full h-full">
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center">
                      <Tag className="w-6 h-6 mr-2 text-blue-400" />
                      <span className="text-white font-medium">Creator:</span>
                      <span className="text-gray-300 ml-2">{dummyCollectionData.creator.slice(0, 6)}...{dummyCollectionData.creator.slice(-4)}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-6 h-6 mr-2 text-green-400" />
                      <span className="text-white font-medium">Royalties:</span>
                      <span className="text-gray-300 ml-2">{dummyCollectionData.royalties}</span>
                    </div>
                    <div className="flex items-center">
                      <ImageIcon className="w-6 h-6 mr-2 text-purple-400" />
                      <span className="text-white font-medium">Total Items:</span>
                      <span className="text-gray-300 ml-2">{dummyCollectionData.totalSupply}</span>
                    </div>
                    <div className="flex items-center">
                      <Hash className="w-6 h-6 mr-2 text-yellow-400" />
                      <span className="text-white font-medium">Blockchain:</span>
                      <span className="text-gray-300 ml-2">{dummyCollectionData.blockchain}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="traits" className="w-full h-full">
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-md w-full h-full">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {dummyCollectionData.traits.map((trait, index) => (
                        <div key={index} className="bg-gray-700/50 backdrop-blur-md p-4 rounded-lg">
                          <h3 className="text-white font-medium mb-2">{trait.name}</h3>
                          <ul className="text-gray-300 text-sm">
                            {trait.values.map((value, vIndex) => (
                              <li key={vIndex}>{value}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="about" className="w-full h-full">
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-md w-full h-full">
                  <CardContent className="p-6">
                    <p className="text-gray-300 leading-relaxed">{dummyCollectionData.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}