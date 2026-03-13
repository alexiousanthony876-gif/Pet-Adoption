"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Float, Environment, MeshDistortMaterial } from "@react-three/drei"
import { Suspense, useRef, useEffect } from "react"
import * as THREE from "three"

// Suppress THREE.Clock deprecation warning from @react-three/fiber internals
// This is a known issue with the library and doesn't affect functionality
if (typeof window !== 'undefined') {
  const originalWarn = console.warn
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return
    originalWarn.apply(console, args)
  }
}

function AnimatedSphere({ position, color, speed = 1, distort = 0.3, scale = 1 }: {
  position: [number, number, number]
  color: string
  speed?: number
  distort?: number
  scale?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)
  
  useFrame((_, delta) => {
    timeRef.current += delta
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(timeRef.current * speed * 0.5) * 0.2
      meshRef.current.rotation.y = timeRef.current * speed * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={speed * 2}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
    </Float>
  )
}

function DogShape() {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)
  
  useFrame((_, delta) => {
    timeRef.current += delta
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(timeRef.current * 0.5) * 0.1
      groupRef.current.position.y = Math.sin(timeRef.current * 0.8) * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} position={[-1.5, 0, 0]}>
        {/* Dog body */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.6, 0.8, 16, 32]} />
          <meshStandardMaterial color="#E87A3C" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Dog head */}
        <mesh position={[0.6, 0.4, 0]}>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshStandardMaterial color="#E87A3C" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Snout */}
        <mesh position={[1, 0.3, 0]}>
          <capsuleGeometry args={[0.15, 0.2, 8, 16]} />
          <meshStandardMaterial color="#D4693A" roughness={0.4} metalness={0.1} />
          <mesh rotation={[0, 0, Math.PI / 2]} />
        </mesh>
        {/* Nose */}
        <mesh position={[1.15, 0.35, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#2a1810" roughness={0.8} />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.85, 0.55, 0.25]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#2a1810" roughness={0.2} metalness={0.3} />
        </mesh>
        <mesh position={[0.85, 0.55, -0.25]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#2a1810" roughness={0.2} metalness={0.3} />
        </mesh>
        {/* Ears */}
        <mesh position={[0.5, 0.75, 0.3]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.12, 0.25, 8, 16]} />
          <meshStandardMaterial color="#C45A2A" roughness={0.4} />
        </mesh>
        <mesh position={[0.5, 0.75, -0.3]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.12, 0.25, 8, 16]} />
          <meshStandardMaterial color="#C45A2A" roughness={0.4} />
        </mesh>
        {/* Tail */}
        <mesh position={[-0.8, 0.3, 0]} rotation={[0, 0, 0.8]}>
          <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
          <meshStandardMaterial color="#E87A3C" roughness={0.3} />
        </mesh>
        {/* Legs */}
        <mesh position={[0.3, -0.6, 0.25]}>
          <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
          <meshStandardMaterial color="#E87A3C" roughness={0.3} />
        </mesh>
        <mesh position={[0.3, -0.6, -0.25]}>
          <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
          <meshStandardMaterial color="#E87A3C" roughness={0.3} />
        </mesh>
        <mesh position={[-0.3, -0.6, 0.25]}>
          <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
          <meshStandardMaterial color="#E87A3C" roughness={0.3} />
        </mesh>
        <mesh position={[-0.3, -0.6, -0.25]}>
          <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
          <meshStandardMaterial color="#E87A3C" roughness={0.3} />
        </mesh>
      </group>
    </Float>
  )
}

