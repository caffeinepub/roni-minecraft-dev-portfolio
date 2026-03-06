import { User } from "lucide-react";
import { type Variants, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useActor } from "../../hooks/useActor";

const DEFAULT_AVATAR = "/assets/generated/roni-avatar.dim_400x400.jpg";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export default function AboutSection() {
  const { actor, isFetching } = useActor();
  const [avatarSrc, setAvatarSrc] = useState<string>(DEFAULT_AVATAR);

  useEffect(() => {
    if (!actor || isFetching) return;
    let cancelled = false;
    actor
      .getAboutImage()
      .then((img) => {
        if (!cancelled && img) {
          setAvatarSrc(img);
        }
      })
      .catch(() => {
        // fall back to default on error — no-op
      });
    return () => {
      cancelled = true;
    };
  }, [actor, isFetching]);

  return (
    <section id="about" className="py-28 px-6 max-w-5xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <User size={20} className="text-glow" />
          </div>
          <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">
            Who I Am
          </span>
        </div>

        <h2 className="section-title text-gradient-purple mb-10">About Roni</h2>

        <div className="glass neon-border rounded-2xl p-8 md:p-10 relative overflow-hidden">
          {/* Decorative corner glow */}
          <div
            className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at top right, oklch(0.55 0.28 290 / 0.12) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-10">
            {/* Avatar */}
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <div
                className="w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden"
                style={{
                  boxShadow:
                    "0 0 30px oklch(0.55 0.28 290 / 0.4), 0 0 60px oklch(0.55 0.28 290 / 0.2), inset 0 0 0 1px oklch(0.55 0.28 290 / 0.4)",
                }}
              >
                <img
                  src={avatarSrc}
                  alt="Roni — Minecraft Server Developer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-5">
              <p className="text-base md:text-lg leading-relaxed text-foreground/90">
                I am an experienced Minecraft server developer focused on
                building{" "}
                <span className="text-glow font-semibold">
                  optimized, stable, and scalable
                </span>{" "}
                server systems.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                I have worked with several Minecraft SMP communities including{" "}
                <span className="text-foreground font-medium">Jerry SMP</span>,{" "}
                <span className="text-foreground font-medium">RazeMC</span>, and{" "}
                <span className="text-foreground font-medium">
                  Goju Network
                </span>
                , helping manage staff teams and configure advanced server
                systems.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                My work includes plugin configuration, server optimization, PvP
                systems, lifesteal setups, headsteal mechanics, and staff
                management systems. My goal is to create smooth player
                experiences through well-optimized plugins and strong community
                management systems.
              </p>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
