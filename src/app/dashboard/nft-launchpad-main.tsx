"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { CreateCollection } from "./create-collection"
import { CreateMinter } from "./create-minter"
import { PlusCircle, Rocket, ArrowRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NFTLaunchpadMain() {
  const [selectedOption, setSelectedOption] = useState<'create' | 'minter' | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const yRange = useTransform(scrollYProgress, [0, 1], [0, 100])

  const [backgroundImage, setBackgroundImage] = useState<string>('')

  useEffect(() => {
    // Simulating a random background image
    setBackgroundImage(`https://source.unsplash.com/random/1920x1080?nft,digital,art`)
  }, [])

  const options = [
    { 
      title: 'Create Collection', 
      description: 'Start your NFT journey by creating a unique collection. Define Collection Name and Ticker before creating the minter smart contract.',
      icon: <PlusCircle size={32} className="text-blue-400" />,
      action: () => setSelectedOption('create'),
      color: 'from-blue-600 to-blue-400'
    },
    { 
      title: 'Issue Minter', 
      description: 'Ready to launch? Issue your minter smart contract for your existing collection and set your NFTs free in the market.',
      icon: <Rocket size={32} className="text-green-400" />,
      action: () => window.location.href = '/issue',
      color: 'from-green-600 to-green-400'
    },
    { 
      title: 'Manager Dashboard', 
      description: 'Manage your issued collections, track performance, and make adjustments to your NFTs seamlessly.',
      icon: <Rocket size={32} className="text-yellow-400" />,
      action: () => window.location.href = '/manager',
      color: 'from-yellow-600 to-yellow-400'
    }
  ]

  return (
    <div className="relative min-h-screen w-screen text-white overflow-hidden" ref={containerRef}>
      <motion.div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px) brightness(0.3)',
        }}
      />
      <div className="relative z-10 container mx-auto py-12 px-4 max-w-6xl">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-12 text-center text-white mix-blend-difference"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your NFT Launchpad in 3..2..1
        </motion.h1>
        
        <AnimatePresence mode="wait">
          {!selectedOption ? (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ y: yRange }}
            >
              {options.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className="bg-black/30 backdrop-blur-xl border-none overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 h-full flex flex-col"
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center mb-4">
                        {option.icon}
                        <h2 className="text-2xl font-bold ml-3 text-white">{option.title}</h2>
                      </div>
                      <p className="text-gray-300 mb-6 flex-grow">{option.description}</p>
                      <Button
                        className={`w-full text-white font-medium transition-all duration-300 bg-gradient-to-r ${option.color} hover:shadow-lg hover:shadow-purple-500/50`}
                        onClick={option.action}
                      >
                        {option.title}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                variant="ghost"
                className="mb-6 text-white hover:text-gray-300 transition-colors"
                onClick={() => setSelectedOption(null)}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Options
              </Button>
              {selectedOption === 'create' && <CreateCollection onBack={() => setSelectedOption(null)} />}
              {selectedOption === 'minter' && <CreateMinter onBack={() => setSelectedOption(null)} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}