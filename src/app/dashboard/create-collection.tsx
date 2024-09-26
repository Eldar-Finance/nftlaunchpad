/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import { useState } from 'react'
import { ArrowLeft, Info, Tag, Palette, Coins, CreditCard, LayoutGrid, Plus, Trash2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { signAndSendTransactions } from '@/helpers/signAndSendTransactions';
import {
  useGetNetworkConfig,
  useGetAccountInfo
} from '@/hooks/sdkDappHooks';
import { newTransaction } from '@/helpers/sdkDappHelpers';
import Image from 'next/image';

import { Address } from '@multiversx/sdk-core';
import { GAS_PRICE, VERSION } from '@/localConstants';

const validateIpfsCid = async (cid: string) => {
  try {
    console.log(`Validating CID: ${cid}`);
    const isValid = /^Qm[a-zA-Z0-9]{44}$/.test(cid);
    console.log(`CID: ${cid}, Valid: ${isValid}`);
    return isValid;
  } catch (error) {
    console.error('Error validating IPFS CID:', error);
    return false;
  }
};

const stringToHex = (str: string) => {
    return Buffer.from(str, 'utf8').toString('hex');
};

const ensureEvenHex = (hex: string) => hex.length % 2 === 0 ? hex : '0' + hex; // Prepend '0' if hex length is odd

interface CreateCollectionProps {
  onBack: () => void;
}

export function CreateCollection({ onBack }: CreateCollectionProps) {
  const [formData, setFormData] = useState({
    collectionName: '',
    nftName: '', // New field for NFT Name
    ticker: '',
    description: '',
    royalties: '',
    maxSupply: '',
    paymentTokens: [{ identifier: '', amount: '' }],
    ipfsCid: '',
    tags: '' // New field for Tags
  })
  
  const { network } = useGetNetworkConfig();
  const { address: connectedAddress } = useGetAccountInfo();
  const { account } = useGetAccountInfo();
  const nonce = account.nonce;


  const [ipfsValid, setIpfsValid] = useState(false)
  const [imageCount, setImageCount] = useState(0);
  const [jsonCount, setJsonCount] = useState(0);
  const [ipfsObjectCount, setIpfsObjectCount] = useState(0);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [imageType, setImageType] = useState(''); // State for image type

  const handleInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'ipfsCid') {
      console.log(`Inputting CID: ${value}`);
      const isValid = await validateIpfsCid(value);
      setIpfsValid(isValid);
      if (isValid) {
        console.log(`Valid CID: ${value}`);
        fetchIpfsData(value);
      } else {
        console.log(`Invalid CID: ${value}`);
        setIpfsObjectCount(0);
      }
    }
  }

  const fetchIpfsData = async (cid: string) => {
    try {
      const imageUrls = [
        `https://ipfs.io/ipfs/${cid}/2.png`,
        `https://ipfs.io/ipfs/${cid}/2.jpg`
      ];
      let thumbnailUrl = '';
      let imageType = '';

      for (const url of imageUrls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            thumbnailUrl = url; // Set the thumbnail URL if the image exists
            imageType = url.endsWith('.png') ? 'PNG' : 'JPEG'; // Determine the image type
            console.log(`Thumbnail URL found: ${thumbnailUrl}`); // Debugging line
            break; // Exit the loop if an image is found
          }
        } catch (error) {
          console.error(`Error fetching ${url}:`, error);
        }
      }

      // Set the thumbnail URL and image type in the state
      setThumbnail(thumbnailUrl);
      setImageType(imageType);

      const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
      const text = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (text.includes('<!DOCTYPE html>')) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = doc.querySelectorAll('a[href]');

        const totalFiles = links.length;
        console.log(`Total number of files in the directory: ${totalFiles}`);

        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
        const jsonExtension = '.json';

        let imageCount = 0;
        let jsonCount = 0;

        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href) {
            if (imageExtensions.some(ext => href.endsWith(ext))) {
              imageCount++;
            }
            if (href.endsWith(jsonExtension)) {
              jsonCount++;
            }
          }
        });

        console.log(`Number of image files: ${imageCount}`);
        console.log(`Number of JSON files: ${jsonCount}`);

        setIpfsObjectCount(totalFiles);
        setImageCount(imageCount);
        setJsonCount(jsonCount);
      } else {
        const data = JSON.parse(text);
        console.log('Fetched IPFS Data:', data);
        const numberOfFiles = data.length;
        setIpfsObjectCount(numberOfFiles);
      }
    } catch (error) {
      console.error('Error fetching IPFS data:', error);
      setIpfsObjectCount(0);
    }
  }

  const handlePaymentTokenChange = (index: number, field: 'identifier' | 'amount', value: string) => {
    const newPaymentTokens = [...formData.paymentTokens]
    newPaymentTokens[index][field] = value
    setFormData(prev => ({ ...prev, paymentTokens: newPaymentTokens }))
  }

  const addPaymentToken = () => {
    setFormData(prev => ({
      ...prev,
      paymentTokens: [...prev.paymentTokens, { identifier: '', amount: '' }]
    }))
  }

  const removePaymentToken = (index: number) => {
    const newPaymentTokens = formData.paymentTokens.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, paymentTokens: newPaymentTokens }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Collection created:', formData)
    // Here you would typically send the data to your backend
  }

  const handleCreateCollection = async () => {
    const costs = formData.paymentTokens.map(token => {
        const identifierHex = stringToHex(token.identifier);
        const amountInHex = (parseFloat(token.amount) * 1e18).toString(16);
        const amountHex = ensureEvenHex(amountInHex);
        return `${identifierHex}@${amountHex}`;
    });

    // Ensure all other hex values are also even
    const name = ensureEvenHex(stringToHex(formData.collectionName));
    const nftName = ensureEvenHex(stringToHex(formData.nftName)); // New: NFT Name
    const ticker = ensureEvenHex(stringToHex(formData.ticker));
    const description = ensureEvenHex(stringToHex(formData.description));
    const royalties = ensureEvenHex((parseFloat(formData.royalties) * 100).toString(16));
    const maxSupply = ensureEvenHex((parseInt(formData.maxSupply)).toString(16));
    const ipfsCid = ensureEvenHex(stringToHex(formData.ipfsCid));
    const fileEnding = ensureEvenHex(stringToHex(imageType.toLowerCase()));
    const hasJsonMetadata = ensureEvenHex('1');
    const tags = ensureEvenHex(stringToHex(formData.tags)); // New: Tags

    // Construct hexArguments
    const hexArguments = `createCollectionMinter@${name}@${nftName}@${ticker}@${description}@${royalties}@${maxSupply}@${ipfsCid}@${fileEnding}@${hasJsonMetadata}@${tags}@${costs.join('@')}`;

    const createCollectionTransaction = newTransaction({
        value: 0,
        data: hexArguments,
        receiver: "erd1qqqqqqqqqqqqqpgqq0hej0p0smnn8ddpshaa903778nnh6pwu7zstg8c0x", // Fixed receiver address
        gasLimit: 20000000,
        gasPrice: GAS_PRICE,
        chainID: network.chainId,
        nonce: nonce,
        sender: new Address(connectedAddress),
        version: VERSION,
        arguments: []
    });

    try {
        const sessionId = await signAndSendTransactions({
            transactions: [createCollectionTransaction],
            callbackRoute: '',
            transactionsDisplayInfo: {
                processingMessage: 'Creating collection...',
                errorMessage: 'Collection creation failed',
                successMessage: 'Collection created successfully'
            }
        });

        console.log('Collection created, session ID:', sessionId);
    } catch (error) {
        console.error('Collection creation failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-b from-gray-900 to-black rounded-lg shadow-xl border border-gray-800">
      <CardHeader className="pb-4 pt-6">
        <CardTitle className="text-2xl font-bold text-center text-white">
          Create Your NFT Collection
        </CardTitle>
        <p className="text-gray-400 text-center text-sm">Define your collection parameters</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="collectionName" className="flex items-center text-sm font-medium text-gray-300">
                  <Palette className="w-4 h-4 mr-2 text-blue-400" />
                  Collection Name
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 ml-2 cursor-help text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-gray-800 text-white p-2 rounded-md text-xs">
                        <p>Only letters, either lowercase or uppercase, without spaces. Maximum of 50 characters.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="collectionName"
                  name="collectionName"
                  value={formData.collectionName}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                  pattern="[a-zA-Z]+"
                  title="Only letters, either lowercase or uppercase, without spaces. Maximum of 50 characters."
                  className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., CryptoArtCollection"
                />
              </div>
              <div>
                <Label htmlFor="nftName" className="flex items-center text-sm font-medium text-gray-300">
                  <Tag className="w-4 h-4 mr-2 text-green-400" />
                  NFT Name
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 ml-2 cursor-help text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-gray-800 text-white p-2 rounded-md text-xs">
                        <p>Letters, spaces, and symbols allowed. Maximum of 50 characters.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="nftName"
                  name="nftName"
                  value={formData.nftName}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                  className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Crypto Art #"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="ticker" className="flex items-center text-sm font-medium text-gray-300">
                <Tag className="w-4 h-4 mr-2 text-green-400" />
                Ticker
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 ml-2 cursor-help text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-gray-800 text-white p-2 rounded-md text-xs">
                      <p>Only uppercase letters. Maximum of 10 characters.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="ticker"
                name="ticker"
                value={formData.ticker}
                onChange={handleInputChange}
                required
                maxLength={10}
                pattern="[A-Z]+"
                title="Only uppercase letters. Maximum of 10 characters."
                className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., CRYPART"
              />
            </div>
            <div>
              <Label htmlFor="description" className="flex items-center text-sm font-medium text-gray-300">
                Description
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 ml-2 cursor-help text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-gray-800 text-white p-2 rounded-md text-xs">
                      <p>A general description that will appear for the collection.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your NFT collection..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="royalties" className="flex items-center text-sm font-medium text-gray-300">
                  <CreditCard className="w-4 h-4 mr-2 text-yellow-400" />
                  Royalties (%)
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 ml-2 cursor-help text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-gray-800 text-white p-2 rounded-md text-xs">
                        <p>A number between 0 and 100 with up to 2 decimal points.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="royalties"
                  name="royalties"
                  type="number"
                  value={formData.royalties}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="e.g., 2.5"
                />
              </div>
              <div>
                <Label htmlFor="maxSupply" className="flex items-center text-sm font-medium text-gray-300">
                  <LayoutGrid className="w-4 h-4 mr-2 text-purple-400" />
                  Maximum Supply
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 ml-2 cursor-help text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-gray-800 text-white p-2 rounded-md text-xs">
                        <p>The total number of NFTs that can be minted.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="maxSupply"
                  name="maxSupply"
                  type="number"
                  value={formData.maxSupply}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., 10000"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="ipfsCid" className="flex items-center text-sm font-medium text-gray-300">
                IPFS CID
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 ml-2 cursor-help text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-gray-800 text-white p-2 rounded-md text-xs">
                      <p>The CID of the folder containing all the files for the NFTs.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="ipfsCid"
                name="ipfsCid"
                value={formData.ipfsCid}
                onChange={handleInputChange}
                required
                className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Qm..."
              />
              {ipfsValid ? (
                <div className="flex items-center text-green-500 mt-2 text-xs">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Valid IPFS CID. {imageCount/2} images and {jsonCount/2} JSON files.</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500 mt-2 text-xs">
                  <XCircle className="w-4 h-4 mr-2" />
                  <span>Invalid IPFS CID.</span>
                </div>
              )}
              {thumbnail && (
                <div className="mt-4">
                  <Image src={thumbnail} alt="Thumbnail" layout="responsive" width={500} height={300} />
                  <p className="text-sm text-gray-500">Image Type: {imageType}</p> {/* Display image type */}
                </div>
              )}
            </div>
            <div>
              <Label className="flex items-center text-sm font-medium text-gray-300">
                <Coins className="w-4 h-4 mr-2 text-blue-400" />
                Payment Tokens and Prices
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 ml-2 cursor-help text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-gray-800 text-white p-2 rounded-md text-xs">
                      <p>Specify the token identifiers and amounts per NFT.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              {formData.paymentTokens.map((token, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    placeholder="Token Identifier"
                    value={token.identifier}
                    onChange={(e) => handlePaymentTokenChange(index, 'identifier', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Input
                    placeholder="Amount per NFT"
                    value={token.amount}
                    onChange={(e) => handlePaymentTokenChange(index, 'amount', e.target.value)}
                    type="number"
                    min="0"
                    step="0.000001"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {index > 0 && (
                    <Button onClick={() => removePaymentToken(index)} variant="destructive" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button onClick={addPaymentToken} variant="outline" className="mt-2 text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-gray-900">
                <Plus className="w-4 h-4 mr-2" /> Add Token
              </Button>
            </div>
            <div>
              <Label htmlFor="tags" className="flex items-center text-sm font-medium text-gray-300">
                <Tag className="w-4 h-4 mr-2 text-orange-400" />
                Tags
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 ml-2 cursor-help text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-gray-800 text-white p-2 rounded-md text-xs">
                      <p>Up to 5 tags separated by semicolons (;)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., art;crypto;collectible;rare;unique"
              />
            </div>
          </div>
          <div className="flex justify-between pt-6">
            <Button onClick={onBack} variant="outline" className="text-gray-400 border-gray-600 hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            onClick={handleCreateCollection}>
              Create Collection
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-center w-full text-gray-500 mt-4">
          Note: You pay nothing to create your collection. A fee will apply to enable the minter.
        </p>
      </CardFooter>
    </Card>
  )
}