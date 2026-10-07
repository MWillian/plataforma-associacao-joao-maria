export function CraftsSection() {
  // Lista dinâmica de cards conforme o protótipo
  const items = [
    {
      id: 1,
      tag: 'Produto',
      title: 'Kit 3 pulseiras de macramê',
      info: 'INSERIR O PREÇO',
      isEvent: false,
    },
    {
      id: 2,
      tag: 'Produto',
      title: 'Caminho de mesa em fuxico',
      info: 'INSERIR O PREÇO',
      isEvent: false,
    },
    {
      id: 3,
      tag: 'Evento',
      title: '4ª Feira de Artesanato da Associação',
      info: 'Saiba Mais',
      isEvent: true,
    },
  ];

  return (
    <section id="artesanato" className="bg-white py-20 px-6 font-poppins text-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Título da Seção */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#142D59] mb-16">
          Artesanato
        </h2>

        {/* Grid de Cards Dinâmicos */}
        <div className="flex flex-wrap justify-center gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              style={{ width: '100%', maxWidth: '359.86px', minHeight: '469.6px' }}
              className="bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col justify-between overflow-hidden transition-transform hover:-translate-y-1"
            >
              {/* Parte Superior: Imagem e Tag (Altura exata: 171.55px) */}
              <div 
                style={{ height: '171.55px' }} 
                className="w-full bg-slate-100 relative flex items-center justify-center overflow-hidden border-b border-slate-100 flex-shrink-0"
              >
                <span className="text-slate-400 text-xs font-roboto">Placeholder Imagem</span>
                <span className="absolute bottom-3 left-3 bg-[#1d3557] text-white text-xs font-medium px-3 py-1 rounded shadow-sm">
                  {item.tag}
                </span>
              </div>

              {/* Parte Inferior: Detalhes e Ações */}
              <div className="p-8 flex flex-col justify-between flex-1">
                <h3 className="text-2xl font-bold text-[#142D59] leading-tight">
                  {item.title}
                </h3>

                <div className="pt-4">
                  {item.isEvent ? (
                    <a href="#" className="text-[#142D59] font-semibold text-sm underline underline-offset-4 hover:text-blue-600 transition-colors">
                      {item.info}
                    </a>
                  ) : (
                    <span className="text-slate-400 font-roboto text-sm tracking-wide block font-medium">
                      {item.info}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão Inferior: Mais Produtos */}
        <div className="flex justify-center mt-16">
          <button className="bg-[#0b1b3d] text-white px-10 py-4 rounded-xl font-semibold text-sm hover:bg-[#142d59]/90 transition-colors shadow-md cursor-pointer tracking-wider">
            MAIS PRODUTOS
          </button>
        </div>
      </div>
    </section>
  );
}