import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef } from "react";
import MinecraftCubes from "./MinecraftCubes";
import ParticleCanvas from "./ParticleCanvas";

function RippleButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  "data-ocid": dataOcid,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
  "data-ocid"?: string;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const btn = btnRef.current;
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        width: ${size}px;
        height: ${size}px;
        left: ${x - size / 2}px;
        top: ${y - size / 2}px;
        background: oklch(0.95 0.01 280 / 0.25);
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out forwards;
      `;

      if (!document.getElementById("ripple-style")) {
        const style = document.createElement("style");
        style.id = "ripple-style";
        style.textContent = `
          @keyframes rippleAnim {
            to { transform: scale(1); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
      onClick?.();
    },
    [onClick],
  );

  const baseClass =
    "relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-sm tracking-[0.18em] uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80";

  const variantClass =
    variant === "primary"
      ? [
          "text-white",
          "border border-violet-500/60",
          "hover:-translate-y-1.5",
          "hover:border-violet-400/80",
        ].join(" ")
      : [
          "border border-border/50 text-foreground/80",
          "hover:border-primary/70 hover:bg-primary/10 hover:text-foreground",
          "hover:shadow-[0_0_20px_oklch(0.55_0.28_290/0.35)]",
          "hover:-translate-y-1",
        ].join(" ");

  const primaryStyle =
    variant === "primary"
      ? {
          background:
            "linear-gradient(135deg, oklch(0.42 0.30 290) 0%, oklch(0.58 0.28 295) 50%, oklch(0.52 0.26 300) 100%)",
          boxShadow:
            "0 0 24px oklch(0.55 0.28 290 / 0.5), 0 0 60px oklch(0.55 0.28 290 / 0.25), inset 0 1px 0 oklch(0.85 0.1 290 / 0.3)",
        }
      : undefined;

  const primaryHoverStyle = variant === "primary" ? {} : undefined;
  void primaryHoverStyle;

  return (
    <button
      type="button"
      ref={btnRef}
      data-ocid={dataOcid}
      onClick={handleClick}
      className={`${baseClass} ${variantClass} ${className}`}
      style={primaryStyle}
      onMouseEnter={(e) => {
        if (variant === "primary") {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 35px oklch(0.55 0.28 290 / 0.65), 0 0 80px oklch(0.55 0.28 290 / 0.35), inset 0 1px 0 oklch(0.85 0.1 290 / 0.3)";
        }
      }}
      onMouseLeave={(e) => {
        if (variant === "primary") {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 24px oklch(0.55 0.28 290 / 0.5), 0 0 60px oklch(0.55 0.28 290 / 0.25), inset 0 1px 0 oklch(0.85 0.1 290 / 0.3)";
        }
      }}
    >
      {children}
    </button>
  );
}

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient"
    >
      {/* Particle canvas layer */}
      <ParticleCanvas />

      {/* Three.js cubes layer */}
      <MinecraftCubes />

      {/* Hero banner image — atmospheric depth layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
      >
        <img
          src="/assets/generated/hero-banner.dim_1600x900.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{ opacity: 0.18, mixBlendMode: "screen" }}
        />
      </div>

      {/* Radial glow backdrop — stronger atmospheric bloom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 90% 70% at 40% 50%, oklch(0.55 0.28 290 / 0.11) 0%, transparent 65%)",
            "radial-gradient(ellipse 50% 40% at 15% 60%, oklch(0.45 0.22 295 / 0.07) 0%, transparent 60%)",
          ].join(", "),
          zIndex: 4,
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-start gap-6 pt-24"
        style={{ zIndex: 10 }}
      >
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass px-4 py-1.5 rounded-full border border-primary/40 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-glow animate-pulse" />
          <span className="text-xs font-medium text-glow tracking-[0.2em] uppercase">
            Available for Projects
          </span>
        </motion.div>

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="font-heading font-black leading-none tracking-tight text-gradient-purple"
            style={{
              fontSize: "clamp(6rem, 20vw, 16rem)",
              fontVariationSettings: '"wdth" 130',
              filter:
                "drop-shadow(0 0 60px oklch(0.55 0.28 290 / 0.55)) drop-shadow(0 0 120px oklch(0.55 0.28 290 / 0.25))",
            }}
          >
            RONI
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center gap-4"
        >
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/70" />
          <p className="text-xs md:text-sm font-mono font-medium tracking-[0.4em] uppercase text-muted-foreground">
            Minecraft Server Developer
          </p>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/70" />
        </motion.div>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="max-w-xl text-base md:text-lg leading-relaxed text-muted-foreground"
        >
          Experienced Minecraft server developer specializing in optimized
          server systems, plugin configuration, and professional community
          management. I help Minecraft communities build stable servers,
          engaging gameplay systems, and well-managed staff teams.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap gap-4 pt-2"
        >
          <RippleButton
            variant="primary"
            onClick={() => scrollTo("#projects")}
            data-ocid="hero.view_work.button"
          >
            View Work
          </RippleButton>
          <RippleButton
            variant="ghost"
            onClick={() => scrollTo("#services")}
            data-ocid="hero.services.button"
          >
            Services
          </RippleButton>
          <RippleButton
            variant="ghost"
            onClick={() => scrollTo("#contact")}
            data-ocid="hero.contact.button"
          >
            Contact
          </RippleButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-muted-foreground/60"
        style={{ zIndex: 10 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}
