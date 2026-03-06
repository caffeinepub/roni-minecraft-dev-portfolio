import { Briefcase, Star } from "lucide-react";
import { motion } from "motion/react";

const experiences = [
  {
    role: "Admin",
    org: "Jerry SMP",
    desc: "Managed staff teams, oversaw server operations, and handled community moderation.",
    current: false,
  },
  {
    role: "Admin",
    org: "RazeMC",
    desc: "Led administrative duties including server management.",
    current: false,
  },
  {
    role: "Moderator",
    org: "Goju Network",
    desc: "Handled ticket systems, community disputes, and event coordination.",
    current: false,
  },
  {
    role: "Developer",
    org: "Multiple SMP Networks",
    desc: "Built and deployed custom PvP systems, economy configs, and server infrastructure.",
    current: false,
  },
  {
    role: "Current Developer",
    org: "Jerry SMP",
    desc: "Active development of server systems, plugin optimization, and community tools.",
    current: true,
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-28 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <Briefcase size={20} className="text-glow" />
          </div>
          <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">
            Timeline
          </span>
        </div>
        <h2 className="section-title text-gradient-purple mb-16">
          Management &amp; Development Experience
        </h2>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Center line */}
        <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />

        <div className="space-y-12">
          {experiences.map((exp, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={exp.org + exp.role}
                initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
                className={`relative flex items-center ${
                  isLeft ? "justify-start" : "justify-end"
                }`}
              >
                {/* Card */}
                <div
                  className={`w-[calc(50%-2.5rem)] glass neon-glow-hover rounded-2xl p-6 relative ${
                    exp.current ? "neon-border" : "border border-border/40"
                  }`}
                >
                  {exp.current && (
                    <div className="absolute -top-3 left-4 flex items-center gap-1 bg-primary/20 border border-primary/50 rounded-full px-3 py-1">
                      <Star size={11} className="text-glow fill-glow" />
                      <span className="text-[10px] font-bold tracking-widest uppercase text-glow">
                        Current
                      </span>
                    </div>
                  )}

                  <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                    {exp.role}
                  </h3>
                  <p className="text-sm font-semibold text-glow mb-2">
                    {exp.org}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {exp.desc}
                  </p>
                </div>

                {/* Timeline dot */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      exp.current ? "bg-glow animate-pulse" : "bg-primary/60"
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
