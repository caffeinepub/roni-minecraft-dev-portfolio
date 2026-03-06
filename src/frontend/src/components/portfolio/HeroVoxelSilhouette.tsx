import { useEffect, useRef } from "react";

/*
  HeroVoxelSilhouette
  Draws a blocky Minecraft-inspired terrain silhouette on a canvas.
  Very low opacity – purely atmospheric depth behind the RONI heading.
  Uses only CSS canvas, zero Three.js cost.
*/

export default function HeroVoxelSilhouette() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      draw();
    };

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Block size: voxel grid unit
      const B = Math.max(12, Math.floor(W / 80));

      // Define a blocky heightmap for terrain silhouette
      // Each value is a height in blocks from the bottom
      const cols = Math.ceil(W / B) + 2;
      const heights: number[] = [];

      // Seed a Minecraft-style terrain with stepped plateaus
      const seed = [
        8, 8, 10, 12, 14, 14, 16, 18, 18, 20, 22, 22, 20, 18, 16, 16, 14, 12,
        10, 8, 6, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 26, 24, 22, 20, 18,
        16, 14, 12, 10, 8, 6, 4, 4, 6, 8, 10, 12, 14, 16, 18, 18, 16, 14, 12,
        10, 8, 6, 4,
      ];
      for (let i = 0; i < cols; i++) {
        const si = i % seed.length;
        heights.push(seed[si]);
      }

      // Draw far background terrain (very faint, smallest blocks)
      drawTerrain(ctx, W, H, B * 0.5, heights, 0, 0.025, "#a78bfa", 0);

      // Draw mid terrain
      drawTerrain(ctx, W, H, B * 0.75, heights, W * 0.1, 0.04, "#7c3aed", 3);

      // Draw near terrain (main silhouette)
      drawTerrain(ctx, W, H, B, heights, W * 0.2, 0.065, "#5b21b6", 6);
    }

    function drawTerrain(
      ctx: CanvasRenderingContext2D,
      W: number,
      H: number,
      blockSize: number,
      heights: number[],
      xOffset: number,
      alpha: number,
      color: string,
      heightBonus: number,
    ) {
      const B = blockSize;
      const cols = Math.ceil(W / B) + 2;
      const baseY = H * 0.82; // terrain sits at 82% down

      ctx.fillStyle = hexWithAlpha(color, alpha);

      for (let i = 0; i < cols; i++) {
        const hi = i % heights.length;
        const terrainH = (heights[hi] + heightBonus) * B;
        const x = i * B - xOffset;

        // Draw column of blocks
        const blockH = Math.ceil(terrainH / B);
        for (let j = 0; j < blockH; j++) {
          const bx = Math.floor(x / B) * B;
          const by = baseY - (j + 1) * B;
          ctx.fillRect(bx + 0.5, by + 0.5, B - 1, B - 1);
        }

        // Top block gets a slightly brighter top face glow
        ctx.fillStyle = hexWithAlpha(color, alpha * 1.6);
        const topY = baseY - terrainH;
        ctx.fillRect(
          Math.floor(x / B) * B + 0.5,
          topY + 0.5,
          B - 1,
          Math.min(B * 0.3, 3),
        );
        ctx.fillStyle = hexWithAlpha(color, alpha);
      }

      // Soft radial glow behind the terrain
      const grad = ctx.createRadialGradient(
        W * 0.5,
        baseY,
        0,
        W * 0.5,
        baseY,
        W * 0.5,
      );
      grad.addColorStop(0, hexWithAlpha("#a78bfa", alpha * 1.2));
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, baseY - heights[20] * B * 2, W, heights[20] * B * 3);
    }

    function hexWithAlpha(hex: string, alpha: number): string {
      const h = hex.replace("#", "");
      const r = Number.parseInt(h.substring(0, 2), 16);
      const g = Number.parseInt(h.substring(2, 4), 16);
      const b = Number.parseInt(h.substring(4, 6), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
