import { useEffect, useRef, useState } from 'react';
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
  listPublicClasses,
  removeClass,
  updateClass,
} from './services/classes.js';
import { listStudents } from './services/students.js';
import {
  createNews,
  listNews,
  removeNews,
  updateNews,
} from './services/news.js';
import {
  createNotice,
  listNotices,
  removeNotice,
} from './services/notices.js';
import {
  createProduct,
  deleteProduct,
  listAdminProducts,
  listPublicProducts,
  listProductHighlights,
  setProductAvailability,
  updateProduct,
} from './services/products.js';
import {
  clearAccessToken,
  getAccessToken,
  logout,
  restoreSession,
} from './services/auth.js';
import { productToPublic } from './services/productMapper.js';
import { SESSION_EXPIRED_EVENT } from './services/api.js';
import { DetailState } from './components/details/DetailState.jsx';

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
  // Ignora a barra final ("/artesanato/" equivale a "/artesanato").
  const pathname = window.location.pathname.replace(/(.)\/+$/, '$1');
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

  // Endereço desconhecido mostra "Página não encontrada" em vez da home.
  return {
    activePage: routes[pathname] || 'not-found',
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

// Página de detalhe: depois que a lista pública carrega, o item é buscado
// nela pelo id da URL. Assim, um item excluído ou indisponível não é exibido
// a partir da cópia guardada no sessionStorage. Antes de carregar, usa a cópia.
function resolveDetail(list, storedItem, idFromUrl, isListLoaded) {
  if (!isListLoaded) {
    return storedItem;
  }

  const id = idFromUrl ?? storedItem?.id;

  return list.find((item) => String(item.id) === String(id)) ?? null;
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
  'not-found': 'Página não encontrada',
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

  // Dados do painel e do site vêm do backend. Os estados ficam aqui no
  // topo porque os efeitos e handlers abaixo os usam.
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [notices, setNotices] = useState([]);
  const [news, setNews] = useState([]);
  // Produtos do painel admin (todos). O site público usa `publicProducts`
  // até o painel ser carregado.
  const [products, setProducts] = useState([]);
  const [publicProducts, setPublicProducts] = useState([]);
  const [isPublicProductsLoaded, setIsPublicProductsLoaded] = useState(false);
  const [isNewsLoaded, setIsNewsLoaded] = useState(false);
  // true quando as chamadas públicas terminaram (com sucesso ou erro).
  const [isPublicContentSettled, setIsPublicContentSettled] = useState(false);
  const [latestCraftProducts, setLatestCraftProducts] = useState([]);
  const [latestAgricultureProducts, setLatestAgricultureProducts] = useState([]);
  const [adminProductsLoaded, setAdminProductsLoaded] = useState(false);
  // 'idle' | 'ready' | 'error'
  const [adminDataStatus, setAdminDataStatus] = useState('idle');
  const [publicDataError, setPublicDataError] = useState(false);
  // Evita pedir os dados do painel mais de uma vez por sessão.
  const adminDataRequestedRef = useRef(false);

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

        // Quem já está logado e abre /admin/login vai direto para o painel.
        if (window.location.pathname === '/admin/login') {
          window.history.replaceState({}, '', '/admin/painel');
          setActivePage('adm-dashboard');
        }
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

  // `authenticated` permite navegar logo após o login, antes de o React
  // aplicar o novo valor de isAuthenticated (o estado ainda seria o antigo).
  const navigate = (page, { authenticated = isAuthenticated } = {}) => {
    const targetPage =
      isAdminPage(page) && page !== 'adm-login' && !authenticated
        ? 'adm-login'
        : page;

    const route = Object.entries(routes).find(
      ([, pageName]) => pageName === targetPage
    )?.[0];

    if (route && window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }

    // Nova página abre no topo (antes mantinha a rolagem da página anterior).
    if (targetPage !== activePage) {
      window.scrollTo({ top: 0 });
    }

    setActivePage(targetPage);
  };

  const navigateToHomeSection = (sectionId) => {
    navigate('home');

    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    navigate('adm-dashboard', { authenticated: true });
    return user;
  };

  // Disparado pelo interceptador do axios quando a renovação da sessão falha.
  useEffect(() => {
    const handleSessionExpired = () => {
      clearAccessToken();
      setIsAuthenticated(false);
      adminDataRequestedRef.current = false;
      setAdminDataStatus('idle');

      if (isAdminPage(getLocationState().activePage)) {
        window.history.replaceState({}, '', '/admin/login');
        setActivePage('adm-login');
      }
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setIsAuthenticated(false);
      setClasses([]);
      setStudents([]);
      setNotices([]);
      setProducts([]);
      setAdminProductsLoaded(false);
      adminDataRequestedRef.current = false;
      setAdminDataStatus('idle');
      navigate('adm-login');
    }
  };

  useEffect(() => {
    if (
      !isAuthenticated ||
      isAuthLoading ||
      !isAdminPage(activePage) ||
      adminDataRequestedRef.current
    ) {
      return;
    }

    adminDataRequestedRef.current = true;

    Promise.allSettled([
      listClasses(),
      listStudents(),
      listNotices(),
      listAdminProducts(),
    ])
      .then(([classesResult, studentsResult, noticesResult, productsResult]) => {
        if (classesResult.status === 'fulfilled') {
          setClasses(classesResult.value);
        }

        if (studentsResult.status === 'fulfilled') {
          setStudents(studentsResult.value);
        }

        if (noticesResult.status === 'fulfilled') {
          setNotices(noticesResult.value);
        }

        if (productsResult.status === 'fulfilled') {
          setProducts(productsResult.value);
          setAdminProductsLoaded(true);
        }

        setAdminDataStatus(
          [classesResult, studentsResult, noticesResult, productsResult]
            .some((result) => result.status === 'rejected')
            ? 'error'
            : 'ready'
        );
      });
  }, [isAuthenticated, isAuthLoading, activePage]);

  // Conteúdo público: notícias e catálogo de produtos.
  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      listNews(),
      listPublicProducts(),
      listPublicClasses(),
      listProductHighlights('artesanato'),
      listProductHighlights('agricultura'),
    ])
      .then(([newsResult, productsResult, classesResult, craftsResult, agricultureResult]) => {
        if (cancelled) return;

        setIsPublicContentSettled(true);

        if (newsResult.status === 'fulfilled') {
          setNews(newsResult.value);
          setIsNewsLoaded(true);
        }

        if (productsResult.status === 'fulfilled') {
          setPublicProducts(productsResult.value);
          setIsPublicProductsLoaded(true);
        }

        if (classesResult.status === 'fulfilled') {
          setClasses(classesResult.value);
        }

        if (craftsResult.status === 'fulfilled') {
          setLatestCraftProducts(craftsResult.value.map(productToPublic));
        }

        if (agricultureResult.status === 'fulfilled') {
          setLatestAgricultureProducts(
            agricultureResult.value.map(productToPublic)
          );
        }

        setPublicDataError(
          [newsResult, productsResult, classesResult, craftsResult, agricultureResult]
            .some((result) => result.status === 'rejected')
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
    // Os alunos continuam ativos, mas ficam sem matrícula na turma inativada.
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
    );
  };

  // Os handlers abaixo lançam erro se o backend recusar; a página que
  // chamou mostra a mensagem ao usuário.
  const handleCreateNotice = async ({ classIds, subject, type, message }) => {
    const createdNotice = await createNotice({
      classIds,
      subject,
      type,
      message,
    });

    setNotices((previousNotices) => [
      createdNotice,
      ...previousNotices,
    ]);

    return createdNotice;
  };

  const handleRemoveNotice = async (id) => {
    await removeNotice(id);

    setNotices((previousNotices) =>
      previousNotices.filter(
        (notice) => String(notice.id) !== String(id)
      )
    );
  };

  const handleCreateNews = async (newNews) => {
    const createdNews = await createNews(newNews);

    setNews((previousNews) => [createdNews, ...previousNews]);

    return createdNews;
  };

  const handleUpdateNews = async (updatedNews) => {
    const savedNews = await updateNews(updatedNews.id, updatedNews);

    setNews((previousNews) =>
      previousNews.map((newsItem) =>
        String(newsItem.id) === String(savedNews.id)
          ? savedNews
          : newsItem
      )
    );

    return savedNews;
  };

  const handleRemoveNews = async (id) => {
    await removeNews(id);

    setNews((previousNews) =>
      previousNews.filter(
        (newsItem) => String(newsItem.id) !== String(id)
      )
    );
  };

  const handleCreateProduct = async (form) => {
    const createdProduct = await createProduct(form);

    setProducts((previousProducts) => [
      ...previousProducts,
      createdProduct,
    ]);

    return createdProduct;
  };

  const handleUpdateProduct = async (form) => {
    const currentProduct = products.find(
      (product) => String(product.id) === String(form.id)
    );

    let savedProduct = await updateProduct(form.id, form);

    // O PUT não altera a disponibilidade; isso é feito à parte.
    const wantsAvailable = form.available !== false;

    if (
      currentProduct &&
      Boolean(currentProduct.available) !== wantsAvailable
    ) {
      savedProduct = await setProductAvailability(
        form.id,
        wantsAvailable
      );
    }

    setProducts((previousProducts) =>
      previousProducts.map((product) =>
        String(product.id) === String(savedProduct.id)
          ? savedProduct
          : product
      )
    );

    return savedProduct;
  };

  const handleRemoveProduct = async (id) => {
    await deleteProduct(id);

    setProducts((previousProducts) =>
      previousProducts.filter(
        (product) => String(product.id) !== String(id)
      )
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

  // Catálogo do site: usa o painel (se carregado) ou a lista pública.
  const catalogProducts =
    adminProductsLoaded
      ? products.filter((product) => product.available)
      : publicProducts;
  const craftCatalog = catalogProducts
    .filter((product) => product.category === 'Artesanato')
    .map(productToPublic);
  const agricultureCatalog = catalogProducts
    .filter((product) => product.category === 'Agricultura Familiar')
    .map(productToPublic);

  const locationState = getLocationState();
  const isCatalogLoaded = adminProductsLoaded || isPublicProductsLoaded;
  const detailCraftProduct = resolveDetail(
    craftCatalog,
    selectedProduct,
    locationState.productId,
    isCatalogLoaded
  );
  const detailAgricultureProduct = resolveDetail(
    agricultureCatalog,
    selectedProduct,
    locationState.productId,
    isCatalogLoaded
  );
  const detailNews = resolveDetail(
    news,
    selectedNews,
    locationState.newsId,
    isNewsLoaded
  );

  const loadErrorToast =
    adminDataStatus === 'error' ? (
      <FeedbackToast
        type="error"
        message="Alguns dados do painel não puderam ser carregados. Recarregue a página."
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
      <>
        {loadErrorToast}
        <AdmNewsPage
          news={news}
          onCreate={handleCreateNews}
          onUpdate={handleUpdateNews}
          onRemove={handleRemoveNews}
          onBack={() => navigate('adm-dashboard')}
        />
      </>
    );
  }

  if (activePage === 'adm-products') {
    return (
      <>
        {loadErrorToast}
        <AdmProductsPage
          products={products}
          onCreate={handleCreateProduct}
          onUpdate={handleUpdateProduct}
          onRemove={handleRemoveProduct}
          onBack={() => navigate('adm-dashboard')}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C2126] flex flex-col justify-between">
      {publicDataError && (
        <FeedbackToast
          type="error"
          message="Alguns conteúdos não puderam ser carregados. Recarregue a página."
        />
      )}
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
            craftProducts={latestCraftProducts}
            agricultureProducts={latestAgricultureProducts}
            onNavigate={navigate}
            onSelectNews={(newsItem) => handleSelectNews(
              newsItem,
              newsItem.publicationArea || 'studio'
            )}
            onSelectCraftProduct={handleSelectCraftProduct}
            onSelectAgricultureProduct={handleSelectAgricultureProduct}
          />
        )}

        {activePage === 'crafts' && (
          <CraftsPage
            news={news}
            products={craftCatalog}
            onSelectProduct={handleSelectCraftProduct}
            onSelectNews={(newsItem) => handleSelectNews(newsItem, 'crafts')}
          />
        )}

        {activePage === 'agriculture' && (
          <AgriculturePage
            news={news}
            products={agricultureCatalog}
            onSelectProduct={handleSelectAgricultureProduct}
            onSelectNews={(newsItem) => handleSelectNews(newsItem, 'agriculture')}
          />
        )}

        {activePage === 'studio' && (
          <StudioPage
            news={news}
            classes={classes}
            onSelectNews={(newsItem) => handleSelectNews(newsItem, 'studio')}
          />
        )}

        {activePage === 'craft-detail' && (
          <CraftDetailPage
            product={detailCraftProduct}
            isLoading={!isPublicContentSettled && !detailCraftProduct}
            products={craftCatalog}
            onBack={() => navigate('crafts')}
            onGoHome={() => navigate('home')}
            onSelectProduct={handleSelectCraftProduct}
          />
        )}

        {activePage === 'agriculture-detail' && (
          <AgricultureDetailPage
            product={detailAgricultureProduct}
            products={agricultureCatalog}
            isLoading={!isPublicContentSettled && !detailAgricultureProduct}
            onBack={() => navigate('agriculture')}
            onGoHome={() => navigate('home')}
            onSelectProduct={handleSelectAgricultureProduct}
          />
        )}

        {activePage === 'not-found' && (
          <DetailState
            notFoundTitle="Página não encontrada"
            notFoundText="O endereço acessado não existe ou foi alterado."
            onGoHome={() => navigate('home')}
          />
        )}

        {activePage === 'news-detail' && (
          <NewsDetailPage
            news={detailNews}
            isLoading={!isPublicContentSettled && !detailNews}
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
      <FooterSection onNavigateToSection={navigateToHomeSection} />
    </div>
  );
}