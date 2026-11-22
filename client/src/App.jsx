import { useEffect, useState } from 'react';
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
import { FeedbackToast } from './components/details/FeedbackToast.jsx';
import {
  createClass,
  listClasses,
  removeClass,
  updateClass,
} from './services/classes.js';
import { listStudents } from './services/students.js';
import {
  clearAccessToken,
  getAccessToken,
  logout,
  restoreSession,
} from './services/auth.js';
import {
  productFromApi,
  productToApi,
} from './services/productMapper.js';

const routes = {
  '/': 'home',
  '/studio': 'studio',
  '/artesanato': 'crafts',
  '/agricultura': 'agriculture',
  '/admin/login': 'adm-login',
  '/admin/painel': 'adm-dashboard',
  '/admin/alunos': 'adm-students',
  '/admin/turmas': 'adm-classes',
  '/admin/avisos': 'adm-class-notices',
  '/admin/noticias': 'adm-news',
  '/admin/produtos': 'adm-products',
};

const DETAIL_STORAGE_KEYS = {
  product: 'joao-maria.selected-product',
  news: 'joao-maria.selected-news',
};

function getLocationState() {
  const { pathname } = window.location;
  const craftMatch = pathname.match(/^\/artesanato\/produtos\/([^/]+)$/);
  const agricultureMatch = pathname.match(/^\/agricultura\/produtos\/([^/]+)$/);
  const newsMatch = pathname.match(/^\/(studio|artesanato|agricultura)\/noticias\/([^/]+)$/);

  if (craftMatch) {
    return {
      activePage: 'craft-detail',
      productId: decodeURIComponent(craftMatch[1]),
    };
  }

  if (agricultureMatch) {
    return {
      activePage: 'agriculture-detail',
      productId: decodeURIComponent(agricultureMatch[1]),
    };
  }

  if (newsMatch) {
    return {
      activePage: 'news-detail',
      newsSourcePage:
        newsMatch[1] === 'artesanato'
          ? 'crafts'
          : newsMatch[1] === 'agricultura'
            ? 'agriculture'
            : 'studio',
      newsId: decodeURIComponent(newsMatch[2]),
    };
  }

  return {
    activePage: routes[pathname] || 'home',
  };
}

