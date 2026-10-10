import { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

export function StudioPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock de notícias e eventos do estúdio
  const allNews = [
    {
      id: 1,
      tag: 'Evento',
      title: 'Notícia 1',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Eventos',
    },
    {
      id: 2,
      tag: 'Evento',
      title: 'Notícia 2',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Eventos',
    },
    {
      id: 3,
      tag: 'Evento',
      title: 'Notícia 3',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Eventos',
    },
    {
      id: 4,
      tag: 'Notícia',
      title: 'Notícia 4',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Notícias',
    },
    {
      id: 5,
      tag: 'Evento',
      title: 'Notícia 5',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Eventos',
    },
    {
      id: 6,
      tag: 'Notícia',
      title: 'Notícia 6',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Notícias',
    },
    {
      id: 7,
      tag: 'Notícia',
      title: 'Notícia 7',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Notícias',
    },
    {
      id: 8,
      tag: 'Notícia',
      title: 'Notícia 8',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Notícias',
    },
    {
      id: 9,
      tag: 'Notícia',
      title: 'Notícia 9',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Notícias',
    },
    {
      id: 10,
      tag: 'Evento',
      title: 'Notícia 10',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Eventos',
    },
    {
      id: 11,
      tag: 'Notícia',
      title: 'Notícia 11',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Notícias',
    },
    {
      id: 12,
      tag: 'Evento',
      title: 'Notícia 12',
      description: 'Breve descrição da notícia convidando o leitor.',
      category: 'Eventos',
    },
  ];

  // Filtro por termo de busca e categoria
  const filteredNews = allNews.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white text-slate-800 font-poppins min-h-screen">
      {/* Hero Banner Edge-to-Edge */}
      <div 
        style={{ minHeight: '464px' }}
        className="w-full bg-[#0b1b3d] relative flex items-center overflow-hidden px-6 md:px-16 py-16"
      >
        <div className="absolute inset-0 bg-blue-950/75 z-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-r from-[#0b1b3d]/90 via-[#0b1b3d]/60 to-transparent flex items-center justify-center text-blue-300/30 font-roboto text-sm">
            [Background Image: Balé Estúdio Adágio]
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Estúdio Adágio
          </h1>
          <p className="text-lg md:text-xl text-blue-100 font-roboto font-light max-w-xl leading-relaxed">
            Turmas de ballet, jazz e sapateado para crianças e jovens.
          </p>
        </div>
      </div>

      {/* Seção da Notícia Mais Recente */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex justify-center">
            <div 
              style={{ width: '100%', maxWidth: '664px', minHeight: '320px' }}
              className="w-full h-80 sm:h-96 lg:h-[320px] bg-red-900/90 rounded-2xl shadow-xl flex items-center justify-center p-6 relative overflow-hidden text-center border border-red-800"
            >
              <div className="text-white space-y-2">
                <span className="text-xs uppercase tracking-widest text-amber-300 block font-bold">
                  1º Festival de Dança da Economia Solidária
                </span>
                <h3 className="text-xl sm:text-2xl font-bold">
                  Associação Comunitária do Bairro João Maria e Adágio Estúdio de Dança
                </h3>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-amber-200">
                  Apresentam: Um Conto de Natal
                </h4>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#142D59] leading-tight">
              Evento: Apresentação da turma de ballet
            </h3>
            
            <p className="text-slate-600 font-roboto text-base leading-relaxed">
              Venha assistir nossas crianças em uma apresentação temática natalina.
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

      {/* Seção do Grid de Notícias */}
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
              placeholder="Buscar notícia"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#3570FC] shadow-sm"
            />
          </div>
        </div>

        {/* Grid de Cards de Notícias (3x3) */}
        {currentNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentNews.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
              >
                {/* Imagem / Placeholder Superior */}
                <div className="w-full h-48 bg-slate-100 relative flex items-center justify-center overflow-hidden border-b border-slate-100">
                  <span className="text-slate-400 text-xs font-roboto">Placeholder Imagem</span>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-3">
                    <span className="inline-block bg-[#0b1b3d] text-white text-xs font-medium px-3 py-1 rounded shadow-sm">
                      {item.tag}
                    </span>
                    <h3 className="text-xl font-bold text-[#142D59] leading-tight group-hover:text-[#3570FC] transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-slate-600 font-roboto text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 font-roboto">
            Nenhuma notícia encontrada para a sua busca.
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