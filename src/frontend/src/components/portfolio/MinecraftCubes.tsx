import { Box, Edges } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";

/* ─────────────────────────────────────────────────────────────
   MinecraftCubes — lightweight Three.js voxel cubes
   3 depth layers: far (tiny, faint), mid (medium), near (large, parallax)
   Mouse parallax: near cubes shift more with cursor
   Accent colors: mostly purple, occasional green/cyan/gold
──────────────────────────────────────────────────────────────── */

interface CubeProps {
  position: [number, number, number];
  scale: number;
  rotSpeed: [number, number, number];
  color: string;
  emissiveIntensity: number;
  opacity: number;
  floatAmp: number;
  floatOffset: number;
  layer: 1 | 2 | 3;
}

const CUBE_DEFS: CubeProps[] = [
  // Layer 1 — far, tiny, very faint
  {
    position: [4.5, 2.0, -8],
    scale: 0.45,
    rotSpeed: [0.12, 0.2, 0.05],
    color: "#7c3aed",
    emissiveIntensity: 0.25,
    opacity: 0.07,
    floatAmp: 0.15,
    floatOffset: 0.0,
    layer: 1,
  },
  {
    position: [-5.2, -1.8, -9],
    scale: 0.38,
    rotSpeed: [0.08, -0.15, 0.1],
    color: "#a78bfa",
    emissiveIntensity: 0.2,
    opacity: 0.06,
    floatAmp: 0.12,
    floatOffset: 1.2,
    layer: 1,
  },
  {
    position: [1.8, 3.2, -10],
    scale: 0.32,
    rotSpeed: [-0.1, 0.12, 0.08],
    color: "#6d28d9",
    emissiveIntensity: 0.2,
    opacity: 0.05,
    floatAmp: 0.1,
    floatOffset: 2.4,
    layer: 1,
  },
  {
    position: [-2.5, 0.5, -8],
    scale: 0.42,
    rotSpeed: [0.07, 0.18, -0.06],
    color: "#5dbb63",
    emissiveIntensity: 0.15,
    opacity: 0.05,
    floatAmp: 0.13,
    floatOffset: 0.8,
    layer: 1,
  },
  // Layer 2 — mid
  {
    position: [3.5, 0.5, -4],
    scale: 0.85,
    rotSpeed: [0.15, 0.25, 0.06],
    color: "#7c3aed",
    emissiveIntensity: 0.35,
    opacity: 0.12,
    floatAmp: 0.25,
    floatOffset: 0.3,
    layer: 2,
  },
  {
    position: [-3.2, -0.5, -5],
    scale: 0.7,
    rotSpeed: [0.1, -0.2, 0.12],
    color: "#a78bfa",
    emissiveIntensity: 0.3,
    opacity: 0.1,
    floatAmp: 0.28,
    floatOffset: 1.8,
    layer: 2,
  },
  {
    position: [2.0, -1.5, -6],
    scale: 0.6,
    rotSpeed: [-0.12, 0.1, 0.16],
    color: "#6d28d9",
    emissiveIntensity: 0.3,
    opacity: 0.09,
    floatAmp: 0.2,
    floatOffset: 3.0,
    layer: 2,
  },
  {
    position: [-1.5, 1.5, -5],
    scale: 0.78,
    rotSpeed: [0.08, 0.17, -0.08],
    color: "#4deeea",
    emissiveIntensity: 0.2,
    opacity: 0.09,
    floatAmp: 0.22,
    floatOffset: 0.6,
    layer: 2,
  },
  // Layer 3 — near, large, parallax
  {
    position: [2.8, -0.8, -2],
    scale: 1.4,
    rotSpeed: [0.06, 0.12, 0.03],
    color: "#7c3aed",
    emissiveIntensity: 0.45,
    opacity: 0.16,
    floatAmp: 0.4,
    floatOffset: 0.0,
    layer: 3,
  },
  {
    position: [-2.6, 0.6, -2.5],
    scale: 1.15,
    rotSpeed: [0.05, -0.1, 0.07],
    color: "#a78bfa",
    emissiveIntensity: 0.4,
    opacity: 0.14,
    floatAmp: 0.35,
    floatOffset: 2.0,
    layer: 3,
  },
  {
    position: [0.5, 1.8, -1.8],
    scale: 0.9,
    rotSpeed: [-0.07, 0.08, 0.04],
    color: "#facc15",
    emissiveIntensity: 0.25,
    opacity: 0.1,
    floatAmp: 0.3,
    floatOffset: 4.0,
    layer: 3,
  },
];

function FloatingCube({
  position,
  scale,
  rotSpeed,
  color,
  emissiveIntensity,
  opacity,
  floatAmp,
  floatOffset,
  layer,
  mouseX,
  mouseY,
  scrollY,
}: CubeProps & { mouseX: number; mouseY: number; scrollY: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const time = useRef(floatOffset);

  useFrame((_, delta) => {
    time.current += delta;
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.rotation.x += rotSpeed[0] * delta;
    mesh.rotation.y += rotSpeed[1] * delta;
    mesh.rotation.z += rotSpeed[2] * delta;

    // Float wave
    const baseY = position[1] + Math.sin(time.current * 0.4) * floatAmp;

    // Parallax factor by layer
    const px =
      layer === 3 ? mouseX * 0.6 : layer === 2 ? mouseX * 0.25 : mouseX * 0.08;
    const py =
      layer === 3 ? mouseY * 0.4 : layer === 2 ? mouseY * 0.15 : mouseY * 0.05;
    const scrollOffset =
      scrollY * (layer === 3 ? 0.003 : layer === 2 ? 0.0015 : 0.0005);

    mesh.position.set(position[0] + px, baseY + py - scrollOffset, position[2]);
  });

  return (
    <Box ref={meshRef} args={[scale, scale, scale]} position={position}>
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        transparent
        opacity={opacity}
        roughness={0.05}
        metalness={0.95}
        envMapIntensity={0.5}
      />
      <Edges
        color={color}
        lineWidth={layer === 3 ? 1.8 : layer === 2 ? 1.2 : 0.7}
      />
    </Box>
  );
}

function Scene() {
  const { size } = useThree();
  const [mouseXY, setMouseXY] = useState<[number, number]>([0, 0]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      // Normalize to -1…1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouseXY([x, y]);
    };
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  void size;

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#7c3aed" />
      <pointLight position={[-5, -5, 3]} intensity={0.7} color="#a78bfa" />
      <pointLight position={[0, 3, -2]} intensity={0.4} color="#4deeea" />

      {CUBE_DEFS.map((cube) => (
        <FloatingCube
          key={`${cube.position.join(",")}-${cube.color}`}
          {...cube}
          mouseX={mouseXY[0]}
          mouseY={mouseXY[1]}
          scrollY={scrollY}
        />
      ))}
    </>
  );
}

export default function MinecraftCubes() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 48 }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 3,
      }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
    >
      <Scene />
    </Canvas>
  );
}
