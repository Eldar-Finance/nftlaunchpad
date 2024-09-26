'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Palette, Code, Rocket, CreditCard, Users, Image as ImageIcon, DollarSign } from 'lucide-react'

const float = {
  y: [0, -20, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

const glow = {
  boxShadow: [
    "0 0 5px #4FD1C5",
    "0 0 20px #4FD1C5, 0 0 30px #4FD1C5",
    "0 0 5px #4FD1C5"
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

const features = [
  { title: 'Create Collections', description: 'Launch your unique NFT collections with ease', icon: Palette },
  { title: 'Smart Contracts', description: 'Generate secure and customizable smart contracts', icon: Code },
  { title: 'Minting Platform', description: 'Seamless minting experience for your community', icon: Rocket },
  { title: 'Royalties Management', description: 'Set and manage royalties for your creations', icon: CreditCard },
]

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-transparent text-white overflow-x-hidden">
      <div className="container mx-auto px-4 pt-20">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-cyan-400 to-pink-600 bg-clip-text text-transparent">
              Qx NFT Launchpad
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Empower your creativity with our cutting-edge NFT creation and management platform.
              Launch, mint, and thrive in the digital art revolution.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
              onClick={() => setIsModalOpen(true)}
            >
              Get Started 🚀
            </Button>
          </div>
          <div className="relative w-full md:w-[500px] h-[300px] md:h-[500px] mt-10 md:mt-0">
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={float}
            >
              <Image
                src=""
                alt="NFT Showcase"
                width={500}
                height={500}
                className="rounded-full shadow-[0_0_20px_rgba(0,255,255,0.5)]"
              />
            </motion.div>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-pink-600 opacity-60"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 50 + 20}px`,
                  height: `${Math.random() * 50 + 20}px`,
                }}
                animate={glow}
              />
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Unleash Your NFT Potential</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-gray-700 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-cyan-400 flex items-center">
                    <feature.icon className="w-6 h-6 mr-2" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-gray-700 mb-20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-white">Platform Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around flex-wrap">
              <div className="text-center">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                <p className="text-4xl font-bold text-cyan-400">10,000+</p>
                <p className="text-lg text-gray-300">NFTs Created</p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                <p className="text-4xl font-bold text-pink-500">1,000+</p>
                <p className="text-lg text-gray-300">Artists</p>
              </div>
              <div className="text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-4xl font-bold text-yellow-500">5M+</p>
                <p className="text-lg text-gray-300">Total Volume</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-8 text-center mb-20">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Launch Your NFT Collection?</h2>
          <p className="text-lg mb-6 text-white">
            Join the NFT revolution today and turn your digital creations into valuable assets.
          </p>
          <Button
            size="lg"
            className="bg-white text-cyan-600 hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
            onClick={() => setIsModalOpen(true)}
          >
            Start Creating
          </Button>
        </div>
      </div>

      {/* Get Started Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Get Started with NFT Launchpad</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">1. Connect your wallet</h3>
              <p className="text-gray-300">Connect your wallet to access all features.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">2. Design Your Collection</h3>
              <p className="text-gray-300">Upload your artwork into IPFS along with the collection metadata.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">3. Create the collection</h3>
              <p className="text-gray-300">Customize name and ticker for your collection.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">4. Generate the minter and Launch</h3>
              <p className="text-gray-300">Set your minting details and share with your community.</p>
            </div>
            <Button asChild className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
              <Link href="/dashboard">Start now</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}