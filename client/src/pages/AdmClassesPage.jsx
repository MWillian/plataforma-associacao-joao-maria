
import { useState } from 'react';

const diasSemana = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

export function AdmClassesPage({
  turmas,
  onCreate,
  onRemove,
  onBack,
}) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [formulario, setFormulario] = useState({
    nome: '',
    turno: '',
    dias: [],
  });

  const [erroDias, setErroDias] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario((estadoAnterior) => ({
      ...estadoAnterior,
      [name]: value,
    }));
  };

  // Marca ou desmarca um dia da semana
  const handleDayToggle = (dia) => {
    setFormulario((estadoAnterior) => {
      const diaJaSelecionado = estadoAnterior.dias.includes(dia);

      const novosDias = diaJaSelecionado
        ? estadoAnterior.dias.filter((item) => item !== dia)
        : [...estadoAnterior.dias, dia];

      return {
        ...estadoAnterior,
        dias: novosDias,
      };
    });

    setErroDias('');
  };

  const limparFormulario = () => {
    setFormulario({
      nome: '',
      turno: '',
      dias: [],
    });

    setErroDias('');
  };

  // Cadastra a turma
  const handleSubmit = (event) => {
    event.preventDefault();

    if (formulario.dias.length === 0) {
      setErroDias('Selecione pelo menos um dia da semana.');
      return;
    }

    const novaTurma = {
      id: Date.now(),
      nome: formulario.nome.trim(),
      turno: formulario.turno,
      dias: formulario.dias,
    };

    onCreate(novaTurma);

    limparFormulario();
    setMostrarFormulario(false);
  };

  const handleCancel = () => {
    limparFormulario();
    setMostrarFormulario(false);
  };

  return (
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

          {!mostrarFormulario ? (
            <>
              <button
                type="button"
                onClick={() => setMostrarFormulario(true)}
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
              onClick={handleCancel}
              className="rounded-xl bg-[#2450DC] px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              × Cancelar
            </button>
          )}

        </div>
      </header>

      {/* Formulário */}
      {mostrarFormulario && (
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
                  name="nome"
                  value={formulario.nome}
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
                  name="turno"
                  value={formulario.turno}
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

            </div>

            {/* Dias da semana */}
            <div className="mt-6">
              <label className="mb-3 block font-medium text-[#40516B]">
                Dias da semana <span className="text-blue-600">*</span>
              </label>

              <div className="flex flex-wrap gap-2">
                {diasSemana.map((dia) => {
                  const selecionado = formulario.dias.includes(dia);

                  return (
                    <button
                      key={dia}
                      type="button"
                      aria-pressed={selecionado}
                      onClick={() => handleDayToggle(dia)}
                      className={`rounded-lg border px-4 py-3 font-medium transition ${
                        selecionado
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-[#DCE4F0] bg-white text-[#526581] hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      {dia}
                    </button>
                  );
                })}
              </div>

              <p className={`mt-2 text-sm ${
                erroDias ? 'text-red-600' : 'text-[#91A2BF]'
              }`}>
                {erroDias || 'Selecione ao menos um dia.'}
              </p>
            </div>

            {/* Salvar */}
            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                className="rounded-xl bg-[#2450DC] px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
              >
                Salvar turma
              </button>
            </div>

          </form>
        </section>
      )}

      {/* Lista de turmas */}
      <section className="overflow-hidden rounded-2xl border border-[#DCE4F0] bg-white">

        <div className="border-b border-[#E7EDF5] px-7 py-5 text-lg text-[#71839F]">
          {turmas.length} turma(s) cadastrada(s)
        </div>

        {turmas.map((turma) => (
          <div
            key={turma.id}
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
                  {turma.nome}
                </h3>

                <div className="mt-1 flex flex-wrap gap-2">
                  {turma.dias.map((dia) => (
                    <span
                      key={dia}
                      className="rounded-md bg-[#F0F4F9] px-2 py-1 text-xs text-[#526581]"
                    >
                      {dia}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex shrink-0 items-center gap-3">

              <span
                className={`rounded-full px-4 py-1 text-sm font-medium ${
                  turma.turno === 'Manhã'
                    ? 'bg-[#FFF1C7] text-[#C65B00]'
                    : turma.turno === 'Tarde'
                      ? 'bg-[#DCEAFF] text-[#2450DC]'
                      : 'bg-[#EDE3FF] text-[#7041B5]'
                }`}
              >
                {turma.turno}
              </span>

              <button
                type="button"
                onClick={() => onRemove(turma.id)}
                aria-label={`Remover turma ${turma.nome}`}
                className="text-3xl leading-none text-[#9AACC5] transition hover:text-red-500"
              >
                ×
              </button>

            </div>

          </div>
        ))}

        {turmas.length === 0 && (
          <p className="px-7 py-10 text-center text-[#71839F]">
            Nenhuma turma cadastrada.
          </p>
        )}

      </section>

    </main>
  );
}
