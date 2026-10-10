import { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

export function CraftsPage({ onSelectProduct }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock de produtos e notícias de artesanato conforme o protótipo
  const allCrafts = [
    {
      id: 1,
      tag: 'Produto',
      price: 'R$ 35,00',
      title: 'Kit 3 pulseiras de macramê',
      description: 'Breve descrição da notícia convidando o leitor.',
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
      id: 3,
      tag: 'Evento',
      price: 'Gratuito',
      title: '4ª Feira de Artesanato da Associação',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Eventos',
    },
    {
      id: 4,
      tag: 'Produto',
      price: 'R$ 15,00',
      title: 'Chaveiros em crochê',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Produtos',
    },
    {
      id: 5,
      tag: 'Produto',
      price: 'R$ 45,00',
      title: 'Caminho de mesa em fuxico',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Produtos',
    },
    {
      id: 6,
      tag: 'Produto',
      price: 'R$ 60,00',
      title: 'Pano com bordado de filé',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Produtos',
    },
    {
      id: 7,
      tag: 'Notícia',
      price: 'Inscrições Abertas',
      title: 'Oficina de costura para iniciantes',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Notícias',
    },
    {
      id: 8,
      tag: 'Produto',
      price: 'R$ 25,00',
      title: 'Colar em macramê',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Produtos',
    },
    {
      id: 9,
      tag: 'Produto',
      price: 'R$ 80,00',
      title: 'Bolsa em crochê',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Produtos',
    },
    {
      id: 10,
      tag: 'Produto',
      price: 'R$ 50,00',
      title: 'Tapete redondo em barbante',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Produtos',
    },
    {
      id: 11,
      tag: 'Evento',
      price: 'Gratuito',
      title: 'Exposição de Bordados Tradicionais',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Eventos',
    },
    {
      id: 12,
      tag: 'Notícia',
      price: 'Informativo',
      title: 'Novas vagas para oficinas comunitárias',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Notícias',
    },
  ];

  // Filtro por busca e categoria
  const filteredCrafts = allCrafts.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredCrafts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCrafts = filteredCrafts.slice(startIndex, startIndex + itemsPerPage);

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
            Produtos artesanais criados por nossos associados e notícias
          </p>
        </div>
      </div>

      {/* Seção da Oficina Recente em Destaque */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
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
                href="#saiba-mais" 
                className="inline-flex items-center text-[#3570FC] font-semibold text-sm hover:underline underline-offset-4 gap-2 transition-colors"
              >
                Saiba Mais <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Seção do Grid de Produtos e Notícias */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
        {/* Controles de Filtro e Busca */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
          {/* Seletor de Categorias */}
          <div className="w-full sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium focus:outline-none focus:border-[#3570FC] shadow-sm cursor-pointer"
            >
              <option value="Todas">Categorias (Todas)</option>
              <option value="Produtos">Produtos</option>
              <option value="Eventos">Eventos</option>
              <option value="Notícias">Notícias</option>
            </select>
          </div>

          {/* Campo de Busca */}
          <div className="w-full sm:w-96 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Buscar notícia ou produto"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#3570FC] shadow-sm"
            />
          </div>
        </div>  

        {/* Grid de Cards (3x3) */}
        {currentCrafts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentCrafts.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectProduct && onSelectProduct(item)}
                className="bg-white rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group cursor-pointer"
              >
                {/* Imagem / Placeholder Superior */}
                <div className="w-full h-48 bg-slate-100 relative flex items-center justify-center overflow-hidden border-b border-slate-100">
                  <span className="text-slate-400 text-xs font-roboto">Placeholder Imagem ({item.title})</span>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="inline-block bg-[#0b1b3d] text-white text-xs font-medium px-3 py-1 rounded shadow-sm">
                      {item.tag}
                    </span>
                    <span className="text-slate-700 font-bold text-sm font-roboto">
                      {item.price}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#142D59] leading-tight group-hover:text-[#3570FC] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 font-roboto text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 font-roboto">
            Nenhum item encontrado para a sua busca.
          </div>
        )}

        {/* Paginação */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-16 pt-8 border-t border-slate-200 gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl font-semibold text-sm transition-colors cursor-pointer shadow-sm ${
                  currentPage === page
                    ? 'bg-[#0b1b3d] text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 text-[#0b1b3d] font-semibold text-sm hover:text-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Próxima <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}