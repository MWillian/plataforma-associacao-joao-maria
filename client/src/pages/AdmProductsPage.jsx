
import { useEffect, useMemo, useState } from 'react';
import { FeedbackToast } from '../components/details/FeedbackToast.jsx';
import { getApiErrorMessage } from '../services/apiError.js';
import { useUrlQueryState } from '../hooks/useUrlQueryState.js';
import { getApiErrorMessage } from '../services/apiError.js';

// Categorias que o backend e o site público suportam.
const availableCategories = [
  'Artesanato',
  'Agricultura Familiar',
];

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  images: [],
  available: true,
};

function formatPrice(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function getProductImages(product) {
  if (product.images?.length) {
    return product.images;
  }

  if (product.imageUrl) {
    return [{ url: product.imageUrl }];
  }

  // Compatibilidade com produtos antigos que utilizavam a propriedade "photos".
  return (product.photos || []).map((photo) => ({
    url: photo,
    type: 'emoji',
  }));
}

function getProductName(product) {
  return product.name || product.title || 'Produto sem nome';
}

function isProductAvailable(product) {
  return product.available ?? product.active ?? product.avaliable ?? true;
}

function revokeObjectUrl(image) {
  const url = typeof image === 'string' ? image : image?.url;

  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

function ProductImage({ image }) {
  const url = typeof image === 'string' ? image : image?.url;

  const isImageFile =
    url?.startsWith('blob:') ||
    url?.startsWith('data:') ||
    url?.startsWith('http');

  if (isImageFile) {
    return (
      <img
        src={url}
        alt="Imagem do produto"
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <span className="text-xs text-slate-400">
      Sem imagem
    </span>
  );
}

export function AdmProductsPage({
  products = [],
  onCreate,
  onUpdate,
  onRemove,
  onBack,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productsToDelete, setProductsToDelete] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');
  const [isSaving, setIsSaving] = useState(false);

  const showFeedback = (message, type = 'success') => {
    setFeedbackType(type);
    setFeedback(message);
  };

  const [categoryFilter, setCategoryFilter] = useUrlQueryState(
    'adminProductCategory',
    'Todas'
  );
  const [minPrice, setMinPrice] = useUrlQueryState('adminProductMinPrice', '');
  const [maxPrice, setMaxPrice] = useUrlQueryState('adminProductMaxPrice', '');
  const [sortOrder, setSortOrder] = useUrlQueryState('adminProductSort', 'name');

  useEffect(() => {
    if (!editingProduct && !productsToDelete) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setEditingProduct(null);
        setProductsToDelete(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editingProduct, productsToDelete]);

  const registeredCategories = useMemo(() => {
    return [
      ...new Set(
        products.map((product) => product.category || 'Outros')
      ),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const price = Number(product.price);
      const category = product.category || 'Outros';

      const matchesCategory =
        categoryFilter === 'Todas' || category === categoryFilter;

      const matchesMinPrice =
        minPrice === '' || price >= Number(minPrice);

      const matchesMaxPrice =
        maxPrice === '' || price <= Number(maxPrice);

      return matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    return result.sort((a, b) => {
      if (sortOrder === 'price-asc') {
        return Number(a.price) - Number(b.price);
      }

      if (sortOrder === 'price-desc') {
        return Number(b.price) - Number(a.price);
      }

      if (sortOrder === 'category') {
        return (a.category || 'Outros').localeCompare(
          b.category || 'Outros',
          'pt-BR'
        );
      }

      return getProductName(a).localeCompare(getProductName(b), 'pt-BR');
    });
  }, [products, categoryFilter, minPrice, maxPrice, sortOrder]);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const addImages = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const availableSlots = 3 - form.images.length;

    if (availableSlots <= 0) {
      setFormError('Este produto já possui o limite de 3 imagens.');
      event.target.value = '';
      return;
    }

    const validFiles = selectedFiles
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, availableSlots);

    if (validFiles.length === 0) {
      setFormError('Selecione pelo menos uma imagem válida.');
      event.target.value = '';
      return;
    }

    const newImages = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setForm((previous) => ({
      ...previous,
      images: [...previous.images, ...newImages],
    }));

    event.target.value = '';
  };

  const removeImage = (index) => {
    revokeObjectUrl(form.images[index]);

    setForm((previous) => ({
      ...previous,
      images: previous.images.filter((_, i) => i !== index),
    }));
  };

  const clearForm = (revokeImages = true) => {
    if (revokeImages) {
      form.images.forEach(revokeObjectUrl);
    }

    setForm(initialForm);
    setEditingProduct(null);
    setShowForm(false);
    setFormError('');
  };

  const saveProduct = async (event) => {
    event.preventDefault();

    if (isSaving) return;

    if (
      !form.name.trim() ||
      !form.category ||
      form.price === '' ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      setFormError('Preencha nome, categoria e um preço válido.');
      return;
    }

    setFormError('');
    setIsSaving(true);

    const productData = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
    };

    try {
      if (editingProduct) {
<<<<<<< HEAD
        await onUpdate?.({
          ...productData,
          id: editingProduct.id,
        });
        setFeedback('Produto atualizado com sucesso.');
      } else {
        await onCreate?.({
          ...productData,
        });
        setFeedback('Produto cadastrado com sucesso.');
      }

      clearForm(false);
    } catch (error) {
      setFormError(getApiErrorMessage(error));
      setFeedback('');
=======
        await onUpdate({ ...productData, id: editingProduct.id });
        showFeedback('Produto atualizado com sucesso.');
      } else {
        await onCreate(productData);
        showFeedback('Produto cadastrado com sucesso.');
      }

      clearForm();
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
>>>>>>> origin/main
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);

    setForm({
      name: getProductName(product) === 'Produto sem nome'
        ? ''
        : getProductName(product),
      description: product.description || '',
      price: String(product.price ?? ''),
      category: product.category || 'Outros',
      images: getProductImages(product),
      available: isProductAvailable(product),
    });
  };

  const handleRemove = (product) => {
    setProductsToDelete(product);
  };

<<<<<<< HEAD
  // Confirma a exclusão da turma
  const confirmRemove = async () => {
    if (!productsToDelete) return;

    try {
      await onRemove?.(productsToDelete.id);
      setProductsToDelete(null);
      setFeedback('Produto excluído com sucesso.');
    } catch (error) {
      setProductsToDelete(null);
      setFeedback(getApiErrorMessage(error));
=======
  // Confirma a exclusão do produto (remove de vez no backend)
  const confirmRemove = async () => {
    if (!productsToDelete || isSaving) return;

    setIsSaving(true);

    try {
      await onRemove(productsToDelete.id);

      setProductsToDelete(null);
      showFeedback('Produto excluído com sucesso.');
    } catch (error) {
      setProductsToDelete(null);
      showFeedback(getApiErrorMessage(error), 'error');
    } finally {
      setIsSaving(false);
>>>>>>> origin/main
    }
  };

  return (
    <>
      <FeedbackToast message={feedback} type={feedbackType} />
      <main className="min-h-screen bg-[#F7F9FC] px-6 py-8 md:px-8 lg:px-10">
      <div className="mx-auto max-w-360">

        {/* Cabeçalho */}
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#172957]">
              Cadastro de Produtos
            </h1>

            <p className="mt-1 text-sm text-[#7183A3]">
              Gerencie o catálogo de produtos disponíveis
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {!showForm ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setForm(initialForm);
                    setEditingProduct(null);
                    setShowForm(true);
                  }}
                  className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  + Novo Produto
                </button>

                <button
                  type="button"
                  onClick={onBack}
                  className="rounded-lg border border-blue-700 bg-white px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  Voltar ao painel principal
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={clearForm}
                className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                ✕ Cancelar
              </button>
            )}
          </div>
        </header>

        {/* Formulário de cadastro */}
        {showForm && (
          <section className="mb-8 rounded-xl border border-[#DCE4F0] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-bold text-[#172957]">
                Novo Produto
              </h2>

              {formError && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {formError}
                </p>
              )}
            </div>

            <form onSubmit={saveProduct}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#344563]">
                    Nome do produto *
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateField('name', event.target.value)
                    }
                    placeholder="Ex: Camiseta Oficial"
                    required
                    className="w-full rounded-lg border border-[#DCE4F0] px-3 py-3 text-sm outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#344563]">
                    Preço (R$) *
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      updateField('price', event.target.value)
                    }
                    placeholder="0,00"
                    required
                    className="w-full rounded-lg border border-[#DCE4F0] px-3 py-3 text-sm outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#344563]">
                    Categoria *
                  </label>

                  <select
                    value={form.category}
                    onChange={(event) =>
                      updateField('category', event.target.value)
                    }
                    required
                    className="w-full rounded-lg border border-[#DCE4F0] bg-white px-3 py-3 text-sm outline-none focus:border-blue-600"
                  >
                    <option value="">
                      Selecione uma categoria...
                    </option>

                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-[#344563]">
                  Descrição
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField('description', event.target.value)
                  }
                  placeholder="Descreva o produto, materiais, tamanhos disponíveis..."
                  rows={4}
                  className="w-full resize-none rounded-lg border border-[#DCE4F0] px-3 py-3 text-sm outline-none focus:border-blue-600"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-[#344563]">
                  Fotos do produto (opcional, máximo de 3)
                </label>

                <div className="flex flex-wrap gap-3">
                  {form.images.map((image, index) => (
                    <div
                      key={`${image.url}-${index}`}
                      className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-[#DCE4F0] bg-[#EDF4FD]"
                    >
                      <ProductImage image={image} />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label="Remover imagem"
                        className="absolute right-1 top-1 rounded-full bg-white px-1.5 text-xs text-red-600 shadow"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {form.images.length < 3 && (
                    <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-300 text-sm text-blue-600 hover:bg-blue-50">
                      <span className="text-xl">+</span>
                      <span>Foto</span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={addImages}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <p className="mt-2 text-xs text-[#91A2BF]">
                  {form.images.length} de 3 imagens selecionadas.
                </p>
              </div>

              <div className="mt-8 flex md:justify-end md:pr-[0%]">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Salvar produto
                </button>
              </div>
            </form>
          </section>
        )}

        {!showForm && (
        <>
        {/* Filtros e ordenação */}
        <section className="mb-6 rounded-xl border border-[#DCE4F0] bg-white p-5">
          <h2 className="mb-4 font-bold text-[#172957]">
            Filtrar e ordenar produtos
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#344563]">
                Categoria
              </label>

              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
                className="w-full rounded-lg border border-[#DCE4F0] bg-white px-3 py-2.5 text-sm"
              >
                <option value="Todas">Todas as categorias</option>

                {registeredCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344563]">
                Preço mínimo (R$)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                placeholder="0,00"
                className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344563]">
                Preço máximo (R$)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="Sem limite"
                className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344563]">
                Ordenar por
              </label>

              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="w-full rounded-lg border border-[#DCE4F0] bg-white px-3 py-2.5 text-sm"
              >
                <option value="name">Ordem alfabética</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="category">Categoria</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-[#7183A3]">
              {filteredProducts.length} produto(s) encontrado(s)
            </p>

            <button
              type="button"
              onClick={() => {
                setCategoryFilter('Todas');
                setMinPrice('');
                setMaxPrice('');
                setSortOrder('name');
              }}
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        </section>

        {/* Listagem de produtos */}
        {filteredProducts.length > 0 ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => {
              const images = getProductImages(product);

              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-xl border border-[#DCE4F0] bg-white"
                >
                  <div className="relative flex h-36 items-center justify-center gap-2 bg-[#EDF4FD] p-3">
                    {images.length > 0 ? (
                      images.slice(0, 3).map((image, index) => (
                        <div
                          key={index}
                          className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg"
                        >
                          <ProductImage image={image} />
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">Sem imagem</span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-[#172033]">
                        {getProductName(product)}
                      </h3>

                      <button
                        type="button"
                        onClick={() => handleRemove(product)}
                        aria-label={`Excluir ${getProductName(product)}`}
                        className="rounded-lg border border-red-700 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                      >
                        Excluir
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-[#7183A3]">
                      {product.category || 'Outros'}
                    </p>

                    <p className="mt-2 min-h-10 text-xs leading-relaxed text-[#7183A3]">
                      {product.description}
                    </p>

                    <p className="mt-3 font-bold text-blue-700">
                      {formatPrice(product.price)}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          !isProductAvailable(product)
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {!isProductAvailable(product)
                          ? 'Indisponível'
                          : 'Disponível'}
                      </span>

                      <button
                        type="button"
                        onClick={() => openEdit(product)}
                        className="rounded-lg border border-blue-700 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <div className="rounded-xl border border-dashed border-[#DCE4F0] bg-white p-10 text-center">
            <p className="font-semibold text-[#172957]">
              Nenhum produto encontrado.
            </p>

            <p className="mt-2 text-sm text-[#7183A3]">
              Tente alterar os filtros selecionados.
            </p>
          </div>
        )}
        </>
        )}
      </div>

      {/* Dialog de edição */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              clearForm();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-edicao-produto"
            className="my-auto w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="titulo-edicao-produto"
                className="text-lg font-bold text-[#172957]"
              >
                Editar Produto
              </h2>

              {formError && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {formError}
                </p>
              )}

              <button
                type="button"
                onClick={clearForm}
                className="text-2xl text-[#91A2BF] hover:text-red-600"
                aria-label="Fechar edição"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveProduct}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#344563]">
                    Nome do produto *
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateField('name', event.target.value)
                    }
                    required
                    className="w-full rounded-lg border border-[#DCE4F0] px-3 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#344563]">
                    Preço (R$) *
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      updateField('price', event.target.value)
                    }
                    required
                    className="w-full rounded-lg border border-[#DCE4F0] px-3 py-3 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#344563]">
                    Categoria *
                  </label>

                  <select
                    value={form.category}
                    onChange={(event) =>
                      updateField('category', event.target.value)
                    }
                    required
                    className="w-full rounded-lg border border-[#DCE4F0] bg-white px-3 py-3 text-sm"
                  >
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#344563]">
                    Descrição
                  </label>

                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(event) =>
                      updateField('description', event.target.value)
                    }
                    className="w-full resize-none rounded-lg border border-[#DCE4F0] px-3 py-3 text-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-[#344563]">
                  Imagens do produto (opcional, máximo de 3)
                </label>

                <div className="flex flex-wrap gap-3">
                  {form.images.map((image, index) => (
                    <div
                      key={`${image.url}-${index}`}
                      className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-[#DCE4F0] bg-[#EDF4FD]"
                    >
                      <ProductImage image={image} />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label="Remover imagem"
                        className="absolute right-1 top-1 rounded-full bg-white px-1.5 text-xs text-red-600 shadow"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {form.images.length < 3 && (
                    <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-300 text-sm text-blue-600 hover:bg-blue-50">
                      <span className="text-xl">+</span>
                      <span>Foto</span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={addImages}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Disponibilidade */}
              <div className="mt-5 rounded-lg border border-[#DCE4F0] p-4">
                <label className="flex cursor-pointer items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#172957]">
                      Disponibilidade do produto
                    </p>

                    <p className="mt-1 text-xs text-[#7183A3]">
                      Defina se o produto pode ser disponibilizado para venda.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(event) =>
                      updateField('available', event.target.checked)
                    }
                    className="h-5 w-5 accent-blue-700"
                  />
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={clearForm}
                  className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Salvar alterações
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Diálogo de confirmação de exclusão */}
      {productsToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setProductsToDelete(null);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >

            <h2
              id="delete-product-title"
              className="text-xl font-bold text-[#172957]"
            >
              Confirmar exclusão
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#71839F]">
              Tem certeza de que deseja excluir o produto{' '}
              <strong className="text-[#172033]">
                {productsToDelete.name}
              </strong>
              ?
              Essa ação não poderá ser desfeita.
            </p>

            <div className="mt-7 flex justify-end gap-3">

              {/* Cancelar exclusão */}
              <button
                type="button"
                onClick={() => setProductsToDelete(null)}
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
                Excluir produto
              </button>

            </div>
          </section>
        </div>
      )}
      </main>
    </>
  );
}
