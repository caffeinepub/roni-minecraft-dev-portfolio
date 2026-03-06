import { useCallback, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   VoxelBackground
   3-layer CSS canvas background:
   Layer 1 (far)   — very faint tiny cube outlines + star dust
   Layer 2 (mid)   — slow medium floating cubes
   Layer 3 (near)  — larger cubes, parallax scroll, mouse parallax

   Accent palette (used sparingly):
     purple glow   #a78bfa
     grass green   #5dbb63
     diamond cyan  #4deeea
     gold yellow   #facc15
   All drawn at very low opacity.
──────────────────────────────────────────────────────────────── */

interface VoxelCube {
  x: number;
  y: number;
  size: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  dRotX: number;
  dRotY: number;
  dRotZ: number;
  floatOffset: number;
  floatSpeed: number;
  floatAmp: number;
  alpha: number;
  fadeDir: number;
  fadeSpeed: number;
  color: string;
  layer: 1 | 2 | 3;
  vx: number;
  vy: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkle: number;
  twinkleSpeed: number;
}

const COLORS = [
  "#a78bfa", // soft purple glow (most common)
  "#a78bfa",
  "#a78bfa",
  "#7c3aed", // deeper purple
  "#5dbb63", // grass green (rare)
  "#4deeea", // diamond cyan (rare)
  "#facc15", // gold (very rare)
];

function pickColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const r = Number.parseInt(h.substring(0, 2), 16);
  const g = Number.parseInt(h.substring(2, 4), 16);
  const b = Number.parseInt(h.substring(4, 6), 16);
  return [r, g, b];
}

function drawCubeOutline(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rotX: number,
  rotY: number,
  alpha: number,
  color: string,
) {
  const h = size / 2;

  // 8 unit cube vertices in local space
  const vertices: [number, number, number][] = [
    [-h, -h, -h],
    [h, -h, -h],
    [h, h, -h],
    [-h, h, -h],
    [-h, -h, h],
    [h, -h, h],
    [h, h, h],
    [-h, h, h],
  ];

  // Rotate around Y then X
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);

  const projected = vertices.map(([x, y, z]) => {
    // Y rotation
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    // X rotation
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;
    void z2;
    return [cx + x1, cy + y2] as [number, number];
  });

  // 12 edges of a cube
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];

  const [r, g, b] = hexToRgb(color);
  ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
  ctx.lineWidth = alpha > 0.12 ? 1 : 0.5;
  ctx.shadowColor = `rgba(${r},${g},${b},${alpha * 0.8})`;
  ctx.shadowBlur = size * 0.4;

  ctx.beginPath();
  for (const [a, bIdx] of edges) {
    ctx.moveTo(projected[a][0], projected[a][1]);
    ctx.lineTo(projected[bIdx][0], projected[bIdx][1]);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function createCube(w: number, h: number, layer: 1 | 2 | 3): VoxelCube {
  const sizeMult = layer === 1 ? 0.4 : layer === 2 ? 0.8 : 1.4;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    size: (Math.random() * 24 + 14) * sizeMult,
    rotX: Math.random() * Math.PI * 2,
    rotY: Math.random() * Math.PI * 2,
    rotZ: Math.random() * Math.PI * 2,
    dRotX: (Math.random() - 0.5) * 0.003,
    dRotY: (Math.random() - 0.5) * 0.005,
    dRotZ: (Math.random() - 0.5) * 0.002,
    floatOffset: Math.random() * Math.PI * 2,
    floatSpeed: 0.0002 + Math.random() * 0.0003,
    floatAmp: layer === 1 ? 12 : layer === 2 ? 22 : 35,
    alpha:
      Math.random() * 0.12 + (layer === 1 ? 0.04 : layer === 2 ? 0.07 : 0.1),
    fadeDir: 1,
    fadeSpeed: 0.0003 + Math.random() * 0.0003,
    color: pickColor(),
    layer,
    vx: 0,
    vy: layer === 1 ? -0.08 : layer === 2 ? -0.12 : -0.06, // float upward
  };
}

