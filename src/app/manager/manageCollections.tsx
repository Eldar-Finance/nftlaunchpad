'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { 
  Tag, Image as ImageIcon, Hash, DollarSign, 
  LayoutGrid, Users, Pause, Play, Lock, Unlock, RefreshCw,
 Fingerprint, CheckCircle, XCircle
} from 'lucide-react'
import { useGetCollectionsInfo } from '@/hooks/useGetCollectionsInfo'

export default function CollectionManager({ collectionAddress }: { collectionAddress: string }) {
  const { collectionsInfo, loading } = useGetCollectionsInfo([collectionAddress])

  const handleAction = async (action: string) => {
    console.log(`Performing action: ${action} on collection: ${collectionAddress}`)
    // Here you would typically call your API to perform the action
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-950">
      <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
    </div>
  }

  if (collectionsInfo.length === 0) {
    return <div className="text-center text-red-500 bg-gray-950 p-8">No collection information found.</div>
  }

  const info = collectionsInfo[0] // We're only managing one collection at a time

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-8 ">
      <Card className="w-full max-w-6xl mx-auto bg-gray-900 border-gray-800 shadow-xl">
        <CardHeader className="border-b border-gray-800">
          <CardTitle className="text-3xl font-bold text-center text-white">
            {info.collectionName} Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              icon={<Tag className="w-5 h-5 text-blue-400" />}
              label="Collection Identifier"
              value={info.collectionIdentifier}
            />
            <InfoCard
              icon={<Hash className="w-5 h-5 text-pink-400" />}
              label="Ticker"
              value={info.ticker}
            />
            <InfoCard
              icon={<DollarSign className="w-5 h-5 text-green-400" />}
              label="Royalties"
              value={`${info.royalties / 100}%`}
            />
            <InfoCard
              icon={<LayoutGrid className="w-5 h-5 text-blue-400" />}
              label="Minted / Total Supply"
              value={`${info.totalNftsMinted || '-'} / ${info.maxSupply || '-'}`}
            />
            <InfoCard
              icon={<Users className="w-5 h-5 text-yellow-400" />}
              label="Max Per Mint"
              value={info.maxAmountPerMint.toString()}
            />
            <InfoCard
              icon={<ImageIcon className="w-5 h-5 text-purple-400" />}
              label="IPFS CID"
              value={info.ipfsCid}
            />
            <InfoCard
              icon={<Fingerprint className="w-5 h-5 text-red-400" />}
              label="Single NFT Name"
              value={info.singleNftName}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <Card className="bg-gray-800 border-gray-700 flex-1">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{info.description}</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 flex-1">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {info.tags.split(';').map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Minting Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {info.mintCosts.map((cost, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                    <span className="text-gray-300">{cost.tokenIdentifier}</span>
                    <span className="text-white font-medium">{cost.amount / 1e18}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Collection Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <StatusItem
                  label="Minting Enabled"
                  value={info.isMintingEnabled}
                  icon={info.isMintingEnabled ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <ActionButton
              icon={info.isMintingEnabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              label={info.isMintingEnabled ? "Pause Minting" : "Enable Minting"}
              onClick={() => handleAction(info.isMintingEnabled ? 'pauseMinting' : 'enableMinting')}
              tooltipText={info.isMintingEnabled ? "Pause minting for this collection" : "Enable minting for this collection"}
            />
            <ActionButton
              icon={<DollarSign className="w-4 h-4" />}
              label="Claim Royalties"
              onClick={() => handleAction('claimRoyalties')}
              tooltipText="Claim accumulated royalties for this collection"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
    <div className="flex items-center space-x-3 mb-2">
      {icon}
      <Label className="text-sm font-medium text-gray-400">{label}</Label>
    </div>
    <p className="text-white text-lg font-semibold break-all">{value}</p>
  </div>
)

const StatusItem = ({ label, value, icon }: { label: string; value: boolean; icon: React.ReactNode }) => (
  <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
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
          className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
        >
          {icon}
          <span className="ml-2">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-gray-800 text-white border-gray-700">
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)