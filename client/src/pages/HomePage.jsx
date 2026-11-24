import { HeroSection } from '../components/home/HeroSection.jsx';
import { AboutSection } from '../components/home/AboutSection.jsx';
import { StudioSection } from '../components/home/StudioSection.jsx';
import { CraftsSection } from '../components/home/CraftsSection.jsx';
import { AgricultureSection } from '../components/home/AgricultureSection.jsx';
import { FoundersSection } from '../components/home/FoundersSection.jsx';
import { DonationSection } from '../components/home/DonationSection.jsx';
import { NewsCarousel } from '../components/home/NewsCarousel.jsx';

export default function HomePage({
  news = [],
  craftProducts = [],
  agricultureProducts = [],
  onNavigate,
  onSelectNews,
  onSelectCraftProduct,
  onSelectAgricultureProduct,
}) {
  return (
    <main>
      <HeroSection />
      <NewsCarousel news={news} onSelectNews={onSelectNews} />
      <AboutSection />
      <StudioSection onNavigate={onNavigate} />
      <CraftsSection
        products={craftProducts}
        onNavigate={onNavigate}
        onSelectProduct={onSelectCraftProduct}
      />
      <AgricultureSection
        products={agricultureProducts}
        onNavigate={onNavigate}
        onSelectProduct={onSelectAgricultureProduct}
      />
      <FoundersSection />
      <DonationSection />
    </main>
  );
}