function createStar(w: number, h: number): Star {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    radius: Math.random() * 1.2 + 0.3,
    alpha: Math.random() * 0.4 + 0.1,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.003 + Math.random() * 0.006,
  };
}

export default function VoxelBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cubesRef = useRef<VoxelCube[]>([]);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const initScene = useCallback((w: number, h: number) => {
    const cubes: VoxelCube[] = [];
    // Layer 1: 18 tiny far cubes
    for (let i = 0; i < 18; i++) cubes.push(createCube(w, h, 1));
    // Layer 2: 12 medium cubes
    for (let i = 0; i < 12; i++) cubes.push(createCube(w, h, 2));
    // Layer 3: 6 large near cubes
    for (let i = 0; i < 6; i++) cubes.push(createCube(w, h, 3));
    cubesRef.current = cubes;

    // Stars in far background
    starsRef.current = Array.from({ length: 120 }, () => createStar(w, h));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initScene(canvas.width, canvas.height);
    };
    resize();

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouse, { passive: true });

    const draw = () => {
      timeRef.current += 1;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const scroll = scrollRef.current;
      const mx = mouseRef.current.x / w - 0.5; // -0.5 to 0.5
      const my = mouseRef.current.y / h - 0.5;

      ctx.clearRect(0, 0, w, h);

      // ── Draw grid floor (very faint) ──────────────────────────
      const gridAlpha = 0.035;
      const gridSize = 80;
      ctx.strokeStyle = `rgba(124, 58, 237, ${gridAlpha})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x < w; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // ── Draw stars (layer 1) ──────────────────────────────────
      for (const star of starsRef.current) {
        star.twinkle += star.twinkleSpeed;
        const a = star.alpha * (0.5 + 0.5 * Math.sin(star.twinkle));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${a})`;
        ctx.fill();
      }

      // ── Draw floating cubes (sorted by layer) ─────────────────
      const cubes = cubesRef.current;
      for (const cube of cubes) {
        // Rotation
        cube.rotX += cube.dRotX;
        cube.rotY += cube.dRotY;
        cube.rotZ += cube.dRotZ;

        // Float upward + sine wave
        cube.y += cube.vy;
        const floatY =
          Math.sin(t * cube.floatSpeed * 60 + cube.floatOffset) * cube.floatAmp;

        // Parallax by layer + mouse interaction
        const parallaxFactor =
          cube.layer === 1 ? 0.02 : cube.layer === 2 ? 0.06 : 0.14;
        const parallaxScrollY = scroll * parallaxFactor;
        const mouseParallaxX = mx * cube.size * (cube.layer === 3 ? 2.5 : 1.2);
        const mouseParallaxY = my * cube.size * (cube.layer === 3 ? 2.5 : 1.2);

        // Fade in/out
        cube.alpha += cube.fadeDir * cube.fadeSpeed;
        const maxAlpha =
          cube.layer === 1 ? 0.16 : cube.layer === 2 ? 0.22 : 0.28;
        const minAlpha = 0.02;
        if (cube.alpha > maxAlpha) {
          cube.alpha = maxAlpha;
          cube.fadeDir = -1;
        }
        if (cube.alpha < minAlpha) {
          cube.alpha = minAlpha;
          cube.fadeDir = 1;
        }

        // Wrap top→bottom when cube floats off screen
        if (cube.y + floatY < -cube.size * 2) {
          cube.y = canvas.height + cube.size * 2;
          cube.x = Math.random() * canvas.width;
        }

        const drawX = cube.x + mouseParallaxX;
        const drawY = cube.y + floatY - parallaxScrollY + mouseParallaxY;

        drawCubeOutline(
          ctx,
          drawX,
          drawY,
          cube.size,
          cube.rotX,
          cube.rotY,
          cube.alpha,
          cube.color,
        );
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [initScene]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
