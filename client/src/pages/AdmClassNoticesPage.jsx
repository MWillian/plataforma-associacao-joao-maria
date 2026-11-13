
import { useState } from 'react';

const getCurrentDate = () => {
  const today = new Date();

  return today.toLocaleDateString('pt-BR');
};

export function AdmClassNoticesPage({
  classes = [],
  notices = [],
  onCreate,
  onRemove,
  onBack,
}) {
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    danceClassId: '',
    subject: '',
    type: 'Informativo',
    message: '',
  });

  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const clearForm = () => {
    setForm({
      danceClassId: '',
      subject: '',
      type: 'Informativo',
      message: '',
    });

    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (classes.length === 0) {
      setError('Cadastre uma turma antes de criar um aviso.');
      return;
    }

    const selectedClass = classes.find(
      (danceClass) => Number(danceClass.id) === Number(form.danceClassId)
    );

    if (!selectedClass) {
      setError('Selecione uma turma válida.');
      return;
    }

    const newNotice = {
      id: Date.now(),
      danceClassId: selectedClass.id,
      subject: form.subject.trim(),
      type: form.type,
      message: form.message.trim(),
      date: getCurrentDate(),
    };

    onCreate(newNotice);

    clearForm();
    setShowForm(false);
  };

  const handleCancel = () => {
    clearForm();
    setShowForm(false);
  };

  const getDanceClass = (danceClassId) => {
    return classes.find(
      (danceClass) => Number(danceClass.id) === Number(danceClassId)
    );
  };

  const getClassName = (danceClassId) => {
    const danceClass = getDanceClass(danceClassId);

    if (!danceClass) {
      return 'Turma não encontrada';
    }

    const days = danceClass.days?.join(', ');

    return days
      ? `${danceClass.name} – ${days}`
      : danceClass.name;
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-6 py-8 md:px-8 lg:px-10">

      <div className="mx-auto max-w-360">

        {/* Cabeçalho */}
        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">

          <div>
            <h1 className="text-2xl font-bold text-[#172957] md:text-3xl">
              notices para Turmas
            </h1>

            <p className="mt-1 text-sm text-[#7183A3] md:text-base">
              Envie comunicados sobre ensaios, aulas e eventos
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            {!showForm ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
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
        {showForm && (
          <section className="mb-6 rounded-xl border border-[#DCE4F0] bg-white p-6 md:p-7">

            <h2 className="mb-6 text-lg font-semibold text-[#23418F]">
              Novo Aviso
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                {/* Turma destinatária */}
                <div>
                  <label
                    htmlFor="danceClassId"
                    className="mb-2 block text-sm font-medium text-[#40516B]"
                  >
                    Turma destinatária
                  </label>

                  <select
                    id="danceClassId"
                    name="danceClassId"
                    value={form.danceClassId}
                    onChange={handleChange}
                    required
                    disabled={classes.length === 0}
                    className="w-full rounded-lg border border-[#DCE4F0] bg-white px-4 py-3 text-sm text-[#172033] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  >
                    <option value="" disabled>
                      Selecione a turma...
                    </option>

                    {classes.map((danceClass) => (
                      <option key={danceClass.id} value={danceClass.id}>
                        {danceClass.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assunto */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-[#40516B]"
                  >
                    Assunto <span className="text-blue-600">*</span>
                  </label>

                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Ex: Ensaio extra, Aula cancelada"
                    required
                    className="w-full rounded-lg border border-[#DCE4F0] px-4 py-3 text-sm outline-none placeholder:text-[#91A2BF] focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Tipo de aviso */}
                <div>
                  <label
                    htmlFor="type"
                    className="mb-2 block text-sm font-medium text-[#40516B]"
                  >
                    Tipo de aviso
                  </label>

                  <select
                    id="type"
                    name="type"
                    value={form.type}
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
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-[#40516B]"
                >
                  Mensagem
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Escreva o conteúdo do aviso para os alunos e responsáveis..."
                  required
                  rows={4}
                  className="w-full resize-y rounded-lg border border-[#DCE4F0] px-4 py-3 text-sm outline-none placeholder:text-[#91A2BF] focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {error && (
                <p className="mt-3 text-sm text-red-600">
                  {error}
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

        {/* Lista de notices */}
        <section className="space-y-3">

          {notices.map((notice) => (
            <article
              key={notice.id}
              className="relative max-w-3xl rounded-xl border border-[#DCE4F0] bg-white p-5 pr-12"
            >

              {/* Tipo, data e turma */}
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">

                <span
                  className={`rounded-md px-2 py-1 font-medium ${
                    notice.type === 'Cancelamento'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {notice.type}
                </span>

                <span className="text-[#91A2BF]">
                  {notice.date}
                </span>

                <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-blue-700">
                  {getClassName(notice.danceClassId)}
                </span>

              </div>

              {/* Assunto */}
              <h3 className="mb-2 font-semibold text-[#172033]">
                {notice.subject}
              </h3>

              {/* Mensagem */}
              <p className="text-sm leading-relaxed text-[#526581]">
                {notice.message}
              </p>

              {/* Remover aviso */}
              <button
                type="button"
                onClick={() => onRemove(notice.id)}
                aria-label={`Remover aviso ${notice.subject}`}
                title="Remover aviso"
                className="absolute right-4 top-5 text-2xl leading-none text-[#B3C1D4] transition hover:text-red-500"
              >
                ×
              </button>

            </article>
          ))}

          {notices.length === 0 && (
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
