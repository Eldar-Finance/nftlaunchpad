/* eslint-disable @typescript-eslint/no-unused-vars */


'use client'

import { useState } from 'react'
import { CreateCollection } from "./create-collection"
import { CreateMinter } from "./create-minter"
import { PlusCircle, Rocket, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NFTLaunchpadMain() {
  const [selectedOption, setSelectedOption] = useState<'create' | 'minter' | null>(null)

  return (
    <div className="min-h-screen bg-transparent text-white p-8">
      <div className="container mx-auto py-12 max-w-6xl">
        <div className="space-y-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-8">
            Your NFT Launchpad in 3..2..1
          </h1>
          
          {!selectedOption && (
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700">
                <CardContent className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl font-semibold flex items-center text-white">
                      <PlusCircle size={24} className="text-blue-400 mr-3" />
                      Create Collection
                    </CardTitle>
                  </CardHeader>
                  <p className="text-gray-400 mb-6 text-sm">
                    Start your NFT journey by creating a unique collection. Define Collection Name and Ticker before creating the minter smart contract.
                  </p>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
                    onClick={() => setSelectedOption('create')}
                  >
                    Create Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700">
                <CardContent className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl font-semibold flex items-center text-white">
                      <Rocket size={24} className="text-green-400 mr-3" />
                      Create Minter
                    </CardTitle>
                  </CardHeader>
                  <p className="text-gray-400 mb-6 text-sm">
                    Ready to launch? Create a minter smart contract for your existing collection and set your NFTs free in the market.
                  </p>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium transition-colors duration-200"
                    onClick={() => setSelectedOption('minter')}
                  >
                    Create Minter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700">
                <CardContent className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl font-semibold flex items-center text-white">
                      <Rocket size={24} className="text-yellow-400 mr-3" />
                      Manager Dashboard
                    </CardTitle>
                  </CardHeader>
                  <p className="text-gray-400 mb-6 text-sm">
                    Manage your issued collections, track performance, and make adjustments to your NFTs seamlessly.
                  </p>
                  <Button
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium transition-colors duration-200"
                    onClick={() => window.location.href = '/manager'} // Redirect to /manager
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedOption === 'create' && <CreateCollection onBack={() => setSelectedOption(null)} />}
          {selectedOption === 'minter' && <CreateMinter onBack={() => setSelectedOption(null)} />}
        </div>
      </div>
    </div>
  )
}