
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { FeedbackToast } from '../components/details/FeedbackToast.jsx';
import { getApiErrorMessage } from '../services/apiError.js';
import {
  createStudent,
  removeStudent,
  updateStudent,
} from '../services/students.js';
import { formatDate, matchesDateRange } from '../utils/dateFilters.js';
import { matchesSearch } from '../utils/search.js';

function MedicalField({ name, label, value, onChange, placeholder }) {
  return (
    <div>
      <label
        htmlFor={`${name}-student`}
        className="mb-2 block text-sm font-medium text-[#40516B]"
      >
        {label}
      </label>
      <textarea
        id={`${name}-student`}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-y rounded-xl border border-[#DCE4F0] px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  )
}

export function AdmStudentsPage({ onBack, classes, students, setStudents,}) {

  const [showForm, setShowForm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');
  const [isSaving, setIsSaving] = useState(false);
  const [nameSearch, setNameSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');

  // Cada aviso ganha um id novo: assim a mesma mensagem volta a aparecer
  // quando repetida (o FeedbackToast esconde de vez a mensagem que já expirou).
  const [feedbackId, setFeedbackId] = useState(0);

  const showFeedback = (message, type = 'success') => {
    setFeedbackId((currentId) => currentId + 1);
    setFeedbackType(type);
    setFeedback(message);
  };

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    danceClassIds: [],
    isMinor: false,
    guardian: '',
    guardianEmail: '',
    allergies: '',
    medicalConditions: '',
    medications: '',
    physicalRestrictions: '',
  });

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    danceClassIds: [],
    isMinor: false,
    guardian: '',
    guardianEmail: '',
    allergies: '',
    medicalConditions: '',
    medications: '',
    physicalRestrictions: '',
  });

  // Atualiza os campos do formulário
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previousState) => ({
      ...previousState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleClassToggle = (classId, isEdit = false) => {
    if (isEdit) {
      setEditForm((previousState) => ({
        ...previousState,
        danceClassIds: previousState.danceClassIds.includes(classId)
          ? previousState.danceClassIds.filter((id) => id !== classId)
          : [...previousState.danceClassIds, classId],
      }));
      return;
    }

    setForm((previousState) => ({
      ...previousState,
      danceClassIds: previousState.danceClassIds.includes(classId)
        ? previousState.danceClassIds.filter((id) => id !== classId)
        : [...previousState.danceClassIds, classId],
    }));
  };

  // Cadastra um novo aluno no backend
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSaving) return;
    if (form.danceClassIds.length === 0) {
      showFeedback('Selecione pelo menos uma turma.', 'error');
      return;
    }

    setIsSaving(true);

    try {
      const createdStudent = await createStudent(form);

      setStudents((previousStudents) => [
        ...previousStudents,
        createdStudent,
      ]);

      setForm({
        name: '',
        email: '',
        phone: '',
        danceClassIds: [],
        isMinor: false,
        guardian: '',
        guardianEmail: '',
        allergies: '',
        medicalConditions: '',
        medications: '',
        physicalRestrictions: '',
      });

      setShowForm(false);
      showFeedback('Aluno cadastrado com sucesso.');
    } catch (error) {
      showFeedback(getApiErrorMessage(error), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = (student) => {
    setStudentToDelete(student);
  };

  // Confirma a exclusão do aluno (no backend ele é inativado)
  const confirmRemove = async () => {
    if (!studentToDelete || isSaving) return;

    setIsSaving(true);

    try {
      await removeStudent(studentToDelete.id);

      setStudents((previousStudents) =>
        previousStudents.filter(
          (student) => student.id !== studentToDelete.id
        )
      );

      setStudentToDelete(null);
      showFeedback('Aluno excluído com sucesso.');
    } catch (error) {
      setStudentToDelete(null);
      showFeedback(getApiErrorMessage(error), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Abre o diálogo de edição
  const handleEdit = (student) => {
    setEditingStudent(student);

    setEditForm({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      danceClassIds: student.danceClassIds?.length
        ? [...student.danceClassIds]
        : student.danceClassId
          ? [String(student.danceClassId)]
          : [],
      isMinor: student.isMinor ?? false,
      guardian: student.guardian || '',
      guardianEmail: student.guardianEmail || '',
      allergies: student.allergies || '',
      medicalConditions: student.medicalConditions || '',
      medications: student.medications || '',
      physicalRestrictions: student.physicalRestrictions || '',
    });
  };

  // Atualiza os campos do formulário de edição
  const handleEditChange = (event) => {
    const { name, value, type, checked } = event.target;

    setEditForm((previousState) => ({
      ...previousState,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'isMinor' && !checked
        ? { guardian: '', guardianEmail: '' }
        : {}),
    }));
  }

  // Salva as alterações do aluno no backend
  const handleUpdateStudent = async (event) => {
    event.preventDefault();

    if (!editingStudent || isSaving) return;

    setIsSaving(true);

    try {
      const savedStudent = await updateStudent(editingStudent.id, {
        ...editForm,
        guardian: editForm.isMinor ? editForm.guardian : '',
        guardianEmail: editForm.isMinor ? editForm.guardianEmail : '',
      });

      setStudents((previousStudents) =>
        previousStudents.map((student) =>
          student.id === savedStudent.id ? savedStudent : student
        )
      );

      setEditingStudent(null);
      showFeedback('Dados do aluno atualizados com sucesso.');
    } catch (error) {
      showFeedback(getApiErrorMessage(error), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Cancela o cadastro
  const handleCancel = () => {
    setShowForm(false);

    setForm({
      name: '',
      email: '',
      phone: '',
      danceClassIds: [],
      isMinor: false,
      guardian: '',
      guardianEmail: '',
      allergies: '',
      medicalConditions: '',
      medications: '',
      physicalRestrictions: '',
    });
  };

  const getDanceClassNames = (student) => {
    const ids = student.danceClassIds?.length
      ? student.danceClassIds
      : student.danceClassId
        ? [student.danceClassId]
        : [];

    const names = ids.map((id) =>
      classes.find((danceClass) => String(danceClass.id) === String(id))?.name
    ).filter(Boolean);

    if (names.length) return names.join(', ');
    return ids.length ? 'Turma não encontrada' : 'Sem turma';
  };

  const filteredStudents = students
    .filter((student) => {
      const danceClassIds = student.danceClassIds?.length
        ? student.danceClassIds
        : student.danceClassId
          ? [student.danceClassId]
          : [];
      const matchesClass =
        !classFilter ||
        danceClassIds.some((id) => String(id) === classFilter);

      return (
        matchesSearch(nameSearch, student.name) &&
        matchesClass &&
        matchesDateRange(student.createdAt, createdFrom, createdTo)
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'name-asc') {
        return (a.name || '').localeCompare(b.name || '', 'pt-BR', {
          sensitivity: 'base',
        });
      }

      if (sortOrder === 'name-desc') {
        return (b.name || '').localeCompare(a.name || '', 'pt-BR', {
          sensitivity: 'base',
        });
      }

      const aCreatedAt = Date.parse(a.createdAt) || 0;
      const bCreatedAt = Date.parse(b.createdAt) || 0;
      return sortOrder === 'date-asc'
        ? aCreatedAt - bCreatedAt
        : bCreatedAt - aCreatedAt;
    });

  return (
    <>
      <FeedbackToast key={feedbackId} message={feedback} type={feedbackType} />
      <main className="min-h-screen bg-[#F7F9FC] px-6 py-10 md:px-12">

      {/* Cabeçalho */}
      <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-start">

        <div>
          <h1 className="text-3xl font-bold text-[#192B59]">
            Cadastro de Alunos
          </h1>

          <p className="mt-2 text-lg text-[#71839F]">
            Gerencie os alunos matriculados na instituição
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          {!showForm ? (
            <>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="rounded-xl bg-[#2450DC] px-7 py-4 font-semibold text-white transition hover:bg-blue-700"
              >
                + Novo Aluno
              </button>

              <button
                type="button"
                onClick={onBack}
                className="rounded-xl border-2 border-[#2450DC] bg-white px-7 py-4 font-semibold text-[#2450DC] transition hover:bg-blue-50"
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

      {/* Formulário de cadastro */}
      {showForm && (
        <section className="mb-9 rounded-2xl border border-[#DCE4F0] bg-white p-7 md:p-9">

          <h2 className="mb-8 text-xl font-semibold text-[#23418F]">
            Novo Aluno
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">

              {/* Nome */}
              <div>
                <label className="mb-2 block font-medium text-[#40516B]">
                  Nome completo <span className="text-blue-600">*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nome do aluno"
                  required
                  className="w-full rounded-xl border border-[#DCE4F0] px-5 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* E-mail */}
              <div>
                <label className="mb-2 block font-medium text-[#40516B]">
                  E-mail <span className="text-sm font-normal text-[#71839F]">(opcional)</span>
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="aluno@email.com"
                  className="w-full rounded-xl border border-[#DCE4F0] px-5 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1 text-xs text-[#71839F]">
                  Se não houver e-mail, o aluno não receberá avisos diretamente.
                </p>
              </div>

              {/* Telefone */}
              <div>
                <label className="mb-2 block font-medium text-[#40516B]">
                  Telefone                   <span className="text-sm font-normal text-[#71839F]">(opcional)</span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="w-full rounded-xl border border-[#DCE4F0] px-5 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1 text-xs text-[#71839F]">
                  Sem e-mail cadastrado, o responsável não receberá avisos.
                </p>
              </div>

              {/* Seleção da turma */}
              <div>
                <label className="mb-2 block font-medium text-[#40516B]">
                  Turma <span className="text-blue-600">*</span>
                </label>

                <div className="flex flex-wrap gap-2 rounded-xl border border-[#DCE4F0] p-3">
                  {classes.map((danceClass) => {
                    const selected = form.danceClassIds.includes(String(danceClass.id));

                    return (
                      <button
                        key={danceClass.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => handleClassToggle(String(danceClass.id))}
                        className={`max-w-full rounded-lg border px-3 py-2 text-left text-sm font-medium wrap-anywhere ${
                          selected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-[#DCE4F0] bg-white text-[#526581]'
                        }`}
                      >
                        {danceClass.name}
                      </button>
                    );
                  })}
                </div>
                {form.danceClassIds.length === 0 && (
                  <p className="mt-2 text-sm text-red-600">Selecione pelo menos uma turma.</p>
                )}
              </div>

                {/* Menor de idade */}
                <div className="flex items-center gap-3 md:pt-9">
                  <input
                    type="checkbox"
                    name="isMinor"
                    checked={form.isMinor}
                    onChange={handleChange}
                    className="h-5 w-5 accent-blue-600"
                  />

                  <label className="font-medium text-[#40516B]">
                    É menor de idade (precisa de responsável)
                  </label>
                </div>

                {/* Dados do responsável: aparecem somente para menores */}
                {form.isMinor && (
                  <div className="grid grid-cols-1 gap-6 md:col-span-2 md:grid-cols-2">

                    {/* Nome do responsável */}
                    <div>
                      <label className="mb-2 block font-medium text-[#40516B]">
                        Nome do responsável <span className="text-blue-600">*</span>
                      </label>

                      <input
                        type="text"
                        name="guardian"
                        value={form.guardian}
                        onChange={handleChange}
                        placeholder="Nome completo do responsável"
                        required
                        className="w-full rounded-xl border border-[#DCE4F0] px-5 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* E-mail do responsável */}
                    <div>
                      <label className="mb-2 block font-medium text-[#40516B]">
                        E-mail do responsável <span className="text-sm font-normal text-[#71839F]">(opcional)</span>
                      </label>

                      <input
                        type="email"
                        name="guardianEmail"
                        value={form.guardianEmail}
                        onChange={handleChange}
                        placeholder="responsavel@email.com"
                        className="w-full rounded-xl border border-[#DCE4F0] px-5 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                      <p className="mt-1 text-xs text-[#71839F]">
                        Sem e-mail cadastrado, o responsável não receberá avisos.
                      </p>
                    </div>

                  </div>
                )}

                <div className="md:col-span-2">
                  <h3 className="mb-1 text-lg font-semibold text-[#23418F]">
                    Informações médicas
                  </h3>
                  <p className="mb-4 text-sm text-[#71839F]">
                    Registre informações importantes para a segurança do aluno.
                  </p>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <MedicalField
                      name="allergies"
                      label="Alergias"
                      value={form.allergies}
                      onChange={handleChange}
                      placeholder="Ex.: alergia a medicamentos ou alimentos"
                    />
                    <MedicalField
                      name="medicalConditions"
                      label="Condições médicas"
                      value={form.medicalConditions}
                      onChange={handleChange}
                      placeholder="Ex.: asma, diabetes ou outra condição"
                    />
                    <MedicalField
                      name="medications"
                      label="Medicamentos"
                      value={form.medications}
                      onChange={handleChange}
                      placeholder="Informe medicamentos de uso contínuo"
                    />
                    <MedicalField
                      name="physicalRestrictions"
                      label="Restrições físicas"
                      value={form.physicalRestrictions}
                      onChange={handleChange}
                      placeholder="Ex.: restrições para exercícios"
                    />
                  </div>
                </div>
            </div>

            {/* Botão salvar */}
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
                Salvar aluno
              </button>
            </div>

          </form>
        </section>
      )}

      {/* Lista de alunos */}
      {!showForm && (
        <section className="overflow-hidden rounded-2xl border border-[#DCE4F0] bg-white">

        {/* Contador */}
        <div className="border-b border-[#E7EDF5] px-7 py-6 text-lg text-[#71839F]">
          Exibindo {filteredStudents.length} de {students.length} aluno(s)
        </div>

        <div className="grid grid-cols-1 gap-4 border-b border-[#E7EDF5] bg-slate-50 p-5 sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <label htmlFor="student-name-search" className="mb-1.5 block text-sm font-medium text-[#40516B]">
              Buscar por nome
            </label>
            <input
              id="student-name-search"
              type="search"
              value={nameSearch}
              onChange={(event) => setNameSearch(event.target.value)}
              placeholder="Digite o nome do aluno"
              className="w-full rounded-lg border border-[#DCE4F0] bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="student-class-filter" className="mb-1.5 block text-sm font-medium text-[#40516B]">
              Turma
            </label>
            <select
              id="student-class-filter"
              value={classFilter}
              onChange={(event) => setClassFilter(event.target.value)}
              className="w-full rounded-lg border border-[#DCE4F0] bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Todas as turmas</option>
              {classes.map((danceClass) => (
                <option key={danceClass.id} value={String(danceClass.id)}>
                  {danceClass.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="student-sort-order" className="mb-1.5 block text-sm font-medium text-[#40516B]">
              Ordenar por
            </label>
            <select
              id="student-sort-order"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="w-full rounded-lg border border-[#DCE4F0] bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="name-asc">Nome (A–Z)</option>
              <option value="name-desc">Nome (Z–A)</option>
              <option value="date-desc">Cadastro (mais recentes)</option>
              <option value="date-asc">Cadastro (mais antigos)</option>
            </select>
          </div>

          <div>
            <label htmlFor="student-created-from" className="mb-1.5 block text-sm font-medium text-[#40516B]">
              Cadastro desde
            </label>
            <input
              id="student-created-from"
              type="date"
              value={createdFrom}
              max={createdTo || undefined}
              onChange={(event) => setCreatedFrom(event.target.value)}
              className="w-full rounded-lg border border-[#DCE4F0] bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="student-created-to" className="mb-1.5 block text-sm font-medium text-[#40516B]">
              Cadastro até
            </label>
            <input
              id="student-created-to"
              type="date"
              value={createdTo}
              min={createdFrom || undefined}
              onChange={(event) => setCreatedTo(event.target.value)}
              className="w-full rounded-lg border border-[#DCE4F0] bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Alunos cadastrados */}
        {filteredStudents.length > 0 && (
          <div className="flex flex-col gap-3 p-5">
            {filteredStudents.map((student) => (
              <article
                key={student.id}
                className="group flex w-full flex-col gap-5 rounded-2xl border border-[#DCE4F0] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-xl font-bold text-[#2450DC] shadow-inner">
                    {student.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-[#17233D] wrap-anywhere">
                        {student.name}
                      </h3>
                      {student.isMinor && (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          Menor
                        </span>
                      )}
                    </div>

                    <p className="mt-1 break-words text-sm text-[#71839F]">
                      {student.email || 'Sem e-mail cadastrado'}
                      {student.phone ? ` · ${student.phone}` : ''}
                    </p>

                    <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-[#526581] wrap-anywhere">
                      Turmas: {getDanceClassNames(student)}
                    </p>

                    {student.isMinor && (
                      <p className="mt-2 text-sm text-blue-700 wrap-anywhere">
                        Responsável: {student.guardian}
                      </p>
                    )}

                    {formatDate(student.createdAt) && (
                      <p className="mt-3 text-xs text-[#9AACC5]">
                        Criado em{' '}
                        <time dateTime={student.createdAt} className="font-medium text-[#71839F]">
                          {formatDate(student.createdAt)}
                        </time>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 justify-end gap-2 sm:border-l sm:border-slate-100 sm:pl-5">
                  <button
                    type="button"
                    onClick={() => handleEdit(student)}
                    className="rounded-lg border border-blue-700 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(student)}
                    aria-label={`Remover ${student.name}`}
                    className="rounded-lg border border-red-700 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {filteredStudents.length === 0 && (
          <p className="px-7 py-10 text-center text-[#71839F]">
            {students.length === 0
              ? 'Nenhum aluno cadastrado.'
              : 'Nenhum aluno corresponde aos filtros selecionados.'}
          </p>
        )}

        </section>
      )}

      {/* Diálogo de confirmação de exclusão */}
      {studentToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setStudentToDelete(null);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-student-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >

            <h2
              id="delete-student-title"
              className="text-xl font-bold text-[#172957]"
            >
              Confirmar exclusão
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#71839F]">
              Tem certeza de que deseja excluir o aluno{' '}
              <strong className="text-[#172033]">
                {studentToDelete.name}
              </strong>
              ?
              Essa ação não poderá ser desfeita.
            </p>

            <div className="mt-7 flex justify-end gap-3">

              {/* Cancelar exclusão */}
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
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
                Excluir aluno
              </button>

            </div>
          </section>
        </div>
      )}

      {/* Diálogo de edição do aluno */}
      {editingStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditingStudent(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-student-title"
            className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl md:p-8"
          >

            {/* Cabeçalho */}
            <div className="mb-7 flex items-center justify-between gap-4">

              <div>
                <h2
                  id="edit-student-title"
                  className="text-xl font-bold text-[#172957]"
                >
                  Editar aluno
                </h2>

                <p className="mt-1 text-sm text-[#71839F]">
                  Atualize as informações do aluno cadastrado.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                aria-label="Fechar edição"
                className="text-2xl text-[#91A2BF] transition hover:text-red-600"
              >
                ×
              </button>

            </div>

            {/* Formulário de edição */}
            <form onSubmit={handleUpdateStudent}>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Nome */}
                <div>
                  <label
                    htmlFor="edit-student-name"
                    className="mb-2 block text-sm font-medium text-[#40516B]"
                  >
                    Nome completo *
                  </label>

                  <input
                    id="edit-student-name"
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                    className="w-full rounded-xl border border-[#DCE4F0] px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* E-mail */}
                <div>
                  <label
                    htmlFor="edit-student-email"
                    className="mb-2 block text-sm font-medium text-[#40516B]"
                  >
                    E-mail <span className="font-normal text-[#71839F]">(opcional)</span>
                  </label>

                  <input
                    id="edit-student-email"
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-[#DCE4F0] px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="mt-1 text-xs text-[#71839F]">
                    Sem e-mail cadastrado, o aluno não receberá avisos diretamente.
                  </p>
                </div>

                {/* Telefone */}
                <div>
                  <label
                    htmlFor="edit-student-phone"
                    className="mb-2 block text-sm font-medium text-[#40516B]"
                  >
                    Telefone <span className="text-sm font-normal text-[#71839F]">(opcional)</span>
                  </label>

                  <input
                    id="edit-student-phone"
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    placeholder="(11) 99999-9999"
                    className="w-full rounded-xl border border-[#DCE4F0] px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Turma */}
                <div>
                  <label
                    htmlFor="edit-student-class"
                    className="mb-2 block text-sm font-medium text-[#40516B]"
                  >
                    Turma (opcional)
                  </label>

                  <div className="flex flex-wrap gap-2 rounded-xl border border-[#DCE4F0] p-3">
                    {classes.map((danceClass) => {
                      const selected = editForm.danceClassIds.includes(String(danceClass.id));

                      return (
                        <button
                          key={danceClass.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => handleClassToggle(String(danceClass.id), true)}
                          className={`max-w-full rounded-lg border px-3 py-2 text-left text-sm wrap-anywhere ${
                            selected
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-[#DCE4F0] bg-white text-[#526581]'
                          }`}
                        >
                          {danceClass.name}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-sm text-[#71839F]">
                    Se nenhuma turma estiver selecionada, o aluno continuará cadastrado sem turma.
                  </p>
                </div>

                {/* Menor de idade */}
                <div className="flex items-center gap-3 md:col-span-2">
                  <input
                    id="edit-student-is-minor"
                    type="checkbox"
                    name="isMinor"
                    checked={editForm.isMinor}
                    onChange={handleEditChange}
                    className="h-5 w-5 accent-blue-600"
                  />

                  <label
                    htmlFor="edit-student-is-minor"
                    className="font-medium text-[#40516B]"
                  >
                    É menor de idade (precisa de responsável)
                  </label>
                </div>

                {/* Dados do responsável */}
                {editForm.isMinor && (
                  <>
                    <div>
                      <label
                        htmlFor="edit-student-guardian"
                        className="mb-2 block text-sm font-medium text-[#40516B]"
                      >
                        Nome do responsável *
                      </label>

                      <input
                        id="edit-student-guardian"
                        type="text"
                        name="guardian"
                        value={editForm.guardian}
                        onChange={handleEditChange}
                        required
                        placeholder="Nome completo do responsável"
                        className="w-full rounded-xl border border-[#DCE4F0] px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="edit-student-guardian-email"
                        className="mb-2 block text-sm font-medium text-[#40516B]"
                      >
                        E-mail do responsável <span className="font-normal text-[#71839F]">(opcional)</span>
                      </label>

                      <input
                        id="edit-student-guardian-email"
                        type="email"
                        name="guardianEmail"
                        value={editForm.guardianEmail}
                        onChange={handleEditChange}
                        placeholder="responsavel@email.com"
                        className="w-full rounded-xl border border-[#DCE4F0] px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                      <p className="mt-1 text-xs text-[#71839F]">
                        Sem e-mail cadastrado, o responsável não receberá avisos.
                      </p>
                    </div>
                  </>
                )}

                <div className="md:col-span-2">
                  <h3 className="mb-1 text-lg font-semibold text-[#23418F]">
                    Informações médicas
                  </h3>
                  <p className="mb-4 text-sm text-[#71839F]">
                    Registre informações importantes para a segurança do aluno.
                  </p>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <MedicalField
                      name="allergies"
                      label="Alergias"
                      value={editForm.allergies}
                      onChange={handleEditChange}
                      placeholder="Ex.: alergia a medicamentos ou alimentos"
                    />
                    <MedicalField
                      name="medicalConditions"
                      label="Condições médicas"
                      value={editForm.medicalConditions}
                      onChange={handleEditChange}
                      placeholder="Ex.: asma, diabetes ou outra condição"
                    />
                    <MedicalField
                      name="medications"
                      label="Medicamentos"
                      value={editForm.medications}
                      onChange={handleEditChange}
                      placeholder="Informe medicamentos de uso contínuo"
                    />
                    <MedicalField
                      name="physicalRestrictions"
                      label="Restrições físicas"
                      value={editForm.physicalRestrictions}
                      onChange={handleEditChange}
                      placeholder="Ex.: restrições para exercícios"
                    />
                  </div>
                </div>

              </div>

              {/* Botões de Cancelar e Salvar alterações */}
              <div className="mt-8 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
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
  )
}