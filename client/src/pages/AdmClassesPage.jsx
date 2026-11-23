
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { FeedbackToast } from '../components/details/FeedbackToast.jsx';
import { getApiErrorMessage } from '../services/apiError.js';

const daysOfWeek = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

export function AdmClassesPage({
  classes,
  onCreate,
  onUpdate,
  onRemove,
  onBack,
}) {
  const [showForm, setShowForm] = useState(false);
  const [danceClassToDelete, setDanceClassToDelete] = useState(null);
  const [editingDanceClass, setEditingDanceClass] = useState(null);
  const [editDaysErr, setEditDaysErr] = useState('');
  const [daysErr, setDaysErr] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');
  const [isSaving, setIsSaving] = useState(false);

  const showFeedback = (message, type = 'success') => {
    setFeedbackType(type);
    setFeedback(message);
  };

  const [form, setForm] = useState({
    name: '',
    turn: '',
    days: [],
    capacity: '',
  });
  const [editForm, setEditForm] = useState({
    name: '',
    turn: '',
    days: [],
    capacity: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Marca ou desmarca um dia da semana
  const handleDayToggle = (day) => {
    setForm((prevState) => {
      const selectedDay = prevState.days.includes(day);

      const newDays = selectedDay
        ? prevState.days.filter((item) => item !== day)
        : [...prevState.days, day];

      return {
        ...prevState,
        days: newDays,
      };
    });

    setDaysErr('');
  };

  const clearForm = () => {
    setForm({
      name: '',
      turn: '',
      days: [],
      capacity: '',
    });

    setDaysErr('');
  };

  // Cadastra a turma no backend
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSaving) return;

    if (form.days.length === 0) {
      setDaysErr('Selecione pelo menos um dia da semana.');
      return;
    }

    setIsSaving(true);

    try {
      await onCreate({
        name: form.name.trim(),
        turn: form.turn,
        days: form.days,
        capacity: form.capacity === '' ? null : Number(form.capacity),
      });

      clearForm();
      setShowForm(false);
      showFeedback('Turma cadastrada com sucesso.');
    } catch (error) {
      showFeedback(getApiErrorMessage(error), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    clearForm();
    setShowForm(false);
  };

  const handleRemove = (danceClass) => {
    setDanceClassToDelete(danceClass);
  };

  // Confirma a exclusão da turma (no backend ela é inativada, junto com
  // os alunos matriculados nela)
  const confirmRemove = async () => {
    if (!danceClassToDelete || isSaving) return;

    setIsSaving(true);

    try {
      await onRemove(danceClassToDelete.id);

      setDanceClassToDelete(null);
      showFeedback('Turma excluída com sucesso.');
    } catch (error) {
      setDanceClassToDelete(null);
      showFeedback(getApiErrorMessage(error), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Abre o diálogo de edição
  const handleEdit = (danceClass) => {
    setEditingDanceClass(danceClass);

    setEditForm({
      name: danceClass.name || '',
      turn: danceClass.turn || '',
      days: [...(danceClass.days || [])],
      capacity: danceClass.capacity ?? '',
    });

    setEditDaysErr('');
  };

  // Atualiza os campos do formulário de edição
  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previousState) => ({
      ...previousState,
      [name]: value,
    }));
  };

  // Marca ou desmarca os dias da turma durante a edição
  const handleEditDayToggle = (day) => {
    setEditForm((previousState) => {
      const isSelected = previousState.days.includes(day);

      const updatedDays = isSelected
        ? previousState.days.filter((item) => item !== day)
        : [...previousState.days, day];

      return {
        ...previousState,
        days: updatedDays,
      };
    });

    setEditDaysErr('');
  };

  // Fecha o diálogo de edição
  const handleCancelEdit = () => {
    setEditingDanceClass(null);

    setEditForm({
      name: '',
      turn: '',
      days: [],
      capacity: '',
    });

    setEditDaysErr('');
  };

  // Salva as alterações da turma no backend
  const handleUpdateDanceClass = async (event) => {
    event.preventDefault();

    if (isSaving) return;

    if (editForm.days.length === 0) {
      setEditDaysErr('Selecione pelo menos um dia da semana.');
      return;
    }

    if (!editingDanceClass) return;

    setIsSaving(true);

    try {
      await onUpdate({
        ...editingDanceClass,
        name: editForm.name.trim(),
        turn: editForm.turn,
        days: [...editForm.days],
        capacity: editForm.capacity === '' ? null : Number(editForm.capacity),
      });

      showFeedback('Turma atualizada com sucesso.');
      handleCancelEdit();
    } catch (error) {
      showFeedback(getApiErrorMessage(error), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <FeedbackToast message={feedback} type={feedbackType} />
      <main className="min-h-screen bg-[#F7F9FC] px-6 py-10 md:px-12">

      {/* Cabeçalho */}
      <header className="mb-9 flex flex-col justify-between gap-6 md:flex-row md:items-start">

        <div>
          <h1 className="text-3xl font-bold text-[#192B59]">
            Cadastro de Turmas
          </h1>

          <p className="mt-2 text-lg text-[#71839F]">
            Gerencie as turmas e horários da instituição
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          {!showForm ? (
            <>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="rounded-xl bg-[#2450DC] px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                + Nova Turma
              </button>

              <button
                type="button"
                onClick={onBack}
                className="rounded-xl border-2 border-[#2450DC] bg-white px-6 py-3 font-semibold text-[#2450DC] transition hover:bg-blue-50"
              >
                Voltar ao painel principal
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-700 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              <ArrowLeft aria-hidden="true" size={16} />
              Voltar
            </button>
          )}

        </div>
      </header>

      {/* Formulário */}
      {showForm && (
        <section className="mb-9 rounded-2xl border border-[#DCE4F0] bg-white p-7 md:p-9">

          <h2 className="mb-7 text-xl font-semibold text-[#23418F]">
            Nova Turma
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Nome da turma */}
              <div>
                <label className="mb-2 block font-medium text-[#40516B]">
                  Nome da turma <span className="text-blue-600">*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ex: Ballet Infantil A"
                  required
                  className="w-full rounded-xl border border-[#DCE4F0] px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Turno */}
              <div>
                <label className="mb-2 block font-medium text-[#40516B]">
                  Turno <span className="text-blue-600">*</span>
                </label>

                <select
                  name="turn"
                  value={form.turn}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[#DCE4F0] bg-white px-4 py-3 text-[#40516B] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="" disabled>
                    Selecione o turno...
                  </option>

                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="class-capacity"
                  className="mb-2 block font-medium text-[#40516B]"
                >
                  Capacidade
                </label>
                <input
                  id="class-capacity"
                  type="number"
                  name="capacity"
                  min="1"
                  step="1"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="Quantidade máxima de alunos"
                  className="w-full rounded-xl border border-[#DCE4F0] px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>

            {/* Dias da semana */}
            <div className="mt-6">
              <label className="mb-3 block font-medium text-[#40516B]">
                Dias da semana <span className="text-blue-600">*</span>
              </label>

              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => {
                  const selected = form.days.includes(day);

                  return (
                    <button
                      key={day}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => handleDayToggle(day)}
                      className={`rounded-lg border px-4 py-3 font-medium transition ${
                        selected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-[#DCE4F0] bg-white text-[#526581] hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <p className={`mt-2 text-sm ${
                daysErr ? 'text-red-600' : 'text-[#91A2BF]'
              }`}>
                {daysErr || 'Selecione ao menos um dia.'}
              </p>
            </div>

            {/* Salvar */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border border-[#2450DC] bg-white px-6 py-4 font-semibold text-[#2450DC] transition hover:bg-blue-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-[#2450DC] px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >
                Salvar turma
              </button>
            </div>

          </form>
        </section>
      )}

      {/* Lista de turmas */}
      {!showForm && <section className="overflow-hidden rounded-2xl border border-[#DCE4F0] bg-white">

        <div className="border-b border-[#E7EDF5] px-7 py-5 text-lg text-[#71839F]">
          {classes.length} turma(s) cadastrada(s)
        </div>

        {classes.map((danceClass) =>  (
          <div
            key={danceClass.id}
            className="flex items-center justify-between gap-4 border-b border-[#E7EDF5] px-6 py-5 last:border-b-0"
          >

            <div className="flex min-w-0 items-center gap-4">

              {/* Ícone */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#DCEAFF] text-xl">
                🎓
              </div>

              {/* Informações */}
              <div className="min-w-0">
                <h3 className="font-semibold text-[#17233D]">
                  {danceClass.name}
                </h3>

                <div className="mt-1 flex flex-wrap gap-2">
                  {danceClass.days.map((day) => (
                    <span
                      key={day}
                      className="rounded-md bg-[#F0F4F9] px-2 py-1 text-xs text-[#526581]"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex shrink-0 items-center gap-3">

              {/* Turno */}
              <span
                className={`rounded-full px-4 py-1 text-sm font-medium ${
                  danceClass.turn === 'Manhã'
                    ? 'bg-[#FFF1C7] text-[#C65B00]'
                    : danceClass.turn === 'Tarde'
                      ? 'bg-[#DCEAFF] text-[#2450DC]'
                      : 'bg-[#EDE3FF] text-[#7041B5]'
                }`}
              >
                {danceClass.turn}
              </span>

              {/* Editar turma */}
              <button
                type="button"
                onClick={() => handleEdit(danceClass)}
                className="rounded-lg border border-blue-700 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Editar
              </button>

              {/* Excluir turma */}
              <button
                type="button"
                onClick={() => handleRemove(danceClass)}
                aria-label={`Remover turma ${danceClass.name}`}
                className="rounded-lg border border-red-700 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
              >
                Excluir
              </button>

            </div>

          </div>
        ))}

        {classes.length === 0 && (
          <p className="px-7 py-10 text-center text-[#71839F]">
            Nenhuma turma cadastrada.
          </p>
        )}

      </section>}

      {/* Diálogo de confirmação de exclusão */}
      {danceClassToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDanceClassToDelete(null);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dance-class-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >

            <h2
              id="delete-dance-class-title"
              className="text-xl font-bold text-[#172957]"
            >
              Confirmar exclusão
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#71839F]">
              Tem certeza de que deseja excluir a turma{' '}
              <strong className="text-[#172033]">
                {danceClassToDelete.name}
              </strong>
              ?
              Essa ação não poderá ser desfeita.
            </p>

            <div className="mt-7 flex justify-end gap-3">

              {/* Cancelar exclusão */}
              <button
                type="button"
                onClick={() => setDanceClassToDelete(null)}
                className="rounded-lg border border-[#DCE4F0] px-5 py-2.5 text-sm font-semibold text-[#526581] transition hover:bg-[#F7F9FC]"
              >
                Cancelar
              </button>

              {/* Confirmar exclusão */}
              <button
                type="button"
                onClick={confirmRemove}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Excluir turma
              </button>

            </div>
          </section>
        </div>
      )}
      
      {/* Diálogo de edição da turma */}
      {editingDanceClass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCancelEdit();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-dance-class-title"
            className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl md:p-8"
          >

            {/* Cabeçalho */}
            <div className="mb-7 flex items-center justify-between gap-4">

              <div>
                <h2
                  id="edit-dance-class-title"
                  className="text-xl font-bold text-[#172957]"
                >
                  Editar turma
                </h2>

                <p className="mt-1 text-sm text-[#71839F]">
                  Atualize as informações e os horários da turma.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancelEdit}
                aria-label="Fechar edição"
                className="text-2xl text-[#91A2BF] transition hover:text-red-600"
              >
                ×
              </button>

            </div>

            {/* Formulário de edição */}
            <form onSubmit={handleUpdateDanceClass}>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Nome da turma */}
                <div>
                  <label
                    htmlFor="edit-class-name"
                    className="mb-2 block text-sm font-medium text-[#40516B]"
                  >
                    Nome da turma *
                  </label>

                  <input
                    id="edit-class-name"
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    placeholder="Ex: Ballet Infantil A"
                    required
                    className="w-full rounded-xl border border-[#DCE4F0] px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Turno */}
                <div>
                  <label
                    htmlFor="edit-class-turn"
                    className="mb-2 block text-sm font-medium text-[#40516B]"
                  >
                    Turno *
                  </label>

                  <select
                    id="edit-class-turn"
                    name="turn"
                    value={editForm.turn}
                    onChange={handleEditChange}
                    required
                    className="w-full rounded-xl border border-[#DCE4F0] bg-white px-4 py-3 text-[#40516B] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="" disabled>
                      Selecione o turno...
                    </option>

                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="edit-class-capacity"
                    className="mb-2 block text-sm font-medium text-[#40516B]"
                  >
                    Capacidade
                  </label>
                  <input
                    id="edit-class-capacity"
                    type="number"
                    name="capacity"
                    min="1"
                    step="1"
                    value={editForm.capacity}
                    onChange={handleEditChange}
                    placeholder="Quantidade máxima de alunos"
                    className="w-full rounded-xl border border-[#DCE4F0] px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

              </div>

              {/* Dias da semana */}
              <div className="mt-6">

                <label className="mb-3 block text-sm font-medium text-[#40516B]">
                  Dias da semana *
                </label>

                <div className="flex flex-wrap gap-2">

                  {daysOfWeek.map((day) => {
                    const selected = editForm.days.includes(day);

                    return (
                      <button
                        key={day}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => handleEditDayToggle(day)}
                        className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                          selected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-[#DCE4F0] bg-white text-[#526581] hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}

                </div>

                <p
                  className={`mt-2 text-sm ${
                    editDaysErr ? 'text-red-600' : 'text-[#91A2BF]'
                  }`}
                >
                  {editDaysErr || 'Selecione ao menos um dia.'}
                </p>

              </div>

              {/* Botões */}
              <div className="mt-8 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                disabled={isSaving}
                  className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Salvar alterações
                </button>

              </div>

            </form>
          </section>
        </div>
      )}
      </main>
    </>
  );
}
