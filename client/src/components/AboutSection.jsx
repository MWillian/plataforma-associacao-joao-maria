export function AboutSection() {
  return (
    <section id="quem-somos" className="bg-white py-16 md:py-20 px-6 font-poppins text-[#142D59]">
      <div className="max-w-7xl mx-auto">
        {/* Título da Seção */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#142D59] mb-12 md:mb-16">
          Quem somos
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Coluna da Esquerda: Imagem Totalmente Redonda */}
          <div className="flex justify-center">
            <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-slate-100 border-4 border-slate-100 flex items-center justify-center shadow-xl overflow-hidden relative">
              <span className="text-slate-400 text-sm font-roboto text-center p-4">Placeholder Foto Redonda</span>
            </div>
          </div>

          {/* Coluna da Direita: Textos e Estatísticas */}
          <div className="space-y-6 text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#142D59] leading-snug">
              A Associação Comunitária João Maria atua em Coruripe-AL
            </h3>
            
            <p className="text-[#142D59] font-roboto leading-relaxed text-base opacity-90">
              Promove iniciativas voltadas à valorização das pessoas, da cultura, da educação e do desenvolvimento social. Por meio de projetos comunitários, buscamos criar oportunidades, incentivar talentos e fortalecer os vínculos entre os moradores, construindo coletivamente uma comunidade mais participativa, acolhedora e unida.
            </p>

            {/* Grid de Estatísticas */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-slate-100">
              <div>
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
                  <span className="text-[#3570FC]">500</span>   
                  <span className="text-[#54FF5F]">+</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 font-roboto mt-1">Crianças atendidas</p>
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
                  <span className="text-[#3570FC]">5</span>
                  <span className="text-[#54FF5F]">+</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 font-roboto mt-1">Anos de atendimento</p>
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
                  <span className="text-[#3570FC]">250</span>
                  <span className="text-[#54FF5F]">+</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 font-roboto mt-1">Famílias participam</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}