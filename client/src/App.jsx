import { useState } from 'react';
import './App.css';
import { Navbar } from './components/Navbar.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { AboutSection } from './components/AboutSection.jsx';
import { StudioSection } from './components/StudioSection.jsx';
import { CraftsSection } from './components/CraftsSection.jsx';
import { AgricultureSection } from './components/AgricultureSection.jsx';
import { FoundersSection } from './components/FoundersSection.jsx';
import { DonationSection } from './components/DonationSection.jsx';
import { FooterSection } from './components/FooterSection.jsx';
import { StudioPage } from './components/StudioPage.jsx';
import { CraftsPage } from './components/CraftsPage.jsx';

export default function App() {
  const [activePage, setActivePage] = useState('home');

  return (
    <div className="min-h-screen bg-[#1C2126] flex flex-col justify-between">
      <div>
        <Navbar activePage={activePage} setActivePage={setActivePage} />
        {activePage === 'home' && (
          <main>
            <HeroSection />
            <AboutSection />
            <StudioSection />
            <CraftsSection />
            <AgricultureSection />
            <FoundersSection />
            <DonationSection />
          </main>
        )}
        {activePage === 'studio' && <StudioPage />}
        {activePage === 'crafts' && <CraftsPage />}
      </div>
      <FooterSection />
    </div>
  );
}