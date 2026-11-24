import { useEffect, useRef, useState } from 'react';

export function FoundersSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const founders = [
    {
      id: 1,
      name: 'Nome do Fundador',
      description: 'Breve histórico sobre a trajetória, dedicação e o papel fundamental na criação e fortalecimento dos projetos da instituição.',
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="fundadores" ref={sectionRef} className="bg-white py-24 px-6 font-poppins text-slate-800 relative">
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
                className={`group relative mt-20 flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/80 p-6 pt-32 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-3 hover:border-blue-200 hover:shadow-2xl motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none sm:p-8 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                {/* Imagem Circular Sobreposta no Topo */}
                <div className="absolute -top-16 left-1/2 flex h-24 w-24 -translate-x-1/2 transform items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-300 shadow-md transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none">
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