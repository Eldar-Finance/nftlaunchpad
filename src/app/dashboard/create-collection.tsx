/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Info, Tag, Palette, Coins, CreditCard, LayoutGrid, Plus, Trash2, CheckCircle, XCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
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
import { Slider } from "@/components/ui/slider"

import { Address } from '@multiversx/sdk-core';
import { useGetCollectionCreationFee } from '@/hooks/useGetMinterFee';
import { GAS_PRICE, VERSION } from '@/localConstants';

interface Attribute {
  trait_type: string;
  value: string;
}

interface Metadata {
  attributes: Attribute[];
  // Add other properties if needed
}

const validateIpfsCid = async (cid: string) => {
  try {
    // console.log(`Validating CID: ${cid}`);
    const isValid = /^Qm[a-zA-Z0-9]{44}$/.test(cid);
    // console.log(`CID: ${cid}, Valid: ${isValid}`);
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
    nftName: '',
    ticker: '',
    description: '',
    royalties: '',
    maxSupply: '',
    ipfsCid: '',
    tags: ''
  })

  const collectionCreationFee = useGetCollectionCreationFee();
  
  const { network } = useGetNetworkConfig();
  const { address: connectedAddress } = useGetAccountInfo();
  const { account } = useGetAccountInfo();
  const nonce = account.nonce;


  const [ipfsValid, setIpfsValid] = useState(false)
  const [imageCount, setImageCount] = useState(0);
  const [jsonCount, setJsonCount] = useState(0);
  const [ipfsObjectCount, setIpfsObjectCount] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageType, setImageType] = useState(''); // State for image type
  const [royaltiesError, setRoyaltiesError] = useState('');
  const [metadataList, setMetadataList] = useState<Metadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'royalties') {
      const royaltiesValue = parseFloat(value);
      if (isNaN(royaltiesValue) || royaltiesValue < 0 || royaltiesValue > 100 || !(/^\d{1,3}(\.\d{0,2})?$/.test(value))) {
        setRoyaltiesError('Royalties must be a number between 0 and 100 with up to 2 decimal places.');
      } else {
        setRoyaltiesError('');
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'ipfsCid') {
      // console.log(`Inputting CID: ${value}`);
      const isValid = await validateIpfsCid(value);
      setIpfsValid(isValid);
      if (isValid) {
        // console.log(`Valid CID: ${value}`);
        fetchIpfsData(value);
      } else {
        // console.log(`Invalid CID: ${value}`);
        setIpfsObjectCount(0);
      }
    }
  }

  const handleRoyaltiesChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, royalties: value[0].toString() }));
    setRoyaltiesError('');
  };

  const fetchIpfsData = async (cid: string) => {
    setIsLoading(true);
    try {
      const imageNumbers = [2, 5, 10];
      const imageUrls: string[] = [];
      const metadataList: Metadata[] = [];

      for (const number of imageNumbers) {
        const pngUrl = `https://ipfs.io/ipfs/${cid}/${number}.png`;
        const jpgUrl = `https://ipfs.io/ipfs/${cid}/${number}.jpg`;
        const jsonUrl = `https://ipfs.io/ipfs/${cid}/${number}.json`;

        try {
          let imageUrl = '';
          let response = await fetch(pngUrl);
          if (response.ok) {
            imageUrl = pngUrl;
          } else {
            response = await fetch(jpgUrl);
            if (response.ok) {
              imageUrl = jpgUrl;
            }
          }

          if (imageUrl) {
            imageUrls.push(imageUrl);
            
            // Fetch and parse JSON metadata
            const metadataResponse = await fetch(jsonUrl);
            if (metadataResponse.ok) {
              const metadata = await metadataResponse.json();
              metadataList.push(metadata);
            }
          }
        } catch (error) {
          console.error(`Error fetching image or metadata ${number}:`, error);
        }
      }

      setThumbnails(imageUrls);
      setMetadataList(metadataList);
      setImageType(imageUrls[0]?.endsWith('.png') ? 'PNG' : 'JPEG');

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
        // console.log(`Total number of files in the directory: ${totalFiles}`);

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

        // console.log(`Number of image files: ${imageCount}`);
        // console.log(`Number of JSON files: ${jsonCount}`);

        setIpfsObjectCount(totalFiles);
        setImageCount(imageCount);
        setJsonCount(jsonCount);
      } else {
        const data = JSON.parse(text);
        // console.log('Fetched IPFS Data:', data);
        const numberOfFiles = data.length;
        setIpfsObjectCount(numberOfFiles);
      }
    } catch (error) {
      console.error('Error fetching IPFS data:', error);
      setIpfsObjectCount(0);
    } finally {
      setIsLoading(false);
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % thumbnails.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + thumbnails.length) % thumbnails.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (royaltiesError) {
      console.error('Invalid royalties value');
      return;
    }
    // console.log('Collection created:', formData)
    // Here you would typically send the data to your backend
  }

  const handleCreateCollection = async () => {
    if (royaltiesError) {
      console.error('Invalid royalties value');
      return;
    }

    // Ensure all hex values are even
    const name = ensureEvenHex(stringToHex(formData.collectionName));
    const nftName = ensureEvenHex(stringToHex(formData.nftName));
    const ticker = ensureEvenHex(stringToHex(formData.ticker));
    const description = ensureEvenHex(stringToHex(formData.description));
    const royalties = ensureEvenHex((parseFloat(formData.royalties) * 100).toString(16));
    const maxSupply = ensureEvenHex((parseInt(formData.maxSupply)).toString(16));
    const ipfsCid = ensureEvenHex(stringToHex(formData.ipfsCid));
    const fileEnding = ensureEvenHex(stringToHex(imageType.toLowerCase()));
    const hasJsonMetadata = ensureEvenHex('1');
    const tags = ensureEvenHex(stringToHex(formData.tags));
    const theFee = collectionCreationFee;
    // Construct hexArguments without costs
    const hexArguments = `createCollectionMinter@${name}@${nftName}@${ticker}@${description}@${royalties}@${maxSupply}@${ipfsCid}@${fileEnding}@${hasJsonMetadata}@${tags}`;

    const createCollectionTransaction = newTransaction({
        value: theFee,
        data: hexArguments,
        receiver: "erd1qqqqqqqqqqqqqpgq0vct9qkqcnr0vgj8hsvdmufzxy9nevppu7zs8qzs0r",
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

        // console.log('Collection created, session ID:', sessionId);
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
                        <p>Set the royalties percentage for secondary sales.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="flex items-center space-x-4 mt-2">
                  <Slider
                    style={{ background: 'blue-500' }}
                    id="royalties"
                    min={0}
                    max={100}
                    step={1}
                    value={[parseFloat(formData.royalties) || 0]}
                    onValueChange={handleRoyaltiesChange}
                    className="flex-grow custom-slider bg-blue-500" 
                  />
                  <span className="text-white font-medium w-12 text-right">{formData.royalties}%</span>
                </div>
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
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-white mb-2">Preview Collection</h2>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64 bg-gray-800 rounded-lg">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                ) : thumbnails.length > 0 ? (
                  <div>
                    <div className="flex bg-gray-800 rounded-lg overflow-hidden">
                      <div className="w-1/2 relative h-64">
                        <Image 
                          src={thumbnails[currentImageIndex]} 
                          alt={`Thumbnail ${currentImageIndex + 1}`} 
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                      <div className="w-1/2 p-2 overflow-y-auto max-h-64">
                        <h3 className="text-sm font-semibold text-white mb-1">Attributes</h3>
                        <div className="grid grid-cols-2 gap-1">
                          {metadataList[currentImageIndex]?.attributes.map((attr: Attribute, attrIndex: number) => (
                            <div key={attrIndex} className="bg-gray-700 rounded p-1 text-xs">
                              <p className="font-medium text-gray-300 truncate" title={attr.trait_type}>{attr.trait_type}</p>
                              <p className="text-white break-words">{attr.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <Button onClick={prevImage} variant="outline" size="sm" className="text-gray-400 border-gray-600 hover:bg-gray-800 p-1">
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <p className="text-xs text-gray-500">
                        {currentImageIndex + 1} / {thumbnails.length} | {imageType}
                      </p>
                      <Button onClick={nextImage} variant="outline" size="sm" className="text-gray-400 border-gray-600 hover:bg-gray-800 p-1">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
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
                      <p>Up to 5 tags separated by commas (,)</p>
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
                placeholder="e.g., art,crypto,collectible,rare,unique"
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