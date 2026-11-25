import { MapPin } from 'lucide-react';

export function AboutSection() {
  return (
    <section
      id="quem-somos"
      className="scroll-mt-24 bg-white py-16 md:py-20 px-6 font-poppins text-[#142D59] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">

        {/* TÍTULO */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">
          Quem somos
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* IMAGEM */}
          <div className="flex justify-center">
            <div
              className="
                w-64 h-64
                sm:w-80 sm:h-80
                md:w-96 md:h-96

                rounded-full

                bg-slate-100
                border-4 border-slate-100

                flex items-center justify-center

                shadow-xl

                overflow-hidden
                relative

                transition-all duration-500

                hover:scale-105
                hover:shadow-2xl
              "
            >
              <img
                src="/quem-somos.png"
                alt="Representante da Associação Comunitária João Maria diante da identidade visual da instituição"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* CONTEÚDO */}
          <div className="space-y-6 text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold leading-snug">
              A Associação Comunitária João Maria atua em Coruripe-AL
            </h3>

            <p className="text-[#142D59] font-roboto leading-relaxed text-base opacity-90">
              Promove iniciativas voltadas à valorização das pessoas, da
              cultura, da educação e do desenvolvimento social. Por meio de
              projetos comunitários, buscamos criar oportunidades, incentivar
              talentos e fortalecer os vínculos entre os moradores,
              construindo coletivamente uma comunidade mais participativa,
              acolhedora e unida.
            </p>

            <div className="flex items-start gap-4 rounded-2xl border border-[#dce6f6] bg-[#f7f9fc] p-5 text-left shadow-sm">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8efff] text-[#3570FC]">
                <MapPin aria-hidden="true" size={22} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#3570FC]">
                  Nosso endereço
                </p>
                <address className="mt-1 not-italic font-semibold leading-relaxed text-[#142D59]">
                  Rua João Peroba, Nº 05
                  <br />
                  Coruripe - AL
                </address>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Rua+Jo%C3%A3o+Peroba%2C+N%C2%BA+05%2C+Coruripe%2C+AL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex text-sm font-semibold text-[#3570FC] underline-offset-4 transition hover:underline"
                >
                  Ver no mapa
                </a>
              </div>
            </div>

            {/* ESTATÍSTICAS */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-slate-100">
              <div className="transition-transform duration-300 hover:-translate-y-2">
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
                  <span className="text-[#3570FC]">200</span>
                  <span className="text-[#54FF5F]">+</span>
                </h4>

                <p className="text-xs sm:text-sm text-slate-500 font-roboto mt-1">
                  Crianças atendidas
                </p>
              </div>

              <div className="transition-transform duration-300 hover:-translate-y-2">
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
                  <span className="text-[#3570FC]">3</span>
                  <span className="text-[#54FF5F]">+</span>
                </h4>

                <p className="text-xs sm:text-sm text-slate-500 font-roboto mt-1">
                  Anos de atendimento
                </p>
              </div>

              <div className="transition-transform duration-300 hover:-translate-y-2">
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
                  <span className="text-[#3570FC]">30</span>
                  <span className="text-[#54FF5F]">+</span>
                </h4>

                <p className="text-xs sm:text-sm text-slate-500 font-roboto mt-1">
                  Famílias participam
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}