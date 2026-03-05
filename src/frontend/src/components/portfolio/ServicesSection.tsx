import { motion } from "framer-motion";
import {
  Code,
  Server,
  Settings,
  Shield,
  Swords,
  Wrench,
  Zap,
} from "lucide-react";
import { useState } from "react";

const services = [
  {
    icon: Server,
    title: "Minecraft Server Setup",
    desc: "Full server deployment from scratch — hardware specs, software stack, and initial configuration.",
  },
  {
    icon: Settings,
    title: "Plugin Configuration",
    desc: "Expert configuration of any plugin ecosystem for optimal performance and gameplay.",
  },
  {
    icon: Zap,
    title: "Server Optimization",
    desc: "Deep TPS analysis, lag reduction, and performance tuning for smooth player experiences.",
  },
  {
    icon: Swords,
    title: "PvP System Setup",
    desc: "Balanced PvP configs, combat logging, kit systems, and tournament infrastructure.",
  },
  {
    icon: Shield,
    title: "Staff Management Systems",
    desc: "Hierarchical staff structures, Discord integration, ticket routing, and moderation tools.",
  },
  {
    icon: Code,
    title: "Minecraft Server Website Development",
    desc: "Custom web presence tailored for your server brand, community, and player acquisition.",
  },
];

export default function ServicesSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="services" className="py-28 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <Wrench size={20} className="text-glow" />
          </div>
          <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">
            What I Do
          </span>
        </div>
        <h2 className="section-title text-gradient-purple">Services I Offer</h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => {
          const Icon = service.icon;
          const isHovered = hoveredIdx === i;
          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                transform: isHovered
                  ? "translateY(-8px) scale(1.02)"
                  : "translateY(0) scale(1)",
                transition: "transform 0.28s ease",
              }}
              className="glass rounded-2xl p-6 border border-border/40 relative overflow-hidden cursor-default"
            >
              {/* Top glow bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-px transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, oklch(0.55 0.28 290 / 0.8) 50%, transparent 100%)",
                }}
              />

              {/* Glow overlay */}
              <div
                className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  boxShadow:
                    "0 0 30px oklch(0.55 0.28 290 / 0.25), inset 0 0 0 1px oklch(0.55 0.28 290 / 0.3)",
                }}
              />

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                  isHovered
                    ? "bg-primary/20 border border-primary/50"
                    : "bg-primary/10 border border-primary/20"
                }`}
              >
                <Icon size={22} className="text-glow" />
              </div>

              <h3 className="font-heading font-bold text-base text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
