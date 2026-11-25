export function StudioSection({ onNavigate }) {
  return (
    <section
      id="estudio"
      className="
        bg-[#0b1b3d]
        text-white
        py-16 md:py-20
        px-4 sm:px-6
        font-poppins
        overflow-hidden
        scroll-mt-24
      "
    >
      <div className="max-w-7xl mx-auto">

        {/* TÍTULO */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
            Estúdio Adágio
          </h2>

          <div
            className="
              mx-auto
              mt-4
              h-[3px]
              bg-blue-400
              rounded-full
              w-16
            "
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* TEXTO */}
          <div className="space-y-6 text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              Dançar, transformar, inspirar.
            </h3>

            <p className="text-blue-100 font-roboto font-light leading-relaxed text-base max-w-xl mx-auto lg:mx-0">
              Um espaço dedicado à arte, à cultura e ao desenvolvimento de
              talentos, promovendo oportunidades, inclusão e transformação
              por meio da dança e da expressão artística.
            </p>

            <div className="pt-4 flex justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => onNavigate?.('studio')}
                className="
                  group
                  relative
                  overflow-hidden

                  bg-white
                  text-[#0b1b3d]

                  px-8 py-3
                  rounded-full

                  font-semibold text-sm

                  shadow-md
                  cursor-pointer

                  transition-all duration-300

                  hover:bg-gray-100
                  hover:-translate-y-1
                  hover:shadow-xl

                  active:translate-y-0
                "
              >
                <span className="relative z-10">
                  SAIBA MAIS
                </span>

                <span
                  className="
                    absolute inset-0
                    bg-blue-100
                    translate-x-[-110%]
                    group-hover:translate-x-0
                    transition-transform duration-500
                    rounded-full
                  "
                />
              </button>
            </div>
          </div>

          {/* IMAGENS */}
          <div className="space-y-6">

            {/* IMAGEM 1 */}
            <div>
              <div
                className="
                  group
                  relative

                  w-full
                  h-72 sm:h-80 md:h-96

                  bg-blue-900/40
                  rounded-3xl
                  border border-blue-800

                  flex items-center justify-center

                  shadow-xl
                  overflow-hidden

                  transition-all duration-500

                  hover:-translate-y-2
                  hover:shadow-2xl
                  hover:border-blue-500
                "
              >
                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-r
                    from-transparent
                    via-white/10
                    to-transparent

                    translate-x-[-100%]
                    group-hover:translate-x-[100%]

                    transition-transform duration-1000
                  "
                />

                <img
                  src="/foto-ballet-1.jpg"
                  alt="Alunas do Estúdio Adágio durante uma apresentação de ballet"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* IMAGEM 2 */}
            <div>
              <div
                className="
                  group
                  relative

                  w-full
                  h-72 sm:h-80 md:h-96

                  bg-blue-900/40
                  rounded-3xl
                  border border-blue-800

                  flex items-center justify-center

                  shadow-xl
                  overflow-hidden

                  transition-all duration-500

                  hover:-translate-y-2
                  hover:shadow-2xl
                  hover:border-blue-500
                "
              >
                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-r
                    from-transparent
                    via-white/10
                    to-transparent

                    translate-x-[-100%]
                    group-hover:translate-x-[100%]

                    transition-transform duration-1000
                  "
                />

                <img
                  src="/foto-ballet-2.png"
                  alt="Turma infantil do Estúdio Adágio em aula de ballet"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}