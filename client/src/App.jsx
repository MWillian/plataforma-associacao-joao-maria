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
import { AgricultureDetailPage } from './components/AgricultureDetailPage.jsx';
import { NewsDetailPage } from './components/NewsDetailPage.jsx';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);

  const handleSelectCraftProduct = (product) => {
    setSelectedProduct(product);
    setActivePage('craft-detail');
  };

  const handleSelectAgricultureProduct = (product) => {
    setSelectedProduct(product);
    setActivePage('agriculture-detail');
  };

  const handleSelectNews = (newsItem) => {
    setSelectedNews(newsItem);
    setActivePage('news-detail');
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

        {activePage === 'crafts' && (
          <CraftsPage onSelectProduct={handleSelectCraftProduct} />
        )}

        {activePage === 'agriculture' && (
          <AgriculturePage onSelectProduct={handleSelectAgricultureProduct} />
        )}

        {activePage === 'studio' && <StudioPage onSelectNews={handleSelectNews} />}

        {activePage === 'craft-detail' && (
          <CraftDetailPage
            product={selectedProduct}
            onBack={() => setActivePage('crafts')}
            onGoHome={() => setActivePage('home')}
            onSelectProduct={handleSelectCraftProduct}
          />
        )}

        {activePage === 'agriculture-detail' && (
          <AgricultureDetailPage
            product={selectedProduct}
            onBack={() => setActivePage('agriculture')}
            onGoHome={() => setActivePage('home')}
            onSelectProduct={handleSelectAgricultureProduct}
          />
        )}

        {activePage === 'news-detail' && (
          <NewsDetailPage
            news={selectedNews}
            onBack={() => setActivePage('studio')}
            onGoHome={() => setActivePage('home')}
          />
        )}

      </div>
      <FooterSection />
    </div>
  );
}