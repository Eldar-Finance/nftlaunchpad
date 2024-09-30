/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Environment, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Palette, Code, Rocket, CreditCard } from 'lucide-react'

const features = [
  { title: 'Create', description: 'Launch unique NFT collections', icon: Palette },
  { title: 'Secure', description: 'Generate smart contracts', icon: Code },
  { title: 'Mint', description: 'Seamless minting experience', icon: Rocket },
  { title: 'Manage', description: 'Set and track royalties', icon: CreditCard },
]

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const textY = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "50%", "100%"])

  useEffect(() => {
    // Any DOM manipulations or event listener additions should go here
    // For example:
    // const container = containerRef.current
    // if (container) {
    //   // Add event listeners or perform DOM manipulations
    // }

    // Cleanup function
    return () => {
      // Remove event listeners or cleanup DOM manipulations
    }
  }, []) // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return (
    <div ref={containerRef} className="min-h-screen text-white overflow-hidden">
      {/* Dynamic Background */}
   

      {/* Hero Section with 3D NFT Sculpture */}
      <section className="relative min-h-screen overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <NFTSculpture />
            <Environment preset="night" />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
          </Canvas>
        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
          <div className="container mx-auto px-4 text-center" style={{ pointerEvents: 'auto' }}>
            <h1 className="text-7xl md:text-9xl font-extrabold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              QuantumX Launcher
            </h1>
            <p className="text-2xl md:text-4xl text-gray-400 mb-8" style={{ textShadow: '0 0 5px rgba(0,0,0,0.5)' }}>
              Next-Gen NFT Collection Launcher
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-lg px-8 py-4"
              onClick={() => setIsModalOpen(true)}
            >
              Launch NFT Collection
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section with Minimalist Design */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with 3D Holographic Display */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Platform Stats</h2>
          <div className="h-[400px] w-full">
            <Canvas>
              <ambientLight intensity={0.2} />
              <pointLight position={[10, 10, 10]} intensity={0.8} />
              <HolographicStats />
              <Environment preset="night" />
              <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
            </Canvas>
          </div>
        </div>
      </section>

      {/* CTA Section with Minimalist Design */}
      <section className="relative py-20">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="bg-gradient-to-r from-cyan-900 to-blue-900 rounded-3xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-8 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Launch?</h2>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
                Join the NFT revolution and turn your creations into digital assets.
              </p>
              <Button
                size="lg"
                className="bg-white text-blue-900 hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-lg px-8 py-4 font-bold"
                onClick={() => setIsModalOpen(true)}
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Get Started Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="bg-gray-900 text-white border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Get Started with QuantumX</DialogTitle>
              </DialogHeader>
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <StepItem number={1} title="Connect Wallet" description="Access all features securely." />
                <StepItem number={2} title="Create Collection" description="Design your unique NFT collection." />
                <StepItem number={3} title="Set Parameters" description="Customize name, ticker, and royalties." />
                <StepItem number={4} title="Launch" description="Mint and share with your community." />
                <Button asChild className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black font-bold py-6 text-lg">
                  <Link href="/dashboard">Launch Collection</Link>
                </Button>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}

function NFTSculpture() {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    mesh.current!.rotation.x = Math.sin(time / 4)
    mesh.current!.rotation.y = Math.sin(time / 2)
    mesh.current!.position.y = Math.sin(time / 1.5) / 2
  })

  return (
    <mesh ref={mesh}>
      <torusKnotGeometry args={[1, 0.3, 100, 16]} />
      <MeshTransmissionMaterial
        backside
        samples={16}
        thickness={0.5}
        chromaticAberration={1}
        anisotropy={0.3}
        distortion={0.5}
        distortionScale={0.5}
        temporalDistortion={0.1}
        iridescence={1}
        iridescenceIOR={1}
        iridescenceThicknessRange={[0, 1400]}
      />
    </mesh>
  )
}

function FeatureCard({ feature, index }: { feature: any, index: any }) {
  return (
    <motion.div
      className="relative bg-gray-900 bg-opacity-50 backdrop-blur-lg border border-gray-800 rounded-xl p-6 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <feature.icon className="w-8 h-8 mb-4 text-cyan-400" />
      <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
      <p className="text-gray-400 text-sm">{feature.description}</p>
    </motion.div>
  )
}

function HolographicStats() {
  const stats = [
    { label: 'NFTs', value: 10000, color: '#00FFFF' },
    { label: 'Artists', value: 1000, color: '#FF00FF' },
    { label: 'Volume', value: 5000, color: '#FFFF00' },
  ]

  return (
    <group scale={[1.5, 1.5, 1.5]} position={[0, -1, -2]}>
      {stats.map((stat, index) => (
        <group key={index} position={[index * 1.5 - 1.5, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.4, 0.4, stat.value / 200000, 32]} />
            <MeshTransmissionMaterial
              backside
              samples={16}
              thickness={0.5}
              chromaticAberration={1}
              anisotropy={0.3}
              distortion={0.5}
              distortionScale={0.5}
              temporalDistortion={0.1}
              color={stat.color}
              attenuationDistance={0.5}
              attenuationColor="#ffffff"
            />
          </mesh>
          <Text
            position={[0, stat.value / 400000 + 0.3, 0]}
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="bottom"
          >
            {stat.label}
          </Text>
          <Text
            position={[0, stat.value / 400000 + 0.5, 0]}
            fontSize={0.12}
            color="white"
            anchorX="center"
            anchorY="bottom"
          >
            {stat.value.toLocaleString()}
          </Text>
        </group>
      ))}
    </group>
  )
}

const StepItem = ({ number, title, description }: { number: any, title: any, description: any }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-4 mt-1">
      <span className="text-black font-bold text-sm">{number}</span>
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-1 text-cyan-400">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </div>
)