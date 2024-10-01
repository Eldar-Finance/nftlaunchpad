"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Tag, Image as ImageIcon, Hash, DollarSign, 
  LayoutGrid, Users, Pause, Play, RefreshCw,
  Fingerprint, CheckCircle, XCircle, Plus, Minus,
  ChevronUp, PlusCircle, ArrowRight
} from 'lucide-react'
import { useGetCollectionsInfo } from '@/hooks/useGetCollectionsInfo'
import { Address, TokenIdentifierValue } from '@multiversx/sdk-core/out'
import { newTransaction } from '@/helpers/sdkDappHelpers'
import { signAndSendTransactions } from '@/helpers/signAndSendTransactions'
import {
  useGetNetworkConfig,
  useGetAccountInfo
} from '@/hooks/sdkDappHooks'
import { GAS_PRICE, VERSION } from '@/localConstants'
import { useRouter } from 'next/navigation'
import BigNumber from 'bignumber.js'

interface Cost {
  token: TokenIdentifierValue
  amount: BigNumber
}

function toEvenLengthHex(value: number | string): string {
  const hex = value.toString(16);
  return hex.length % 2 ? '0' + hex : hex;
}

export function toEvenLength(value: string): string {
  return value.length % 2 ? '0' + value : value;
}

export default function CollectionManager({ collectionAddress }: { collectionAddress: string }) {
  const { collectionsInfo, loading } = useGetCollectionsInfo([collectionAddress])
  const { account } = useGetAccountInfo()
  const nonce = account.nonce
  const { network } = useGetNetworkConfig()
  const { address: connectedAddress } = useGetAccountInfo()
  const router = useRouter()

  const [phaseName, setPhaseName] = useState('')
  const [userMaxMints, setUserMaxMints] = useState('')
  const [maxMints, setMaxMints] = useState('')
  const [costs, setCosts] = useState<Cost[]>([])
  const [whitelist, setWhitelist] = useState('')
  const [showCreatePhase, setShowCreatePhase] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const yRange = useTransform(scrollYProgress, [0, 1], [0, 100])

  const [backgroundImage, setBackgroundImage] = useState<string>('')

  useEffect(() => {
    setBackgroundImage(`https://source.unsplash.com/random/1920x1080?nft,digital,art`)
  }, [])

  const handleAddCost = () => {
    setCosts([...costs, { token: new TokenIdentifierValue(''), amount: new BigNumber(0) }])
  }

  const handleRemoveCost = (index: number) => {
    const newCosts = costs.filter((_, i) => i !== index)
    setCosts(newCosts)
  }

  const handleCostChange = (index: number, field: keyof Cost, value: string) => {
    const newCosts = [...costs]
    if (field === 'token') {
      newCosts[index].token = new TokenIdentifierValue(value)
    } else if (field === 'amount') {
      newCosts[index].amount = new BigNumber(value)
    }
    setCosts(newCosts)
  }

  const handleCreatePhase = async (e: React.FormEvent) => {
    e.preventDefault()
    // ... (rest of the handleCreatePhase function remains unchanged)
  }

  const handleAction = async (action: string) => {
    // ... (rest of the handleAction function remains unchanged)
  }

  const handleSeeMintPage = () => {
    router.push(`/collections?select=${collectionAddress}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="text-6xl font-bold text-white"
        >
          Loading Collection...
        </motion.div>
      </div>
    )
  }

  if (collectionsInfo.length === 0) {
    return <div className="text-center text-red-500 bg-black p-8">No collection information found.</div>
  }

  const info = collectionsInfo[0]

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
      <div className="relative z-10 container mx-auto py-12 px-4">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-12 text-center text-white mix-blend-difference"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {info.collectionName} Manager
        </motion.h1>
        
        <motion.div 
          className="space-y-8"
          style={{ y: yRange }}
        >
          <Card className="bg-black/30 backdrop-blur-xl border-none overflow-hidden transition-all duration-300 ease-in-out">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard
                  icon={<Tag className="w-6 h-6 text-blue-400" />}
                  label="Collection Identifier"
                  value={info.collectionIdentifier}
                />
                <InfoCard
                  icon={<Hash className="w-6 h-6 text-pink-400" />}
                  label="Ticker"
                  value={info.ticker}
                />
                <InfoCard
                  icon={<DollarSign className="w-6 h-6 text-green-400" />}
                  label="Royalties"
                  value={`${info.royalties / 100}%`}
                />
                <InfoCard
                  icon={<LayoutGrid className="w-6 h-6 text-blue-400" />}
                  label="Minted / Total Supply"
                  value={`${info.totalNftsMinted || '-'} / ${info.maxSupply || '-'}`}
                />
                <InfoCard
                  icon={<Users className="w-6 h-6 text-yellow-400" />}
                  label="Max Per Mint"
                  value={info.maxAmountPerMint?.toString() || "-"}
                />
                <InfoCard
                  icon={<ImageIcon className="w-6 h-6 text-purple-400" />}
                  label="IPFS CID"
                  value={info.ipfsCid}
                />
                <InfoCard
                  icon={<Fingerprint className="w-6 h-6 text-red-400" />}
                  label="Single NFT Name"
                  value={info.singleNftName}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-xl border-none overflow-hidden transition-all duration-300 ease-in-out">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-white">Current Phase Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <InfoCard
                icon={<Tag className="w-6 h-6 text-blue-400" />}
                label="Phase Name"
                value={info.phaseName || "N/A"}
              />
              <InfoCard
                icon={<LayoutGrid className="w-6 h-6 text-green-400" />}
                label="Max Mints"
                value={info.maxMints?.toString() || "N/A"}
              />
              <InfoCard
                icon={<Hash className="w-6 h-6 text-yellow-400" />}
                label="Minted"
                value={info.minted?.toString() || "N/A"}
              />
              <InfoCard
                icon={<Users className="w-6 h-6 text-purple-400" />}
                label="Whitelist Only"
                value={info.isPhaseWlOnly ? "Yes" : "No"}
              />
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-xl border-none overflow-hidden transition-all duration-300 ease-in-out">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-semibold text-white">Create New Phase</CardTitle>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowCreatePhase(!showCreatePhase)}
                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
              >
                {showCreatePhase ? (
                  <>
                    <ChevronUp className="h-5 w-5 mr-2" />
                    Hide Form
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Create New Phase
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {showCreatePhase && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleCreatePhase}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="phaseName">Phase Name (max 50 characters)</Label>
                      <Input
                        id="phaseName"
                        value={phaseName}
                        onChange={(e) => setPhaseName(e.target.value.slice(0, 50))}
                        maxLength={50}
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="userMaxMints">User Max Mints</Label>
                        <Input
                          id="userMaxMints"
                          type="number"
                          min="1"
                          step="1"
                          value={userMaxMints}
                          onChange={(e) => setUserMaxMints(e.target.value)}
                          className="bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxMints">Max Mints</Label>
                        <Input
                          id="maxMints"
                          type="number"
                          min="1"
                          step="1"
                          value={maxMints}
                          onChange={(e) => setMaxMints(e.target.value)}
                          className="bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Costs</Label>
                      {costs.map((cost, index) => (
                        <div key={index} className="flex items-center space-x-2 mt-2">
                          <Input
                            placeholder="Token Identifier"
                            value={cost.token.toString()}
                            onChange={(e) => handleCostChange(index, 'token', e.target.value)}
                            className="bg-gray-700 text-white border-gray-600"
                          />
                          <Input
                            type="number"
                            step="0.000000000000000001"
                            placeholder="Amount"
                            value={cost.amount.toString()}
                            onChange={(e) => handleCostChange(index, 'amount', e.target.value)}
                            className="bg-gray-700 text-white border-gray-600"
                          />
                          <Button type="button" onClick={() => handleRemoveCost(index)} className="bg-red-600 hover:bg-red-700">
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" onClick={handleAddCost} className="mt-2 bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-2" /> Add Cost
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="whitelist">Whitelist (one address per line)</Label>
                      <Textarea
                        id="whitelist"
                        value={whitelist}
                        onChange={(e) => setWhitelist(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="erd1..."
                        rows={5}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Create Phase
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-xl border-none overflow-hidden transition-all duration-300 ease-in-out">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-white">Minting Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {info.mintCosts.map((cost, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
                    <span className="text-gray-300">{cost.tokenIdentifier}</span>
                    <span className="text-white font-medium">{cost.amount / 1e18}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-xl border-none overflow-hidden transition-all duration-300 ease-in-out">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-white">Collection Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="w-full md:w-1/2">
                  <StatusItem
                    label="Minting Enabled"
                    value={info.isMintingEnabled}
                    icon={info.isMintingEnabled ? <CheckCircle className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-red-400" />}
                  />
                </div>
                <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                  <ActionButton
                    icon={info.isMintingEnabled ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    label={info.isMintingEnabled ? "Disable Minting" : "Enable Minting"}
                    onClick={() => handleAction(info.isMintingEnabled ? 'disableMinting' : 'enableMinting')}
                    tooltipText={info.isMintingEnabled ? "Disable minting for this collection" : "Enable minting for this collection"}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <ActionButton
              icon={<DollarSign className="w-5 h-5" />}
              label="Claim Royalties"
              onClick={() => handleAction('claimRoyalties')}
              tooltipText="Claim accumulated royalties for this collection"
            />
            <ActionButton
              icon={<ImageIcon className="w-5 h-5" />}
              label="See Mint Page"
              onClick={handleSeeMintPage}
              tooltipText="View the minting page for this collection"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 backdrop-blur-sm">
    <div className="flex items-center space-x-3 mb-2">
      {icon}
      <Label className="text-sm font-medium text-gray-400">{label}</Label>
    </div>
    <p className="text-white text-lg font-semibold break-all">{value}</p>
  </div>
)

const StatusItem = ({ label, value, icon }: { label: string; value: boolean; icon: React.ReactNode }) => (
  <div className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg backdrop-blur-sm">
    <span className="text-gray-300">{label}</span>
    <div className="flex items-center">
      <span className="text-white font-medium mr-2">{value ? 'Yes' : 'No'}</span>
      {icon}
    </div>
  </div>
)

const ActionButton = ({ icon, label, onClick, tooltipText }: { icon: React.ReactNode; label: string; onClick: () => void; tooltipText: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          onClick={onClick}
          className="bg-gray-800/50 hover:bg-gray-700/50 text-white border-gray-700/50 backdrop-blur-sm transition-all duration-300"
        >
          {icon}
          <span className="ml-2">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-gray-800/90 text-white border-gray-700/50 backdrop-blur-sm">
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)