import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderGit2,
  Globe,
  MessageSquare,
  Monitor,
  Package,
  Play,
  Star,
  Sword,
  Trophy,
  Users,
  X,
  ZoomIn,
} from "lucide-react";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

/* ─── Types ─────────────────────────────────────────────────────── */
type ProjectCategory = "website" | "minecraft";

interface Screenshot {
  src: string;
  caption: string;
}

interface ShowcaseProject {
  title: string;
  projectType: string;
  role: string;
  description: string;
  videoSrc?: string;
  features: string[];
  screenshots: Screenshot[];
  liveSiteUrl?: string;
  category: ProjectCategory;
}

interface CompactProject {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  projectType: string;
  role: string;
  desc: string;
  features: string[];
  category: ProjectCategory;
}

/* ─── Static data ────────────────────────────────────────────────── */
const FEATURED_PROJECT: ShowcaseProject = {
  title: "Jerry SMP Website",
  projectType: "Minecraft Server Website",
  role: "Developer",
  description:
    "A modern Minecraft server website featuring game mode pages, voting systems, leaderboards, and a server store. Built with performance and player experience in mind, delivering a seamless digital home for the Jerry SMP community.",
  videoSrc: undefined,
  features: [
    "Server Store System",
    "Voting Integration",
    "Leaderboards",
    "Game Mode Pages",
    "Responsive UI Design",
  ],
  screenshots: [
    { src: "/assets/generated/mc-spawn.dim_800x500.jpg", caption: "Homepage" },
    {
      src: "/assets/generated/mc-pvp-arena.dim_800x500.jpg",
      caption: "Game Modes",
    },
    {
      src: "/assets/generated/mc-smp-world.dim_800x500.jpg",
      caption: "Server World",
    },
    {
      src: "/assets/generated/mc-event-arena.dim_800x500.jpg",
      caption: "Event Arena",
    },
    {
      src: "/assets/generated/mc-lobby.dim_800x500.jpg",
      caption: "Server Lobby",
    },
  ],
  liveSiteUrl: undefined,
  category: "website",
};

const COMPACT_PROJECTS: CompactProject[] = [
  {
    icon: Users,
    title: "Staff Management Systems",
    projectType: "Server Administration",
    role: "Developer",
    desc: "Custom-built staff hierarchy with permission tiers and ticket routing",
    features: [
      "Role Hierarchy",
      "Permission Tiers",
      "Ticket Routing",
      "Staff Onboarding",
    ],
    category: "minecraft",
  },
  {
    icon: Package,
    title: "Custom Kit Systems",
    projectType: "Gameplay Design",
    role: "Developer",
    desc: "Balanced kit configurations for competitive PvP gameplay",
    features: ["Kit Balance", "PvP Presets", "Custom Abilities"],
    category: "minecraft",
  },
  {
    icon: MessageSquare,
    title: "Discord Management Systems",
    projectType: "Community Management",
    role: "Developer",
    desc: "Bot configs and role systems for community Discord servers",
    features: ["Bot Configuration", "Role Automation", "Moderation Workflows"],
    category: "minecraft",
  },
  {
    icon: Trophy,
    title: "Tournament Systems",
    projectType: "Event Management",
    role: "Developer",
    desc: "Automated bracket management and reward distribution",
    features: ["Bracket Management", "Auto Rewards", "Leaderboards"],
    category: "minecraft",
  },
  {
    icon: Globe,
    title: "Minecraft Server Websites",
    projectType: "Web Development",
    role: "Developer",
    desc: "Modern websites for Minecraft servers with voting, store, and community hubs",
    features: [
      "Voting Integration",
      "Server Store",
      "Community Hub",
      "Responsive Design",
    ],
    category: "website",
  },
];

