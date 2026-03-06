# Roni — Minecraft Dev Portfolio

## Current State

Full-stack portfolio with Motoko backend and React frontend. Backend exposes: `submitMessage`, `getAllMessages`, `addImage`, `editImage`, `removeImage`, `getAllImages`, `getAboutImage`, `setAboutImage`. The backend canister (i5dt4-raaaa-aaaaf-qbaja-cai) is stopped (IC0508), causing all calls — transmissions submit and all three admin tabs — to fail.

Admin panel has three tabs: Transmissions, Gallery, About Me.

ServicesSection has a "Request a Quote" card rendered at the bottom, visually separated from the server showcase (GallerySection), causing it to appear out of context.

ProjectsSection has two category tabs: Website Showcase and Minecraft Showcase.

## Requested Changes (Diff)

### Add
- Two new tabs in AdminPanel: **Website Showcase** and **Server Showcase** (these manage the respective project/gallery images for those two categories in the Projects section — can be read-only management views or just visual tabs that list/manage assets per category)
- The admin tab type must expand from `"transmissions" | "gallery" | "about"` to include `"website-showcase" | "server-showcase"`

### Modify
- **Backend**: Regenerate fresh Motoko backend with identical API surface — this creates a new canister and resolves the IC0508 stopped-canister error
- **ServicesSection**: Move the "Request a Quote" card so it sits directly below the server showcase (GallerySection) in the page flow — OR keep it in ServicesSection but make it visually adjacent. The user wants it near the server showcase, not floating at the bottom of Services. The simplest fix: remove it from ServicesSection and render it as part of or directly after GallerySection in App.tsx ordering, OR place it inside GallerySection at the bottom.
- **AdminPanel Website Showcase tab**: Show the list of website project entries (Jerry SMP Website and Minecraft Server Websites) — these are static data from ProjectsSection, so this tab can display them as a read-only list with the ability to note they are managed in code, or can simply list the current website showcase projects.
- **AdminPanel Server Showcase tab**: Mirrors the existing Gallery tab functionality (manage server screenshot images) — this IS the gallery, just renamed/relabeled to "Server Showcase" to match the public-facing section name.

### Remove
- The standalone "Gallery" tab label — rename it to "Server Showcase" in the admin tab bar (or keep gallery tab and add new server-showcase tab that links to same data — confirm with simplest approach: rename Gallery → Server Showcase, add Website Showcase as a new tab showing the website projects list)

## Implementation Plan

1. Regenerate Motoko backend with same API — fixes stopped canister
2. In AdminPanel.tsx:
   - Change Tab type to: `"transmissions" | "server-showcase" | "website-showcase" | "about"`
   - Rename the "Gallery" tab button label to "Server Showcase" (keep same GalleryTab component, just rename)
   - Add new "Website Showcase" tab that shows a read-only list of the current website showcase projects (Jerry SMP Website + Minecraft Server Websites compact card) with a note they are managed in code
3. In App.tsx or ServicesSection.tsx: move the Request a Quote card to render directly below/inside GallerySection, not at bottom of ServicesSection — remove it from ServicesSection and place it in or after GallerySection
