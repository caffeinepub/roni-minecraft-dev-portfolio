import AboutSection from "./components/portfolio/AboutSection";
import ContactSection from "./components/portfolio/ContactSection";
import ExperienceSection from "./components/portfolio/ExperienceSection";
import Footer from "./components/portfolio/Footer";
import GallerySection from "./components/portfolio/GallerySection";
import HeroSection from "./components/portfolio/HeroSection";
import Navigation from "./components/portfolio/Navigation";
import ProjectsSection from "./components/portfolio/ProjectsSection";
import ServicesSection from "./components/portfolio/ServicesSection";
import SkillsSection from "./components/portfolio/SkillsSection";
import StatsSection from "./components/portfolio/StatsSection";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
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
      <Footer />
    </div>
  );
}
