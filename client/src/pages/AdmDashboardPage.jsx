function ActionButton({ children, page, className = '', onNavigate }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate?.(page)}
      className={`rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 ${className}`}
    >
      {children}
    </button>
  );
}

const publicationAreaLabels = {
  studio: {
    label: 'Estúdio Adágio',
    className: 'bg-purple-100 text-purple-700',
  },
  crafts: {
    label: 'Artesanato',
    className: 'bg-amber-100 text-amber-700',
  },
  agriculture: {
    label: 'Agricultura Familiar',
    className: 'bg-green-100 text-green-700',
  },
};

export function AdmDashboardPage({
  onNavigate,
  onLogout,
  classes,
  students,
  news = [],
  notices = [],
  products = [],
}) {
  

const classesWithStudents = classes.map((danceClass) => ({
  ...danceClass,
  students: students.filter(
    (student) => Number(student.danceClassId) === Number(danceClass.id)
  ).length,
}));

const totalStudents = students.length;

const classesWithStudentCount = classesWithStudents.filter(
  (danceClass) => danceClass.students > 0
).length;

const getDanceClassName = (classId) => {
  if (Array.isArray(classId)) {
    return classId.map((id) => getDanceClassName(id)).join(', ');
  }

  const danceClass = classes.find(
    (danceClass) => Number(danceClass.id) === Number(classId)
  );

  return danceClass?.name || 'Turma não encontrada';
};

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-6 py-8 md:px-8 lg:px-10">
      <div className="mx-auto max-w-360">

        {/* Cabeçalho */}
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#172957]">
              Painel principal
            </h1>

            <p className="mt-1 text-sm text-[#7183A3]">
              Acompanhe as turmas e as matrículas da instituição.
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-red-700 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
          >
            Sair
          </button>
        </header>

        {/* Indicadores */}
        <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

          <div className="rounded-xl border border-[#DCE4F0] bg-white px-5 py-4">
            <p className="text-sm text-[#7183A3]">
              Turmas cadastradas
            </p>

            <p className="mt-1 text-3xl font-bold text-blue-700">
              {classes.length}
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
              {totalStudents}
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
              {classesWithStudentCount} de {classes.length}
            </p>

            <p className="mt-1 text-xs text-[#7183A3]">
              {classes.length - classesWithStudentCount} turmas sem matrículas
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
              <ActionButton page="adm-students" onNavigate={onNavigate}>
                Ver alunos
              </ActionButton>

              <ActionButton page="adm-classes" onNavigate={onNavigate}>
                Ver turmas
              </ActionButton>
            </div>
          </div>

          <div className="flex justify-between bg-[#F9FAFC] px-6 py-2 text-xs text-[#7183A3]">
            <span>TURMA</span>
            <span>ALUNOS MATRICULADOS</span>
          </div>

          {classesWithStudents.map((danceClass) => (
            <div
              key={danceClass.id}
              className="flex justify-between border-t border-[#E5EAF2] px-6 py-4 text-sm"
            >
              <span className="font-semibold text-[#172957]">
                {danceClass.name}
              </span>

              <span className="font-bold text-[#172957]">
                {danceClass.students}
              </span>
            </div>
          ))}

          <div className="flex justify-between border-t border-[#E5EAF2] px-6 py-4 text-sm font-bold">
            <span className="text-[#172957]">
              Total nas {classes.length} turmas
            </span>

            <span className="text-blue-700">
              {totalStudents} alunos
            </span>
          </div>
        </section>

        <p className="mb-6 text-xs text-[#7183A3]">
          Distribuição atual de alunos entre as turmas cadastradas.
          Total de {totalStudents} alunos conforme o cadastro.
        </p>

        {/* Última notícia */}
        <section className="mb-8">

          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-bold text-[#172957]">
              Últimas Notícias
            </h2>

            <ActionButton page="adm-news" onNavigate={onNavigate}>
              Ver notícias
            </ActionButton>
          </div>

          {news.length > 0 ? (
            <ul className="divide-y divide-[#E7EDF5] rounded-xl border border-[#DCE4F0] bg-white">
              {news.slice(0, 2).map((newsItem) => (
                <li
                  key={newsItem.id}
                  className="p-5"
                >

                  {/* Área e data */}
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">
                    {publicationAreaLabels[newsItem.publicationArea] && (
                      <span
                        className={`rounded-md px-2 py-1 font-medium ${publicationAreaLabels[newsItem.publicationArea].className}`}
                      >
                        {publicationAreaLabels[newsItem.publicationArea].label}
                      </span>
                    )}

                    <span className="text-[#91A2BF]">
                      {newsItem.date}
                    </span>
                  </div>

                  {/* Título */}
                  <h3 className="mb-2 font-semibold text-[#172957]">
                    {newsItem.title}
                  </h3>

                  {/* Descrição */}
                  <p className="text-sm leading-relaxed text-[#7183A3]">
                    {newsItem.description}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-[#DCE4F0] bg-white p-8 text-center">
              <p className="text-sm text-[#7183A3]">
                Nenhuma notícia cadastrada.
              </p>
            </div>
          )}

        </section>

        {/* Avisos */}
        <section className="mb-8">

          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-bold text-[#172957]">
              Últimos Avisos
            </h2>

            <ActionButton page="adm-class-notices" onNavigate={onNavigate}>
              Ver avisos
            </ActionButton>
          </div>

          {notices.length > 0 ? (
            <ul className="divide-y divide-[#E7EDF5] rounded-xl border border-[#DCE4F0] bg-white">
              {notices.slice(0, 2).map((notice) => (
                <li
                  key={notice.id}
                  className="p-5"
                >

                  {/* Tipo, turma e data */}
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">

                    <span
                      className={`rounded-md px-2 py-1 font-medium ${
                        notice.type === 'Cancelamento'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {notice.type}
                    </span>

                    <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-blue-700">
                      {getDanceClassName(
                        notice.classIds || notice.classId || notice.danceClassId
                      )}
                    </span>

                    <span className="text-[#91A2BF]">
                      {notice.date}
                    </span>

                  </div>

                  {/* Assunto */}
                  <h3 className="mb-2 font-semibold text-[#172957]">
                    {notice.subject}
                  </h3>

                  {/* Mensagem */}
                  <p className="text-sm leading-relaxed text-[#7183A3]">
                    {notice.message}
                  </p>

                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-[#DCE4F0] bg-white p-8 text-center">
              <p className="text-sm text-[#7183A3]">
                Nenhum aviso cadastrado.
              </p>
            </div>
          )}

        </section>


        {/* Produtos */}
        <section className="rounded-xl border border-[#DCE4F0] bg-white p-6">

          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="font-bold text-[#172957]">
              Últimos produtos cadastrados
            </h2>

            <ActionButton page="adm-products" onNavigate={onNavigate}>
              Ver produtos
            </ActionButton>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

            {products.slice(-2).reverse().map((product) => (
              <article
                key={product.name}
                className="overflow-hidden rounded-xl border border-[#DCE4F0] bg-white"
              >
                <div className="flex h-24 items-center justify-center bg-[#EDF4FD]">
                  {product.images?.length > 0 ? (
                    <img
                      src={
                        typeof product.images[0] === 'string'
                          ? product.images[0]
                          : product.images[0].url
                      }
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name || product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">
                      Sem imagem
                    </span>
                  )}
                </div>

                <div className="flex min-h-41.25 flex-col justify-between p-4">

                  <div>
                    <h3 className="text-sm font-semibold text-[#172033]">
                      {product.name}
                    </h3>

                    <p className="mt-7 text-xs leading-relaxed text-[#7183A3]">
                      {product.description}
                    </p>
                  </div>

                  <p className="mt-5 font-bold text-blue-700">
                    {product.price == null
                      ? 'Consulte disponibilidade'
                      : Number(product.price).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
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