/* ─── Variants ───────────────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

/* ─── VideoPlayer ─────────────────────────────────────────────── */
function ProjectVideoPlayer({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isYouTube =
    src.includes("youtube.com/watch") || src.includes("youtu.be/");
  const isVimeo = src.includes("vimeo.com/");
  const isEmbed = isYouTube || isVimeo;

  const getEmbedUrl = useCallback(() => {
    if (isYouTube) {
      let videoId = "";
      if (src.includes("youtu.be/")) {
        videoId = src.split("youtu.be/")[1]?.split("?")[0] ?? "";
      } else {
        const match = src.match(/[?&]v=([^&]+)/);
        videoId = match?.[1] ?? "";
      }
      return isPlaying
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
        : `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`;
    }
    if (isVimeo) {
      const videoId = src.split("vimeo.com/")[1]?.split("?")[0] ?? "";
      return isPlaying
        ? `https://player.vimeo.com/video/${videoId}?autoplay=1`
        : `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1`;
    }
    return src;
  }, [src, isYouTube, isVimeo, isPlaying]);

  const handlePlay = () => {
    if (!isEmbed && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
    }
    setIsPlaying(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        aspectRatio: "16 / 9",
        border: "1px solid oklch(0.55 0.28 290 / 0.35)",
        boxShadow:
          "0 0 40px oklch(0.55 0.28 290 / 0.2), 0 8px 40px oklch(0 0 0 / 0.5)",
        background: "oklch(0.08 0.03 280)",
      }}
    >
      {isEmbed ? (
        <iframe
          src={getEmbedUrl()}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Project video preview"
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      {/* Play button overlay — hidden once clicked */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.button
            type="button"
            data-ocid="projects.video.play_button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center group cursor-pointer"
            style={{ background: "oklch(0.05 0.02 280 / 0.45)" }}
            aria-label="Play project video"
          >
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.45 0.28 290) 0%, oklch(0.55 0.30 305) 100%)",
                boxShadow:
                  "0 0 30px oklch(0.55 0.28 290 / 0.6), 0 4px 20px oklch(0 0 0 / 0.4)",
                border: "1px solid oklch(0.72 0.18 295 / 0.6)",
              }}
            >
              <Play size={28} className="text-white ml-1" fill="white" />
            </motion.div>
            <span className="sr-only">Play video</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Glass top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.72 0.18 295 / 0.6), transparent)",
        }}
      />
    </motion.div>
  );
}

