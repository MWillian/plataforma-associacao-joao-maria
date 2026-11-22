
import { useState } from 'react';
import { FeedbackToast } from '../components/details/FeedbackToast.jsx';

export function AdmNewsPage({ news = [], onCreate, onUpdate, onRemove, onBack}) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [publicationArea, setPublicationArea] = useState('');
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    images: [],
    publicationArea: '',
  });

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();

      reader.onload = () => {
        setImages((previousImages) => [
          ...previousImages,
          reader.result,
        ]);
      };

      reader.readAsDataURL(file);
    });

    event.target.value = '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) return;

    const newNews = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      date: new Date().toLocaleDateString('pt-BR'),
      images,
      publicationArea,
    };

    await onCreate?.(newNews);

    setTitle('');
    setDescription('');
    setImages([]);
    setPublicationArea('');
    setShowForm(false);
    setFeedback('Notícia publicada com sucesso.');
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setImages([]);
    setPublicationArea('');
    setShowForm(false);
  };

  const handleRemove = (danceClass) => {
    setNewsToDelete(danceClass);
  };

  // Confirma a exclusão da turma
  const confirmRemove = async () => {
    if (!newsToDelete) return;

    await onRemove?.(newsToDelete.id);

    setNewsToDelete(null);
    setFeedback('Notícia excluída com sucesso.');
  };

  // Abre o diálogo de edição
  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);

    setEditForm({
      title: newsItem.title || '',
      description: newsItem.description || '',
      images: [...(newsItem.images || [])],
      publicationArea: newsItem.publicationArea || '',
    });
  };

  // Atualiza os campos do formulário de edição
  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previousState) => ({
      ...previousState,
      [name]: value,
    }));
  };

  // Adiciona imagens durante a edição
  const handleEditImageChange = (event) => {
    const files = Array.from(event.target.files || []);

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();

      reader.onload = () => {
        setEditForm((previousState) => ({
          ...previousState,
          images: [...previousState.images, reader.result],
        }));
      };

      reader.readAsDataURL(file);
    });

    event.target.value = '';
  };

  // Remove uma imagem durante a edição
  const removeEditImage = (index) => {
    setEditForm((previousState) => ({
      ...previousState,
      images: previousState.images.filter(
        (_, imageIndex) => imageIndex !== index
      ),
    }));
  };

  // Fecha o diálogo de edição
  const handleCancelEdit = () => {
    setEditingNews(null);

    setEditForm({
      title: '',
      description: '',
      images: [],
      publicationArea: '',
    });
  };

  // Salva as alterações da notícia
  const handleUpdateNews = async (event) => {
    event.preventDefault();

    if (!editForm.title.trim() || !editingNews) return;

    const updatedNews = {
      ...editingNews,
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      images: editForm.images,
      publicationArea: editForm.publicationArea,
    };

    await onUpdate?.(updatedNews);
    setFeedback('Notícia atualizada com sucesso.');

    handleCancelEdit();
  };

  return (
    <>
      <FeedbackToast message={feedback} />
      <main className="min-h-screen bg-[#F7F9FC] px-6 py-8 md:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Cabeçalho */}
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#172957]">
              Cadastro de Notícias
            </h1>

            <p className="mt-1 text-sm text-[#7183A3]">
              Publique notícias da instituição
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
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
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
              Nova Notícia
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
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
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
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Descreva a notícia em detalhes..."
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
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>

                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative h-[60px] w-[60px] overflow-hidden rounded-lg border border-[#DCE4F0]"
                      >
                        <img
                          src={image}
                          alt={`Foto selecionada ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setImages((previousImages) =>
                              previousImages.filter(
                                (_, imageIndex) => imageIndex !== index
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

                <div className="mb-5">
                  <label
                    htmlFor="news-publication-area"
                    className="mb-2 block text-sm font-medium text-[#344563]"
                  >
                    Área de exibição <span className="text-blue-600">*</span>
                  </label>

                  <select
                    id="news-publication-area"
                    value={publicationArea}
                    onChange={(event) => setPublicationArea(event.target.value)}
                    required
                    className="w-full rounded-lg border border-[#DCE4F0] bg-white px-3.5 py-2.5 text-sm text-[#172033] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="" disabled>
                      Selecione onde a notícia será exibida
                    </option>
                    <option value="studio">Estúdio Adágio</option>
                    <option value="crafts">Artesanato</option>
                    <option value="agriculture">Agricultura Familiar</option>
                  </select>
                </div>
              </div>

              {/* Publicar */}
              <div className="flex justify-end">
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
        {!showForm && (news.length === 0 ? (
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
            {news.map((newsItem) => (
              <article
                key={newsItem.id}
                className="rounded-xl border border-[#DCE4F0] bg-white p-5"
              >
                {/* Data */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs text-[#91A4C2]">
                    {newsItem.date}
                  </span>

                  {/* Botões de edição e exclusão */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(newsItem)}
                      className="rounded-lg border border-blue-700 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50 justify-end"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemove(newsItem)}
                      aria-label={`Excluir notícia ${newsItem.title}`}
                      className="rounded-lg border border-red-700 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                {/* Conteúdo */}
                <h3 className="mb-2 font-semibold text-[#172033]">
                  {newsItem.title}
                </h3>

                <p className="text-sm leading-relaxed text-[#7183A3]">
                  {newsItem.description}
                </p>

                <p className="mt-3 text-xs font-medium text-blue-700">
                  Exibição: {
                    {
                      studio: 'Estúdio Adágio',
                      crafts: 'Artesanato',
                      agriculture: 'Agricultura Familiar',
                    }[newsItem.publicationArea] || 'Não definida'
                  }
                </p>
              </article>
            ))}
          </section>
        ))}
      </div>

      {/* Diálogo de confirmação de exclusão */}
      {newsToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setNewsToDelete(null);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-news-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >

            <h2
              id="delete-news-title"
              className="text-xl font-bold text-[#172957]"
            >
              Confirmar exclusão
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#71839F]">
              Tem certeza de que deseja excluir a notícia{' '}
              <strong className="text-[#172033]">
                {newsToDelete.title}
              </strong>
              ?
              Essa ação não poderá ser desfeita.
            </p>

            <div className="mt-7 flex justify-end gap-3">

              {/* Cancelar exclusão */}
              <button
                type="button"
                onClick={() => setNewsToDelete(null)}
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
                Excluir notícia
              </button>

            </div>
          </section>
        </div>
      )}

      {/* Diálogo de edição da notícia */}
      {editingNews && (
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
            aria-labelledby="edit-news-title"
            className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl md:p-8"
          >

            {/* Cabeçalho */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2
                  id="edit-news-title"
                  className="text-xl font-bold text-[#172957]"
                >
                  Editar notícia
                </h2>

                <p className="mt-1 text-sm text-[#7183A3]">
                  Atualize as informações da notícia publicada.
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

            {/* Formulário */}
            <form onSubmit={handleUpdateNews}>

              {/* Título */}
              <div className="mb-4">
                <label
                  htmlFor="edit-news-title-input"
                  className="mb-2 block text-sm font-medium text-[#344563]"
                >
                  Título *
                </label>

                <input
                  id="edit-news-title-input"
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  placeholder="Título da notícia"
                  required
                  className="w-full rounded-lg border border-[#DCE4F0] px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Descrição */}
              <div className="mb-5">
                <label
                  htmlFor="edit-news-description"
                  className="mb-2 block text-sm font-medium text-[#344563]"
                >
                  Descrição
                </label>

                <textarea
                  id="edit-news-description"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  placeholder="Descreva a notícia..."
                  rows={5}
                  className="w-full resize-y rounded-lg border border-[#DCE4F0] px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="edit-news-publication-area"
                  className="mb-2 block text-sm font-medium text-[#344563]"
                >
                  Área de exibição *
                </label>

                <select
                  id="edit-news-publication-area"
                  name="publicationArea"
                  value={editForm.publicationArea}
                  onChange={handleEditChange}
                  required
                  className="w-full rounded-lg border border-[#DCE4F0] bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="" disabled>
                    Selecione onde a notícia será exibida
                  </option>
                  <option value="studio">Estúdio Adágio</option>
                  <option value="crafts">Artesanato</option>
                  <option value="agriculture">Agricultura Familiar</option>
                </select>
              </div>

              {/* Imagens */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-[#344563]">
                  Imagens da notícia
                </label>

                <div className="flex flex-wrap gap-3">

                  {editForm.images.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-[#DCE4F0] bg-[#EDF4FD]"
                    >

                      {typeof image === 'string' &&
                      image.startsWith('data:image/') ? (
                        <img
                          src={image}
                          alt={`Imagem da notícia ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl" role="img">
                          {image}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => removeEditImage(index)}
                        aria-label="Remover imagem"
                        className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-bl-md bg-white/90 text-xs text-red-600"
                      >
                        ×
                      </button>

                    </div>
                  ))}

                  {/* Adicionar imagens */}
                  <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-300 text-blue-500 transition hover:bg-blue-50">
                    <span className="text-xl">+</span>
                    <span className="text-xs">Foto</span>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleEditImageChange}
                      className="sr-only"
                    />
                  </label>

                </div>

                <p className="mt-2 text-xs text-[#91A2BF]">
                  Você pode remover imagens existentes ou adicionar novas.
                </p>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
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
