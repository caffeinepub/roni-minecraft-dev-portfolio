import { AlertCircle, ArrowLeft, Lock, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface LoginPageProps {
  onLogin: () => void;
  onBack: () => void;
}

/* Floating glow orb */
function GlowOrb({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none blur-3xl"
      style={style}
    />
  );
}

export default function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [accessId, setAccessId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const idInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the ID input on mount
    setTimeout(() => idInputRef.current?.focus(), 400);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Simulate a brief auth check delay for realism
    await new Promise((r) => setTimeout(r, 600));

    if (accessId.trim() === "RIOhuBKL" && password === "8zx5ruqbz3") {
      setIsSubmitting(false);
      onLogin();
    } else {
      setIsSubmitting(false);
      setError("INVALID CREDENTIALS — ACCESS DENIED");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const inputBaseClass =
    "w-full rounded-xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-all duration-300 font-mono tracking-wider";
  const inputStyle: React.CSSProperties = {
    background: "oklch(0.09 0.03 280 / 0.85)",
    border: "1px solid oklch(0.28 0.08 285 / 0.7)",
    backdropFilter: "blur(12px)",
  };
  const inputFocusRingStyle = "focus:ring-2 focus:ring-offset-0";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: "oklch(0.06 0.02 280)" }}
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, oklch(0.14 0.06 290 / 0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, oklch(0.12 0.05 275 / 0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, oklch(0.10 0.04 295 / 0.25) 0%, transparent 55%)",
          animation: "gradientShift 8s ease-in-out infinite alternate",
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.55 0.28 290) 1px, transparent 1px), linear-gradient(90deg, oklch(0.55 0.28 290) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <GlowOrb
        style={{
          width: "500px",
          height: "500px",
          top: "-150px",
          left: "-100px",
          background: "oklch(0.38 0.28 292 / 0.12)",
        }}
      />
      <GlowOrb
        style={{
          width: "400px",
          height: "400px",
          bottom: "-100px",
          right: "-80px",
          background: "oklch(0.45 0.25 285 / 0.10)",
        }}
      />

      {/* Back link */}
      <motion.button
        type="button"
        data-ocid="login.back.link"
        onClick={onBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-mono tracking-wider uppercase transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg px-3 py-2"
        style={{ color: "oklch(var(--primary) / 0.6)" }}
      >
        <ArrowLeft
          size={14}
          className="transition-transform duration-200 group-hover:-translate-x-1"
        />
        <span className="group-hover:text-[oklch(var(--glow))] transition-colors duration-200">
          Back to Portfolio
        </span>
      </motion.button>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md mx-4"
      >
        <motion.div
          animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative rounded-2xl p-8 overflow-hidden"
          style={{
            background: "oklch(0.10 0.04 278 / 0.85)",
            backdropFilter: "blur(48px) saturate(180%)",
            WebkitBackdropFilter: "blur(48px) saturate(180%)",
            border: "1px solid oklch(0.55 0.28 290 / 0.35)",
            boxShadow:
              "0 0 0 1px oklch(0.28 0.08 285 / 0.3), 0 30px 80px oklch(0 0 0 / 0.7), 0 0 80px oklch(0.55 0.28 290 / 0.12)",
          }}
        >
          {/* Top glow line */}
          <div
            className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, oklch(0.55 0.28 290 / 0.9) 50%, transparent 100%)",
            }}
          />

          {/* Ambient corner glow */}
          <div
            className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at top right, oklch(0.55 0.28 290 / 0.10) 0%, transparent 70%)",
            }}
          />

          {/* Header */}
          <div className="text-center mb-8">
            {/* Shield icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                type: "spring",
                stiffness: 200,
              }}
              className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.38 0.32 292 / 0.3) 0%, oklch(0.52 0.30 288 / 0.2) 100%)",
                border: "1px solid oklch(0.55 0.28 290 / 0.5)",
                boxShadow:
                  "0 0 30px oklch(0.55 0.28 290 / 0.25), inset 0 1px 0 oklch(1 0 0 / 0.08)",
              }}
            >
              <Shield size={22} style={{ color: "oklch(var(--glow))" }} />
              {/* Pulse ring */}
              <div
                className="absolute inset-0 rounded-2xl animate-ping opacity-20"
                style={{ border: "1px solid oklch(0.55 0.28 290)" }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <p
                className="text-[10px] font-mono tracking-[0.4em] uppercase mb-2"
                style={{ color: "oklch(var(--primary) / 0.6)" }}
              >
                {"// RESTRICTED ACCESS"}
              </p>
              <h1
                className="font-heading font-black text-2xl tracking-tight mb-1"
                style={{
                  fontVariationSettings: '"wdth" 125',
                  background:
                    "linear-gradient(135deg, oklch(0.92 0.03 280) 0%, oklch(var(--glow)) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ADMIN ACCESS
              </h1>
              <p className="text-xs text-muted-foreground font-mono tracking-wider">
                Enter your credentials to continue
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Access ID */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <label
                htmlFor="login-access-id"
                className="block text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground mb-2"
              >
                Access ID
              </label>
              <div className="relative">
                <input
                  id="login-access-id"
                  ref={idInputRef}
                  data-ocid="login.id.input"
                  type="text"
                  value={accessId}
                  onChange={(e) => {
                    setAccessId(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter access ID..."
                  autoComplete="off"
                  spellCheck={false}
                  className={`${inputBaseClass} ${inputFocusRingStyle}`}
                  style={{
                    ...inputStyle,
                    ...(error
                      ? { borderColor: "oklch(0.577 0.245 27 / 0.7)" }
                      : {}),
                  }}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <label
                htmlFor="login-password"
                className="block text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  data-ocid="login.password.input"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter password..."
                  autoComplete="current-password"
                  className={`${inputBaseClass} ${inputFocusRingStyle}`}
                  style={{
                    ...inputStyle,
                    ...(error
                      ? { borderColor: "oklch(0.577 0.245 27 / 0.7)" }
                      : {}),
                  }}
                />
              </div>
            </motion.div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  data-ocid="login.error_state"
                  initial={{ opacity: 0, y: -5, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -5, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 overflow-hidden"
                  style={{
                    background: "oklch(0.577 0.245 27 / 0.1)",
                    border: "1px solid oklch(0.577 0.245 27 / 0.4)",
                  }}
                >
                  <AlertCircle
                    size={14}
                    className="shrink-0"
                    style={{ color: "oklch(0.75 0.18 27)" }}
                  />
                  <p
                    className="text-xs font-mono tracking-wider"
                    style={{ color: "oklch(0.75 0.18 27)" }}
                  >
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <button
                type="submit"
                data-ocid="login.submit_button"
                disabled={isSubmitting}
                className="relative w-full py-3.5 rounded-xl font-mono font-bold text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.38 0.32 292) 0%, oklch(0.52 0.30 288) 100%)",
                  boxShadow:
                    "0 0 20px oklch(0.55 0.28 290 / 0.4), 0 0 40px oklch(0.55 0.28 290 / 0.15), 0 4px 15px oklch(0 0 0 / 0.3)",
                  color: "oklch(0.98 0.005 280)",
                }}
              >
                {/* Button shimmer */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 0%, oklch(1 0 0 / 0.08) 50%, transparent 100%)",
                  }}
                />

                <div className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div
                        className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                        style={{ borderColor: "oklch(0.98 0.005 280 / 0.6)" }}
                      />
                      <span>AUTHENTICATING...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      <span>AUTHENTICATE</span>
                    </>
                  )}
                </div>
              </button>
            </motion.div>
          </form>

          {/* Bottom security badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="mt-6 flex items-center justify-center gap-2"
          >
            <div
              className="w-1 h-1 rounded-full animate-pulse"
              style={{ background: "oklch(0.55 0.28 290 / 0.6)" }}
            />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/40">
              Secure Admin Channel
            </span>
            <div
              className="w-1 h-1 rounded-full animate-pulse"
              style={{
                background: "oklch(0.55 0.28 290 / 0.6)",
                animationDelay: "0.5s",
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
