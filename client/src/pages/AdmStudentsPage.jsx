
import { useState } from 'react';

export function AdmStudentsPage({
  onBack,
  classes,
  students,
  setStudents,
}) {
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    danceClassId: '',
    isMinor: false,
    guardian: '',
  });

  // Atualiza os campos do formulário
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previousState) => ({
      ...previousState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Cadastra um novo aluno
  const handleSubmit = (event) => {
    event.preventDefault();

    const newStudent = {
      id: Date.now(),
      ...form,
    };

    setStudents((previousStudents) => [
      ...previousStudents,
      newStudent,
    ]);

    setForm({
      name: '',
      email: '',
      phone: '',
      danceClassId: '',
      isMinor: false,
      guardian: '',
    });

    setShowForm(false);
  };

  // Remove um aluno
  const handleRemove = (id) => {
    setStudents((previousStudents) =>
      previousStudents.filter((student) => student.id !== id)
    );
  };

  // Cancela o cadastro
  const handleCancel = () => {
    setShowForm(false);

    setForm({
      name: '',
      email: '',
      phone: '',
      danceClassId: '',
      isMinor: false,
      guardian: '',
      guardianEmail: '',
    });
  };

  return (
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
              onClick={handleCancel}
              className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              × Cancelar
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
                  E-mail <span className="text-blue-600">*</span>
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="aluno@email.com"
                  required
                  className="w-full rounded-xl border border-[#DCE4F0] px-5 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="mb-2 block font-medium text-[#40516B]">
                  Telefone <span className="text-blue-600">*</span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  required
                  className="w-full rounded-xl border border-[#DCE4F0] px-5 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Seleção da turma */}
              <div>
                <label className="mb-2 block font-medium text-[#40516B]">
                  Turma <span className="text-blue-600">*</span>
                </label>

                <select
                  name="danceClassId"
                  value={form.danceClassId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[#DCE4F0] bg-white px-5 py-4 text-[#40516B] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="" disabled>
                    Selecione uma turma
                  </option>

                  {classes.map((danceClass) => (
                    <option key={danceClass.id} value={danceClass.id}>
                      {danceClass.name}
                    </option>
                  ))}
                </select>
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
                        E-mail do responsável <span className="text-blue-600">*</span>
                      </label>

                      <input
                        type="email"
                        name="guardianEmail"
                        value={form.guardianEmail}
                        onChange={handleChange}
                        placeholder="responsavel@email.com"
                        required
                        className="w-full rounded-xl border border-[#DCE4F0] px-5 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                  </div>
                )}
            </div>

            {/* Botão salvar */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-[#2450DC] px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >
                Salvar aluno
              </button>
            </div>

          </form>
        </section>
      )}

      {/* Lista de alunos */}
      <section className="overflow-hidden rounded-2xl border border-[#DCE4F0] bg-white">

        {/* Contador */}
        <div className="border-b border-[#E7EDF5] px-7 py-6 text-lg text-[#71839F]">
          {students.length} aluno(s) cadastrado(s)
        </div>

        {/* Alunos cadastrados */}
        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between gap-4 border-b border-[#E7EDF5] px-7 py-6 last:border-b-0"
          >

            <div className="flex min-w-0 items-center gap-5">

              {/* Avatar */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#DCEAFF] text-xl font-semibold text-[#2450DC]">
                {student.name.charAt(0).toUpperCase()}
              </div>

              {/* Informações */}
              <div className="min-w-0">
                <h3 className="font-semibold text-[#17233D]">
                  {student.name}
                </h3>

                <p className="text-[#9AACC5]">
                  {student.email} · {student.phone}
                </p>

                {student.isMinor && (
                  <p className="text-[#3978F6]">
                    Responsável: {student.guardian}
                  </p>
                )}
              </div>

            </div>

            <div className="flex shrink-0 items-center gap-4">

              {student.isMinor && (
                <span className="rounded-full bg-[#FFF1C7] px-4 py-1 font-medium text-[#C65B00]">
                  Menor
                </span>
              )}

              <button
                type="button"
                onClick={() => handleRemove(student.id)}
                aria-label={`Remover ${student.name}`}
                className="text-3xl leading-none text-[#9AACC5] transition hover:text-red-500"
              >
                ×
              </button>

            </div>

          </div>
        ))}

        {students.length === 0 && (
          <p className="px-7 py-10 text-center text-[#71839F]">
            Nenhum aluno cadastrado.
          </p>
        )}

      </section>

    </main>
  );
}