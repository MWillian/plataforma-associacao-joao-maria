import { HeroSection } from '../components/home/HeroSection.jsx';
import { AboutSection } from '../components/home/AboutSection.jsx';
import { StudioSection } from '../components/home/StudioSection.jsx';
import { CraftsSection } from '../components/home/CraftsSection.jsx';
import { AgricultureSection } from '../components/home/AgricultureSection.jsx';
import { FoundersSection } from '../components/home/FoundersSection.jsx';
import { DonationSection } from '../components/home/DonationSection.jsx';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <StudioSection />
      <CraftsSection />
      <AgricultureSection />
      <FoundersSection />
      <DonationSection />
    </main>
  );
}