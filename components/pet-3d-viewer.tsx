'use client'

import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stage, Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface Pet3DViewerProps {
  petName?: string
  color?: string
  height?: string
  modelUrl?: string
}

function AnimatedPetModel({ petName = 'Buddy', color = '#E87A3C' }) {
  const meshRef = useRef<THREE.Group>(null)
  const [isAnimating, setIsAnimating] = useState(true)

  useFrame((state) => {
    if (meshRef.current && isAnimating) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2
    }
  })

  return (
    <group ref={meshRef}>
      {/* Main body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.7, 0.2]} castShadow receiveShadow>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Left ear */}
      <mesh position={[-0.3, 1.3, 0.1]} castShadow receiveShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Right ear */}
      <mesh position={[0.3, 1.3, 0.1]} castShadow receiveShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.15, 0.85, 0.65]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[0.15, 0.85, 0.65]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Left front leg */}
      <mesh position={[-0.3, -0.5, 0.3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.8, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Right front leg */}
      <mesh position={[0.3, -0.5, 0.3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.8, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Left back leg */}
      <mesh position={[-0.3, -0.5, -0.3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.8, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Right back leg */}
      <mesh position={[0.3, -0.5, -0.3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.8, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Tail */}
      <mesh position={[0, 0, -0.8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.6, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>
    </group>
  )
}

function GLBModelLoader({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl)
  const modelRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.004
    }
  })

  // Auto-scale model to fit view
  React.useEffect(() => {
    if (modelRef.current) {
      const box = new THREE.Box3().setFromObject(modelRef.current)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 2 / maxDim
      modelRef.current.scale.multiplyScalar(scale)
    }
  }, [])

  return (
    <group ref={modelRef}>
      <primitive object={scene} />
    </group>
  )
}

function PetModelLoader() {
  return (
    <Html>
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </Html>
  )
}

export function Pet3DViewer({ petName = 'Buddy', color = '#E87A3C', height = 'h-96', modelUrl }: Pet3DViewerProps) {
  return (
    <div className={`w-full ${height} bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl overflow-hidden`}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        shadows
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={50} />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <pointLight position={[0, 5, 10]} intensity={0.8} color="#ffffff" />

        {/* Model */}
        <Suspense fallback={<PetModelLoader />}>
          <Stage environment="city" preset="rembrandt" intensity={0.6}>
            {modelUrl ? (
              <GLBModelLoader modelUrl={modelUrl} />
            ) : (
              <AnimatedPetModel petName={petName} color={color} />
            )}
          </Stage>
        </Suspense>

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={2}
          minDistance={2}
          maxDistance={5}
        />
      </Canvas>
    </div>
  )
}
