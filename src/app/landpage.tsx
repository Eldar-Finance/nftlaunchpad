"use client"

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Environment } from '@react-three/drei'
import * as THREE from 'three'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Palette, Code, Rocket, CreditCard, Users, Image as ImageIcon, DollarSign } from 'lucide-react'
import { InstancedMesh } from 'three'

const features = [
  { title: 'Create', description: 'Launch unique NFT collections', icon: Palette },
  { title: 'Secure', description: 'Generate smart contracts', icon: Code },
  { title: 'Mint', description: 'Seamless minting experience', icon: Rocket },
  { title: 'Manage', description: 'Set and track royalties', icon: CreditCard },
]

// Add this above your existing code
const StepItem = ({ number, title, description }: { number: number; title: string; description: string }) => (
  <div>
    <span>{number}. </span>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);



export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "50%", "100%"])

  return (
    <div ref={containerRef} className="min-h-screen text-white overflow-hidden">
      {/* Dynamic Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{
          background: "radial-gradient(circle at center, #080808 0%, #050505 50%, #000000 100%)",
          y: backgroundY
        }}
      />

      {/* Hero Section with 3D Lightning Thunder */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-10">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ambientLight intensity={0.1} />
            <pointLight position={[10, 10, 10]} intensity={0.3} />
            <LightningThunder />
            <Environment preset="night" />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
          </Canvas>
        </div>
        <motion.div 
          className="container mx-auto px-4 z-20 text-center relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="backdrop-blur-md p-8 rounded-xl">
            <motion.h1 
              className="text-6xl md:text-8xl font-extrabold mb-4 bg-clip-text text-blue-500"
              style={{ y: textY }}
            >
              QuantumX
            </motion.h1>
            <motion.p 
              className="text-xl md:text-3xl text-gray-200 mb-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Next-Gen NFT Launchpad
            </motion.p>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-lg px-8 py-4"
                onClick={() => setIsModalOpen(true)}
              >
                Launch NFT
              </Button>
            </motion.div>
          </div>
        </motion.div>
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
            <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
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

function LightningThunder() {
  const count = 5000
  const mesh = useRef<InstancedMesh>(null)
  const light = useRef<THREE.PointLight>(null)
  const { viewport, camera } = useThree()

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])

  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [count])

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.min(Math.cos(t), Math.sin(t), 0.5)

      particle.mx += (state.mouse.x * viewport.width - particle.mx) * 0.02
      particle.my += (state.mouse.y * viewport.height - particle.my) * 0.02

      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      ;(mesh.current as InstancedMesh)?.setMatrixAt(i, dummy.matrix)
    })
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true
    }

    // Animate lightning effect
    if (light.current) {
      light.current.intensity = 0.1 + Math.random() * 0.5
      light.current.position.set(
        Math.sin(state.clock.elapsedTime * 2) * 3,
        Math.cos(state.clock.elapsedTime * 2) * 3,
        Math.sin(state.clock.elapsedTime) * 3
      )
    }
  })

  return (
    <>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshPhongMaterial color="#00ffff" />
      </instancedMesh>
      <pointLight ref={light} distance={10} intensity={1} color="#00ffff" />
    </>
  )
}

function FeatureCard({ feature, index }: { feature: any; index: number }) {
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
            <meshPhongMaterial color={stat.color} transparent opacity={0.6} />
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