import { useState } from 'react';
import './App.css';
import { Navbar } from './components/layout/Navbar.jsx';
import { FooterSection } from './components/layout/FooterSection.jsx';
import HomePage from './pages/HomePage.jsx';
import { StudioPage } from './pages/StudioPage.jsx';
import { CraftsPage } from './pages/CraftsPage.jsx';
import { AgriculturePage } from './pages/AgriculturePage.jsx';
import { CraftDetailPage } from './pages/details/CraftDetailPage.jsx';
import { AgricultureDetailPage } from './pages/details/AgricultureDetailPage.jsx';
import { NewsDetailPage } from './pages/details/NewsDetailPage.jsx';

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
          <HomePage />
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