import { ChevronLeft, ChevronRight } from 'lucide-react';

export function FoundersSection() {
  const founders = [
    {
      id: 1,
      name: 'Nome do Fundador',
      description: 'Breve histórico sobre a trajetória, dedicação e o papel fundamental na criação e fortalecimento dos projetos da instituição.',
    },
    {
      id: 2,
      name: 'Nome do Fundador',
      description: 'Breve histórico sobre a trajetória, dedicação e o papel fundamental na criação e fortalecimento dos projetos da instituição.',
    },
  ];

  return (
    <section id="fundadores" className="bg-white py-24 px-6 font-poppins text-slate-800 relative">
      <div className="max-w-7xl mx-auto">
        {/* Título da Seção */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#142D59] mb-16">
          Fundadores
        </h2>

        {/* Container com setas de navegação nas laterais */}
        <div className="relative flex items-center justify-center">

          {/* Grid de Cards Responsivos */}
          <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl mx-auto px-4 md:px-12">
            {founders.map((founder) => (
              <div
                key={founder.id}
                style={{ width: '100%', maxWidth: '342.09px', minHeight: '378.77px' }}
                className="bg-slate-50/80 rounded-2xl p-6 sm:p-8 pt-32 flex flex-col justify-between shadow-sm border border-slate-100 relative mt-20"
              >
                {/* Imagem Circular Sobreposta no Topo */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-slate-300 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                  <span className="text-slate-500 text-xs font-roboto">Foto</span>
                </div>

                {/* Descrição com folga adequada em relação à foto */}
                <p className="text-slate-600 font-roboto text-sm leading-relaxed text-center mb-6">
                  {founder.description}
                </p>

                {/* Nome do Fundador */}
                <h3 className="text-lg font-bold text-[#142D59] text-center">
                  {founder.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}