export function AdmDashboardPage({ onNavigate, turmas }) {
  

  const produtos = [
    {
      nome: 'Tomate (Kg)',
      descricao: 'Tomates produzidos por associados da agricultura familiar.',
      preco: 'R$ 15,00'
    },
    {
      nome: 'Kit pulseiras de macramê',
      descricao: 'Conjunto de pulseiras artesanais criadas por associados.',
      preco: 'R$ 45,00'
    },
    {
      nome: 'Sousplat de crochê',
      descricao: 'Conjunto de 4 sousplat + 4 porta copos em crochê.',
      preco: 'R$ 130,00'
    },
  ];

  const totalAlunos = turmas.reduce(
    (total, turma) => total + turma.alunos,
    0
  );

  const turmasComAlunos = turmas.filter(
    (turma) => turma.alunos > 0
  ).length;

  const ActionButton = ({ children, page, className = '' }) => (
    <button
      type="button"
      onClick={() => onNavigate?.(page)}
      className={`rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-6 py-8 md:px-8 lg:px-10">
      <div className="mx-auto max-w-360">

        {/* Cabeçalho */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-[#172957]">
            Painel principal
          </h1>

          <p className="mt-1 text-sm text-[#7183A3]">
            Acompanhe as turmas e as matrículas da instituição.
          </p>
        </header>

        {/* Indicadores */}
        <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

          <div className="rounded-xl border border-[#DCE4F0] bg-white px-5 py-4">
            <p className="text-sm text-[#7183A3]">
              Turmas cadastradas
            </p>

            <p className="mt-1 text-3xl font-bold text-blue-700">
              {turmas.length}
            </p>

            <p className="mt-1 text-xs text-[#7183A3]">
              No total da instituição
            </p>
          </div>

          <div className="rounded-xl border border-[#DCE4F0] bg-white px-5 py-4">
            <p className="text-sm text-[#7183A3]">
              Alunos matriculados
            </p>

            <p className="mt-1 text-3xl font-bold text-blue-700">
              {totalAlunos}
            </p>

            <p className="mt-1 text-xs text-[#7183A3]">
              Distribuídos entre as turmas
            </p>
          </div>

          <div className="rounded-xl border border-[#DCE4F0] bg-white px-5 py-4">
            <p className="text-sm text-[#7183A3]">
              Turmas com alunos
            </p>

            <p className="mt-1 text-3xl font-bold text-blue-700">
              {turmasComAlunos} de {turmas.length}
            </p>

            <p className="mt-1 text-xs text-[#7183A3]">
              {turmas.length - turmasComAlunos} turmas sem matrículas
            </p>
          </div>

        </section>

        {/* Alunos por turma */}
        <section className="mb-6 overflow-hidden rounded-xl border border-[#DCE4F0] bg-white">

          <div className="flex flex-col justify-between gap-4 border-b border-[#E5EAF2] px-6 py-4 sm:flex-row sm:items-center">

            <div>
              <h2 className="font-bold text-[#172957]">
                Alunos por turma
              </h2>

              <p className="text-xs text-[#7183A3]">
                Total de alunos matriculados em cada turma.
              </p>
            </div>

            <div className="flex gap-3">
              <ActionButton page="adm-students">
                Ver alunos
              </ActionButton>

              <ActionButton page="adm-classes">
                Ver turmas
              </ActionButton>
            </div>
          </div>

          <div className="flex justify-between bg-[#F9FAFC] px-6 py-2 text-xs text-[#7183A3]">
            <span>TURMA</span>
            <span>ALUNOS MATRICULADOS</span>
          </div>

          {turmas.map((turma) => (
            <div
              key={turma.nome}
              className="flex justify-between border-t border-[#E5EAF2] px-6 py-4 text-sm"
            >
              <span className="font-semibold text-[#172957]">
                {turma.nome}
              </span>

              <span className="font-bold text-[#172957]">
                {turma.alunos}
              </span>
            </div>
          ))}

          <div className="flex justify-between border-t border-[#E5EAF2] px-6 py-4 text-sm font-bold">
            <span className="text-[#172957]">
              Total nas {turmas.length} turmas
            </span>

            <span className="text-blue-700">
              {totalAlunos} alunos
            </span>
          </div>
        </section>

        <p className="mb-6 text-xs text-[#7183A3]">
          Dados demonstrativos de turmas e distribuição. Total de {totalAlunos} alunos conforme o cadastro.
        </p>

        {/* Última notícia */}
        <section className="mb-6 rounded-xl border border-[#DCE4F0] bg-white p-6">

          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-bold text-[#172957]">
              Última notícia
            </h2>

            <ActionButton page="noticias">
              Ver notícias →
            </ActionButton>
          </div>

          <p className="mb-1 text-xs text-[#7183A3]">
            14/09/2026
          </p>

          <h3 className="mb-1 text-lg font-bold text-[#172957]">
            Festival de Dança 2026
          </h3>

          <p className="text-sm leading-relaxed text-[#7183A3]">
            Nossa instituição realizará o Grande Festival de Dança no próximo mês. Inscrições abertas para todas as turmas!
          </p>
        </section>

        {/* Avisos */}
        <section className="mb-6 rounded-xl border border-[#DCE4F0] bg-white p-6">

          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-bold text-[#172957]">
              Avisos
            </h2>

            <ActionButton page="avisos">
              Ver Avisos
            </ActionButton>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-md bg-blue-100 px-2 py-1 font-medium text-blue-700">
              Informativo
            </span>

            <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-blue-700">
              Ballet Infantil - 3ª feira
            </span>

            <span className="text-[#91A2BF]">
              21/09/2026
            </span>
          </div>

          <h3 className="mb-2 font-bold text-[#172957]">
            Ensaio Extra
          </h3>

          <p className="text-sm leading-relaxed text-[#526581]">
            Informamos que haverá ensaio extra na próxima sexta-feira, dia 27/09, das 14h às 16h. Presença obrigatória.
          </p>
        </section>

        {/* Produtos */}
        <section className="rounded-xl border border-[#DCE4F0] bg-white p-6">

          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="font-bold text-[#172957]">
              Produtos
            </h2>

            <ActionButton page="produtos">
              Ver produtos
            </ActionButton>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

            {produtos.map((produto) => (
              <article
                key={produto.nome}
                className="overflow-hidden rounded-xl border border-[#DCE4F0] bg-white"
              >
                <div className="flex h-24 items-center justify-center bg-[#EDF4FD]">
                  <span className="text-5xl" role="img" aria-label={produto.nome}>
                    {produto.emoji}
                  </span>
                </div>

                <div className="flex min-h-41.25 flex-col justify-between p-4">

                  <div>
                    <h3 className="text-sm font-semibold text-[#172033]">
                      {produto.nome}
                    </h3>

                    <p className="mt-7 text-xs leading-relaxed text-[#7183A3]">
                      {produto.descricao}
                    </p>
                  </div>

                  <p className="mt-5 font-bold text-blue-700">
                    {produto.preco}
                  </p>
                </div>
              </article>
            ))}

          </div>
        </section>

      </div>
    </main>
  );
}
