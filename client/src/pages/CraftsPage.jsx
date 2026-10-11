import { useState, useRef } from 'react';
import { Search, ChevronRight } from 'lucide-react';

export function CraftsPage({ onSelectProduct, onSelectNews }) {
  // Referências para controlar a rolagem exata das seções
  const productsSectionRef = useRef(null);
  const newsSectionRef = useRef(null);

  // Estados para o Catálogo de Produtos
  const [productSearch, setProductSearch] = useState('');
  const [productPage, setProductPage] = useState(1);

  // Estados para o Mural de Notícias e Eventos
  const [newsSearch, setNewsSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [newsPage, setNewsPage] = useState(1);

  // Funções de mudança de página com rolagem automática para o topo da seção
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

  // 1. Catálogo de Produtos Artesanais
  const craftProducts = [
    {
      id: 1,
      tag: 'Produto',
      price: 'R$ 35,00',
      title: 'Kit 3 pulseiras de macramê',
      description: 'Pulseiras artesanais feitas à mão com fios duráveis e fecho regulável em diversas cores.',
      category: 'Produtos',
    },
    {
      id: 2,
      tag: 'Produto',
      price: 'R$ 35,00',
      title: 'Sousplat de crochê',
      description: 'Sousplat artesanal feito inteiramente à mão em crochê com fios selecionados de 100% algodão natural.',
      category: 'Produtos',
    },
    {
      id: 4,
      tag: 'Produto',
      price: 'R$ 15,00',
      title: 'Chaveiros em crochê',
      description: 'Lembrancinhas delicadas e coloridas tecidas à mão pelas artesãs da associação.',
      category: 'Produtos',
    },
    {
      id: 5,
      tag: 'Produto',
      price: 'R$ 45,00',
      title: 'Caminho de mesa em fuxico',
      description: 'Trabalho tradicional em fuxico com retalhos coloridos, unindo tradição e aconchego.',
      category: 'Produtos',
    },
    {
      id: 6,
      tag: 'Produto',
      price: 'R$ 60,00',
      title: 'Pano com bordado de filé',
      description: 'Autêntico bordado filé de Alagoas com tramas e cores vibrantes da nossa região.',
      category: 'Produtos',
    },
    {
      id: 8,
      tag: 'Produto',
      price: 'R$ 25,00',
      title: 'Colar em macramê',
      description: 'Acessório exclusivo com pedras naturais e nós trançados com acabamento impecável.',
      category: 'Produtos',
    },
    {
      id: 9,
      tag: 'Produto',
      price: 'R$ 80,00',
      title: 'Bolsa em crochê',
      description: 'Bolsa tiracolo artesanal reforçada, ideal para o dia a dia com estilo regional.',
      category: 'Produtos',
    },
    {
      id: 10,
      tag: 'Produto',
      price: 'R$ 50,00',
      title: 'Tapete redondo em barbante',
      description: 'Tapete macio e resistente para compor a decoração de salas e quartos.',
      category: 'Produtos',
    },
  ];

  // 2. Mural de Notícias, Oficinas e Eventos
  const craftNews = [
    {
      id: 3,
      tag: 'Evento',
      title: '4ª Feira de Artesanato da Associação',
      description: 'Venha conhecer e apoiar a produção local das nossas artesãs cooperadas em Coruripe.',
      category: 'Eventos',
      date: '20 de Outubro, 2026',
    },
    {
      id: 7,
      tag: 'Notícia',
      title: 'Oficina de costura para iniciantes',
      description: 'Aprenda os primeiros passos do corte e costura comunitária nesta oficina gratuita.',
      category: 'Notícias',
      date: '12 de Outubro, 2026',
    },
    {
      id: 11,
      tag: 'Evento',
      title: 'Exposição de Bordados Tradicionais',
      description: 'Mostra cultural celebrando a história do bordado filé e do crochê na comunidade.',
      category: 'Eventos',
      date: '05 de Novembro, 2026',
    },
    {
      id: 12,
      tag: 'Notícia',
      title: 'Novas vagas para oficinas comunitárias',
      description: 'Abertas as inscrições para turmas de crochê e confecção de acessórios artesanais.',
      category: 'Notícias',
      date: '01 de Outubro, 2026',
    },
  ];

  // Filtro de Produtos
  const filteredProducts = craftProducts.filter((item) =>
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
  const filteredNews = craftNews.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(newsSearch.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todas' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const newsPerPage = 3;
  const totalNewsPages = Math.ceil(filteredNews.length / newsPerPage) || 1;
  const currentNews = filteredNews.slice(
    (newsPage - 1) * newsPerPage,
    newsPage * newsPerPage
  );

  return (
    <div className="bg-white text-slate-800 font-poppins min-h-screen">
      {/* Hero Banner Edge-to-Edge */}
      <div 
        style={{ minHeight: '464px' }}
        className="w-full bg-[#0b1b3d] relative flex items-center overflow-hidden px-6 md:px-16 py-16"
      >
        <div className="absolute inset-0 bg-blue-950/75 z-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-r from-[#0b1b3d]/90 via-[#0b1b3d]/60 to-transparent flex items-center justify-center text-blue-300/30 font-roboto text-sm">
            [Background Image: Artesanato e Crochê]
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Artesanato
          </h1>
          <p className="text-lg md:text-xl text-blue-100 font-roboto font-light max-w-xl leading-relaxed">
            Produtos artesanais criados por nossos associados, oficinas e feiras comunitárias.
          </p>
        </div>
      </div>

      {/* Destaque da Oficina Recente */}
      <section className="py-16 sm:py-20 px-6 max-w-7xl mx-auto border-b border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex justify-center">
            <div 
              style={{ width: '100%', maxWidth: '664px', minHeight: '320px' }}
              className="w-full h-80 sm:h-96 lg:h-[320px] bg-amber-100/90 rounded-2xl shadow-xl flex items-center justify-center p-6 relative overflow-hidden text-center border border-amber-200"
            >
              <div className="text-amber-950 space-y-2">
                <h3 className="text-2xl sm:text-3xl font-serif italic font-bold">
                  Oficina de Crochê
                </h3>
                <h4 className="text-lg sm:text-xl font-medium">
                  Venha criar com as mãos.
                </h4>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#142D59] leading-tight">
              Oficinas: Produção de artigos de crochê.
            </h3>
            
            <p className="text-slate-600 font-roboto text-base leading-relaxed">
              Participe desse encontro para aprender e compartilhar conhecimentos básicos sobre a arte do crochê.
            </p>

            <div className="pt-2">
              <a
                href="https://wa.me/5582998989898"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#3570FC] font-semibold text-sm hover:underline underline-offset-4 gap-2 transition-colors"
              >
                Saiba Mais / Inscrições <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 1: CATÁLOGO DE PRODUTOS ARTESANAIS */}
      <section ref={productsSectionRef} className="py-16 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
            Feito à Mão
          </span>
          <h2 className="text-3xl font-extrabold text-[#0b1b3d] tracking-tight">
            Catálogo de Peças Artesanais
          </h2>
          <p className="text-slate-600 font-roboto text-sm sm:text-base max-w-2xl">
            Explore os produtos confeccionados pelas artesãs cooperadas da nossa associação. Clique em uma peça para ver os detalhes e encomendar direto pelo WhatsApp.
          </p>
        </div>

        {/* Busca de Produtos */}
        <div className="flex justify-end mb-8">
          <div className="w-full sm:w-96 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Buscar produto no catálogo..."
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                setProductPage(1);
              }}
              className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#3570FC] shadow-sm"
            />
          </div>
        </div>

        {/* Grid de Produtos (3 Colunas) */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectProduct && onSelectProduct(item)}
                className="bg-white rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group cursor-pointer"
              >
                {/* Imagem Placeholder */}
                <div className="w-full h-48 bg-slate-100 relative flex items-center justify-center overflow-hidden border-b border-slate-100">
                  <span className="text-slate-400 text-xs font-roboto">
                    Placeholder Imagem ({item.title})
                  </span>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="inline-block bg-[#0b1b3d] text-white text-xs font-medium px-3 py-1 rounded shadow-sm">
                      {item.tag}
                    </span>
                    <span className="text-amber-800 font-extrabold text-base font-roboto">
                      {item.price}
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
                      Ver Detalhes do Produto →
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

        {/* Paginação do Catálogo com Rolagem Automática */}
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

      {/* SEÇÃO 2: MURAL DE NOTÍCIAS, EVENTOS E OFICINAS */}
      <section ref={newsSectionRef} className="pb-24 pt-12 px-6 max-w-7xl mx-auto border-t border-slate-100 scroll-mt-24">
        <div className="mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#3570FC] font-bold">
            Mural da Associação
          </span>
          <h2 className="text-3xl font-extrabold text-[#0b1b3d] tracking-tight">
            Notícias, Oficinas e Feiras
          </h2>
        </div>

        {/* Controles de Filtro e Busca para Notícias */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
          <div className="w-full sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setNewsPage(1);
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium focus:outline-none focus:border-[#3570FC] shadow-sm cursor-pointer"
            >
              <option value="Todas">Todas as Publicações</option>
              <option value="Notícias">Notícias e Oficinas</option>
              <option value="Eventos">Feiras e Eventos</option>
            </select>
          </div>

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
            {currentNews.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNews && onSelectNews(item)}
                className="bg-white rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group cursor-pointer"
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

        {/* Paginação de Notícias com Rolagem Automática */}
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