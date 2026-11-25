export function FoundersSection() {
  const founders = [
    {
      id: 1,
      name: 'Ana Maria dos Santos Silva',
      description: 'Como fundadora da Associação Comunitária João Maria, Ana Maria dos Santos Silva representa o compromisso com o fortalecimento de Coruripe. A Associação promove ações de cultura, artesanato e agricultura familiar, valorizando talentos locais e criando oportunidades para as famílias. Esse trabalho comunitário fortalece vínculos e inspira uma comunidade mais acolhedora e participativa.',
    },
  ];

  return (
    <section id="fundadores" className="relative bg-white py-16 md:py-20 px-6 font-poppins text-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Título da Seção */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#142D59] mb-8">
          Fundadora
        </h2>

        {/* Container com setas de navegação nas laterais */}
        <div className="relative flex items-center justify-center">

          {/* Grid de Cards Responsivos */}
          <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl mx-auto px-4 md:px-12">
            {founders.map((founder) => (
              <div
                key={founder.id}
                style={{ width: '100%', maxWidth: '342.09px', minHeight: '430px' }}
                className="group relative mt-32 flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/80 p-6 pt-32 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:border-blue-500 hover:shadow-2xl sm:p-8 sm:pt-32"
              >
                {/* Imagem Circular Sobreposta no Topo */}
                <div className="absolute -top-28 left-1/2 flex h-48 w-48 -translate-x-1/2 transform items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-300 shadow-md">
                  <img
                    src="/foto-fundadora.jpeg"
                    alt="Fundadora da Associação Comunitária João Maria"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
                </div>
                
                 {/* Nome do Fundador */}
                <h3 className="text-lg font-bold text-[#142D59] text-center mb-2">
                  {founder.name}
                </h3>

                {/* Descrição com folga adequada em relação à foto */}
                <p className="text-slate-600 font-roboto text-base leading-relaxed text-center mb-6">
                  {founder.description}
                </p>

               
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}