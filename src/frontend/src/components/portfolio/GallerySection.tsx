import { AnimatePresence, motion } from "framer-motion";
import { Images, X, ZoomIn } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const images = [
  {
    src: "/assets/generated/mc-spawn.dim_800x500.jpg",
    caption: "Spawn Build",
  },
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

function GalleryItem({
  img,
  index,
  onOpen,
}: {
  img: { src: string; caption: string };
  index: number;
  onOpen: (i: number) => void;
}) {
  return (
    <motion.button
      type="button"
      key={img.src}
      data-ocid={`gallery.item.${index + 1}`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="relative group rounded-2xl overflow-hidden aspect-[16/10] border border-border/40 w-full text-left"
      onClick={() => onOpen(index)}
      aria-label={`Open ${img.caption} in fullscreen`}
    >
      <img
        src={img.src}
        alt={img.caption}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
        <ZoomIn size={28} className="text-glow" />
        <span className="text-sm font-semibold tracking-widest uppercase text-foreground">
          {img.caption}
        </span>
      </div>

      {/* Glow border on hover */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: "inset 0 0 0 1px oklch(0.55 0.28 290 / 0.6)",
        }}
      />
    </motion.button>
  );
}

export default function GallerySection() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);

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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <GalleryItem
            key={img.src}
            img={img}
            index={i}
            onOpen={setLightboxIdx}
          />
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
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
                src={images[lightboxIdx].src}
                alt={images[lightboxIdx].caption}
                className="w-full rounded-2xl border border-primary/30 shadow-neon-lg"
              />
              <div className="absolute -bottom-10 left-0 right-0 text-center">
                <span className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
                  {images[lightboxIdx].caption}
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
