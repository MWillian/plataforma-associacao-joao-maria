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
import { AgriculturePage } from './components/AgriculturePage.jsx';
import { CraftDetailPage } from './components/CraftDetailPage.jsx';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActivePage('craft-detail');
  };

  return (
    <div className="min-h-screen bg-[#1C2126] flex flex-col justify-between">
      <div>
        <Navbar 
          activePage={activePage} 
          setActivePage={(page) => {
            setActivePage(page);
            setSelectedProduct(null);
          }} 
        />

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

        {activePage === 'crafts' && (
          <CraftsPage onSelectProduct={handleSelectProduct} />
        )}

        {activePage === 'agriculture' && <AgriculturePage />}

        {activePage === 'craft-detail' && (
          <CraftDetailPage 
            product={selectedProduct} 
            onBack={() => setActivePage('crafts')} 
            onGoHome={() => setActivePage('home')} 
          />
        )}
      </div>
      <FooterSection />
    </div>
  );
}