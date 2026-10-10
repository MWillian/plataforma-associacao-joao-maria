import { useState, useEffect } from 'react';
import { HeartHandshake } from 'lucide-react';

export function CraftDetailPage({ product, onBack, onGoHome }) {
  // Rola suavemente para o topo assim que o componente é montado
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Produto padrão de fallback (Sousplat de Crochê) caso não venha props dinâmicas
  const defaultProduct = {
    title: 'Sousplat de crochê',
    price: 'R$ 35,00',
    unit: '/ unidade',
    badge: 'PRODUTO COOPERATIVO',
    description:
      'Sousplat artesanal feito inteiramente à mão em crochê com fios selecionados de 100% algodão natural. Ideal para emoldurar pratos e decorar sua mesa com elegância, aconchego e um autêntico toque regional nordestino. Disponível sob encomenda em diversas cores personalizadas.',
    specs: {
      diameter: '35 cm',
      composition: 'Fio de Algodão Ecológico',
      colors: 'Cru, Mostarda, Terracota, Verde Oliva e Azul Marinho',
    },
    images: [
      'Placeholder Imagem Principal',
      'Miniatura 1',
      'Miniatura 2',
      'Miniatura 3',
    ],
  };

  const currentProduct = product || defaultProduct;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="bg-white text-slate-800 font-poppins min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb de Navegação */}
        <nav className="text-xs sm:text-sm text-slate-500 font-roboto flex items-center gap-2">
          <button 
            onClick={onGoHome} 
            className="hover:text-[#142D59] transition-colors cursor-pointer"
          >
            Início
          </button>
          <span>&gt;</span>
          <button 
            onClick={onBack} 
            className="hover:text-[#142D59] transition-colors cursor-pointer"
          >
            Artesanato
          </button>
          <span>&gt;</span>
          <span className="text-amber-800 font-medium">{currentProduct.title}</span>
        </nav>

        {/* Grid Principal do Produto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Coluna da Esquerda: Galeria de Imagens (7 colunas) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Imagem Principal */}
            <div className="w-full h-80 sm:h-96 md:h-[420px] bg-amber-50/60 rounded-3xl border border-amber-200/50 flex items-center justify-center overflow-hidden shadow-sm relative">
              <span className="text-amber-800/60 font-roboto text-sm sm:text-base font-medium">
                {currentProduct.images?.[selectedImageIndex] || 'Imagem do Produto'}
              </span>
            </div>

            {/* Miniaturas */}
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx + 1)}
                  className={`h-24 sm:h-28 bg-amber-50/40 rounded-2xl border transition-all cursor-pointer flex items-center justify-center p-2 ${
                    selectedImageIndex === idx + 1
                      ? 'border-amber-700 ring-2 ring-amber-700/20 shadow-md'
                      : 'border-slate-200 hover:border-amber-400'
                  }`}
                >
                  <span className="text-xs text-slate-400 font-roboto">
                    {currentProduct.images?.[idx + 1] || `Foto ${idx + 1}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Coluna da Direita: Informações e Encomenda (5 colunas) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Tag de Destaque */}
            <div>
              <span className="inline-block bg-amber-100/80 text-amber-900 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-md tracking-wider">
                {currentProduct.badge || 'PRODUTO COOPERATIVO'}
              </span>
            </div>

            {/* Título e Preço */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1b3d] tracking-tight">
                {currentProduct.title}
              </h1>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-800">
                  {currentProduct.price || 'R$ 35,00'}
                </span>
                <span className="text-slate-500 font-roboto text-sm">
                  {currentProduct.unit || '/ unidade'}
                </span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Descrição do Produto */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#0b1b3d]">
                Descrição do Produto
              </h3>
              <p className="text-slate-600 font-roboto text-xs sm:text-sm leading-relaxed">
                {currentProduct.description}
              </p>
            </div>

            {/* Especificações */}
            <div className="space-y-2 font-roboto text-xs sm:text-sm text-slate-700 pt-2">
              <p>
                <strong className="font-bold text-[#0b1b3d]">Diâmetro:</strong>{' '}
                {currentProduct.specs?.diameter || '35 cm'}
              </p>
              <p>
                <strong className="font-bold text-[#0b1b3d]">Composição:</strong>{' '}
                {currentProduct.specs?.composition || 'Fio de Algodão Ecológico'}
              </p>
              <p>
                <strong className="font-bold text-[#0b1b3d]">Cores Disponíveis:</strong>{' '}
                {currentProduct.specs?.colors || 'Cru, Mostarda, Terracota, Verde Oliva e Azul Marinho'}
              </p>
            </div>

            {/* Botão do WhatsApp */}
            <div className="pt-2 space-y-3">
              <a
                href="https://wa.me/5582998989898"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#1b7a33] hover:bg-[#156128] text-white py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {/* WhatsApp SVG Icon */}
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                Encomendar pelo WhatsApp
              </a>
              <p className="text-[11px] text-slate-400 font-roboto leading-normal">
                * Ao clicar, você será direcionado para o nosso canal de atendimento direto para combinar cores, quantidades e frete.
              </p>
            </div>

            {/* Card Impacto Social Direto */}
            <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-5 flex items-start gap-4">
              <div className="text-amber-800 pt-0.5">
                <HeartHandshake size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-900">
                  Impacto Social Direto
                </h4>
                <p className="text-xs text-amber-950/80 font-roboto leading-relaxed">
                  100% do valor arrecadado é repassado diretamente para a artesã cooperada da Associação João Maria, promovendo autonomia financeira e preservando tradições.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}