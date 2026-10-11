import { useEffect, useRef, useState } from 'react';

export function AboutSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="quem-somos"
      ref={sectionRef}
      className="bg-white py-16 md:py-20 px-6 font-poppins text-[#142D59] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">

        {/* TÍTULO */}
        <h2
          className={`
            text-3xl md:text-4xl
            font-bold text-center
            mb-12 md:mb-16

            transition-all
            duration-1000
            ease-[cubic-bezier(0.22,1,0.36,1)]

            ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }
          `}
        >
          Quem somos
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* IMAGEM */}
          <div
            className={`
              flex justify-center

              transition-all
              duration-1000
              ease-[cubic-bezier(0.22,1,0.36,1)]
              delay-100

              ${
                isVisible
                  ? 'opacity-100 translate-x-0 scale-100'
                  : 'opacity-0 -translate-x-20 scale-95'
              }
            `}
          >
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
              <span className="text-slate-400 text-sm font-roboto text-center p-4">
                Placeholder Foto Redonda
              </span>
            </div>
          </div>

          {/* CONTEÚDO */}
          <div
            className={`
              space-y-6
              text-center lg:text-left

              transition-all
              duration-1000
              ease-[cubic-bezier(0.22,1,0.36,1)]
              delay-200

              ${
                isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-20'
              }
            `}
          >
            <h3
              className={`
                text-2xl sm:text-3xl
                font-bold
                leading-snug

                transition-all
                duration-700
                delay-300

                ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }
              `}
            >
              A Associação Comunitária João Maria atua em Coruripe-AL
            </h3>

            <p
              className={`
                text-[#142D59]
                font-roboto
                leading-relaxed
                text-base
                opacity-90

                transition-all
                duration-700
                delay-400

                ${
                  isVisible
                    ? 'opacity-90 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }
              `}
            >
              Promove iniciativas voltadas à valorização das pessoas, da
              cultura, da educação e do desenvolvimento social. Por meio de
              projetos comunitários, buscamos criar oportunidades, incentivar
              talentos e fortalecer os vínculos entre os moradores,
              construindo coletivamente uma comunidade mais participativa,
              acolhedora e unida.
            </p>

            {/* ESTATÍSTICAS */}
            <div
              className={`
                grid grid-cols-3
                gap-4 sm:gap-6
                pt-6
                border-t border-slate-100

                transition-all
                duration-800
                delay-500

                ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }
              `}
            >
              <div className="transition-transform duration-300 hover:-translate-y-2">
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
                  <span className="text-[#3570FC]">500</span>
                  <span className="text-[#54FF5F]">+</span>
                </h4>

                <p className="text-xs sm:text-sm text-slate-500 font-roboto mt-1">
                  Crianças atendidas
                </p>
              </div>

              <div className="transition-transform duration-300 hover:-translate-y-2">
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
                  <span className="text-[#3570FC]">5</span>
                  <span className="text-[#54FF5F]">+</span>
                </h4>

                <p className="text-xs sm:text-sm text-slate-500 font-roboto mt-1">
                  Anos de atendimento
                </p>
              </div>

              <div className="transition-transform duration-300 hover:-translate-y-2">
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
                  <span className="text-[#3570FC]">250</span>
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