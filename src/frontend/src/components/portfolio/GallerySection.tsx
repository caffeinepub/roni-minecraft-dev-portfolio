import { Images, MessageCircle, X, ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { GalleryImage } from "../../backend.d";
import { useActor } from "../../hooks/useActor";

/* ─── Fallback images shown while actor loads or if no images exist ── */
const FALLBACK_IMAGES: { src: string; caption: string }[] = [
  { src: "/assets/generated/mc-spawn.dim_800x500.jpg", caption: "Spawn Build" },
  {
    src: "/assets/generated/mc-pvp-arena.dim_800x500.jpg",
    caption: "PvP Arena",
  },
  {
    src: "/assets/generated/mc-smp-world.dim_800x500.jpg",
    caption: "SMP World",
  },
  {
    src: "/assets/generated/mc-event-arena.dim_800x500.jpg",
    caption: "Event Arena",
  },
  {
    src: "/assets/generated/mc-lifesteal.dim_800x500.jpg",
    caption: "Lifesteal Hub",
  },
  {
    src: "/assets/generated/mc-lobby.dim_800x500.jpg",
    caption: "Server Lobby",
  },
];

interface DisplayImage {
  src: string;
  caption: string;
}

function GalleryItem({
  img,
  index,
  onOpen,
}: {
  img: DisplayImage;
  index: number;
  onOpen: (i: number) => void;
}) {
  return (
    <motion.button
      type="button"
      data-ocid={`gallery.item.${index + 1}`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="relative group aspect-[16/10] w-full text-left"
      style={{ padding: "6px" }}
      onClick={() => onOpen(index)}
      aria-label={`Open ${img.caption} in fullscreen`}
    >
      {/* Minecraft-style pixel frame — 4 corner brackets */}
      {/* Top-left */}
      <span
        className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-violet-500/50 group-hover:border-violet-400/90 transition-colors duration-300 pointer-events-none"
        style={{ borderRadius: "2px 0 0 0" }}
      />
      {/* Top-right */}
      <span
        className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-violet-500/50 group-hover:border-violet-400/90 transition-colors duration-300 pointer-events-none"
        style={{ borderRadius: "0 2px 0 0" }}
      />
      {/* Bottom-left */}
      <span
        className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-violet-500/50 group-hover:border-violet-400/90 transition-colors duration-300 pointer-events-none"
        style={{ borderRadius: "0 0 0 2px" }}
      />
      {/* Bottom-right */}
      <span
        className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-violet-500/50 group-hover:border-violet-400/90 transition-colors duration-300 pointer-events-none"
        style={{ borderRadius: "0 0 2px 0" }}
      />

      {/* Inner image container */}
      <div className="relative w-full h-full overflow-hidden rounded-xl border border-border/40 group-hover:border-violet-500/40 transition-colors duration-300">
        <img
          src={img.src}
          alt={img.caption}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
          <ZoomIn size={28} className="text-glow" />
          <span className="text-sm font-semibold tracking-widest uppercase text-foreground">
            {img.caption}
          </span>
        </div>

        {/* Purple glow on hover */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            boxShadow:
              "inset 0 0 0 1px oklch(0.55 0.28 290 / 0.6), 0 0 20px oklch(0.55 0.28 290 / 0.2)",
          }}
        />
      </div>
    </motion.button>
  );
}

/* ─── Loading skeleton ───────────────────────────────────────── */
function GallerySkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((sk, i) => (
        <div
          key={sk}
          className="aspect-[16/10] rounded-2xl"
          style={{
            background: "oklch(0.12 0.04 280 / 0.6)",
            border: "1px solid oklch(var(--border) / 0.3)",
            animation: `pulse 2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function GallerySection() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  // Always start with fallback images — they're shown until backend images load
  const [displayImages, setDisplayImages] =
    useState<DisplayImage[]>(FALLBACK_IMAGES);

  const { actor, isFetching } = useActor();

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

  // Load images from actor — replace fallbacks only when backend has real images
  useEffect(() => {
    if (!actor || isFetching) return;
    let cancelled = false;

    actor
      .getAllImages()
      .then((imgs: GalleryImage[]) => {
        if (cancelled) return;
        if (imgs.length > 0) {
          const sorted = [...imgs].sort((a, b) => Number(a.order - b.order));
          setDisplayImages(
            sorted.map((img) => ({ src: img.url, caption: img.caption })),
          );
        }
        // If backend returned empty array, keep fallback images (no-op)
      })
      .catch(() => {
        // On error, keep fallback images (no-op)
      });

    return () => {
      cancelled = true;
    };
  }, [actor, isFetching]);

  // ESC to close lightbox
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeLightbox]);

  // Lock scroll when lightbox open
  useEffect(() => {
    if (lightboxIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIdx]);

  // Never show a skeleton — fallback images are always ready to display
  const showSkeleton = false;

  return (
    <section id="gallery" className="py-28 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <Images size={20} className="text-glow" />
          </div>
          <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">
            Showcase
          </span>
        </div>
        <h2 className="section-title text-gradient-purple">Server Showcase</h2>
      </motion.div>

      {showSkeleton ? (
        <GallerySkeleton />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayImages.map((img, i) => (
            <GalleryItem
              key={`${img.src}-${i}`}
              img={img}
              index={i}
              onOpen={setLightboxIdx}
            />
          ))}
        </div>
      )}

      {/* Request a Quote — placed right after the gallery grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, delay: 0.1 }}
        className="mt-16 glass rounded-2xl p-10 border border-primary/30 relative overflow-hidden text-center"
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
              className="px-3 py-1 rounded-lg text-sm font-mono"
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
            data-ocid="gallery.request_quote.button"
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && displayImages[lightboxIdx] && (
          <motion.div
            data-ocid="gallery.lightbox.modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "oklch(0.05 0.01 280 / 0.95)" }}
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={displayImages[lightboxIdx].src}
                alt={displayImages[lightboxIdx].caption}
                className="w-full rounded-2xl border border-primary/30 shadow-neon-lg"
              />
              <div className="absolute -bottom-10 left-0 right-0 text-center">
                <span className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
                  {displayImages[lightboxIdx].caption}
                </span>
              </div>

              <button
                type="button"
                data-ocid="gallery.lightbox.close_button"
                onClick={closeLightbox}
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full glass-strong border border-primary/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/80 transition-all duration-200"
                aria-label="Close lightbox"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
