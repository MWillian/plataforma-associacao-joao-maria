import { useState, useEffect } from 'react';
import { Calendar, Tag, ArrowLeft, Share2 } from 'lucide-react';

export function NewsDetailPage({ news, onBack, onGoHome }) {
  // Rola automaticamente para o topo ao carregar a página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [news]);

  // Notícia padrão de fallback
  const defaultNews = {
    id: 1,
    tag: 'Evento',
    title: '1º Festival de Dança da Economia Solidária: Um Conto de Natal',
    date: '15 de Dezembro, 2026',
    author: 'Estúdio Adágio & Associação João Maria',
    category: 'Eventos',
    content: [
      'É com muita alegria que a Associação Comunitária do Bairro João Maria e o Adágio Estúdio de Dança convidam toda a comunidade de Coruripe-AL para assistir ao nosso 1º Festival de Dança da Economia Solidária.',
      'O evento contará com apresentações temáticas natalinas desenvolvidas ao longo do ano com as crianças e jovens atendidos pelos nossos projetos sociais de ballet, jazz e sapateado.',
      'Além das belíssimas apresentações de dança, teremos uma feira especial com exposição de peças de artesanato local e degustação de produtos frescos da agricultura familiar. Venha prestigiar nossos talentos e fortalecer nossa economia comunitária!'
    ],
    imagePlaceholder: 'Banner do Evento Natalino (Um Conto de Natal)'
  };

  const currentNews = news || defaultNews;

  return (
    <div className="bg-white text-slate-800 font-poppins min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb e Botão Voltar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <nav className="text-xs sm:text-sm text-slate-500 font-roboto flex items-center gap-2">
            <button 
              onClick={onGoHome} 
              className="hover:text-[#142D59] transition-colors cursor-pointer"
            >
              Início
            </button>
            <span>&gt;</span>
            <button 
              onClick={onBack} 
              className="hover:text-[#142D59] transition-colors cursor-pointer"
            >
              Mural / Estúdio Adágio
            </button>
            <span>&gt;</span>
            <span className="text-[#3570FC] font-medium line-clamp-1">{currentNews.title}</span>
          </nav>

          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#0b1b3d] hover:text-[#3570FC] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Voltar para o mural
          </button>
        </div>

        {/* Cabeçalho da Notícia */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 font-roboto text-xs">
            <span className="bg-[#0b1b3d] text-white font-medium px-3 py-1 rounded shadow-sm">
              {currentNews.tag || 'Notícia'}
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar size={14} /> {currentNews.date || 'Data da publicação'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0b1b3d] tracking-tight leading-tight">
            {currentNews.title}
          </h1>

          {currentNews.author && (
            <p className="text-slate-500 font-roboto text-xs sm:text-sm border-l-2 border-[#3570FC] pl-3 py-0.5">
              Por: <strong className="text-slate-700">{currentNews.author}</strong>
            </p>
          )}
        </div>

        {/* Imagem Principal da Notícia */}
        <div className="w-full h-72 sm:h-96 md:h-[450px] bg-slate-100 rounded-3xl border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm relative">
          <span className="text-slate-400 font-roboto text-sm sm:text-base text-center px-4">
            {currentNews.imagePlaceholder || `Imagem Ilustrativa: ${currentNews.title}`}
          </span>
        </div>

        {/* Corpo do Texto da Notícia */}
        <article className="prose prose-slate max-w-none font-roboto text-slate-700 text-sm sm:text-base leading-relaxed space-y-6 pt-4">
          {Array.isArray(currentNews.content) ? (
            currentNews.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <p>{currentNews.description || currentNews.content}</p>
          )}
        </article>

        <hr className="border-slate-200 my-8" />

        {/* Chamada para Ação / Inscrições */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-[#0b1b3d]">
              Ficou com alguma dúvida ou deseja participar?
            </h3>
            <p className="text-slate-600 font-roboto text-xs sm:text-sm">
              Entre em contato direto pelo WhatsApp do Estúdio Adágio e da Associação.
            </p>
          </div>

          <a
            href="https://wa.me/5582998989898"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1b7a33] hover:bg-[#156128] text-white px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all shadow-md hover:shadow-lg shrink-0"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}