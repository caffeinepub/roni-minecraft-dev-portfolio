import {
  FolderGit2,
  Globe,
  MessageSquare,
  Package,
  Trophy,
  Users,
} from "lucide-react";
import { type Variants, motion } from "motion/react";
import { useState } from "react";

const projects = [
  {
    icon: Users,
    title: "Staff Management Systems",
    desc: "Custom-built staff hierarchy with permission tiers and ticket routing",
  },
  {
    icon: Package,
    title: "Custom Kit Systems",
    desc: "Balanced kit configurations for competitive PvP gameplay",
  },
  {
    icon: MessageSquare,
    title: "Discord Management Systems",
    desc: "Bot configs and role systems for community Discord servers",
  },
  {
    icon: Trophy,
    title: "Tournament Systems",
    desc: "Automated bracket management and reward distribution",
  },
  {
    icon: Globe,
    title: "Minecraft Server Websites",
    desc: "Custom web presence for Minecraft communities",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

export default function ProjectsSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="projects" className="py-28 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <FolderGit2 size={20} className="text-glow" />
          </div>
          <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">
            Portfolio
          </span>
        </div>
        <h2 className="section-title text-gradient-purple">
          Projects &amp; Systems Built
        </h2>
      </motion.div>

      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {projects.map((project, i) => {
          const Icon = project.icon;
          const isHovered = hoveredIdx === i;
          return (
            <motion.div
              key={project.title}
              variants={cardVariants}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                transform: isHovered
                  ? "translateY(-8px) scale(1.02) perspective(800px) rotateX(2deg)"
                  : "translateY(0) scale(1) perspective(800px) rotateX(0deg)",
                transition: "transform 0.3s ease",
              }}
              className="glass rounded-2xl p-6 border border-border/40 cursor-default group relative overflow-hidden"
            >
              {/* Hover glow */}
              <div
                className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, oklch(0.55 0.28 290 / 0.15) 0%, transparent 70%)",
                  boxShadow: "inset 0 0 0 1px oklch(0.55 0.28 290 / 0.4)",
                }}
              />

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                  isHovered
                    ? "bg-primary/20 border border-primary/50 shadow-neon"
                    : "bg-primary/10 border border-primary/20"
                }`}
              >
                <Icon size={22} className="text-glow" />
              </div>

              <h3 className="font-heading font-bold text-base text-foreground mb-2 group-hover:text-glow transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.desc}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
