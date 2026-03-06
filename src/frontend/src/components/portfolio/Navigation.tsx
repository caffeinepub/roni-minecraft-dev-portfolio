import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#hero", ocid: "nav.home.link" },
  { label: "Experience", href: "#experience", ocid: "nav.experience.link" },
  { label: "Skills", href: "#skills", ocid: "nav.skills.link" },
  { label: "Projects", href: "#projects", ocid: "nav.projects.link" },
  { label: "Services", href: "#services", ocid: "nav.services.link" },
  { label: "Gallery", href: "#gallery", ocid: "nav.gallery.link" },
  { label: "Contact", href: "#contact", ocid: "nav.contact.link" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-strong shadow-neon py-3" : "bg-transparent py-5"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavClick("#hero")}
            className="font-heading font-black text-2xl text-gradient-purple tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
            style={{ fontVariationSettings: '"wdth" 125' }}
          >
            RONI<span className="text-glow">.DEV</span>
          </button>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  type="button"
                  data-ocid={link.ocid}
                  onClick={() => handleNavClick(link.href)}
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md"
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute inset-0 rounded-md bg-primary/0 group-hover:bg-primary/10 transition-colors duration-200" />
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 bg-glow group-hover:w-4/5 transition-all duration-300" />
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-16 z-40 glass-strong border-b border-border mx-4 rounded-2xl p-4"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    data-ocid={link.ocid}
                    onClick={() => handleNavClick(link.href)}
                    className="block w-full text-left px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-lg transition-all duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
