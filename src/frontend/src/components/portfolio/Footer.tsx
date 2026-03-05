const footerLinks = [
  { label: "Home", href: "#hero", ocid: "footer.home.link" },
  { label: "Experience", href: "#experience", ocid: "footer.experience.link" },
  { label: "Skills", href: "#skills", ocid: "footer.skills.link" },
  { label: "Projects", href: "#projects", ocid: "footer.projects.link" },
  { label: "Services", href: "#services", ocid: "footer.services.link" },
  { label: "Contact", href: "#contact", ocid: "footer.contact.link" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative py-12 px-6 mt-8">
      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, oklch(0.06 0.02 280) 100%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto flex flex-col items-center gap-6">
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollTo("#hero")}
          className="font-heading font-black text-xl text-gradient-purple tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
          style={{ fontVariationSettings: '"wdth" 125' }}
        >
          RONI<span className="text-glow">.DEV</span>
        </button>

        {/* Links */}
        <nav>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  data-ocid={link.ocid}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(link.href);
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground/60 text-center">
          © {year} Roni. All rights reserved.
        </p>

        {/* Caffeine attribution */}
        <p className="text-xs text-muted-foreground/40 text-center">
          Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground/70 transition-colors duration-200 underline underline-offset-2"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
