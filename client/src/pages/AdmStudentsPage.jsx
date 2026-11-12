import { useState } from 'react';

export function AdmStudentsPage({ onBack }) {
  const [alunos, setAlunos] = useState([
    {
      id: 1,
      nome: 'Lucas Ferreira',
      email: 'lucas@email.com',
      telefone: '(11) 99234-5678',
      menor: true,
      responsavel: 'Maria Ferreira (Mãe)',
    },
    {
      id: 2,
      nome: 'Carolina Mendes',
      email: 'carol@email.com',
      telefone: '(21) 97654-3210',
      menor: false,
      responsavel: '',
    },
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    telefone: '',
    menor: false,
    responsavel: '',
  });

  // Atualiza os campos do formulário
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormulario((estadoAnterior) => ({
      ...estadoAnterior,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Cadastra um novo aluno
  const handleSubmit = (event) => {
    event.preventDefault();

    const novoAluno = {
      id: Date.now(),
      ...formulario,
    };

    setAlunos((listaAnterior) => [
      ...listaAnterior,
      novoAluno,
    ]);

    setFormulario({
      nome: '',
      email: '',
      telefone: '',
      menor: false,
      responsavel: '',
    });

    setMostrarFormulario(false);
  };

  // Remove um aluno
  const handleRemove = (id) => {
    setAlunos((listaAnterior) =>
      listaAnterior.filter((aluno) => aluno.id !== id)
    );
  };

  // Cancela o cadastro
  const handleCancel = () => {
    setMostrarFormulario(false);

    setFormulario({
      nome: '',
      email: '',
      telefone: '',
      menor: false,
      responsavel: '',
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

          {!mostrarFormulario ? (
            <>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="rounded-xl bg-[#2450DC] px-7 py-4 font-semibold text-white transition hover:bg-blue-700"
              >
                + Novo Aluno
              </button>

              <button
                onClick={onBack}
                className="rounded-xl border-2 border-[#2450DC] bg-white px-7 py-4 font-semibold text-[#2450DC] transition hover:bg-blue-50"
              >
                Voltar ao painel principal
              </button>
            </>
          ) : (
            <button
              onClick={handleCancel}
              className="rounded-xl bg-[#2450DC] px-7 py-4 font-semibold text-white transition hover:bg-blue-700"
            >
              × Cancelar
            </button>
          )}

        </div>
      </header>

      {/* Formulário de cadastro */}
      {mostrarFormulario && (
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
                  name="nome"
                  value={formulario.nome}
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
                  value={formulario.email}
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
                  name="telefone"
                  value={formulario.telefone}
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
                name="turmaId"
                value={formulario.turmaId}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#DCE4F0] bg-white px-5 py-4 text-[#40516B] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
                <option value="" disabled>
                Selecione uma turma
                </option>

                {turmas.map((turma) => (
                <option key={turma.id} value={turma.id}>
                    {turma.nome}
                </option>
                ))}
            </select>
            </div>

              {/* Menor de idade */}
              <div className="flex items-center gap-3 md:pt-9">
                <input
                  type="checkbox"
                  name="menor"
                  checked={formulario.menor}
                  onChange={handleChange}
                  className="h-5 w-5 accent-blue-600"
                />

                <label className="font-medium text-[#40516B]">
                  É menor de idade (precisa de responsável)
                </label>
              </div>

              {/* Responsável: aparece somente para menores */}
              {formulario.menor && (
                <div className="md:col-span-2">
                  <label className="mb-2 block font-medium text-[#40516B]">
                    Nome do responsável <span className="text-blue-600">*</span>
                  </label>

                  <input
                    type="text"
                    name="responsavel"
                    value={formulario.responsavel}
                    onChange={handleChange}
                    placeholder="Nome completo do responsável"
                    required
                    className="w-full rounded-xl border border-[#DCE4F0] px-5 py-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              )}

            </div>

            {/* Botão salvar */}
            <div className="mt-6 flex justify-center">
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
          {alunos.length} aluno(s) cadastrado(s)
        </div>

        {/* Alunos cadastrados */}
        {alunos.map((aluno) => (
          <div
            key={aluno.id}
            className="flex items-center justify-between gap-4 border-b border-[#E7EDF5] px-7 py-6 last:border-b-0"
          >

            <div className="flex min-w-0 items-center gap-5">

              {/* Avatar */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#DCEAFF] text-xl font-semibold text-[#2450DC]">
                {aluno.nome.charAt(0).toUpperCase()}
              </div>

              {/* Informações */}
              <div className="min-w-0">
                <h3 className="font-semibold text-[#17233D]">
                  {aluno.nome}
                </h3>

                <p className="text-[#9AACC5]">
                  {aluno.email} · {aluno.telefone}
                </p>

                {aluno.menor && (
                  <p className="text-[#3978F6]">
                    Responsável: {aluno.responsavel}
                  </p>
                )}
              </div>

            </div>

            <div className="flex shrink-0 items-center gap-4">

              {aluno.menor && (
                <span className="rounded-full bg-[#FFF1C7] px-4 py-1 font-medium text-[#C65B00]">
                  Menor
                </span>
              )}

              <button
                onClick={() => handleRemove(aluno.id)}
                aria-label={`Remover ${aluno.nome}`}
                className="text-3xl leading-none text-[#9AACC5] transition hover:text-red-500"
              >
                ×
              </button>

            </div>

          </div>
        ))}

        {alunos.length === 0 && (
          <p className="px-7 py-10 text-center text-[#71839F]">
            Nenhum aluno cadastrado.
          </p>
        )}

      </section>

    </main>
  );
}