import { useState } from 'react';
import { Search, ChevronRight, Users, Clock, Calendar } from 'lucide-react';

export function StudioPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);

  // Grade de Turmas do Estúdio
  const danceClasses = [
    {
      id: 'c1',
      title: 'Ballet Baby & Infantil',
      age: '3 a 8 anos',
      schedule: 'Terças e Quintas - 14h às 15h',
      description: 'Introdução à dança, expressão corporal, postura e coordenação motora de forma lúdica.',
      tag: 'Turma',
    },
    {
      id: 'c2',
      title: 'Ballet Juvenil',
      age: '9 a 15 anos',
      schedule: 'Segundas e Quartas - 15h às 16h30',
      description: 'Técnica clássica de ballet, sapatilhas de ponta e preparação para apresentações.',
      tag: 'Turma',
    },
    {
      id: 'c3',
      title: 'Jazz Dance',
      age: '7 a 16 anos',
      schedule: 'Terças e Quintas - 15h30 às 16h30',
      description: 'Dança vibrante com ritmos modernos, foco em ritmo, flexibilidade e energia.',
      tag: 'Turma',
    },
    {
      id: 'c4',
      title: 'Sapateado',
      age: '8 a 16 anos',
      schedule: 'Sábados - 09h às 10h30',
      description: 'Desenvolvimento de musicalidade, percussão com os pés e coordenação corporal.',
      tag: 'Turma',
    },
  ];

  // Feed de Notícias, Notícias de Turmas e Eventos
  const allNews = [
    {
      id: 1,
      tag: 'Evento',
      title: '1º Festival de Dança da Economia Solidária',
      description: 'Apresentação especial natalina "Um Conto de Natal" com nossos alunos.',
      category: 'Eventos',
    },
    {
      id: 2,
      tag: 'Notícia',
      title: 'Novas Vagas Abertas para Ballet Infantil',
      description: 'Garanta a vaga do seu filho para o novo semestre letivo no Estúdio Adágio.',
      category: 'Notícias',
    },
    {
      id: 3,
      tag: 'Notícia',
      title: 'Novos Figurinos do Grupo Principal',
      description: 'Confira a confecção das roupas sustentáveis feitas pela nossa comunidade.',
      category: 'Notícias',
    },
    {
      id: 4,
      tag: 'Turma',
      title: 'Aulão Aberto de Jazz para Iniciantes',
      description: 'Venha experimentar uma aula gratuita de Jazz Dance neste sábado.',
      category: 'Turmas',
    },
    {
      id: 5,
      tag: 'Evento',
      title: 'Espetáculo de Fim de Ano no Teatro',
      description: 'Nossos alunos sobem ao palco principal para a grande apresentação anual.',
      category: 'Eventos',
    },
    {
      id: 6,
      tag: 'Notícia',
      title: 'Aluna do Estúdio Aprovada em Audição',
      description: 'Orgulho para Coruripe! Nossa bailarina ganha destaque em seleção estadual.',
      category: 'Notícias',
    },
    {
      id: 7,
      tag: 'Turma',
      title: 'Inscrições Prorrogadas para Sapateado',
      description: 'Aproveite a oportunidade para ingressar na nova turma de sapateado.',
      category: 'Turmas',
    },
    {
      id: 8,
      tag: 'Evento',
      title: 'Ensaio Geral Aberto aos Pais e Familiares',
      description: 'Um momento de integração e prévia das coreografias do semestre.',
      category: 'Eventos',
    },
    {
      id: 9,
      tag: 'Notícia',
      title: 'Oficina de Expressão Corporal com Convidado',
      description: 'Workshop especial ministrado para a aperfeiçoar a interpretação artística.',
      category: 'Notícias',
    },
  ];

  // Filtro por termo de busca e categoria
  const filteredNews = allNews.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todas' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const itemsPerPage = 6;
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
            Turmas de ballet, jazz e sapateado para crianças e jovens da nossa comunidade.
          </p>
        </div>
      </div>

      {/* Destaque do Evento Recente */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-b border-slate-100">
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
              Venha assistir nossas crianças em uma apresentação temática natalina inesquecível.
            </p>

            <div className="pt-2">
              <a
                href="https://wa.me/5582998989898"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#3570FC] font-semibold text-sm hover:underline underline-offset-4 gap-2 transition-colors"
              >
                Saiba Mais / Ingressos <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 1: Turmas Abertas e Atividades */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#3570FC] font-bold">
            Formação Artística
          </span>
          <h2 className="text-3xl font-extrabold text-[#0b1b3d] tracking-tight">
            Nossas Turmas de Dança
          </h2>
          <p className="text-slate-600 font-roboto text-sm sm:text-base max-w-2xl">
            Oferecemos aulas de ballet, jazz e sapateado focadas no desenvolvimento artístico, disciplina e autoestima de crianças e jovens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {danceClasses.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all"
            >
              <div className="space-y-4">
                <span className="inline-block bg-[#0b1b3d] text-white text-[10px] font-bold px-3 py-1 rounded shadow-sm uppercase tracking-wider">
                  {item.tag}
                </span>

                <h3 className="text-xl font-bold text-[#142D59] leading-snug">
                  {item.title}
                </h3>

                <p className="text-slate-600 font-roboto text-xs leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-200/60 font-roboto text-xs text-slate-700">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users size={14} className="text-[#3570FC]" />
                    <span><strong>Idade:</strong> {item.age}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600">
                    <Clock size={14} className="text-[#3570FC] mt-0.5 shrink-0" />
                    <span><strong>Horário:</strong> {item.schedule}</span>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/5582998989898"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#1b7a33] hover:bg-[#156128] text-white py-2.5 px-4 rounded-xl text-xs font-bold text-center block transition-colors shadow-sm"
              >
                Inscrever pelo WhatsApp
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 2: Notícias e Publicações da Proprietária */}
      <section className="pb-24 pt-10 px-6 max-w-7xl mx-auto border-t border-slate-100">
        <div className="mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#3570FC] font-bold">
            Mural do Estúdio
          </span>
          <h2 className="text-3xl font-extrabold text-[#0b1b3d] tracking-tight">
            Notícias e Avisos
          </h2>
        </div>

        {/* Controles de Filtro e Busca */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
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
              <option value="Todas">Todas as Categorias</option>
              <option value="Turmas">Avisos de Turmas</option>
              <option value="Notícias">Notícias</option>
              <option value="Eventos">Eventos e Apresentações</option>
            </select>
          </div>

          {/* Campo de Busca */}
          <div className="w-full sm:w-96 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Buscar no mural de notícias..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#3570FC] shadow-sm"
            />
          </div>
        </div>

        {/* Grid de Cards de Notícias */}
        {currentNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentNews.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md border border-slate-100 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
              >
                {/* Imagem / Placeholder Superior */}
                <div className="w-full h-48 bg-slate-100 relative flex items-center justify-center overflow-hidden border-b border-slate-100">
                  <span className="text-slate-400 text-xs font-roboto">
                    Placeholder Imagem ({item.title})
                  </span>
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
            Nenhuma publicação encontrada para a sua busca.
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