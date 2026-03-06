import { Code2, Users } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Skill {
  label: string;
  percent: number;
}

const devSkills: Skill[] = [
  { label: "Plugin Configuration", percent: 90 },
  { label: "Server Optimization", percent: 88 },
  { label: "Permissions Setup", percent: 100 },
  { label: "Economy Systems", percent: 80 },
  { label: "PvP Setup", percent: 92 },
  { label: "Lifesteal & Headsteal Systems", percent: 87 },
];

const mgmtSkills: Skill[] = [
  { label: "Staff Recruitment", percent: 100 },
  { label: "Ticket Handling", percent: 100 },
  { label: "Community Moderation", percent: 100 },
  { label: "Event Management", percent: 100 },
];

function SkillBar({ label, percent, delay }: Skill & { delay: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(percent), delay * 100);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [percent, delay]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground/90">{label}</span>
        <span className="text-xs font-bold text-glow">{percent}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
        <div
          className="h-full rounded-full transition-all ease-out"
          style={{
            width: `${width}%`,
            transitionDuration: "1s",
            background:
              "linear-gradient(90deg, oklch(0.55 0.28 290) 0%, oklch(0.72 0.18 295) 100%)",
            boxShadow: "0 0 8px oklch(0.55 0.28 290 / 0.6)",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Voxel particle canvas behind skill cards ────────────────── */
function VoxelParticles({ color = "#a78bfa" }: { color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Small voxel squares that float upward
    interface VoxelDot {
      x: number;
      y: number;
      size: number;
      vy: number;
      alpha: number;
      fadeDir: number;
    }

    const h = canvas.height;
    const w = canvas.width;
    const dots: VoxelDot[] = Array.from({ length: 18 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 5 + 3,
      vy: -(0.2 + Math.random() * 0.4),
      alpha: Math.random() * 0.12 + 0.04,
      fadeDir: 1,
    }));

    const hexToRgb = (hex: string) => {
      const h2 = hex.replace("#", "");
      return [
        Number.parseInt(h2.substring(0, 2), 16),
        Number.parseInt(h2.substring(2, 4), 16),
        Number.parseInt(h2.substring(4, 6), 16),
      ];
    };
    const [r, g, b] = hexToRgb(color);

    const draw = () => {
      if (!canvas || !ctx) return;
      const cw = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);

      for (const dot of dots) {
        // Float up
        dot.y += dot.vy;
        if (dot.y < -dot.size * 2) {
          dot.y = ch + dot.size;
          dot.x = Math.random() * cw;
        }

        // Pulse alpha
        dot.alpha += dot.fadeDir * 0.0008;
        if (dot.alpha > 0.16) dot.fadeDir = -1;
        if (dot.alpha < 0.03) dot.fadeDir = 1;

        // Draw square voxel
        ctx.strokeStyle = `rgba(${r},${g},${b},${dot.alpha})`;
        ctx.lineWidth = 0.8;
        ctx.shadowColor = `rgba(${r},${g},${b},${dot.alpha * 0.5})`;
        ctx.shadowBlur = dot.size * 1.5;
        ctx.strokeRect(dot.x, dot.y, dot.size, dot.size);
        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl"
      style={{ zIndex: 0 }}
    />
  );
}

export default function SkillsSection() {
  return (
    <section id="skills" className="py-28 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h2 className="section-title text-gradient-purple">
          Skills &amp; Expertise
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Development */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
          className="glass neon-border rounded-2xl p-8 space-y-6 relative overflow-hidden"
        >
          <VoxelParticles color="#7c3aed" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                <Code2 size={20} className="text-glow" />
              </div>
              <h3 className="font-heading font-bold text-xl text-foreground">
                Development
              </h3>
            </div>
            <div className="space-y-5">
              {devSkills.map((skill, i) => (
                <SkillBar key={skill.label} {...skill} delay={i} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Management */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
          className="glass neon-border rounded-2xl p-8 space-y-6 relative overflow-hidden"
        >
          <VoxelParticles color="#a78bfa" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                <Users size={20} className="text-glow" />
              </div>
              <h3 className="font-heading font-bold text-xl text-foreground">
                Management
              </h3>
            </div>
            <div className="space-y-5">
              {mgmtSkills.map((skill, i) => (
                <SkillBar key={skill.label} {...skill} delay={i} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
