import { useState } from "react";
import AboutSection from "./components/portfolio/AboutSection";
import AdminPanel from "./components/portfolio/AdminPanel";
import ContactSection from "./components/portfolio/ContactSection";
import ExperienceSection from "./components/portfolio/ExperienceSection";
import Footer from "./components/portfolio/Footer";
import GallerySection from "./components/portfolio/GallerySection";
import HeroSection from "./components/portfolio/HeroSection";
import LoginPage from "./components/portfolio/LoginPage";
import Navigation from "./components/portfolio/Navigation";
import ProjectsSection from "./components/portfolio/ProjectsSection";
import ServicesSection from "./components/portfolio/ServicesSection";
import SkillsSection from "./components/portfolio/SkillsSection";
import StatsSection from "./components/portfolio/StatsSection";
import VoxelBackground from "./components/portfolio/VoxelBackground";

type View = "portfolio" | "login" | "admin";

export default function App() {
  const [view, setView] = useState<View>("portfolio");

  if (view === "login") {
    return (
      <LoginPage
        onLogin={() => setView("admin")}
        onBack={() => setView("portfolio")}
      />
    );
  }

  if (view === "admin") {
    return <AdminPanel open={true} onClose={() => setView("portfolio")} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* Global voxel background — fixed layer behind all sections */}
      <VoxelBackground />
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <ServicesSection />
        <GallerySection />
        <StatsSection />
        <ContactSection />
      </main>
      <Footer onAdminOpen={() => setView("login")} />
    </div>
  );
}
