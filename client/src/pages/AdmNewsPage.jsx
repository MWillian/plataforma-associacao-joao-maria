
import { useState } from 'react';

export function AdmNewsPage({
  noticias,
  onCreate,
  onRemove,
  onBack,
}) {
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fotos, setFotos] = useState([]);

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files || []);

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();

      reader.onload = () => {
        setFotos((previousPhotos) => [
          ...previousPhotos,
          reader.result,
        ]);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!titulo.trim()) return;

    const novaNoticia = {
      id: Date.now(),
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      data: new Date().toLocaleDateString('pt-BR'),
      fotos,
    };

    onCreate(novaNoticia);

    setTitulo('');
    setDescricao('');
    setFotos([]);
    setShowForm(false);
  };

  const handleCancel = () => {
    setTitulo('');
    setDescricao('');
    setFotos([]);
    setShowForm(false);
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-6 py-8 md:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Cabeçalho */}
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#172957]">
              Cadastro de Notícias
            </h1>

            <p className="mt-1 text-sm text-[#7183A3]">
              Publique eventos e novidades da instituição
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {!showForm ? (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                + Nova Notícia
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                ✕ Cancelar
              </button>
            )}

            {!showForm && (
              <button
                type="button"
                onClick={onBack}
                className="rounded-lg border border-blue-700 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Voltar ao painel principal
              </button>
            )}
          </div>
        </header>

        {/* Formulário */}
        {showForm && (
          <section className="mb-6 rounded-xl border border-[#DCE4F0] bg-white p-6">
            <h2 className="mb-5 font-semibold text-[#21418E]">
              Nova Notícia / Evento
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="max-w-2xl">

                {/* Título */}
                <div className="mb-4">
                  <label
                    htmlFor="news-title"
                    className="mb-2 block text-sm font-medium text-[#344563]"
                  >
                    Título <span className="text-blue-600">*</span>
                  </label>

                  <input
                    id="news-title"
                    type="text"
                    value={titulo}
                    onChange={(event) => setTitulo(event.target.value)}
                    placeholder="Ex: Festival de Encerramento 2026"
                    required
                    className="w-full rounded-lg border border-[#DCE4F0] px-3.5 py-2.5 text-sm text-[#172033] outline-none transition placeholder:text-[#91A4C2] focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Descrição */}
                <div className="mb-4">
                  <label
                    htmlFor="news-description"
                    className="mb-2 block text-sm font-medium text-[#344563]"
                  >
                    Descrição
                  </label>

                  <textarea
                    id="news-description"
                    value={descricao}
                    onChange={(event) => setDescricao(event.target.value)}
                    placeholder="Descreva o evento ou notícia em detalhes..."
                    rows={5}
                    className="w-full resize-y rounded-lg border border-[#DCE4F0] px-3.5 py-3 text-sm text-[#172033] outline-none transition placeholder:text-[#91A4C2] focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Fotos */}
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-medium text-[#344563]">
                    Fotos
                  </label>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex h-[60px] w-[60px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-300 text-blue-500 transition hover:bg-blue-50">
                      <span className="text-xl">+</span>
                      <span className="text-xs">Foto</span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoChange}
                        className="sr-only"
                      />
                    </label>

                    {fotos.map((foto, index) => (
                      <div
                        key={index}
                        className="relative h-[60px] w-[60px] overflow-hidden rounded-lg border border-[#DCE4F0]"
                      >
                        <img
                          src={foto}
                          alt={`Foto selecionada ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setFotos((previousPhotos) =>
                              previousPhotos.filter(
                                (_, photoIndex) => photoIndex !== index
                              )
                            )
                          }
                          aria-label="Remover foto"
                          className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-bl-md bg-white/90 text-xs text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <p className="mt-2 text-xs text-[#91A4C2]">
                    Você pode selecionar uma ou mais imagens.
                  </p>
                </div>
              </div>

              {/* Publicar */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Publicar notícia
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Listagem */}
        {noticias.length === 0 ? (
          <div className="rounded-xl border border-[#DCE4F0] bg-white px-6 py-12 text-center">
            <p className="font-medium text-[#526581]">
              Nenhuma notícia cadastrada.
            </p>

            <p className="mt-1 text-sm text-[#91A4C2]">
              Clique em "+ Nova Notícia" para publicar a primeira notícia.
            </p>
          </div>
        ) : (
          <section className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
            {noticias.map((noticia) => (
              <article
                key={noticia.id}
                className="rounded-xl border border-[#DCE4F0] bg-white p-5"
              >
                {/* Data e exclusão */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs text-[#91A4C2]">
                    {noticia.data}
                  </span>

                  <button
                    type="button"
                    onClick={() => onRemove(noticia.id)}
                    aria-label={`Excluir notícia ${noticia.titulo}`}
                    className="text-xl leading-none text-[#B7C5D9] transition hover:text-red-500"
                  >
                    ×
                  </button>
                </div>

                {/* Conteúdo */}
                <h3 className="mb-2 font-semibold text-[#172033]">
                  {noticia.titulo}
                </h3>

                <p className="text-sm leading-relaxed text-[#7183A3]">
                  {noticia.descricao}
                </p>

                {/* Fotos */}
                {noticia.fotos?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {noticia.fotos.map((foto, index) => (
                      <div
                        key={index}
                        className="flex h-[54px] w-[54px] items-center justify-center overflow-hidden rounded-lg border border-[#DCE4F0] bg-[#EDF4FD]"
                      >
                        {foto.startsWith('data:image/') ? (
                          <img
                            src={foto}
                            alt={`Imagem da notícia ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl" role="img">
                            {foto}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
