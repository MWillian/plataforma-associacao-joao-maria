import './App.css';
import { HeroSection } from './components/HeroSection.jsx';
import { AboutSection } from './components/AboutSection.jsx';
import { StudioSection } from './components/StudioSection.jsx';
import { CraftsSection } from './components/CraftsSection.jsx';
import { AgricultureSection } from './components/AgricultureSection.jsx';
import { FoundersSection } from './components/FounderSection.jsx';
import { DonationSection } from './components/DonationSection.jsx';
import { FooterSection } from './components/FooterSection.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <HeroSection />
      <AboutSection />
      <StudioSection />
      <CraftsSection />
      <AgricultureSection />
      <FoundersSection />
      <DonationSection />
      <FooterSection />
    </div>
  );
}