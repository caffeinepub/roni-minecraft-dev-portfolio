import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Servers Worked On", value: 10, suffix: "+" },
  { label: "Staff Teams Managed", value: 8, suffix: "+" },
  { label: "Systems Built", value: 20, suffix: "+" },
  { label: "Communities Helped", value: 10, suffix: "+" },
];

function CounterCard({
  label,
  value,
  suffix,
  delay,
}: {
  label: string;
  value: number;
  suffix: string;
  delay: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 1500;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - (1 - progress) ** 3; // cubic ease-out
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          setTimeout(() => requestAnimationFrame(animate), delay * 150);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.55, delay: delay * 0.1 }}
      className="glass glow-pulse rounded-2xl p-8 text-center border border-border/40 relative overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.55 0.28 290 / 0.08) 0%, transparent 70%)",
        }}
      />

      <div
        className="font-heading font-black mb-2 text-gradient-purple leading-none"
        style={{
          fontSize: "clamp(3rem, 6vw, 4.5rem)",
          fontVariationSettings: '"wdth" 125',
        }}
      >
        {count}
        {suffix}
      </div>
      <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
        {label}
      </p>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section id="stats" className="py-24 px-6 max-w-5xl mx-auto">
      {/* Background separator */}
      <div className="relative mb-16">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <CounterCard key={stat.label} {...stat} delay={i} />
        ))}
      </div>

      <div className="relative mt-16">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>
    </section>
  );
}
