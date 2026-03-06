import {
  Globe,
  MessageCircle,
  Server,
  Settings,
  Shield,
  Swords,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const services = [
  {
    icon: Wrench,
    title: "Minecraft Server Setup",
    desc: "Complete server setup including plugins, permissions, economy systems, and optimization for smooth gameplay.",
  },
  {
    icon: Settings,
    title: "Plugin Configuration",
    desc: "Professional configuration of Minecraft plugins to ensure stability, performance, and balanced gameplay.",
  },
  {
    icon: Swords,
    title: "PvP / Lifesteal Systems",
    desc: "Custom PvP environments including lifesteal mechanics, headsteal systems, kits, and arena setups.",
  },
  {
    icon: Shield,
    title: "Staff Management Systems",
    desc: "Setup of staff roles, moderation systems, permissions structures, and management workflows.",
  },
  {
    icon: MessageCircle,
    title: "Discord Management",
    desc: "Discord server setup including moderation bots, automation systems, and community management tools.",
  },
  {
    icon: Globe,
    title: "Minecraft Server Websites",
    desc: "Modern websites for Minecraft servers including server information pages, voting links, and community hubs.",
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
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <Server size={20} className="text-glow" />
          </div>
          <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">
            What I Do
          </span>
        </div>
        <h2 className="section-title text-gradient-purple">Services I Offer</h2>
        <p className="text-muted-foreground max-w-2xl mt-4 text-base leading-relaxed">
          I help Minecraft communities build stable, optimized, and engaging
          servers through professional development and management solutions.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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

      {/* Request a Quote */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, delay: 0.1 }}
        className="glass rounded-2xl p-10 border border-primary/30 relative overflow-hidden text-center"
        style={{
          boxShadow:
            "0 0 40px oklch(0.55 0.28 290 / 0.15), inset 0 0 0 1px oklch(0.55 0.28 290 / 0.15)",
        }}
      >
        {/* Ambient top glow */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, oklch(0.55 0.28 290 / 0.7) 50%, transparent 100%)",
          }}
        />
        {/* Background radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.55 0.28 290 / 0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
              <MessageCircle size={18} className="text-glow" />
            </div>
            <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">
              Get in Touch
            </span>
          </div>

          <h3 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4 text-gradient-purple">
            Request a Quote
          </h3>

          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-6">
            Every server has different needs, so pricing depends on the
            complexity of the project. If you&apos;re interested in working
            together, contact me directly on Discord.
          </p>

          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-muted-foreground text-sm">Discord:</span>
            <code
              className="px-3 py-1 rounded-lg text-sm font-mono text-glow"
              style={{
                background: "oklch(0.55 0.28 290 / 0.12)",
                border: "1px solid oklch(0.55 0.28 290 / 0.35)",
                color: "oklch(0.78 0.18 290)",
              }}
            >
              roni.is.here
            </code>
          </div>

          <a
            href="https://discord.com/users/roni.is.here"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="services.request_quote.button"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-heading font-bold text-sm uppercase tracking-wider text-white relative overflow-hidden group cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.45 0.28 290) 0%, oklch(0.55 0.30 305) 100%)",
              boxShadow:
                "0 0 20px oklch(0.55 0.28 290 / 0.45), 0 4px 16px oklch(0.55 0.28 290 / 0.3)",
              transition: "box-shadow 0.3s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 0 35px oklch(0.55 0.28 290 / 0.7), 0 6px 24px oklch(0.55 0.28 290 / 0.45)";
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(-2px) scale(1.02)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 0 20px oklch(0.55 0.28 290 / 0.45), 0 4px 16px oklch(0.55 0.28 290 / 0.3)";
              (e.currentTarget as HTMLAnchorElement).style.transform =
                "translateY(0) scale(1)";
            }}
          >
            {/* Ripple shine overlay */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
              }}
            />
            <MessageCircle size={16} />
            Request Quote on Discord
          </a>
        </div>
      </motion.div>
    </section>
  );
}
