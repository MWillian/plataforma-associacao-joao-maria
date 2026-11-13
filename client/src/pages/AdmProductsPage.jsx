
import { useMemo, useState } from 'react';

const categoriasDisponiveis = [
  'Artesanato',
  'Agricultura familiar',
  'Vestuário',
  'Calçados',
  'Acessórios',
  'Outros',
];

const formularioInicial = {
  nome: '',
  descricao: '',
  preco: '',
  categoria: '',
  imagens: [],
  disponivel: true,
};

function formatarPreco(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function obterImagens(produto) {
  if (produto.imagens) {
    return produto.imagens;
  }

  // Compatibilidade com os produtos demonstrativos antigos,
  // que utilizavam a propriedade "fotos".
  return (produto.fotos || []).map((foto) => ({
    url: foto,
    tipo: 'emoji',
  }));
}

function ImagemProduto({ imagem }) {
  const url = typeof imagem === 'string' ? imagem : imagem.url;
  const ehArquivoImagem =
    url?.startsWith('blob:') ||
    url?.startsWith('data:') ||
    url?.startsWith('http');

  if (ehArquivoImagem) {
    return (
      <img
        src={url}
        alt="Imagem do produto"
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <span className="text-5xl" role="img" aria-label="Imagem ilustrativa">
      {url || '📦'}
    </span>
  );
}

export function AdmProductsPage({
  produtos = [],
  onCreate,
  onUpdate,
  onRemove,
  onBack,
}) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);

  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [precoMinimo, setPrecoMinimo] = useState('');
  const [precoMaximo, setPrecoMaximo] = useState('');
  const [ordenacao, setOrdenacao] = useState('nome');

  const categoriasCadastradas = useMemo(() => {
    return [...new Set(produtos.map((produto) => produto.categoria || 'Outros'))];
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    const resultado = produtos.filter((produto) => {
      const preco = Number(produto.preco);
      const categoria = produto.categoria || 'Outros';

      const atendeCategoria =
        filtroCategoria === 'Todas' || categoria === filtroCategoria;

      const atendePrecoMinimo =
        precoMinimo === '' || preco >= Number(precoMinimo);

      const atendePrecoMaximo =
        precoMaximo === '' || preco <= Number(precoMaximo);

      return atendeCategoria && atendePrecoMinimo && atendePrecoMaximo;
    });

    return resultado.sort((a, b) => {
      if (ordenacao === 'preco') {
        return Number(a.preco) - Number(b.preco);
      }

      if (ordenacao === 'categoria') {
        return (a.categoria || 'Outros').localeCompare(
          b.categoria || 'Outros',
          'pt-BR'
        );
      }

      return a.nome.localeCompare(b.nome, 'pt-BR');
    });
  }, [produtos, filtroCategoria, precoMinimo, precoMaximo, ordenacao]);

  const atualizarCampo = (campo, valor) => {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  const adicionarImagens = (evento) => {
    const arquivosSelecionados = Array.from(evento.target.files || []);
    const espacosDisponiveis = 3 - formulario.imagens.length;

    if (espacosDisponiveis <= 0) {
      alert('Este produto já possui o limite de 3 imagens.');
      evento.target.value = '';
      return;
    }

    const arquivosValidos = arquivosSelecionados
      .filter((arquivo) => arquivo.type.startsWith('image/'))
      .slice(0, espacosDisponiveis);

    const novasImagens = arquivosValidos.map((arquivo) => ({
      url: URL.createObjectURL(arquivo),
      arquivo,
    }));

    setFormulario((anterior) => ({
      ...anterior,
      imagens: [...anterior.imagens, ...novasImagens],
    }));

    evento.target.value = '';
  };

  const removerImagem = (indice) => {
    setFormulario((anterior) => ({
      ...anterior,
      imagens: anterior.imagens.filter((_, i) => i !== indice),
    }));
  };

  const limparFormulario = () => {
    setFormulario(formularioInicial);
    setProdutoEditando(null);
    setMostrarFormulario(false);
  };

  const salvarProduto = (evento) => {
    evento.preventDefault();

    if (!formulario.nome.trim() || !formulario.categoria || formulario.preco === '') {
      alert('Preencha o nome, a categoria e o preço do produto.');
      return;
    }

    const dadosProduto = {
      ...formulario,
      nome: formulario.nome.trim(),
      descricao: formulario.descricao.trim(),
      preco: Number(formulario.preco),
    };

    if (produtoEditando) {
      onUpdate?.({
        ...dadosProduto,
        id: produtoEditando.id,
      });
    } else {
      onCreate?.({
        ...dadosProduto,
        id: Date.now(),
      });
    }

    limparFormulario();
  };

  const abrirEdicao = (produto) => {
    setProdutoEditando(produto);

    setFormulario({
      nome: produto.nome || '',
      descricao: produto.descricao || '',
      preco: String(produto.preco ?? ''),
      categoria: produto.categoria || 'Outros',
      imagens: obterImagens(produto),
      disponivel: produto.disponivel ?? true,
    });
  };

  return (
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
            <button
              type="button"
              onClick={() => {
                setFormulario(formularioInicial);
                setProdutoEditando(null);
                setMostrarFormulario(true);
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
          </div>
        </header>

        {/* Formulário de cadastro */}
        {mostrarFormulario && (
          <section className="mb-8 rounded-xl border border-[#DCE4F0] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-bold text-[#172957]">
                Novo Produto
              </h2>

              <button
                type="button"
                onClick={limparFormulario}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                ✕ Cancelar
              </button>
            </div>

            <form onSubmit={salvarProduto}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#344563]">
                    Nome do produto *
                  </label>

                  <input
                    type="text"
                    value={formulario.nome}
                    onChange={(e) => atualizarCampo('nome', e.target.value)}
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
                    value={formulario.preco}
                    onChange={(e) => atualizarCampo('preco', e.target.value)}
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
                    value={formulario.categoria}
                    onChange={(e) => atualizarCampo('categoria', e.target.value)}
                    required
                    className="w-full rounded-lg border border-[#DCE4F0] bg-white px-3 py-3 text-sm outline-none focus:border-blue-600"
                  >
                    <option value="">Selecione uma categoria...</option>

                    {categoriasDisponiveis.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
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
                  value={formulario.descricao}
                  onChange={(e) => atualizarCampo('descricao', e.target.value)}
                  placeholder="Descreva o produto, materiais, tamanhos disponíveis..."
                  rows={4}
                  className="w-full resize-none rounded-lg border border-[#DCE4F0] px-3 py-3 text-sm outline-none focus:border-blue-600"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-[#344563]">
                  Fotos do produto (máximo de 3)
                </label>

                <div className="flex flex-wrap gap-3">
                  {formulario.imagens.map((imagem, indice) => (
                    <div
                      key={`${imagem.url}-${indice}`}
                      className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-[#DCE4F0] bg-[#EDF4FD]"
                    >
                      <ImagemProduto imagem={imagem} />

                      <button
                        type="button"
                        onClick={() => removerImagem(indice)}
                        aria-label="Remover imagem"
                        className="absolute right-1 top-1 rounded-full bg-white px-1.5 text-xs text-red-600 shadow"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {formulario.imagens.length < 3 && (
                    <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-300 text-sm text-blue-600 hover:bg-blue-50">
                      <span className="text-xl">+</span>
                      <span>Foto</span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={adicionarImagens}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <p className="mt-2 text-xs text-[#91A2BF]">
                  {formulario.imagens.length} de 3 imagens selecionadas.
                </p>
              </div>

              <div className="mt-8 flex md:justify-end md:pr-[0%]">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Salvar produto
                </button>
              </div>
            </form>
          </section>
        )}

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
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full rounded-lg border border-[#DCE4F0] bg-white px-3 py-2.5 text-sm"
              >
                <option value="Todas">Todas as categorias</option>

                {categoriasCadastradas.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
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
                value={precoMinimo}
                onChange={(e) => setPrecoMinimo(e.target.value)}
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
                value={precoMaximo}
                onChange={(e) => setPrecoMaximo(e.target.value)}
                placeholder="Sem limite"
                className="w-full rounded-lg border border-[#DCE4F0] px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344563]">
                Ordenar por
              </label>

              <select
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
                className="w-full rounded-lg border border-[#DCE4F0] bg-white px-3 py-2.5 text-sm"
              >
                <option value="nome">Ordem alfabética</option>
                <option value="preco">Menor preço</option>
                <option value="categoria">Categoria</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-[#7183A3]">
              {produtosFiltrados.length} produto(s) encontrado(s)
            </p>

            <button
              type="button"
              onClick={() => {
                setFiltroCategoria('Todas');
                setPrecoMinimo('');
                setPrecoMaximo('');
                setOrdenacao('nome');
              }}
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        </section>

        {/* Listagem de produtos */}
        {produtosFiltrados.length > 0 ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {produtosFiltrados.map((produto) => {
              const imagens = obterImagens(produto);

              return (
                <article
                  key={produto.id}
                  className="overflow-hidden rounded-xl border border-[#DCE4F0] bg-white"
                >
                  <div className="relative flex h-36 items-center justify-center gap-2 bg-[#EDF4FD] p-3">
                    {imagens.length > 0 ? (
                      imagens.slice(0, 3).map((imagem, indice) => (
                        <div
                          key={indice}
                          className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg"
                        >
                          <ImagemProduto imagem={imagem} />
                        </div>
                      ))
                    ) : (
                      <span className="text-5xl">📦</span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-[#172033]">
                        {produto.nome}
                      </h3>

                      <button
                        type="button"
                        onClick={() => onRemove?.(produto.id)}
                        aria-label={`Excluir ${produto.nome}`}
                        className="text-xl leading-none text-[#B7C5D8] hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-[#7183A3]">
                      {produto.categoria || 'Outros'}
                    </p>

                    <p className="mt-2 min-h-10 text-xs leading-relaxed text-[#7183A3]">
                      {produto.descricao}
                    </p>

                    <p className="mt-3 font-bold text-blue-700">
                      {formatarPreco(produto.preco)}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          produto.disponivel === false
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {produto.disponivel === false
                          ? 'Indisponível'
                          : 'Disponível'}
                      </span>

                      <button
                        type="button"
                        onClick={() => abrirEdicao(produto)}
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
      </div>

      {/* Dialog de edição */}
      {produtoEditando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              limparFormulario();
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

              <button
                type="button"
                onClick={limparFormulario}
                className="text-2xl text-[#91A2BF] hover:text-red-600"
                aria-label="Fechar edição"
              >
                ×
              </button>
            </div>

            <form onSubmit={salvarProduto}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#344563]">
                    Nome do produto *
                  </label>

                  <input
                    type="text"
                    value={formulario.nome}
                    onChange={(e) => atualizarCampo('nome', e.target.value)}
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
                    value={formulario.preco}
                    onChange={(e) => atualizarCampo('preco', e.target.value)}
                    required
                    className="w-full rounded-lg border border-[#DCE4F0] px-3 py-3 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#344563]">
                    Categoria *
                  </label>

                  <select
                    value={formulario.categoria}
                    onChange={(e) => atualizarCampo('categoria', e.target.value)}
                    required
                    className="w-full rounded-lg border border-[#DCE4F0] bg-white px-3 py-3 text-sm"
                  >
                    {categoriasDisponiveis.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
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
                    value={formulario.descricao}
                    onChange={(e) => atualizarCampo('descricao', e.target.value)}
                    className="w-full resize-none rounded-lg border border-[#DCE4F0] px-3 py-3 text-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-[#344563]">
                  Imagens do produto (máximo de 3)
                </label>

                <div className="flex flex-wrap gap-3">
                  {formulario.imagens.map((imagem, indice) => (
                    <div
                      key={`${imagem.url}-${indice}`}
                      className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-[#DCE4F0] bg-[#EDF4FD]"
                    >
                      <ImagemProduto imagem={imagem} />

                      <button
                        type="button"
                        onClick={() => removerImagem(indice)}
                        aria-label="Remover imagem"
                        className="absolute right-1 top-1 rounded-full bg-white px-1.5 text-xs text-red-600 shadow"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {formulario.imagens.length < 3 && (
                    <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-300 text-sm text-blue-600 hover:bg-blue-50">
                      <span className="text-xl">+</span>
                      <span>Foto</span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={adicionarImagens}
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
                    checked={formulario.disponivel}
                    onChange={(e) =>
                      atualizarCampo('disponivel', e.target.checked)
                    }
                    className="h-5 w-5 accent-blue-700"
                  />
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={limparFormulario}
                  className="rounded-lg border border-[#DCE4F0] px-5 py-2.5 text-sm font-semibold text-[#526581] hover:bg-[#F7F9FC]"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Salvar alterações
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
