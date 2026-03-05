# Roni — Minecraft Dev Portfolio

## Current State
New project with no existing frontend or backend code.

## Requested Changes (Diff)

### Add
- Full single-page portfolio website for Roni, Minecraft Server Developer
- Animated dark background with gradient (deep black to dark purple) and interactive particle system
- 3D floating Minecraft cube elements using Three.js / React Three Fiber
- Glassmorphism UI cards with neon purple glow borders throughout
- Mouse-tracking tilt effect on cards

**Hero Section**: Full-screen, large "RONI" heading, subtitle, intro paragraph, three CTA buttons (View Work, Services, Contact) with neon glow and ripple animation, floating cube elements

**About Section**: Bio text about Jerry SMP, RazeMC, Goju Network experience; glass card layout

**Experience Section**: Vertical animated timeline with 5 entries (Admin Jerry SMP, Admin RazeMC, Moderator Goju Network, Developer Multiple SMP Networks, Current Developer Jerry SMP); scroll-triggered entrance animations

**Skills Section**: Two-column layout (Development + Management); animated progress bars that trigger on viewport entry

**Projects Section**: Grid of 5 interactive glass cards (Staff Management Systems, Custom Kit Systems, Discord Management Systems, Tournament Systems, Minecraft Server Websites) with icons, hover zoom/tilt, glow effects

**Services Section**: Grid of 6 glass service cards (Server Setup, Plugin Config, Optimization, PvP Setup, Staff Management, Website Dev) with icons, hover glow/elevation

**Server Gallery Section**: 6 generated Minecraft screenshots in a responsive grid with fullscreen lightbox on click:
  - /assets/generated/mc-spawn.dim_800x500.jpg
  - /assets/generated/mc-pvp-arena.dim_800x500.jpg
  - /assets/generated/mc-smp-world.dim_800x500.jpg
  - /assets/generated/mc-event-arena.dim_800x500.jpg
  - /assets/generated/mc-lifesteal.dim_800x500.jpg
  - /assets/generated/mc-lobby.dim_800x500.jpg

**Statistics Section**: 4 animated counters (Servers 10+, Staff Teams 8+, Systems Built 20+, Communities 10+) with count-up on scroll

**Contact Section**: Sci-fi styled contact form matching the uploaded reference (Screenshot-2026-03-05-235228-1.png):
  - Field label: "DESIGNATION (NAME)" → text input, placeholder "Commander Shepard" style
  - Field label: "RETURN ADDRESS (EMAIL)" → email input
  - Field label: "TRANSMISSION DATA (MESSAGE)" → textarea
  - Submit button: "INITIALIZE TRANSMISSION" — wide, neon purple, uppercase
  - Discord button linking to discord user: roni.is.here
  - Glass card with glow animation

**Footer**: Navigation links (Home, Experience, Skills, Projects, Services, Contact), minimal dark gradient style

- Backend contact form message storage (store name, email, message, timestamp)
- Smooth scroll navigation from header/hero buttons

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Select no extra Caffeine components (no auth, no blob storage needed)
2. Generate Motoko backend with contact form message storage (submitContact, listContacts)
3. Build full frontend:
   - Setup OKLCH design tokens with deep black/dark purple/neon purple palette
   - Fonts: Sora (body), Mona Sans (headings) from pre-bundled fonts
   - Implement all 9 sections + footer
   - Three.js React Three Fiber for floating 3D cubes
   - Framer Motion for scroll animations, counter animations, skill bar animations
   - Particle system background with mouse interaction
   - Lightbox for gallery
   - Contact form wired to backend submitContact
   - All interactive surfaces get data-ocid markers
