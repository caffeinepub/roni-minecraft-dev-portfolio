import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Radio,
  Send,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { useActor } from "../../hooks/useActor";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const { actor } = useActor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setFormState("loading");
    setErrorMsg("");

    try {
      if (actor) {
        await actor.submitMessage(name.trim(), email.trim(), message.trim());
      }
      setFormState("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("Contact form error:", err);
      setErrorMsg("Transmission failed. Please try again.");
      setFormState("error");
    }
  };

  const inputBase =
    "w-full rounded-xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all duration-250 focus:outline-none font-body";
  const inputStyle: React.CSSProperties = {
    background: "oklch(0.09 0.03 280 / 0.85)",
    border: "1px solid oklch(0.28 0.08 285 / 0.7)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow:
      "inset 0 1px 0 oklch(0.95 0.01 280 / 0.04), inset 0 -1px 0 oklch(0 0 0 / 0.2)",
  };
  const inputFocusClass =
    "focus:border-primary/80 focus:shadow-[0_0_0_2px_oklch(0.55_0.28_290/0.25),0_0_25px_oklch(0.55_0.28_290/0.2),inset_0_1px_0_oklch(0.95_0.01_280/0.05)]";

  return (
    <section id="contact" className="py-28 px-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <Radio size={20} className="text-glow" />
          </div>
          <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">
            Open Comm Channel
          </span>
        </div>
        <h2 className="section-title text-gradient-purple">
          Let's Work Together
        </h2>
        <p className="mt-3 text-muted-foreground text-base">
          Initialize a transmission and I'll respond within 24 hours.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.65, delay: 0.1 }}
        className="glass-strong neon-border rounded-2xl p-8 md:p-10 relative overflow-hidden"
      >
        {/* Corner glow */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, oklch(0.55 0.28 290 / 0.7) 50%, transparent 100%)",
          }}
        />
        <div
          className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at top right, oklch(0.55 0.28 290 / 0.1) 0%, transparent 70%)",
          }}
        />

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6 relative z-10"
        >
          {/* Name field */}
          <div className="space-y-2">
            <label
              htmlFor="contact-name"
              className="flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.3em] uppercase text-glow"
            >
              <span className="opacity-50 text-[9px]">01</span>
              DESIGNATION
              <span className="text-muted-foreground/60 font-normal tracking-normal">
                / NAME
              </span>
            </label>
            <input
              id="contact-name"
              data-ocid="contact.name.input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              autoComplete="name"
              className={`${inputBase} ${inputFocusClass}`}
              style={inputStyle}
            />
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <label
              htmlFor="contact-email"
              className="flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.3em] uppercase text-glow"
            >
              <span className="opacity-50 text-[9px]">02</span>
              RETURN ADDRESS
              <span className="text-muted-foreground/60 font-normal tracking-normal">
                / EMAIL
              </span>
            </label>
            <input
              id="contact-email"
              data-ocid="contact.email.input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
              className={`${inputBase} ${inputFocusClass}`}
              style={inputStyle}
            />
          </div>

          {/* Message field */}
          <div className="space-y-2">
            <label
              htmlFor="contact-message"
              className="flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.3em] uppercase text-glow"
            >
              <span className="opacity-50 text-[9px]">03</span>
              TRANSMISSION DATA
              <span className="text-muted-foreground/60 font-normal tracking-normal">
                / MESSAGE
              </span>
            </label>
            <textarea
              id="contact-message"
              data-ocid="contact.message.textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your project..."
              required
              rows={5}
              className={`${inputBase} ${inputFocusClass} resize-none`}
              style={inputStyle}
            />
          </div>

          {/* Error message */}
          {formState === "error" && (
            <div
              data-ocid="contact.submit_button.error_state"
              className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30"
            >
              <AlertCircle
                size={16}
                className="text-destructive flex-shrink-0"
              />
              <p className="text-sm text-destructive">{errorMsg}</p>
            </div>
          )}

          {/* Success message */}
          {formState === "success" && (
            <div
              data-ocid="contact.submit_button.success_state"
              className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/30"
            >
              <CheckCircle2 size={16} className="text-glow flex-shrink-0" />
              <p className="text-sm text-glow font-medium">
                Transmission received. I'll be in touch shortly.
              </p>
            </div>
          )}

          {/* Submit button */}
          <div className="pt-2">
            <button
              data-ocid="contact.submit_button"
              type="submit"
              disabled={formState === "loading" || formState === "success"}
              className="w-full relative overflow-hidden rounded-xl py-5 px-8 font-mono font-bold text-xs tracking-[0.35em] uppercase text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 hover:-translate-y-1 group"
              style={{
                background:
                  formState === "success"
                    ? "oklch(0.38 0.12 290)"
                    : "linear-gradient(135deg, oklch(0.38 0.32 292) 0%, oklch(0.52 0.30 288) 40%, oklch(0.60 0.26 296) 100%)",
                boxShadow:
                  formState !== "loading" && formState !== "success"
                    ? "0 0 30px oklch(0.55 0.28 290 / 0.55), 0 0 70px oklch(0.55 0.28 290 / 0.28), inset 0 1px 0 oklch(0.85 0.1 290 / 0.25), inset 0 -1px 0 oklch(0 0 0 / 0.3)"
                    : "none",
              }}
            >
              {/* Shimmer sweep on hover */}
              <span
                className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, oklch(0.95 0.01 280 / 0.12) 50%, transparent 100%)",
                }}
              />

              {formState === "loading" ? (
                <span
                  data-ocid="contact.submit_button.loading_state"
                  className="flex items-center justify-center gap-3 relative z-10"
                >
                  <Loader2 size={16} className="animate-spin" />
                  TRANSMITTING...
                </span>
              ) : formState === "success" ? (
                <span className="flex items-center justify-center gap-3 relative z-10">
                  <CheckCircle2 size={16} />
                  TRANSMISSION COMPLETE
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3 relative z-10">
                  <Send size={15} />
                  INITIALIZE TRANSMISSION
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Discord CTA */}
        <div className="mt-8 pt-8 border-t border-border/40 text-center relative z-10">
          <p className="text-sm text-muted-foreground mb-4">
            Or reach me directly on Discord
          </p>
          <a
            href="https://discord.com/users/roni.is.here"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="contact.discord.button"
            className="inline-flex items-center gap-3 px-7 py-3 rounded-xl border border-border/60 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/10 transition-all duration-250 hover:shadow-neon hover:-translate-y-0.5"
          >
            <MessageCircle size={18} className="text-glow" />
            Add me on Discord — roni.is.here
          </a>
        </div>
      </motion.div>
    </section>
  );
}