/* ─── Screenshot thumbnail ───────────────────────────────────── */
function ScreenshotThumb({
  screenshot,
  index,
  onOpen,
}: {
  screenshot: Screenshot;
  index: number;
  onOpen: (i: number) => void;
}) {
  const ocidMap: Record<number, string> = {
    0: "projects.screenshot.item.1",
    1: "projects.screenshot.item.2",
    2: "projects.screenshot.item.3",
    3: "projects.screenshot.item.4",
    4: "projects.screenshot.item.5",
  };

  return (
    <motion.button
      type="button"
      data-ocid={ocidMap[index] ?? `projects.screenshot.item.${index + 1}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="relative flex-shrink-0 group cursor-pointer"
      style={{ width: 220, padding: "6px" }}
      onClick={() => onOpen(index)}
      aria-label={`View ${screenshot.caption} screenshot`}
    >
      {/* Minecraft corner brackets */}
      <span
        className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-violet-500/50 group-hover:border-violet-400/90 transition-colors duration-300 pointer-events-none"
        style={{ borderRadius: "2px 0 0 0" }}
      />
      <span
        className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-violet-500/50 group-hover:border-violet-400/90 transition-colors duration-300 pointer-events-none"
        style={{ borderRadius: "0 2px 0 0" }}
      />
      <span
        className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-violet-500/50 group-hover:border-violet-400/90 transition-colors duration-300 pointer-events-none"
        style={{ borderRadius: "0 0 0 2px" }}
      />
      <span
        className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-violet-500/50 group-hover:border-violet-400/90 transition-colors duration-300 pointer-events-none"
        style={{ borderRadius: "0 0 2px 0" }}
      />

      <div
        className="relative overflow-hidden rounded-xl border border-border/40 group-hover:border-violet-500/40 transition-colors duration-300"
        style={{ aspectRatio: "16 / 10" }}
      >
        <img
          src={screenshot.src}
          alt={screenshot.caption}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
          <ZoomIn size={22} className="text-glow" />
          <span className="text-xs font-semibold tracking-widest uppercase text-foreground">
            {screenshot.caption}
          </span>
        </div>

        {/* Glow ring on hover */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            boxShadow:
              "inset 0 0 0 1px oklch(0.55 0.28 290 / 0.6), 0 0 16px oklch(0.55 0.28 290 / 0.2)",
          }}
        />
      </div>

      <p className="text-xs text-muted-foreground text-center mt-1.5 truncate px-1">
        {screenshot.caption}
      </p>
    </motion.button>
  );
}

/* ─── Screenshot Slider ──────────────────────────────────────── */
function ProjectScreenshotSlider({
  screenshots,
  onOpenLightbox,
}: {
  screenshots: Screenshot[];
  onOpenLightbox: (index: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Scroll left arrow */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            style={{
              background: "oklch(0.14 0.05 280)",
              border: "1px solid oklch(0.55 0.28 290 / 0.4)",
              boxShadow: "0 0 12px oklch(0.55 0.28 290 / 0.25)",
            }}
            aria-label="Scroll screenshots left"
          >
            <ChevronLeft size={14} className="text-glow" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scroll right arrow */}
      <AnimatePresence>
        {canScrollRight && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            style={{
              background: "oklch(0.14 0.05 280)",
              border: "1px solid oklch(0.55 0.28 290 / 0.4)",
              boxShadow: "0 0 12px oklch(0.55 0.28 290 / 0.25)",
            }}
            aria-label="Scroll screenshots right"
          >
            <ChevronRight size={14} className="text-glow" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto py-1 px-1"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "oklch(0.55 0.28 290 / 0.3) transparent",
        }}
      >
        {screenshots.map((shot, i) => (
          <ScreenshotThumb
            key={shot.src}
            screenshot={shot}
            index={i}
            onOpen={onOpenLightbox}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Lightbox ───────────────────────────────────────────────── */
function ProjectLightbox({
  screenshots,
  activeIndex,
  onClose,
  onNavigate,
}: {
  screenshots: Screenshot[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (idx: number) => void;
}) {
  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && activeIndex !== null && activeIndex > 0)
        onNavigate(activeIndex - 1);
      if (
        e.key === "ArrowRight" &&
        activeIndex !== null &&
        activeIndex < screenshots.length - 1
      )
        onNavigate(activeIndex + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNavigate, activeIndex, screenshots.length]);

  // Lock scroll
  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  return (
    <AnimatePresence>
      {activeIndex !== null && screenshots[activeIndex] && (
        <motion.div
          data-ocid="projects.lightbox.modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "oklch(0.04 0.01 280 / 0.95)" }}
          onClick={onClose}
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
              src={screenshots[activeIndex].src}
              alt={screenshots[activeIndex].caption}
              className="w-full rounded-2xl"
              style={{
                border: "1px solid oklch(0.55 0.28 290 / 0.35)",
                boxShadow:
                  "0 0 60px oklch(0.55 0.28 290 / 0.3), 0 16px 60px oklch(0 0 0 / 0.6)",
              }}
            />

            {/* Caption */}
            <div className="absolute -bottom-10 left-0 right-0 text-center">
              <span className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
                {screenshots[activeIndex].caption}
              </span>
            </div>

            {/* Close */}
            <button
              type="button"
              data-ocid="projects.lightbox.close_button"
              onClick={onClose}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full glass-strong border border-primary/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/80 transition-all duration-200"
              aria-label="Close lightbox"
            >
              <X size={18} />
            </button>

            {/* Prev / Next */}
            {activeIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(activeIndex - 1);
                }}
                className="absolute top-1/2 -left-14 -translate-y-1/2 w-10 h-10 rounded-full glass-strong border border-primary/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/80 transition-all duration-200"
                aria-label="Previous screenshot"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {activeIndex < screenshots.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(activeIndex + 1);
                }}
                className="absolute top-1/2 -right-14 -translate-y-1/2 w-10 h-10 rounded-full glass-strong border border-primary/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/80 transition-all duration-200"
                aria-label="Next screenshot"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Featured Project Card ──────────────────────────────────── */
function FeaturedProjectCard({ project }: { project: ShowcaseProject }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const hasVideo = !!project.videoSrc;

  return (
    <>
      <motion.div
        data-ocid="projects.featured.card"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="glass rounded-2xl border overflow-hidden mb-16 relative"
        style={{
          borderColor: "oklch(0.55 0.28 290 / 0.35)",
          boxShadow:
            "0 0 60px oklch(0.55 0.28 290 / 0.12), 0 16px 60px oklch(0 0 0 / 0.5)",
        }}
      >
        {/* Ambient top glow line */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.55 0.28 290 / 0.8), transparent)",
          }}
        />

        {/* Background radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 50% 0%, oklch(0.55 0.28 290 / 0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 p-6 md:p-10">
          {/* Title + Featured badge */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground">
              {project.title}
            </h3>
            <span
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{
                background: "oklch(0.55 0.28 290 / 0.18)",
                border: "1px solid oklch(0.55 0.28 290 / 0.5)",
                color: "oklch(0.78 0.18 290)",
              }}
            >
              <Star size={10} fill="currentColor" />
              Featured
            </span>
          </div>

          {/* VIDEO or SCREENSHOT GALLERY AT TOP (fallback) */}
          {hasVideo ? (
            <div className="mb-8">
              <ProjectVideoPlayer src={project.videoSrc!} />
            </div>
          ) : (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={14} className="text-muted-foreground" />
                <span className="text-xs tracking-widest uppercase text-muted-foreground font-medium">
                  Screenshots
                </span>
              </div>
              <ProjectScreenshotSlider
                screenshots={project.screenshots}
                onOpenLightbox={setLightboxIdx}
              />
            </div>
          )}

          {/* Description block */}
          <div
            className="rounded-xl p-5 mb-8"
            style={{
              background: "oklch(0.10 0.04 280 / 0.6)",
              border: "1px solid oklch(0.55 0.28 290 / 0.15)",
            }}
          >
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1">
                  Type
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {project.projectType}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1">
                  Role
                </p>
                <p className="text-sm font-semibold text-glow">
                  {project.role}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1">
                  Status
                </p>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "rgb(var(--mc-green))" }}
                  />
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "rgb(var(--mc-green))" }}
                  >
                    Complete
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Feature list */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-4">
              Key Features
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {project.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <CheckCircle2
                    size={14}
                    style={{ color: "oklch(0.72 0.18 295)", flexShrink: 0 }}
                  />
                  <span className="text-sm text-foreground font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Screenshot slider BELOW description (only if video was shown above) */}
          {hasVideo && project.screenshots.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={14} className="text-muted-foreground" />
                <span className="text-xs tracking-widest uppercase text-muted-foreground font-medium">
                  Screenshots
                </span>
              </div>
              <ProjectScreenshotSlider
                screenshots={project.screenshots}
                onOpenLightbox={setLightboxIdx}
              />
            </div>
          )}

          {/* Live site button */}
          {project.liveSiteUrl && (
            <a
              href={project.liveSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="projects.live_site.button"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading font-bold text-sm uppercase tracking-wider text-white relative overflow-hidden group cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.45 0.28 290) 0%, oklch(0.55 0.30 305) 100%)",
                boxShadow:
                  "0 0 20px oklch(0.55 0.28 290 / 0.45), 0 4px 16px oklch(0.55 0.28 290 / 0.3)",
                transition: "box-shadow 0.3s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.boxShadow =
                  "0 0 35px oklch(0.55 0.28 290 / 0.7), 0 6px 24px oklch(0.55 0.28 290 / 0.45)";
                el.style.transform = "translateY(-2px) scale(1.02)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.boxShadow =
                  "0 0 20px oklch(0.55 0.28 290 / 0.45), 0 4px 16px oklch(0.55 0.28 290 / 0.3)";
                el.style.transform = "translateY(0) scale(1)";
              }}
            >
              <ExternalLink size={15} />
              View Live Site
            </a>
          )}
        </div>
      </motion.div>

      {/* Lightbox */}
      <ProjectLightbox
        screenshots={project.screenshots}
        activeIndex={lightboxIdx}
        onClose={() => setLightboxIdx(null)}
        onNavigate={setLightboxIdx}
      />
    </>
  );
}

/* ─── Compact Project Card ───────────────────────────────────── */
function CompactCard({
  project,
  index,
}: {
  project: CompactProject;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const Icon = project.icon;

  const ocidMap: Record<number, string> = {
    0: "projects.item.1",
    1: "projects.item.2",
    2: "projects.item.3",
    3: "projects.item.4",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ((e.clientX - cx) / (rect.width / 2)) * 6;
    const dy = ((e.clientY - cy) / (rect.height / 2)) * -6;
    setTilt({ x: dy, y: dx });
  };

  return (
    <motion.div
      data-ocid={ocidMap[index] ?? `projects.item.${index + 1}`}
      variants={cardVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      style={{
        transform: isHovered
          ? `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-10px) scale(1.03)`
          : "perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)",
        transition: "transform 0.25s ease",
        transformStyle: "preserve-3d",
      }}
      className="glass rounded-2xl p-6 border border-border/40 cursor-default group relative overflow-hidden"
    >
      {/* Hover glow */}
      <div
        className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(circle at 50% 0%, oklch(0.55 0.28 290 / 0.18) 0%, transparent 70%)",
          boxShadow: "inset 0 0 0 1px oklch(0.55 0.28 290 / 0.45)",
        }}
      />

      {/* Minecraft corner brackets */}
      <div
        className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <span
          className="absolute top-0 left-0 w-3 h-3 border-t border-l border-violet-400/60"
          style={{ borderRadius: "2px 0 0 0" }}
        />
        <span
          className="absolute top-0 right-0 w-3 h-3 border-t border-r border-violet-400/60"
          style={{ borderRadius: "0 2px 0 0" }}
        />
        <span
          className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-violet-400/60"
          style={{ borderRadius: "0 0 0 2px" }}
        />
        <span
          className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-violet-400/60"
          style={{ borderRadius: "0 0 2px 0" }}
        />
      </div>

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
          isHovered
            ? "bg-primary/20 border border-primary/50 shadow-neon"
            : "bg-primary/10 border border-primary/20"
        }`}
      >
        <Icon size={22} className="text-glow" />
      </div>

      <h3 className="font-heading font-bold text-base text-foreground mb-1 group-hover:text-glow transition-colors duration-300">
        {project.title}
      </h3>
      <p
        className="text-xs mb-3 font-medium"
        style={{ color: "oklch(0.65 0.15 290)" }}
      >
        {project.projectType}
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {project.desc}
      </p>

      {/* Feature bullets */}
      <ul className="space-y-1.5">
        {project.features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span
              className="w-1.5 h-1.5 rounded-sm flex-shrink-0"
              style={{ background: "oklch(0.55 0.28 290 / 0.7)" }}
            />
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ─── Category Tab Bar ──────────────────────────────────────────── */
function CategoryTabBar({
  active,
  onChange,
}: {
  active: ProjectCategory;
  onChange: (cat: ProjectCategory) => void;
}) {
  const tabs: { id: ProjectCategory; label: string; icon: React.ReactNode }[] =
    [
      {
        id: "website",
        label: "Website Showcase",
        icon: <Monitor size={15} />,
      },
      {
        id: "minecraft",
        label: "Minecraft Showcase",
        icon: <Sword size={15} />,
      },
    ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2 p-1.5 rounded-2xl mb-12 w-fit mx-auto"
      style={{
        background: "oklch(0.10 0.04 280 / 0.7)",
        border: "1px solid oklch(0.55 0.28 290 / 0.2)",
        backdropFilter: "blur(12px)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            data-ocid={`projects.${tab.id === "website" ? "website" : "minecraft"}_tab`}
            onClick={() => onChange(tab.id)}
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            style={{
              color: isActive ? "oklch(0.95 0.05 290)" : "oklch(0.60 0.08 290)",
            }}
            aria-pressed={isActive}
          >
            {/* Active pill background */}
            <AnimatePresence>
              {isActive && (
                <motion.span
                  layoutId="tab-active-pill"
                  className="absolute inset-0 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.25,
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.38 0.22 290) 0%, oklch(0.45 0.26 305) 100%)",
                    boxShadow:
                      "0 0 18px oklch(0.55 0.28 290 / 0.45), 0 2px 10px oklch(0 0 0 / 0.35)",
                    border: "1px solid oklch(0.60 0.22 290 / 0.5)",
                  }}
                />
              )}
            </AnimatePresence>

            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
}

/* ─── Main Section ───────────────────────────────────────────── */
export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] =
    useState<ProjectCategory>("website");

  const filteredCompact = COMPACT_PROJECTS.filter(
    (p) => p.category === activeCategory,
  );
  const showFeatured =
    activeCategory === "website" && FEATURED_PROJECT.category === "website";

  return (
    <section
      id="projects"
      data-ocid="projects.section"
      className="py-28 px-6 max-w-6xl mx-auto"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <FolderGit2 size={20} className="text-glow" />
          </div>
          <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">
            Portfolio
          </span>
        </div>
        <h2 className="section-title text-gradient-purple">
          Projects &amp; Systems Built
        </h2>
        <p className="text-muted-foreground max-w-2xl mt-4 text-base leading-relaxed">
          A selection of Minecraft server systems, management solutions, and web
          projects developed for communities across multiple networks.
        </p>
      </motion.div>

      {/* Category tab bar */}
      <CategoryTabBar active={activeCategory} onChange={setActiveCategory} />

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Featured project — only for website category */}
          {showFeatured && <FeaturedProjectCard project={FEATURED_PROJECT} />}

          {/* Compact project grid */}
          {filteredCompact.length > 0 && (
            <>
              {showFeatured && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="flex-1 h-px"
                      style={{
                        background:
                          "linear-gradient(90deg, oklch(0.55 0.28 290 / 0.4), transparent)",
                      }}
                    />
                    <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium px-2">
                      More Projects
                    </span>
                    <div
                      className="flex-1 h-px"
                      style={{
                        background:
                          "linear-gradient(270deg, oklch(0.55 0.28 290 / 0.4), transparent)",
                      }}
                    />
                  </div>
                </motion.div>
              )}

              <motion.div
                className={`grid gap-6 ${
                  activeCategory === "minecraft"
                    ? "sm:grid-cols-2 lg:grid-cols-4"
                    : "sm:grid-cols-2"
                }`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredCompact.map((project, i) => (
                  <CompactCard
                    key={project.title}
                    project={project}
                    index={i}
                  />
                ))}
              </motion.div>
            </>
          )}

          {/* Empty state */}
          {!showFeatured && filteredCompact.length === 0 && (
            <motion.div
              data-ocid="projects.empty_state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: "oklch(0.14 0.05 280 / 0.6)",
                  border: "1px solid oklch(0.55 0.28 290 / 0.2)",
                }}
              >
                <FolderGit2 size={28} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                No projects in this category yet.
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
