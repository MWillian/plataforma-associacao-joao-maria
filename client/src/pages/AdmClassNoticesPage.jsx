
import { useState } from 'react';
import { FeedbackToast } from '../components/details/FeedbackToast.jsx';
import { getApiErrorMessage } from '../services/apiError.js';

const getCurrentDate = () => {
  const today = new Date();

  return today.toLocaleDateString('pt-BR');
};

export function AdmClassNoticesPage({ classes = [], notices = [], onCreate, onRemove, onBack,}) {
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    danceClassIds: [],
    subject: '',
    type: 'Informativo',
    message: '',
  });

  const [error, setError] = useState('');
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [noticeToSend, setNoticeToSend] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');
  const [isSaving, setIsSaving] = useState(false);

  const showFeedback = (message, type = 'success') => {
    setFeedbackType(type);
    setFeedback(message);
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;

    setForm((prevState) => ({
      ...prevState,
      [name]: name === 'danceClassIds'
        ? checked
          ? [...prevState.danceClassIds, value]
          : prevState.danceClassIds.filter((classId) => classId !== value)
        : value,
    }));
  };

  const clearForm = () => {
    setForm({
      danceClassIds: [],
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

    const selectedClasses = classes.filter((danceClass) =>
      form.danceClassIds.some(
        (classId) => String(classId) === String(danceClass.id)
      )
    );

    if (selectedClasses.length === 0) {
      setError('Selecione pelo menos uma turma válida.');
      return;
    }

    const newNotice = {
      id: Date.now(),
      classIds: selectedClasses.map((danceClass) => danceClass.id),
      subject: form.subject.trim(),
      type: form.type,
      message: form.message.trim(),
      date: getCurrentDate(),
    };

    setNoticeToSend(newNotice);
  };

  const handleCancel = () => {
    clearForm();
    setShowForm(false);
  };

  const getDanceClass = (danceClassId) => {
    return classes.find(
      (danceClass) => String(danceClass.id) === String(danceClassId)
    );
  };

  const getClassName = (danceClassId) => {
    const danceClass = getDanceClass(danceClassId);

    if (!danceClass) {
      return 'Turma inativa';
    }

    const days = danceClass.days?.join(', ');

    return days
      ? `${danceClass.name} – ${days}`
      : danceClass.name;
  };

  const getNoticeClassIds = (notice) => (
    notice.classIds || (notice.classId != null ? [notice.classId] : [])
  );

  // Cria o aviso no backend, que envia o e-mail aos responsáveis
  // (alunos menores) ou aos próprios alunos das turmas escolhidas.
  const confirmSend = async () => {
    if (!noticeToSend || isSaving) return;

    setIsSaving(true);

    try {
      const created = await onCreate(noticeToSend);

      setNoticeToSend(null);
      clearForm();
      setShowForm(false);

      if (created.totalRecipients === 0) {
        showFeedback(
          'Aviso registrado, mas nenhum aluno ou responsável das turmas escolhidas tem e-mail cadastrado.',
          'error'
        );
      } else if (created.sentCount === 0) {
        showFeedback(
          'Aviso registrado, mas nenhum e-mail foi enviado. Verifique a configuração de e-mail do servidor.',
          'error'
        );
      } else {
        const parts = [
          `Aviso enviado para ${created.sentCount} destinatário(s).`,
        ];

        if (created.failedCount > 0) {
          parts.push(`${created.failedCount} envio(s) falharam.`);
        }

        if (created.skippedCount > 0) {
          parts.push(
            `${created.skippedCount} aluno(s) sem e-mail cadastrado.`
          );
        }

        showFeedback(parts.join(' '));
      }
    } catch (error) {
      setNoticeToSend(null);
      showFeedback(getApiErrorMessage(error), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmRemove = async () => {
    if (!noticeToDelete || isSaving) return;

    setIsSaving(true);

    try {
      await onRemove(noticeToDelete.id);

      setNoticeToDelete(null);
      showFeedback('Aviso excluído com sucesso.');
    } catch (error) {
      setNoticeToDelete(null);
      showFeedback(getApiErrorMessage(error), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <FeedbackToast message={feedback} type={feedbackType} />
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
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
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
                <fieldset className="md:col-span-1">
                  <label
                    className="mb-2 block text-sm font-medium text-[#40516B]"
                  >
                    Turmas destinatárias
                  </label>
                  <div
                    className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-[#DCE4F0] bg-white p-3"
                    aria-label="Turmas destinatárias"
                  >
                    {classes.map((danceClass) => (
                      <label key={danceClass.id} className="flex items-center gap-2 text-sm text-[#40516B]">
                        <input
                          type="checkbox"
                          name="danceClassIds"
                          value={danceClass.id}
                          checked={form.danceClassIds.includes(String(danceClass.id))}
                          onChange={handleChange}
                          disabled={classes.length === 0}
                          className="h-4 w-4 accent-blue-600"
                        />
                        <span>{danceClass.name}</span>
                      </label>
                    ))}
                    {classes.length === 0 && (
                      <p className="text-sm text-[#91A2BF]">Nenhuma turma cadastrada.</p>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[#91A2BF]">
                    Selecione uma ou mais turmas.
                  </p>
                </fieldset>

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
                      Informativo
                    </option>

                    <option value="Cancelamento">
                      Cancelamento
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
              <div className="mt-4 flex justify-end">
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
        {!showForm && <section className="space-y-3">

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
                  {getNoticeClassIds(notice)
                    .map((classId) => getClassName(classId))
                    .join(', ')}
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

              <button
                type="button"
                onClick={() => setNoticeToDelete(notice)}
                aria-label={`Excluir aviso ${notice.subject}`}
                className="absolute right-4 top-5 rounded-lg border border-red-700 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
              >
                Excluir
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

        </section>}

      </div>

      {noticeToSend && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setNoticeToSend(null);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="send-notice-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 id="send-notice-title" className="text-xl font-bold text-[#172957]">
              Confirmar envio
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#71839F]">
              Deseja enviar este aviso para {noticeToSend.classIds.length} turma(s)?
            </p>
            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setNoticeToSend(null)}
                className="rounded-lg border border-[#DCE4F0] px-5 py-2.5 text-sm font-semibold text-[#526581] transition hover:bg-[#F7F9FC]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmSend}
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Confirmar envio
              </button>
            </div>
          </section>
        </div>
      )}

      {noticeToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setNoticeToDelete(null);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-notice-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 id="delete-notice-title" className="text-xl font-bold text-[#172957]">
              Confirmar exclusão
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#71839F]">
              Tem certeza de que deseja excluir o aviso{' '}
              <strong className="text-[#172033]">{noticeToDelete.subject}</strong>?
              Essa ação não poderá ser desfeita.
            </p>
            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setNoticeToDelete(null)}
                className="rounded-lg border border-[#DCE4F0] px-5 py-2.5 text-sm font-semibold text-[#526581] transition hover:bg-[#F7F9FC]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmRemove}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Excluir aviso
              </button>
            </div>
          </section>
        </div>
      )}
      </main>
    </>
  );
}
