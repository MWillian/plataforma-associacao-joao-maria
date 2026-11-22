import { useRef } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { useUrlQueryState } from '../hooks/useUrlQueryState.js';
import { ProductImage } from '../components/details/ProductImage.jsx';

export function AgriculturePage({ news = [], products = [], onSelectProduct, onSelectNews }) {
  // Referências para controlar a rolagem exata das seções
  const productsSectionRef = useRef(null);
  const newsSectionRef = useRef(null);

  // Estados para o Catálogo de Alimentos
  const [productSearch, setProductSearch] = useUrlQueryState('agricultureProductSearch', '');
  const [productPage, setProductPage] = useUrlQueryState('agricultureProductPage', 1, {
    parse: (value) => Math.max(1, Number(value) || 1),
    serialize: String,
    history: 'push',
  });

  // Estados para o Mural de Notícias e Eventos
  const [newsSearch, setNewsSearch] = useUrlQueryState('agricultureNewsSearch', '');
  const [newsPage, setNewsPage] = useUrlQueryState('agricultureNewsPage', 1, {
    parse: (value) => Math.max(1, Number(value) || 1),
    serialize: String,
    history: 'push',
  });

  // Funções de troca de página com rolagem suave automática
  const handleProductPageChange = (newPage) => {
    setProductPage(newPage);
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNewsPageChange = (newPage) => {
    setNewsPage(newPage);
    if (newsSectionRef.current) {
      newsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Catálogo vem do backend (via App).
  const agricultureProducts = products;

  // Filtro do Catálogo de Alimentos
  const filteredProducts = agricultureProducts.filter((item) =>
    item.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    item.description.toLowerCase().includes(productSearch.toLowerCase())
  );

  const productsPerPage = 6;
  const totalProductPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;
  const currentProducts = filteredProducts.slice(
    (productPage - 1) * productsPerPage,
    productPage * productsPerPage
  );

  // Filtro de Notícias/Eventos
  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(newsSearch.toLowerCase());
    return matchesSearch && item.publicationArea === 'agriculture';
  });

  const newsPerPage = 3;
  const totalNewsPages = Math.ceil(filteredNews.length / newsPerPage) || 1;
  const currentNews = filteredNews.slice(
    (newsPage - 1) * newsPerPage,
    newsPage * newsPerPage
  );
  const latestNews = filteredNews[0];

  return (
    <div className="bg-white text-slate-800 font-poppins min-h-screen page-reveal-fade">
      {/* Hero Banner Edge-to-Edge */}
      <div
        style={{ minHeight: '464px' }}
        className="w-full bg-[#0b1b3d] relative flex items-center overflow-hidden px-6 md:px-16 py-16"
      >
        <div className="absolute inset-0 bg-emerald-950/80 z-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-r from-emerald-950/90 via-emerald-900/60 to-transparent flex items-center justify-center text-emerald-300/30 font-roboto text-sm">
            [Background Image: Campo/Agricultura Familiar]
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-4">
          <div className="w-4 h-4 bg-emerald-500 rounded-sm mb-2" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Agricultura Familiar
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 font-roboto font-light max-w-xl leading-relaxed">
            Alimentos saudáveis cultivados pelas famílias associadas e notícias do campo.
          </p>
        </div>
      </div>

      {latestNews && (
        <section className="py-16 sm:py-20 px-6 max-w-7xl mx-auto border-b border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <button
              type="button"
              onClick={() => onSelectNews?.(latestNews)}
              className="lg:col-span-7 flex justify-center"
              aria-label={`Ler notícia: ${latestNews.title}`}
            >
              <div
                style={{ width: '100%', maxWidth: '664px', minHeight: '320px' }}
                className="w-full h-80 sm:h-96 lg:h-[320px] bg-emerald-100 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden border border-emerald-200"
              >
                {latestNews.images?.[0] ? (
                  <img
                    src={latestNews.images[0]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-emerald-800 text-sm font-medium">
                    Sem imagem
                  </span>
                )}
              </div>
            </button>

            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold">
                Última notícia
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#142D59] leading-tight">
                {latestNews.title}
              </h3>
              <p className="text-slate-600 font-roboto text-base leading-relaxed">
                {latestNews.description}
              </p>
              <button
                type="button"
                onClick={() => onSelectNews?.(latestNews)}
                className="inline-flex items-center text-[#3570FC] font-semibold text-sm hover:underline underline-offset-4 gap-2 transition-colors"
              >
                Ler notícia completa <span>→</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* SEÇÃO 1: CATÁLOGO DE CULTIVOS E ALIMENTOS */}
      <section ref={productsSectionRef} className="py-16 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="mb-10 space-y-2 page-reveal-up">
          <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold">
            Direto do Campo
          </span>
          <h2 className="text-3xl font-extrabold text-[#0b1b3d] tracking-tight">
            Nossos Cultivos e Produtos
          </h2>
          <p className="text-slate-600 font-roboto text-sm sm:text-base max-w-2xl">
            Conheça os alimentos cultivados de forma agroecológica pelas famílias da comunidade. Clique em um item para saber mais sobre a safra e disponibilidade.
          </p>
        </div>

        {/* Busca no Catálogo */}
        <div className="flex justify-end mb-8 page-reveal-up" style={{ animationDelay: '100ms' }}>
          <div className="w-full sm:w-96 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Buscar cultivo ou alimento..."
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                setProductPage(1);
              }}
              className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#3570FC] shadow-sm"
            />
          </div>
        </div>

        {/* Grid de Cultivos */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProducts.map((item, index) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                aria-label={`Ver detalhes de ${item.title}`}
                onClick={() => onSelectProduct && onSelectProduct(item)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelectProduct?.(item);
                  }
                }}
                style={{ animationDelay: `${150 + index * 90}ms` }}
                className="page-reveal-up bg-white rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#3570FC] focus:ring-offset-2 group cursor-pointer"
              >
                {/* Imagem Placeholder */}
                <div className="w-full h-48 bg-slate-100 relative flex items-center justify-center overflow-hidden border-b border-slate-100">
                  <ProductImage src={item.images?.[0]} alt={item.title}>
                    <span className="text-slate-400 text-xs font-roboto">
                      Placeholder Imagem ({item.title})
                    </span>
                  </ProductImage>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                  <div className="flex justify-start items-center">
                    <span className="inline-block bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded shadow-sm">
                      {item.tag || 'Notícia'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#142D59] leading-tight group-hover:text-[#3570FC] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 font-roboto text-sm leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-right">
                    <span className="text-[#3570FC] text-xs font-semibold group-hover:underline">
                      Ver Detalhes do Alimento →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 font-roboto">
            Nenhum produto encontrado para a sua busca.
          </div>
        )}

        {/* Paginação do Catálogo */}
        {totalProductPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-6 border-t border-slate-200 gap-4">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalProductPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handleProductPageChange(page)}
                  className={`w-10 h-10 rounded-xl font-semibold text-sm transition-colors cursor-pointer shadow-sm ${
                    productPage === page
                      ? 'bg-[#0b1b3d] text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleProductPageChange(Math.min(productPage + 1, totalProductPages))}
              disabled={productPage === totalProductPages}
              className="flex items-center gap-2 text-[#0b1b3d] font-semibold text-sm hover:text-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Próxima <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>

      {/* SEÇÃO 2: MURAL DA AGRICULTURA FAMILIAR */}
      <section ref={newsSectionRef} className="pb-24 pt-12 px-6 max-w-7xl mx-auto border-t border-slate-100 scroll-mt-24">
        <div className="mb-10 space-y-2 page-reveal-up">
          <span className="text-xs uppercase tracking-widest text-[#3570FC] font-bold">
            Mural Agroecológico
          </span>
          <h2 className="text-3xl font-extrabold text-[#0b1b3d] tracking-tight">
            Notícias
          </h2>
        </div>

        {/* Busca de Notícias */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 page-reveal-up" style={{ animationDelay: '100ms' }}>
          <div className="w-full sm:w-96 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Buscar no mural..."
              value={newsSearch}
              onChange={(e) => {
                setNewsSearch(e.target.value);
                setNewsPage(1);
              }}
              className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#3570FC] shadow-sm"
            />
          </div>
        </div>

        {/* Grid de Notícias */}
        {currentNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentNews.map((item, index) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                aria-label={`Ler notícia: ${item.title}`}
                onClick={() => onSelectNews && onSelectNews(item)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelectNews?.(item);
                  }
                }}
                style={{ animationDelay: `${150 + index * 90}ms` }}
                className="page-reveal-up bg-white rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#3570FC] focus:ring-offset-2 group cursor-pointer"
              >
                <div className="w-full h-44 bg-slate-100 relative flex items-center justify-center overflow-hidden border-b border-slate-100">
                  <span className="text-slate-400 text-xs font-roboto">
                    Placeholder Imagem ({item.title})
                  </span>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-3">
                    <span className="inline-block bg-[#0b1b3d] text-white text-xs font-medium px-3 py-1 rounded shadow-sm">
                      {item.tag}
                    </span>
                    <h3 className="text-xl font-bold text-[#142D59] leading-tight group-hover:text-[#3570FC] transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-slate-600 font-roboto text-sm leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 text-right">
                    <span className="text-[#3570FC] text-xs font-semibold group-hover:underline">
                      Ler Notícia Completa →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 font-roboto">
            Nenhuma publicação encontrada no mural.
          </div>
        )}

        {/* Paginação de Notícias */}
        {totalNewsPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-6 border-t border-slate-200 gap-4">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalNewsPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handleNewsPageChange(page)}
                  className={`w-10 h-10 rounded-xl font-semibold text-sm transition-colors cursor-pointer shadow-sm ${
                    newsPage === page
                      ? 'bg-[#0b1b3d] text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleNewsPageChange(Math.min(newsPage + 1, totalNewsPages))}
              disabled={newsPage === totalNewsPages}
              className="flex items-center gap-2 text-[#0b1b3d] font-semibold text-sm hover:text-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Próxima <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}