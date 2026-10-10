import { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

export function AgriculturePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);

  // Lista expositiva de produtos e notícias da Agricultura Familiar conforme o Figma
  const allAgricultureItems = [
    {
      id: 1,
      tag: 'Produto',
      title: 'Tomates',
      description: 'Cultivados de forma sustentável pelos produtores da associação.',
      category: 'Produtos',
    },
    {
      id: 2,
      tag: 'Produto',
      title: 'Cebola',
      description: 'Cultivados de forma sustentável pelos produtores da associação.',
      category: 'Produtos',
    },
    {
      id: 3,
      tag: 'Produto',
      title: 'Macaxeira',
      description: 'Cultivados de forma sustentável pelos produtores da associação.',
      category: 'Produtos',
    },
    {
      id: 4,
      tag: 'Produto',
      title: 'Batata inglesa',
      description: 'Cultivados de forma sustentável pelos produtores da associação.',
      category: 'Produtos',
    },
    {
      id: 5,
      tag: 'Produto',
      title: 'Batata doce',
      description: 'Cultivados de forma sustentável pelos produtores da associação.',
      category: 'Produtos',
    },
    {
      id: 6,
      tag: 'Produto',
      title: 'Pimentão',
      description: 'Cultivados de forma sustentável pelos produtores da associação.',
      category: 'Produtos',
    },
    {
      id: 7,
      tag: 'Evento',
      title: 'Edição Especial da Feira Comunitária',
      description: 'Confira as datas e os locais das próximas feiras da agricultura familiar.',
      category: 'Eventos',
    },
    {
      id: 8,
      tag: 'Notícia',
      title: 'Incentivo à produção orgânica local',
      description: 'Novas parcerias garantem sementes e insumos para as famílias associadas.',
      category: 'Notícias',
    },
    {
      id: 9,
      tag: 'Produto',
      title: 'Cenoura fresca',
      description: 'Cultivados de forma sustentável pelos produtores da associação.',
      category: 'Produtos',
    },
  ];

  // Filtro por termo de busca e categoria
  const filteredItems = allAgricultureItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white text-slate-800 font-poppins min-h-screen">
      {/* Hero Banner Edge-to-Edge */}
      <div 
        style={{ minHeight: '464px' }}
        className="w-full bg-[#0b1b3d] relative flex items-center overflow-hidden px-6 md:px-16 py-16"
      >
        {/* Imagem de Fundo de Plantio/Agricultura */}
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
            Produtos cultivados por famílias associadas e notícias
          </p>
        </div>
      </div>

      {/* Seção do Evento em Destaque */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Lado Esquerdo: Banner do Evento (664px max width x 320px height) */}
          <div className="lg:col-span-7 flex justify-center">
            <div 
              style={{ width: '100%', maxWidth: '664px', minHeight: '320px' }}
              className="w-full h-80 sm:h-96 lg:h-[320px] bg-amber-200/90 rounded-2xl shadow-xl flex items-center justify-center p-6 relative overflow-hidden text-center border border-amber-300"
            >
              <div className="text-amber-950 space-y-3">
                <h3 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-wide">
                  Feira de Agricultura Familiar
                </h3>
                <p className="text-sm font-medium opacity-90">
                  Alimentos frescos direto do produtor para a sua mesa
                </p>
              </div>
            </div>
          </div>

          {/* Lado Direito: Detalhes do Evento */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#142D59] leading-tight">
              Evento: Feira da Agricultura Familiar.
            </h3>
            
            <p className="text-slate-600 font-roboto text-base leading-relaxed">
              Participe da nova edição da nossa feira livre.
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

      {/* Seção do Grid de Produtos Expositivos e Notícias */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
        {/* Controles de Filtro e Busca */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
          {/* Campo de Busca */}
          <div className="w-full sm:w-96 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Buscar produto ou notícia"
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
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
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