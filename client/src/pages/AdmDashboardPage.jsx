import { ArrowUpRight, LogOut } from 'lucide-react';

function ActionButton({ children, page, onNavigate, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate?.(page)}
      aria-label={ariaLabel}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
    >
      {children}
      <ArrowUpRight aria-hidden="true" size={16} />
    </button>
  );
}

function getImageUrl(image) {
  return typeof image === 'string' ? image : image?.url;
}

function getRecentItems(items) {
  return items
    .map((item, index) => ({
      item,
      index,
      timestamp: Date.parse(item.createdAt || ''),
    }))
    .sort((left, right) => {
      const leftHasDate = Number.isFinite(left.timestamp);
      const rightHasDate = Number.isFinite(right.timestamp);

      if (leftHasDate && rightHasDate && left.timestamp !== right.timestamp) {
        return right.timestamp - left.timestamp;
      }

      if (leftHasDate !== rightHasDate) {
        return leftHasDate ? -1 : 1;
      }

      return left.index - right.index;
    })
    .slice(0, 3)
    .map(({ item }) => item);
}

function formatDate(value) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString('pt-BR');
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
  loadingMessage,
  errorMessage,
  status = 'ready',
  actionLabel,
  children,
}) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-slate-300 border-t-4 bg-white shadow-sm ${accent}`}>
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-4">
        <div>
          <h2 className="font-bold text-slate-800">{title}</h2>
          <p className="mt-1 text-xs text-slate-600">{description}</p>
        </div>
        <ActionButton page={page} onNavigate={onNavigate} ariaLabel={actionLabel}>
          Ver todos
        </ActionButton>
      </header>
      <div className="space-y-3 p-4">
        {status === 'loading' ? (
          <p className="rounded-xl bg-slate-100 px-4 py-6 text-center text-sm text-slate-600">
            {loadingMessage}
          </p>
        ) : status === 'error' ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-800">
            {errorMessage}
          </p>
        ) : children || (
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
  onRetry,
  dataStatus = {},
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
      resource: 'classes',
      accent: 'border-t-blue-700',
    },
    {
      label: 'Estudantes Criados',
      count: students.length,
      page: 'adm-students',
      resource: 'students',
      accent: 'border-t-emerald-700',
    },
    {
      label: 'Avisos',
      count: notices.length,
      page: 'adm-class-notices',
      resource: 'notices',
      accent: 'border-t-amber-600',
    },
    {
      label: 'Notícias',
      count: news.length,
      page: 'adm-news',
      resource: 'news',
      accent: 'border-t-violet-700',
    },
    {
      label: 'Produtos Cadastrados',
      count: products.length,
      page: 'adm-products',
      resource: 'products',
      accent: 'border-t-green-700',
    },
  ];

  const resourceLabels = {
    classes: 'turmas',
    students: 'estudantes',
    notices: 'avisos',
    news: 'notícias',
    products: 'produtos',
  };
  const failedResources = Object.entries(dataStatus)
    .filter(([, status]) => status === 'error')
    .map(([resource]) => resourceLabels[resource])
    .filter(Boolean);
  const hasLoadingData = Object.values(dataStatus).some((status) => status === 'loading');

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
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:self-center"
          >
            <LogOut aria-hidden="true" size={17} />
            Sair
          </button>
        </header>

        {failedResources.length > 0 ? (
          <div
            role="alert"
            className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>Não foi possível carregar: {failedResources.join(', ')}.</p>
            <button
              type="button"
              onClick={onRetry}
              className="shrink-0 rounded-lg bg-red-700 px-4 py-2 font-semibold text-white transition hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            >
              Tentar novamente
            </button>
          </div>
        ) : hasLoadingData ? (
          <p
            role="status"
            className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-900"
          >
            Carregando dados do painel...
          </p>
        ) : null}

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
                <ActionButton
                  page={card.page}
                  onNavigate={onNavigate}
                  ariaLabel={`Gerenciar ${card.label.toLowerCase()}`}
                >
                  Gerenciar
                </ActionButton>
              </div>
              <p
                aria-label={
                  dataStatus[card.resource] === 'loading'
                    ? 'Carregando'
                    : dataStatus[card.resource] === 'error' ? 'Falha ao carregar' : undefined
                }
                className="mt-3 text-3xl font-bold tracking-tight text-black"
              >
                {dataStatus[card.resource] === 'loading'
                  ? '...'
                  : dataStatus[card.resource] === 'error' ? '—' : card.count}
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
            <ActionButton
              page="adm-classes"
              onNavigate={onNavigate}
              ariaLabel="Ver todas as turmas"
            >
              Ver todas
            </ActionButton>
          </header>

          {dataStatus.classes === 'loading' ? (
            <p className="px-5 py-8 text-center text-sm text-slate-600">
              Carregando turmas...
            </p>
          ) : dataStatus.classes === 'error' ? (
            <p className="px-5 py-8 text-center text-sm text-red-800">
              Não foi possível carregar as turmas. Use o aviso acima para tentar novamente.
            </p>
          ) : classes.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {getRecentItems(classes).map((danceClass) => (
                <div
                  key={danceClass.id}
                  className="w-full px-5 py-4 transition hover:bg-blue-50"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="break-words font-semibold text-slate-800 [overflow-wrap:anywhere] wrap-anywhere">
                        {danceClass.name}
                      </h3>
                      {formatDate(danceClass.createdAt) && (
                        <>
                          <span aria-hidden="true" className="text-slate-400">
                            &nbsp;·&nbsp;
                          </span>
                          <time
                            dateTime={danceClass.createdAt}
                            className="shrink-0 text-sm text-slate-600"
                          >
                            {formatDate(danceClass.createdAt)}
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
            loadingMessage="Carregando produtos..."
            errorMessage="Não foi possível carregar os produtos. Use o aviso acima para tentar novamente."
            status={dataStatus.products}
            actionLabel="Ver todos os produtos"
          >
            {products.length > 0 && getRecentItems(products).map((product) => {
              const imageUrl = getImageUrl(product.images?.[0]) || product.imageUrl;
              const name = product.name || product.title || 'Produto';
              const productDate = formatDate(product.createdAt);

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
                  <div className="max-w-24 shrink-0 text-right">
                    <span className="block break-words text-xs font-bold text-green-900">
                      {product.price == null
                        ? 'Sob consulta'
                        : Number(product.price).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                    </span>
                    {productDate && (
                      <time
                        dateTime={product.createdAt}
                        className="mt-1 block text-xs text-slate-600"
                      >
                        {productDate}
                      </time>
                    )}
                  </div>
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
            loadingMessage="Carregando notícias..."
            errorMessage="Não foi possível carregar as notícias. Use o aviso acima para tentar novamente."
            status={dataStatus.news}
            actionLabel="Ver todas as notícias"
          >
            {news.length > 0 && getRecentItems(news).map((newsItem) => (
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
                <time
                  dateTime={newsItem.createdAt}
                  className="max-w-20 shrink-0 text-right text-xs font-semibold text-slate-600"
                >
                  {formatDate(newsItem.createdAt) || newsItem.date}
                </time>
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
            loadingMessage="Carregando avisos..."
            errorMessage="Não foi possível carregar os avisos. Use o aviso acima para tentar novamente."
            status={dataStatus.notices}
            actionLabel="Ver todos os avisos"
          >
            {notices.length > 0 && getRecentItems(notices).map((notice) => (
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
                  <time dateTime={notice.createdAt} className="block font-semibold">
                    {formatDate(notice.createdAt) || notice.date}
                  </time>
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
