import { ArrowUpRight, LogOut } from 'lucide-react';

function ActionButton({ children, page, onNavigate }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate?.(page)}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-800"
    >
      {children}
      <ArrowUpRight aria-hidden="true" size={16} />
    </button>
  );
}

function getImageUrl(image) {
  return typeof image === 'string' ? image : image?.url;
}

function RecentThumbnail({ imageUrl, label, tone, size = 'h-14 w-14' }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className={`${size} shrink-0 rounded-lg border border-slate-200 object-cover`}
      />
    );
  }

  return (
    <div className={`flex ${size} shrink-0 items-center justify-center rounded-lg text-center text-xs font-semibold ${tone}`}>
      {label}
    </div>
  );
}

function RecentSection({
  title,
  description,
  page,
  onNavigate,
  accent,
  emptyMessage,
  children,
}) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-slate-300 border-t-4 bg-white shadow-sm ${accent}`}>
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-4">
        <div>
          <h2 className="font-bold text-slate-800">{title}</h2>
          <p className="mt-1 text-xs text-slate-600">{description}</p>
        </div>
        <ActionButton page={page} onNavigate={onNavigate}>
          Ver todos
        </ActionButton>
      </header>
      <div className="space-y-3 p-4">
        {children || (
          <p className="rounded-xl bg-slate-100 px-4 py-6 text-center text-sm text-slate-600">
            {emptyMessage}
          </p>
        )}
      </div>
    </section>
  );
}

const publicationAreaLabels = {
  studio: {
    label: 'Estúdio Adágio',
    className: 'bg-violet-100 text-violet-800',
  },
  crafts: {
    label: 'Artesanato',
    className: 'bg-amber-100 text-amber-900',
  },
  agriculture: {
    label: 'Agricultura Familiar',
    className: 'bg-emerald-100 text-emerald-900',
  },
};

export function AdmDashboardPage({
  onNavigate,
  onLogout,
  classes = [],
  students = [],
  news = [],
  notices = [],
  products = [],
}) {
  const summaryCards = [
    {
      label: 'Turmas Cadastradas',
      count: classes.length,
      page: 'adm-classes',
      accent: 'border-t-blue-700',
    },
    {
      label: 'Estudantes Criados',
      count: students.length,
      page: 'adm-students',
      accent: 'border-t-emerald-700',
    },
    {
      label: 'Avisos',
      count: notices.length,
      page: 'adm-class-notices',
      accent: 'border-t-amber-600',
    },
    {
      label: 'Notícias',
      count: news.length,
      page: 'adm-news',
      accent: 'border-t-violet-700',
    },
    {
      label: 'Produtos Cadastrados',
      count: products.length,
      page: 'adm-products',
      accent: 'border-t-green-700',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-[1480px]">
        <header className="mb-8 flex flex-col justify-between gap-6 rounded-3xl bg-blue-950/75 px-6 py-7 text-white shadow-xl shadow-blue-950/10 sm:flex-row sm:items-center sm:px-9 sm:py-9">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
              Gestão da associação
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Painel principal
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base">
              Acompanhe os totais e acesse cada área administrativa.
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 sm:self-center"
          >
            <LogOut aria-hidden="true" size={17} />
            Sair
          </button>
        </header>

        <section
          aria-label="Resumo do painel"
          className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5"
        >
          {summaryCards.map((card) => (
            <article
              key={card.label}
              className={`min-h-32 rounded-2xl border border-slate-300 border-t-4 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${card.accent}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-sm font-bold text-slate-800">
                  {card.label}
                </h2>
                <ActionButton page={card.page} onNavigate={onNavigate}>
                  Gerenciar
                </ActionButton>
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-black">
                {card.count}
              </p>
            </article>
          ))}
        </section>

        <section className="mb-8 overflow-hidden rounded-2xl border border-slate-300 border-t-4 border-t-blue-700 bg-white shadow-sm">
          <header className="flex flex-col justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-800">Turmas recentes</h2>
              <p className="mt-1 text-xs text-slate-600">
                Últimas turmas cadastradas
              </p>
            </div>
            <ActionButton page="adm-classes" onNavigate={onNavigate}>
              Ver todas
            </ActionButton>
          </header>

          {classes.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {classes.slice(-3).reverse().map((danceClass) => (
                <div
                  key={danceClass.id}
                  className="w-full px-5 py-4 transition hover:bg-blue-50"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="break-words font-semibold text-slate-800 [overflow-wrap:anywhere] wrap-anywhere">
                        {danceClass.name}
                      </h3>
                      {danceClass.createdAt && (
                        <>
                          <span aria-hidden="true" className="text-slate-400">
                            &nbsp;·&nbsp;
                          </span>
                          <time
                            dateTime={danceClass.createdAt}
                            className="shrink-0 text-sm text-slate-600"
                          >
                            {new Date(danceClass.createdAt).toLocaleDateString('pt-BR')}
                          </time>
                        </>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {danceClass.turn}
                      {danceClass.days?.length
                        ? ` · ${danceClass.days.join(', ')}`
                        : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-slate-600">
              Nenhuma turma cadastrada.
            </p>
          )}
        </section>

        <section
          aria-label="Registros recentes"
          className="grid gap-5 xl:grid-cols-3"
        >
          <RecentSection
            title="Produtos recentes"
            description="Últimos itens cadastrados"
            page="adm-products"
            onNavigate={onNavigate}
            accent="border-t-green-700"
            emptyMessage="Nenhum produto cadastrado."
          >
            {products.length > 0 && products.slice(-3).reverse().map((product) => {
              const imageUrl = getImageUrl(product.images?.[0]) || product.imageUrl;
              const name = product.name || product.title || 'Produto';

              return (
                <article
                  key={product.id || name}
                  className="flex items-center gap-3 rounded-xl border border-slate-300 bg-slate-100 p-3 transition-all duration-200 hover:border-blue-400 hover:bg-blue-100 hover:shadow-md"
                >
                  <RecentThumbnail
                    imageUrl={imageUrl}
                    label="Sem imagem"
                    tone="bg-slate-200 text-slate-700"
                    size="h-20 w-20"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-slate-800">
                      {name}
                    </h3>
                    <p className="mt-1 line-clamp-2 break-words text-xs text-slate-600 [overflow-wrap:anywhere]">
                      {product.description || 'Sem descrição.'}
                    </p>
                  </div>
                  <span className="max-w-24 shrink-0 break-words text-right text-xs font-bold text-green-900">
                    {product.price == null
                      ? 'Sob consulta'
                      : Number(product.price).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                  </span>
                </article>
              );
            })}
          </RecentSection>

          <RecentSection
            title="Notícias recentes"
            description="Últimas publicações"
            page="adm-news"
            onNavigate={onNavigate}
            accent="border-t-green-700"
            emptyMessage="Nenhuma notícia cadastrada."
          >
            {news.length > 0 && news.slice(0, 3).map((newsItem) => (
              <article
                key={newsItem.id}
                className="flex items-center gap-3 rounded-xl border border-slate-300 bg-slate-100 p-3 transition-all duration-200 hover:border-blue-400 hover:bg-blue-100 hover:shadow-md"
              >
                <RecentThumbnail
                  imageUrl={getImageUrl(newsItem.images?.[0])}
                  label="Notícia"
                  tone="bg-slate-200 text-slate-700"
                />
                <div className="min-w-0 flex-1">
                  {publicationAreaLabels[newsItem.publicationArea] && (
                    <span className={`mb-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${publicationAreaLabels[newsItem.publicationArea].className}`}>
                      {publicationAreaLabels[newsItem.publicationArea].label}
                    </span>
                  )}
                  <h3 className="truncate text-sm font-semibold text-slate-800">
                    {newsItem.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 break-words text-xs text-slate-600 [overflow-wrap:anywhere]">
                    {newsItem.description || 'Sem descrição.'}
                  </p>
                </div>
                <span className="max-w-20 shrink-0 text-right text-xs font-semibold text-slate-600">
                  {newsItem.date}
                </span>
              </article>
            ))}
          </RecentSection>

          <RecentSection
            title="Avisos recentes"
            description="Últimos comunicados enviados"
            page="adm-class-notices"
            onNavigate={onNavigate}
            accent="border-t-green-700"
            emptyMessage="Nenhum aviso enviado."
          >
            {notices.length > 0 && notices.slice(0, 3).map((notice) => (
              <article
                key={notice.id}
                className="flex items-center gap-3 rounded-xl border border-slate-300 bg-slate-100 p-3 transition-all duration-200 hover:border-blue-400 hover:bg-blue-100 hover:shadow-md"
              >
                <RecentThumbnail
                  label="Aviso"
                  tone="bg-slate-200 text-slate-700"
                />
                <div className="min-w-0 flex-1">
                  <span className={`mb-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                    notice.type === 'Cancelamento'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {notice.type}
                  </span>
                  <h3 className="truncate text-sm font-semibold text-slate-800 wrap-anywhere">
                    {notice.subject}
                  </h3>
                  <p className="mt-1 line-clamp-2 break-words text-xs text-slate-600 [overflow-wrap:anywhere]">
                    {notice.message}
                  </p>
                </div>
                <div className="shrink-0 whitespace-nowrap text-right text-xs text-slate-600">
                  <p className="font-semibold">{notice.date}</p>
                  <p className="mt-1 flex items-center justify-end gap-1">
                    <span>{notice.sentCount ?? 0}</span>
                    <span>
                      {notice.sentCount === 1 ? 'destinatário' : 'destinatários'}
                    </span>
                  </p>
                </div>
              </article>
            ))}
          </RecentSection>
        </section>
      </div>
    </main>
  );
}
