import { useEffect } from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import { DetailState } from '../../components/details/DetailState.jsx';

export function NewsDetailPage({ news, isLoading = false, onBack, onGoHome, backLabel }) {
  // Rola automaticamente para o topo ao carregar a página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [news]);

  if (!news) {
    return (
      <DetailState
        isLoading={isLoading}
        notFoundTitle="Notícia não encontrada"
        notFoundText="Esta notícia não está mais disponível no mural."
        backLabel={backLabel ? `Voltar para ${backLabel.toLowerCase()}` : 'Voltar ao mural'}
        onBack={onBack}
        onGoHome={onGoHome}
      />
    );
  }

  const currentNews = news;
  // Linha em branco separa parágrafos; quebra simples vira quebra de linha.
  const newsText = Array.isArray(currentNews.content)
    ? currentNews.content.join('\n\n')
    : currentNews.description || currentNews.content || '';
  const newsParagraphs = String(newsText)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  // A API envia as imagens como lista de URLs; aceita também objetos { url }.
  const newsImages = (currentNews.images || [])
    .map((image) => (typeof image === 'string' ? image : image?.url))
    .filter(Boolean);

  return (
    <div className="bg-white text-slate-800 font-poppins min-h-screen py-6 sm:py-10 px-4 sm:px-6 lg:px-8 page-reveal-fade">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Breadcrumb e Botão Voltar Responsivo */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4 sm:border-none sm:pb-0">
          <nav className="text-xs sm:text-sm text-slate-500 font-roboto flex items-center gap-1.5 flex-wrap">
            <button 
              onClick={onGoHome} 
              className="hover:text-[#142D59] transition-colors cursor-pointer py-1"
            >
              Início
            </button>
            <span>&gt;</span>
            <button 
              onClick={onBack} 
              className="hover:text-[#142D59] transition-colors cursor-pointer py-1 whitespace-nowrap"
            >
              {backLabel || 'Mural / Estúdio Adágio'}
            </button>
            <span>&gt;</span>
            <span className="text-[#3570FC] font-medium max-w-[140px] sm:max-w-xs truncate block">
              {currentNews.title}
            </span>
          </nav>

          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#0b1b3d] hover:text-[#3570FC] transition-colors cursor-pointer py-1.5 px-3 bg-slate-50 sm:bg-transparent rounded-lg border sm:border-none border-slate-200"
          >
            <ArrowLeft size={16} /> Voltar para {backLabel?.toLowerCase() || 'o mural'}
          </button>
        </div>

        {/* Cabeçalho da Notícia */}
        <div className="space-y-3 sm:space-y-4 page-reveal-up">
          <div className="flex items-center gap-2.5 sm:gap-3 font-roboto text-xs flex-wrap">
            <span className="bg-[#0b1b3d] text-white font-medium px-2.5 py-1 rounded shadow-sm text-[11px] sm:text-xs">
              {currentNews.tag || 'Notícia'}
            </span>
            <span className="text-slate-400 flex items-center gap-1 text-[11px] sm:text-xs">
              <Calendar size={14} /> {currentNews.date || 'Data da publicação'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#0b1b3d] tracking-tight leading-tight sm:leading-tight">
            {currentNews.title}
          </h1>

          {currentNews.author && (
            <p className="text-slate-500 font-roboto text-xs sm:text-sm border-l-2 border-[#3570FC] pl-3 py-0.5">
              Por: <strong className="text-slate-700">{currentNews.author}</strong>
            </p>
          )}
        </div>

        {/* Imagem Principal da Notícia (Proporções Otimizadas para Mobile) */}
        <div className="w-full h-52 sm:h-80 md:h-[450px] bg-slate-100 rounded-2xl sm:rounded-3xl border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm relative page-reveal-fade" style={{ animationDelay: '120ms' }}>
          {newsImages.length > 0 ? (
            <img
              src={newsImages[0]}
              alt={currentNews.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-slate-400 font-roboto text-xs sm:text-base text-center px-4">
              {`Imagem Ilustrativa: ${currentNews.title}`}
            </span>
          )}
        </div>

        {/* Demais fotos da notícia */}
        {newsImages.length > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {newsImages.slice(1).map((url, index) => (
              <img
                key={url}
                src={url}
                alt={`${currentNews.title} (foto ${index + 2})`}
                className="h-32 sm:h-44 w-full rounded-xl border border-slate-200 object-cover"
              />
            ))}
          </div>
        )}

        {/* Corpo do Texto da Notícia */}
        <article className="prose prose-slate max-w-none font-roboto text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 sm:space-y-6 pt-2 sm:pt-4 page-reveal-up" style={{ animationDelay: '220ms' }}>
          {newsParagraphs.map((paragraph, index) => (
            <p key={index} className="m-0 whitespace-pre-line break-words leading-relaxed [overflow-wrap:anywhere]">{paragraph}</p>
          ))}
        </article>

        <hr className="border-slate-200 my-6 sm:my-8" />

        {/* Chamada para Ação / Inscrições */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-center sm:text-left page-reveal-up" style={{ animationDelay: '300ms' }}>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-[#0b1b3d]">
              Ficou com alguma dúvida ou deseja participar?
            </h3>
            <p className="text-slate-600 font-roboto text-xs sm:text-sm">
              Entre em contato direto pelo WhatsApp do Estúdio Adágio e da Associação.
            </p>
          </div>

          <a
            href="https://wa.me/5582996486572"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#1b7a33] hover:bg-[#156128] text-white px-6 py-3.5 rounded-xl font-bold text-sm text-center transition-all shadow-md hover:shadow-lg shrink-0 cursor-pointer"
          >
            Falar no WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}