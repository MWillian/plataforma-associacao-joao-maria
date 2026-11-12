
import { useState } from 'react';

const obterDataAtual = () => {
  const hoje = new Date();

  return hoje.toLocaleDateString('pt-BR');
};

export function AdmClassNoticesPage({
  turmas = [],
  avisos = [],
  onCreate,
  onRemove,
  onBack,
}) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [formulario, setFormulario] = useState({
    turmaId: '',
    assunto: '',
    tipo: 'Informativo',
    mensagem: '',
  });

  const [erro, setErro] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario((estadoAnterior) => ({
      ...estadoAnterior,
      [name]: value,
    }));
  };

  const limparFormulario = () => {
    setFormulario({
      turmaId: '',
      assunto: '',
      tipo: 'Informativo',
      mensagem: '',
    });

    setErro('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (turmas.length === 0) {
      setErro('Cadastre uma turma antes de criar um aviso.');
      return;
    }

    const turmaSelecionada = turmas.find(
      (turma) => Number(turma.id) === Number(formulario.turmaId)
    );

    if (!turmaSelecionada) {
      setErro('Selecione uma turma válida.');
      return;
    }

    const novoAviso = {
      id: Date.now(),
      turmaId: turmaSelecionada.id,
      assunto: formulario.assunto.trim(),
      tipo: formulario.tipo,
      mensagem: formulario.mensagem.trim(),
      data: obterDataAtual(),
    };

    onCreate(novoAviso);

    limparFormulario();
    setMostrarFormulario(false);
  };

  const handleCancel = () => {
    limparFormulario();
    setMostrarFormulario(false);
  };

  const obterTurma = (turmaId) => {
    return turmas.find(
      (turma) => Number(turma.id) === Number(turmaId)
    );
  };

  const obterNomeTurma = (turmaId) => {
    const turma = obterTurma(turmaId);

    if (!turma) {
      return 'Turma não encontrada';
    }

    const dias = turma.dias?.join(', ');

    return dias
      ? `${turma.nome} – ${dias}`
      : turma.nome;
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-6 py-8 md:px-8 lg:px-10">

      <div className="mx-auto max-w-360">

        {/* Cabeçalho */}
        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">

          <div>
            <h1 className="text-2xl font-bold text-[#172957] md:text-3xl">
              Avisos para Turmas
            </h1>

            <p className="mt-1 text-sm text-[#7183A3] md:text-base">
              Envie comunicados sobre ensaios, aulas e eventos
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            {!mostrarFormulario ? (
              <>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(true)}
                  className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  + Novo Aviso
                </button>

                <button
                  type="button"
                  onClick={onBack}
                  className="rounded-lg border border-blue-700 bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  Voltar ao painel principal
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                × Cancelar
              </button>
            )}

          </div>
        </header>

        {/* Formulário de novo aviso */}
        {mostrarFormulario && (
          <section className="mb-6 rounded-xl border border-[#DCE4F0] bg-white p-6 md:p-7">

            <h2 className="mb-6 text-lg font-semibold text-[#23418F]">
              Novo Aviso
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                {/* Turma destinatária */}
                <div>
                  <label
                    htmlFor="turmaId"
                    className="mb-2 block text-sm font-medium text-[#40516B]"
                  >
                    Turma destinatária
                  </label>

                  <select
                    id="turmaId"
                    name="turmaId"
                    value={formulario.turmaId}
                    onChange={handleChange}
                    required
                    disabled={turmas.length === 0}
                    className="w-full rounded-lg border border-[#DCE4F0] bg-white px-4 py-3 text-sm text-[#172033] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  >
                    <option value="" disabled>
                      Selecione a turma...
                    </option>

                    {turmas.map((turma) => (
                      <option key={turma.id} value={turma.id}>
                        {turma.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assunto */}
                <div>
                  <label
                    htmlFor="assunto"
                    className="mb-2 block text-sm font-medium text-[#40516B]"
                  >
                    Assunto <span className="text-blue-600">*</span>
                  </label>

                  <input
                    id="assunto"
                    type="text"
                    name="assunto"
                    value={formulario.assunto}
                    onChange={handleChange}
                    placeholder="Ex: Ensaio extra, Aula cancelada"
                    required
                    className="w-full rounded-lg border border-[#DCE4F0] px-4 py-3 text-sm outline-none placeholder:text-[#91A2BF] focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Tipo de aviso */}
                <div>
                  <label
                    htmlFor="tipo"
                    className="mb-2 block text-sm font-medium text-[#40516B]"
                  >
                    Tipo de aviso
                  </label>

                  <select
                    id="tipo"
                    name="tipo"
                    value={formulario.tipo}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[#DCE4F0] bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Informativo">
                      🔵 Informativo
                    </option>

                    <option value="Cancelamento">
                      🔴 Cancelamento
                    </option>
                  </select>
                </div>

              </div>

              {/* Mensagem */}
              <div className="mt-5 max-w-2xl">
                <label
                  htmlFor="mensagem"
                  className="mb-2 block text-sm font-medium text-[#40516B]"
                >
                  Mensagem
                </label>

                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={formulario.mensagem}
                  onChange={handleChange}
                  placeholder="Escreva o conteúdo do aviso para os alunos e responsáveis..."
                  required
                  rows={4}
                  className="w-full resize-y rounded-lg border border-[#DCE4F0] px-4 py-3 text-sm outline-none placeholder:text-[#91A2BF] focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {erro && (
                <p className="mt-3 text-sm text-red-600">
                  {erro}
                </p>
              )}

              {/* Botão de envio */}
              <div className="mt-4 flex justify-center md:justify-end md:pr-[28%]">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Enviar aviso
                </button>
              </div>

            </form>
          </section>
        )}

        {/* Lista de avisos */}
        <section className="space-y-3">

          {avisos.map((aviso) => (
            <article
              key={aviso.id}
              className="relative max-w-3xl rounded-xl border border-[#DCE4F0] bg-white p-5 pr-12"
            >

              {/* Tipo, data e turma */}
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">

                <span
                  className={`rounded-md px-2 py-1 font-medium ${
                    aviso.tipo === 'Cancelamento'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {aviso.tipo}
                </span>

                <span className="text-[#91A2BF]">
                  {aviso.data}
                </span>

                <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-blue-700">
                  {obterNomeTurma(aviso.turmaId)}
                </span>

              </div>

              {/* Assunto */}
              <h3 className="mb-2 font-semibold text-[#172033]">
                {aviso.assunto}
              </h3>

              {/* Mensagem */}
              <p className="text-sm leading-relaxed text-[#526581]">
                {aviso.mensagem}
              </p>

              {/* Remover aviso */}
              <button
                type="button"
                onClick={() => onRemove(aviso.id)}
                aria-label={`Remover aviso ${aviso.assunto}`}
                title="Remover aviso"
                className="absolute right-4 top-5 text-2xl leading-none text-[#B3C1D4] transition hover:text-red-500"
              >
                ×
              </button>

            </article>
          ))}

          {avisos.length === 0 && (
            <div className="rounded-xl border border-[#DCE4F0] bg-white px-6 py-12 text-center">
              <p className="font-medium text-[#526581]">
                Nenhum aviso cadastrado.
              </p>

              <p className="mt-1 text-sm text-[#91A2BF]">
                Clique em "+ Novo Aviso" para criar o primeiro comunicado.
              </p>
            </div>
          )}

        </section>

      </div>
    </main>
  );
}
