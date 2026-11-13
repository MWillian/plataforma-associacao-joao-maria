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
import { AdmClassNoticesPage } from './pages/AdmClassNoticesPage.jsx';
import { AdmNewsPage } from './pages/AdmNewsPage.jsx';
import { AdmProductsPage } from './pages/AdmProductsPage.jsx';

export default function App() {
  const routes = {
    '/': 'home',
    '/admin/login': 'adm-login',
    '/admin/painel': 'adm-dashboard',
    '/admin/alunos': 'adm-students',
    '/admin/turmas': 'adm-classes',
    '/admin/avisos': 'adm-classNotices',
    '/admin/noticias': 'adm-news',
    '/admin/produtos': 'adm-products',
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

  const [alunos, setAlunos] = useState([
    {
      id: 1,
      name: 'Lucas Ferreira',
      email: 'lucas@email.com',
      telefone: '(11) 99234-5678',
      danceClassId: 1,
      menor: true,
      responsavel: 'Maria Ferreira (Mãe)',
    },
    {
      id: 2,
      name: 'Carolina Mendes',
      email: 'carol@email.com',
      telefone: '(21) 97654-3210',
      danceClassId: 2,
      menor: false,
      responsavel: '',
    },
  ]);

  const [classes, setclasses] = useState([
    {
      id: 1,
      name: 'Ballet Infantil A',
      turn: 'Tarde',
      days: ['Terça-feira', 'Quinta-feira'],
    },
    {
      id: 2,
      name: 'Ballet Adolescente',
      turn: 'Manhã',
      days: ['Segunda-feira', 'Quarta-feira'],
    },
    {
      id: 3,
      name: 'Jazz Adolescente',
      turn: 'Tarde',
      days: ['Quinta-feira'],
    },
    {
      id: 4,
      name: 'Ballet Adulto',
      turn: 'Manhã',
      days: ['Sexta-feira'],
    }
  ]);

  const [avisos, setAvisos] = useState([
    {
      id: 1,
      danceClassId: 1,
      assunto: 'Ensaio Extra',
      tipo: 'Informativo',
      mensagem:
        'Informamos que haverá ensaio extra na próxima sexta-feira, dia 27/09, das 14h às 16h. Presença obrigatória.',
      data: '21/09/2026',
    },
    {
      id: 2,
      danceClassId: 2,
      assunto: 'Aula Cancelada',
      tipo: 'Cancelamento',
      mensagem:
        'A aula da próxima quinta-feira, 26/09, está cancelada por motivo de saúde da professora. Retorno previsto para 03/10.',
      data: '20/09/2026',
    },
  ]);

  const [noticias, setNoticias] = useState([
    {
      id: 1,
      titulo: 'Festival de Dança 2026',
      description:
        'Nossa instituição realizará o Grande Festival de Dança no próximo mês. Inscrições abertas para todas as turmas!',
      data: '14/09/2026',
      fotos: ['🎭', '📸'],
    },
    {
      id: 2,
      titulo: 'Encerramento do 2º Semestre',
      description:
        'Convocamos alunos e responsáveis para a festa de encerramento do semestre com apresentações especiais.',
      data: '09/09/2026',
      fotos: ['🎉'],
    },
  ]);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Tomate (Kg)',
      description: 'Tomates produzidos por associados da agricultura familiar.',
      price: 15.00,
      category: 'Agricultura Familiar',
      images: [],
      avaliable: true,
    },
    {
      id: 2,
      name: 'Kit pulseiras de macramê',
      description: 'Conjunto de pulseiras artesanais criadas por associados.',
      price: 45.00,
      category: 'Artesanato',
      images: [],
      avaliable: true,
    },
    {
      id: 3,
      name: 'Sousplat de crochê',
      description: 'Conjunto de 4 sousplat + 4 porta copos em crochê.',
      price: 130.00,
      category: 'Artesanato',
      images: [],
      avaliable: true,
    },
  ]);

  const handleCreateDanceClass = (novaTurma) => {
    setclasses((listaAnterior) => [
      ...listaAnterior,
      novadanceClass,
    ]);
  };

  const handleRemoveDanceClass = (id) => {
    setclasses((listaAnterior) =>
      listaAnterior.filter((danceClass) => danceClass.id !== id)
    );
  };

  const handleCreateNotice = (novoAviso) => {
    setAvisos((listaAnterior) => [
      novoAviso,
      ...listaAnterior,
    ]);
  };

  const handleRemoveNotice = (id) => {
    setAvisos((listaAnterior) =>
      listaAnterior.filter((aviso) => aviso.id !== id)
    );
  };

  const handleCreateNews = (novaNoticia) => {
    setNoticias((listaAnterior) => [
      novaNoticia,
      ...listaAnterior,
    ]);
  };

  const handleRemoveNews = (id) => {
    setNoticias((listaAnterior) =>
      listaAnterior.filter((noticia) => noticia.id !== id)
    );
  };

  const handleCreateProduct = (novoProduto) => {
    setProducts((listaAnterior) => [
      ...listaAnterior,
      novoProduto,
    ]);
  };

  const handleUpdateProduct = (produtoAtualizado) => {
    setProducts((listaAnterior) =>
      listaAnterior.map((produto) =>
        produto.id === produtoAtualizado.id
          ? produtoAtualizado
          : produto
      )
    );
  };

  const handleRemoveProduct = (id) => {
    setProducts((listaAnterior) =>
      listaAnterior.filter((produto) => produto.id !== id)
    );
  };

  if (activePage === 'adm-login') {
    return <AdmLoginPage />;
  }

  if (activePage === 'adm-dashboard') {
    return (
      <AdmDashboardPage 
      onNavigate={navigate}
      classes={classes}
      alunos={alunos}
      produtos={produtos}
      />
    );
  } 

  if (activePage === 'adm-students') {
    return (
      <AdmStudentsPage 
      classes={classes}
      alunos={alunos}
      setAlunos={setAlunos}
      onBack={() => navigate('adm-dashboard')}
      />
    );
  }

  if (activePage === 'adm-classes') {
    return (
      <AdmClassesPage
        classes={classes}
        onCreate={handleCreateDanceClass}
        onRemove={handleRemoveDanceClass}
        onBack={() => navigate('adm-dashboard')}
      />
    );
  }

  if (activePage === 'adm-classNotices') {
    return (
      <AdmClassNoticesPage
        classes={classes}
        avisos={avisos}
        onCreate={handleCreateNotice}
        onRemove={handleRemoveNotice}
        onBack={() => navigate('adm-dashboard')}
      />
    );
  } 

  if (activePage === 'adm-news') {
    return (
      <AdmNewsPage
        noticias={noticias}
        onCreate={handleCreateNews}
        onRemove={handleRemoveNews}
        onBack={() => navigate('adm-dashboard')}
      />
    );
  }

  if (activePage === 'adm-products') {
    return (
      <AdmProductsPage
        products={products}
        onCreate={handleCreateProduct}
        onUpdate={handleUpdateProduct}
        onRemove={handleRemoveProduct}
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