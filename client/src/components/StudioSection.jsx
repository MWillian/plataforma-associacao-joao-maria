export function StudioSection() {
  return (
    <section id="estudio" className="bg-[#0b1b3d] text-white py-16 md:py-20 px-4 sm:px-6 font-poppins">
      <div className="max-w-7xl mx-auto">
        {/* Título da Seção */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 tracking-wide">
          Estúdio Adágio
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Coluna da Esquerda: Textos e Botão */}    
          <div className="space-y-6 text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              Dançar, transformar, inspirar.
            </h3>
            
            <p className="text-blue-100 font-roboto font-light leading-relaxed text-base max-w-xl mx-auto lg:mx-0">
              Um espaço dedicado à arte, à cultura e ao desenvolvimento de talentos, promovendo oportunidades, inclusão e transformação por meio da dança e da expressão artística.
            </p>

            <div className="pt-4 flex justify-center lg:justify-start">
              <button className="bg-white text-[#0b1b3d] px-8 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors shadow-md cursor-pointer">
                SAIBA MAIS
              </button>
            </div>
          </div>

          {/* Coluna da Direita: Placeholders de Imagem */}
          <div className="space-y-6">
            <div className="w-full h-56 sm:h-64 md:h-72 bg-blue-900/40 rounded-3xl border border-blue-800 flex items-center justify-center shadow-xl overflow-hidden relative">
              <span className="text-blue-300 text-xs sm:text-sm font-roboto">Placeholder Imagem Superior</span>
            </div>

            <div className="w-full h-56 sm:h-64 md:h-72 bg-blue-900/40 rounded-3xl border border-blue-800 flex items-center justify-center shadow-xl overflow-hidden relative">
              <span className="text-blue-300 text-xs sm:text-sm font-roboto">Placeholder Imagem Inferior</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}