function CatShape() {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)
  
  useFrame((_, delta) => {
    timeRef.current += delta
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(timeRef.current * 0.6 + 1) * 0.15
      groupRef.current.position.y = Math.sin(timeRef.current * 0.9 + 0.5) * 0.12
    }
  })

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={groupRef} position={[1.8, -0.2, 0.5]}>
        {/* Cat body */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.4, 0.6, 16, 32]} />
          <meshStandardMaterial color="#9CA3AF" roughness={0.35} metalness={0.1} />
        </mesh>
        {/* Cat head */}
        <mesh position={[0.5, 0.35, 0]}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial color="#9CA3AF" roughness={0.35} metalness={0.1} />
        </mesh>
        {/* Cat ears - triangular */}
        <mesh position={[0.4, 0.65, 0.18]} rotation={[0.2, 0, 0.3]}>
          <coneGeometry args={[0.12, 0.25, 4]} />
          <meshStandardMaterial color="#9CA3AF" roughness={0.35} />
        </mesh>
        <mesh position={[0.4, 0.65, -0.18]} rotation={[-0.2, 0, -0.3]}>
          <coneGeometry args={[0.12, 0.25, 4]} />
          <meshStandardMaterial color="#9CA3AF" roughness={0.35} />
        </mesh>
        {/* Inner ears */}
        <mesh position={[0.42, 0.62, 0.18]} rotation={[0.2, 0, 0.3]} scale={0.7}>
          <coneGeometry args={[0.1, 0.18, 4]} />
          <meshStandardMaterial color="#F8B4B4" roughness={0.4} />
        </mesh>
        <mesh position={[0.42, 0.62, -0.18]} rotation={[-0.2, 0, -0.3]} scale={0.7}>
          <coneGeometry args={[0.1, 0.18, 4]} />
          <meshStandardMaterial color="#F8B4B4" roughness={0.4} />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.75, 0.4, 0.15]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#34D399" roughness={0.2} metalness={0.4} />
        </mesh>
        <mesh position={[0.75, 0.4, -0.15]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#34D399" roughness={0.2} metalness={0.4} />
        </mesh>
        {/* Pupils */}
        <mesh position={[0.79, 0.4, 0.15]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.79, 0.4, -0.15]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Nose */}
        <mesh position={[0.82, 0.3, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#F8B4B4" roughness={0.5} />
        </mesh>
        {/* Tail */}
        <mesh position={[-0.6, 0.3, 0]} rotation={[0, 0, 1.2]}>
          <capsuleGeometry args={[0.06, 0.5, 8, 16]} />
          <meshStandardMaterial color="#9CA3AF" roughness={0.35} />
        </mesh>
        {/* Tail tip */}
        <mesh position={[-0.85, 0.7, 0]} rotation={[0, 0, 0.5]}>
          <capsuleGeometry args={[0.05, 0.15, 8, 16]} />
          <meshStandardMaterial color="#6B7280" roughness={0.35} />
        </mesh>
        {/* Legs */}
        <mesh position={[0.2, -0.45, 0.15]}>
          <capsuleGeometry args={[0.07, 0.25, 8, 16]} />
          <meshStandardMaterial color="#9CA3AF" roughness={0.35} />
        </mesh>
        <mesh position={[0.2, -0.45, -0.15]}>
          <capsuleGeometry args={[0.07, 0.25, 8, 16]} />
          <meshStandardMaterial color="#9CA3AF" roughness={0.35} />
        </mesh>
        <mesh position={[-0.2, -0.45, 0.15]}>
          <capsuleGeometry args={[0.07, 0.25, 8, 16]} />
          <meshStandardMaterial color="#9CA3AF" roughness={0.35} />
        </mesh>
        <mesh position={[-0.2, -0.45, -0.15]}>
          <capsuleGeometry args={[0.07, 0.25, 8, 16]} />
          <meshStandardMaterial color="#9CA3AF" roughness={0.35} />
        </mesh>
      </group>
    </Float>
  )
}

function PawPrints() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.2} floatIntensity={0.8}>
          <mesh position={[
            Math.sin(i * 1.5) * 3,
            Math.cos(i * 1.2) * 1.5 - 1,
            -2 - i * 0.5
          ]} rotation={[Math.PI / 2, 0, i * 0.5]}>
            <torusGeometry args={[0.15, 0.05, 8, 16]} />
            <meshStandardMaterial 
              color="#E87A3C" 
              transparent 
              opacity={0.3 + i * 0.1} 
              roughness={0.5}
            />
          </mesh>
        </Float>
      ))}
    </>
  )
}

function Scene() {
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ffa94d" />
      
      <DogShape />
      <CatShape />
      <PawPrints />
      
      {/* Background decorative spheres */}
      <AnimatedSphere position={[-3, 1.5, -2]} color="#ffeee0" speed={0.5} distort={0.2} scale={0.5} />
      <AnimatedSphere position={[3.5, -1, -3]} color="#ffe4cc" speed={0.7} distort={0.25} scale={0.4} />
      <AnimatedSphere position={[0, 2, -4]} color="#ffd9b3" speed={0.6} distort={0.15} scale={0.6} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </>
  )
}

export function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
