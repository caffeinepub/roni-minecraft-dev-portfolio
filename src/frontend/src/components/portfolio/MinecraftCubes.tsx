import { Box, Edges } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

interface CubeProps {
  position: [number, number, number];
  scale: number;
  rotationSpeed: [number, number, number];
  color: string;
}

function FloatingCube({ position, scale, rotationSpeed, color }: CubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const time = useRef(Math.random() * 100);

  useFrame((_, delta) => {
    time.current += delta;
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed[0] * delta;
      meshRef.current.rotation.y += rotationSpeed[1] * delta;
      meshRef.current.rotation.z += rotationSpeed[2] * delta;
      meshRef.current.position.y =
        position[1] + Math.sin(time.current * 0.5) * 0.3;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = meshRef.current?.rotation.x ?? 0;
      wireRef.current.rotation.y = meshRef.current?.rotation.y ?? 0;
      wireRef.current.rotation.z = meshRef.current?.rotation.z ?? 0;
      wireRef.current.position.y = meshRef.current?.position.y ?? position[1];
    }
  });

  return (
    <group>
      <Box ref={meshRef} args={[scale, scale, scale]} position={position}>
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.15}
          roughness={0.1}
          metalness={0.9}
        />
        <Edges color={color} lineWidth={1.5} />
      </Box>
    </group>
  );
}

const cubes: CubeProps[] = [
  {
    position: [3.5, 0.5, -2],
    scale: 1.2,
    rotationSpeed: [0.3, 0.5, 0.1],
    color: "#7b3cff",
  },
  {
    position: [-3.2, -0.5, -3],
    scale: 0.9,
    rotationSpeed: [0.2, -0.4, 0.3],
    color: "#a78bfa",
  },
  {
    position: [2, -1.5, -4],
    scale: 0.7,
    rotationSpeed: [-0.3, 0.2, 0.4],
    color: "#6d28d9",
  },
  {
    position: [-1.5, 1.5, -3],
    scale: 1.0,
    rotationSpeed: [0.15, 0.35, -0.2],
    color: "#8b5cf6",
  },
];

export default function MinecraftCubes() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 3,
      }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#7b3cff" />
      <pointLight position={[-5, -5, 3]} intensity={0.8} color="#a78bfa" />

      {cubes.map((cube) => (
        <FloatingCube
          key={`${cube.position.join("-")}-${cube.color}`}
          {...cube}
        />
      ))}
    </Canvas>
  );
}
