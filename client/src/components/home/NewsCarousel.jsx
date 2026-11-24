import { useEffect, useState } from 'react';

const areaLabels = {
  studio: 'Estúdio Adágio',
  crafts: 'Artesanato',
  agriculture: 'Agricultura Familiar',
};

function getImageSource(image) {
  return typeof image === 'string' ? image : image?.url;
}

export function NewsCarousel({ news = [], onSelectNews }) {
  const latestNews = news.slice(0, 6);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (latestNews.length < 2) return undefined;

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (
        (currentIndex + 1) % latestNews.length
      ));
    }, 6000);

    return () => window.clearInterval(interval);
  }, [latestNews.length]);

  if (latestNews.length === 0) {
    return null;
  }

  const currentIndex = Math.min(activeIndex, latestNews.length - 1);
  const currentNews = latestNews[currentIndex];
  const imageSource = getImageSource(currentNews.images?.[0]);
  const isImageFile =
    typeof imageSource === 'string' &&
    (
      imageSource.startsWith('data:image/') ||
      imageSource.startsWith('blob:') ||
      imageSource.startsWith('http')
    );

  const selectNews = () => {
    onSelectNews?.(currentNews);
  };

  return (
    <section className="bg-white px-6 py-14 font-poppins sm:px-8 md:py-18">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#3570FC]">
            Atualizações da associação
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0b1b3d]">
            Últimas notícias
          </h2>
        </div>

        <article className="grid overflow-hidden rounded-3xl border border-slate-200 bg-[#F7F9FC] shadow-md md:grid-cols-2">
          <button
            type="button"
            onClick={selectNews}
            className="flex min-h-56 cursor-pointer items-center justify-center bg-slate-100 text-center focus:outline-none focus:ring-2 focus:ring-[#3570FC] focus:ring-inset md:min-h-72"
            aria-label={`Abrir notícia: ${currentNews.title}`}
          >
            {isImageFile ? (
              <img
                src={imageSource}
                alt=""
                className="h-full min-h-56 w-full object-cover md:min-h-72"
              />
            ) : (
              <span className="px-6 text-sm text-slate-400">
                Imagem da notícia
              </span>
            )}
          </button>

          <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
            <button
              type="button"
              onClick={selectNews}
              className="cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#3570FC] focus:ring-offset-2"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-[#3570FC]">
                {areaLabels[currentNews.publicationArea] || 'Associação'}
              </span>
              <h3 className="mt-3 text-2xl font-bold leading-tight text-[#142D59] wrap-anywhere">
                {currentNews.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 line-clamp-4 break-words [overflow-wrap:anywhere]">
                {currentNews.description}
              </p>
              <span className="mt-5 inline-block text-sm font-semibold text-[#3570FC]">
                Ler notícia completa →
              </span>
            </button>

            {latestNews.length > 1 && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2" aria-label="Navegação das notícias">
                  {latestNews.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Exibir notícia ${index + 1}`}
                      aria-current={index === currentIndex}
                      className={`h-2.5 rounded-full transition-all ${
                        index === currentIndex
                          ? 'w-7 bg-[#3570FC]'
                          : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveIndex(
                      (currentIndex - 1 + latestNews.length) % latestNews.length
                    )}
                    aria-label="Notícia anterior"
                    className="rounded-full border border-slate-300 px-3 py-1 text-slate-600 transition hover:bg-white"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(
                      (currentIndex + 1) % latestNews.length
                    )}
                    aria-label="Próxima notícia"
                    className="rounded-full border border-slate-300 px-3 py-1 text-slate-600 transition hover:bg-white"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
