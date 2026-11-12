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
import   { AdmLoginPage }   from './pages/AdmLoginPage.jsx';
import  { AdmDashboardPage }  from './pages/AdmDashboardPage.jsx';
import { AdmStudentsPage } from './pages/AdmStudentsPage.jsx';
import { AdmClassesPage } from './pages/AdmClassesPage.jsx';

export default function App() {
  const routes = {
    '/': 'home',
    '/admin/login': 'adm-login',
    '/admin/painel': 'adm-dashboard',
    '/admin/alunos': 'adm-students',
    '/admin/turmas': 'adm-classes',
  };

  const [activePage, setActivePage] = useState(() => {
    return routes[window.location.pathname] || 'home';
})

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [newsSourcePage, setNewsSourcePage] = useState('studio');

  const handleSelectCraftProduct = (product) => {
    setSelectedProduct(product);
    setActivePage('craft-detail');
  };

  const handleSelectAgricultureProduct = (product) => {
    setSelectedProduct(product);
    setActivePage('agriculture-detail');
  };

  const handleSelectNews = (newsItem, sourcePage) => {
    setSelectedNews(newsItem);
    setNewsSourcePage(sourcePage);
    setActivePage('news-detail');
  }; 

  const navigate = (page) => {
    const route = Object.entries(routes).find(
      ([path, pageName]) => pageName === page
    )?.[0];

    if (route && window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }

    setActivePage(page);
  };

  const [turmas, setTurmas] = useState([
    {
      id: 1,
      nome: 'Ballet Infantil A',
      turno: 'Tarde',
      dias: ['Terça-feira', 'Quinta-feira'],
    },
    {
      id: 2,
      nome: 'Ballet Infantil B',
      turno: 'Manhã',
      dias: ['Segunda-feira', 'Quarta-feira'],
    },
    {
      id: 3,
      nome: 'Jazz Adolescente',
      turno: 'Tarde',
      dias: ['Quinta-feira'],
    },
    {
      id: 4,
      nome: 'Ballet Adulto',
      turno: 'Manhã',
      dias: ['Sexta-feira'],
    }
  ]);

  const handleCreateClass = (novaTurma) => {
    setTurmas((listaAnterior) => [
      ...listaAnterior,
      novaTurma,
    ]);
  };

  const handleRemoveClass = (id) => {
    setTurmas((listaAnterior) =>
      listaAnterior.filter((turma) => turma.id !== id)
    );
  };

  if (activePage === 'adm-login') {
    return <AdmLoginPage />;
  }

  if (activePage === 'adm-dashboard') {
    return (
      <AdmDashboardPage 
      onNavigate={navigate}
      turmas={turmas}
      />
    );
  } 

  if (activePage === 'adm-students') {
    return (
      <AdmStudentsPage 
      onBack={() => navigate('adm-dashboard')}
      />
    );
  }

  if (activePage === 'adm-classes') {
    return (
      <AdmClassesPage
        turmas={turmas}
        onCreate={handleCreateClass}
        onRemove={handleRemoveClass}
        onBack={() => navigate('adm-dashboard')}
      />
    );
  }

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
          <CraftsPage
            onSelectProduct={handleSelectCraftProduct}
            onSelectNews={(newsItem) => handleSelectNews(newsItem, 'crafts')}
          />
        )}

        {activePage === 'agriculture' && (
          <AgriculturePage
            onSelectProduct={handleSelectAgricultureProduct}
            onSelectNews={(newsItem) => handleSelectNews(newsItem, 'agriculture')}
          />
        )}

        {activePage === 'studio' && (
          <StudioPage
            onSelectNews={(newsItem) => handleSelectNews(newsItem, 'studio')}
          />
        )}

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
            onBack={() => setActivePage(newsSourcePage)}
            onGoHome={() => setActivePage('home')}
            backLabel={
              newsSourcePage === 'crafts'
                ? 'Mural / Artesanato'
                : newsSourcePage === 'agriculture'
                  ? 'Mural / Agricultura Familiar'
                  : 'Mural / Estúdio Adágio'
            }
          />
        )}
      </div>
      <FooterSection />
    </div>
  );
}