function readStoredValue(key) {
  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function readStoredDetail(key, id) {
  const value = readStoredValue(key);

  if (!value || (id && String(value.id) !== String(id))) {
    return null;
  }

  return value;
}

function isAdminPage(page) {
  return page.startsWith('adm-');
}

const pageTitles = {
  home: 'Início',
  studio: 'Estúdio Adágio',
  crafts: 'Artesanato',
  agriculture: 'Agricultura Familiar',
  'craft-detail': 'Detalhes do artesanato',
  'agriculture-detail': 'Detalhes da agricultura',
  'news-detail': 'Notícia',
  'adm-login': 'Acesso administrativo',
  'adm-dashboard': 'Painel administrativo',
  'adm-students': 'Alunos',
  'adm-classes': 'Turmas',
  'adm-class-notices': 'Avisos',
  'adm-news': 'Notícias',
  'adm-products': 'Produtos',
};

export default function App() {
  const initialLocation = getLocationState();
  const [activePage, setActivePage] = useState(() => {
    return initialLocation.activePage;
  });
  const [selectedProduct, setSelectedProduct] = useState(() =>
    readStoredDetail(DETAIL_STORAGE_KEYS.product, initialLocation.productId)
  );
  const [selectedNews, setSelectedNews] = useState(() =>
    readStoredDetail(DETAIL_STORAGE_KEYS.news, initialLocation.newsId)
  );
  const [newsSourcePage, setNewsSourcePage] = useState(
    initialLocation.newsSourcePage || 'studio'
  );
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(getAccessToken())
  );
  const [isAuthLoading, setIsAuthLoading] = useState(() =>
    isAdminPage(initialLocation.activePage)
  );

  useEffect(() => {
    const pageTitle = pageTitles[activePage] || 'Associação João Maria';
    document.title = `${pageTitle} | Associação João Maria`;
  }, [activePage]);

  useEffect(() => {
    if (!isAdminPage(initialLocation.activePage)) {
      return undefined;
    }

    restoreSession()
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        clearAccessToken();
        setIsAuthenticated(false);

        if (window.location.pathname !== '/admin/login') {
          window.history.replaceState({}, '', '/admin/login');
          setActivePage('adm-login');
        }
      })
      .finally(() => {
        setIsAuthLoading(false);
      });

    return undefined;
  }, [initialLocation.activePage]);

  useEffect(() => {
    const handlePopState = () => {
      const locationState = getLocationState();
      setActivePage(locationState.activePage);
      setSelectedProduct(
        readStoredDetail(DETAIL_STORAGE_KEYS.product, locationState.productId)
      );
      setSelectedNews(
        readStoredDetail(DETAIL_STORAGE_KEYS.news, locationState.newsId)
      );

      if (locationState.newsSourcePage) {
        setNewsSourcePage(locationState.newsSourcePage);
      }

      if (isAdminPage(locationState.activePage) && !isAuthenticated) {
        setActivePage('adm-login');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated]);

  const handleSelectCraftProduct = (product) => {
    setSelectedProduct(product);
    sessionStorage.setItem(
      DETAIL_STORAGE_KEYS.product,
      JSON.stringify(product)
    );
    window.history.pushState({}, '', `/artesanato/produtos/${product.id}`);
    setActivePage('craft-detail');
  };

  const handleSelectAgricultureProduct = (product) => {
    setSelectedProduct(product);
    sessionStorage.setItem(
      DETAIL_STORAGE_KEYS.product,
      JSON.stringify(product)
    );
    window.history.pushState({}, '', `/agricultura/produtos/${product.id}`);
    setActivePage('agriculture-detail');
  };

  const handleSelectNews = (newsItem, sourcePage) => {
    setSelectedNews(newsItem);
    setNewsSourcePage(sourcePage);
    sessionStorage.setItem(
      DETAIL_STORAGE_KEYS.news,
      JSON.stringify(newsItem)
    );
    const sourcePath =
      sourcePage === 'crafts'
        ? 'artesanato'
        : sourcePage === 'agriculture'
          ? 'agricultura'
          : 'studio';
    window.history.pushState({}, '', `/${sourcePath}/noticias/${newsItem.id}`);
    setActivePage('news-detail');
  }; 

  const navigate = (page) => {
    const targetPage =
      isAdminPage(page) && page !== 'adm-login' && !isAuthenticated
        ? 'adm-login'
        : page;

    const route = Object.entries(routes).find(
      ([, pageName]) => pageName === targetPage
    )?.[0];

    if (route && window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }

    setActivePage(targetPage);
  };

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    navigate('adm-dashboard');
    return user;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setIsAuthenticated(false);
      setClasses([]);
      setStudents([]);
      setAdminDataStatus('idle');
      navigate('adm-login');
    }
  };

  // Turmas e alunos vêm do backend (carregados após o login).
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [adminDataStatus, setAdminDataStatus] = useState('idle');

  useEffect(() => {
    if (
      !isAuthenticated ||
      isAuthLoading ||
      !isAdminPage(activePage) ||
      adminDataStatus !== 'idle'
    ) {
      return;
    }

    setAdminDataStatus('loading');

    Promise.all([listClasses(), listStudents()])
      .then(([loadedClasses, loadedStudents]) => {
        setClasses(loadedClasses);
        setStudents(loadedStudents);
        setAdminDataStatus('ready');
      })
      .catch(() => {
        setAdminDataStatus('error');
      });
  }, [isAuthenticated, isAuthLoading, activePage, adminDataStatus]);

  const [notices, setNotices] = useState([
    {
      id: 1,
      classId: 1,
      subject: 'Ensaio Extra',
      type: 'Informativo',
      message:
        'Informamos que haverá ensaio extra na próxima sexta-feira, dia 27/09, das 14h às 16h. Presença obrigatória.',
      date: '21/09/2026',
    },
    {
      id: 2,
      classId: 2,
      subject: 'Aula Cancelada',
      type: 'Cancelamento',
      message:
        'A aula da próxima quinta-feira, 26/09, está cancelada por motivo de saúde da professora. Retorno previsto para 03/10.',
      date: '20/09/2026',
    },
  ]);

  const [news, setNews] = useState([
    {
      id: 1,
      title: 'Festival de Dança 2026',
      description:
        'Nossa instituição realizará o Grande Festival de Dança no próximo mês. Inscrições abertas para todas as turmas!',
      date: '14/09/2026',
      images: ['🎭', '📸'],
      publicationArea: 'studio',
    },
    {
      id: 2,
      title: 'Encerramento do 2º Semestre',
      description:
        'Convocamos alunos e responsáveis para a festa de encerramento do semestre com apresentações especiais.',
      date: '09/09/2026',
      images: ['🎉'],
      publicationArea: 'crafts',
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
      available: true,
    },
    {
      id: 2,
      name: 'Kit pulseiras de macramê',
      description: 'Conjunto de pulseiras artesanais criadas por associados.',
      price: 45.00,
      category: 'Artesanato',
      images: [],
      available: true,
    },
    {
      id: 3,
      name: 'Sousplat de crochê',
      description: 'Conjunto de 4 sousplat + 4 porta copos em crochê.',
      price: 130.00,
      category: 'Artesanato',
      images: [],
      available: true,
    },
  ]);

  // As três funções abaixo falham (lançam erro) se o backend recusar; a
  // página que chamou mostra a mensagem ao usuário.
  const handleCreateDanceClass = async ({ name, turn, days, capacity }) => {
    const createdClass = await createClass({ name, turn, days, capacity });

    setClasses((previousClasses) => [
      ...previousClasses,
      createdClass,
    ]);

    return createdClass;
  };

  const handleRemoveDanceClass = async (id) => {
    await removeClass(id);

    setClasses((previousClasses) =>
      previousClasses.filter(
        (danceClass) => String(danceClass.id) !== String(id)
      )
    );
    // O backend também inativa os alunos da turma; refletimos na tela.
    setStudents((previousStudents) =>
      previousStudents
        .map((student) => {
          const classIds = (student.danceClassIds?.length
            ? student.danceClassIds
            : student.danceClassId
              ? [student.danceClassId]
              : [])
            .filter((classId) => String(classId) !== String(id));

          if (classIds.length === (student.danceClassIds?.length
            ? student.danceClassIds.length
            : student.danceClassId ? 1 : 0)) {
            return student;
          }

          return {
            ...student,
            danceClassIds: classIds,
            danceClassId: classIds[0] ?? null,
          };
        })
        .filter((student) => (student.danceClassIds?.length ?? 0) > 0)
    );
    setNotices((previousNotices) =>
      previousNotices.filter((notice) => {
        const classIds = notice.classIds
          || [notice.classId ?? notice.danceClassId];

        return !classIds.some(
          (classId) => String(classId) === String(id)
        );
      })
    );
  };

  const handleCreateNotice = (newNotice) => {
    setNotices((previousNotices) => [
      newNotice,
      ...previousNotices,
    ]);
  };

  const handleRemoveNotice = (id) => {
    setNotices((previousNotices) =>
      previousNotices.filter((notice) => notice.id !== id)
    );
  };

  const handleCreateNews = (newNews) => {
    setNews((previousNews) => [
      newNews,
      ...previousNews,
    ]);
  };

  const handleUpdateNews = (updatedNews) => {
    setNews((previousNews) =>
      previousNews.map((newsItem) =>
        newsItem.id === updatedNews.id
          ? updatedNews
          : newsItem
      )
    );
  };

  const handleRemoveNews = (id) => {
    setNews((previousNews) =>
      previousNews.filter((newsItem) => newsItem.id !== id)
    );
  };

  const handleCreateProduct = (newProduct) => {
    const apiProduct = productToApi(newProduct);

    setProducts((previousProducts) => [
      ...previousProducts,
      productFromApi(apiProduct, newProduct),
    ]);
  };

  const handleUpdateProduct = (updatedProduct) => {
    const apiProduct = productToApi(updatedProduct);
    const normalizedProduct = productFromApi(apiProduct, updatedProduct);

    setProducts((previousProducts) =>
      previousProducts.map((product) =>
        product.id === updatedProduct.id
          ? normalizedProduct
          : product
      )
    );
  };

  const handleRemoveProduct = (id) => {
    setProducts((previousProducts) =>
      previousProducts.filter((product) => product.id !== id)
    );
  };

  // Atualiza uma turma existente
  const handleUpdateDanceClass = async (updatedClass) => {
    const savedClass = await updateClass(updatedClass.id, {
      name: updatedClass.name,
      turn: updatedClass.turn,
      days: updatedClass.days,
      capacity: updatedClass.capacity ?? null,
    });

    setClasses((previousClasses) =>
      previousClasses.map((danceClass) =>
        String(danceClass.id) === String(savedClass.id)
          ? savedClass
          : danceClass
      )
    );

    return savedClass;
  };

  const loadErrorToast =
    adminDataStatus === 'error' ? (
      <FeedbackToast
        type="error"
        message="Não foi possível carregar turmas e alunos. Recarregue a página."
      />
    ) : null;

  if (isAuthLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F9FC]">
        <p className="text-sm text-[#526581]">Restaurando sua sessão...</p>
      </main>
    );
  }

  if (activePage === 'adm-login') {
    return <AdmLoginPage onLogin={handleLogin} />;
  }

  if (isAdminPage(activePage) && !isAuthenticated) {
    return <AdmLoginPage onLogin={handleLogin} />;
  }

  if (activePage === 'adm-dashboard') {
    return (
      <>
        {loadErrorToast}
        <AdmDashboardPage 
      onNavigate={navigate}
      onLogout={handleLogout}
      classes={classes}
      students={students}
      news={news}
      notices={notices}
      products={products}
      />
      </>
    );
  } 

  if (activePage === 'adm-students') {
    return (
      <>
        {loadErrorToast}
        <AdmStudentsPage 
      classes={classes}
      students={students}
      setStudents={setStudents}
      onBack={() => navigate('adm-dashboard')}
      />
      </>
    );
  }

  if (activePage === 'adm-classes') {
    return (
      <>
        {loadErrorToast}
        <AdmClassesPage
        classes={classes}
        onCreate={handleCreateDanceClass}
        onUpdate={handleUpdateDanceClass}
        onRemove={handleRemoveDanceClass}
        onBack={() => navigate('adm-dashboard')}
      />
      </>
    );
  }

  if (activePage === 'adm-class-notices') {
    return (
      <>
        {loadErrorToast}
        <AdmClassNoticesPage
        classes={classes}
        notices={notices}
        onCreate={handleCreateNotice}
        onRemove={handleRemoveNotice}
        onBack={() => navigate('adm-dashboard')}
      />
      </>
    );
  } 

  if (activePage === 'adm-news') {
    return (
      <AdmNewsPage
        news={news}
        onCreate={handleCreateNews}
        onUpdate={handleUpdateNews}
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
            navigate(page);
            setSelectedProduct(null);
          }}
        />

        {activePage === 'home' && (
          <HomePage
            news={news}
            onSelectNews={(newsItem) => handleSelectNews(
              newsItem,
              newsItem.publicationArea || 'studio'
            )}
          />
        )}

        {activePage === 'crafts' && (
          <CraftsPage
            news={news}
            onSelectProduct={handleSelectCraftProduct}
            onSelectNews={(newsItem) => handleSelectNews(newsItem, 'crafts')}
          />
        )}

        {activePage === 'agriculture' && (
          <AgriculturePage
            news={news}
            onSelectProduct={handleSelectAgricultureProduct}
            onSelectNews={(newsItem) => handleSelectNews(newsItem, 'agriculture')}
          />
        )}

        {activePage === 'studio' && (
          <StudioPage
            news={news}
            onSelectNews={(newsItem) => handleSelectNews(newsItem, 'studio')}
          />
        )}

        {activePage === 'craft-detail' && (
          <CraftDetailPage
            product={selectedProduct}
            onBack={() => navigate('crafts')}
            onGoHome={() => navigate('home')}
            onSelectProduct={handleSelectCraftProduct}
          />
        )}

        {activePage === 'agriculture-detail' && (
          <AgricultureDetailPage
            product={selectedProduct}
            onBack={() => navigate('agriculture')}
            onGoHome={() => navigate('home')}
            onSelectProduct={handleSelectAgricultureProduct}
          />
        )}

        {activePage === 'news-detail' && (
          <NewsDetailPage
            news={selectedNews}
            onBack={() => navigate(newsSourcePage)}
            onGoHome={() => navigate('home')}
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