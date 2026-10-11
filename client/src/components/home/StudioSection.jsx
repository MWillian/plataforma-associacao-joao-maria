import { useEffect, useRef, useState } from 'react';

export function StudioSection() {
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
        threshold: 0.18,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="estudio"
      ref={sectionRef}
      className="
        bg-[#0b1b3d]
        text-white
        py-16 md:py-20
        px-4 sm:px-6
        font-poppins
        overflow-hidden
      "
    >
      <div className="max-w-7xl mx-auto">

        {/* TÍTULO */}
        <div
          className={`
            text-center
            mb-12 md:mb-16

            transition-all
            duration-1000
            ease-[cubic-bezier(0.22,1,0.36,1)]

            ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-12'
            }
          `}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
            Estúdio Adágio
          </h2>

          <div
            className={`
              mx-auto
              mt-4
              h-[3px]
              bg-blue-400
              rounded-full
              transition-all duration-1000 delay-200

              ${
                isVisible
                  ? 'w-16 opacity-100'
                  : 'w-0 opacity-0'
              }
            `}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* TEXTO */}
          <div
            className={`
              space-y-6
              text-center lg:text-left

              transition-all
              duration-1000
              ease-[cubic-bezier(0.22,1,0.36,1)]

              ${
                isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-20'
              }
            `}
          >
            <h3
              className={`
                text-2xl sm:text-3xl md:text-4xl
                font-bold
                leading-tight

                transition-all duration-700 delay-200

                ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }
              `}
            >
              Dançar, transformar, inspirar.
            </h3>

            <p
              className={`
                text-blue-100
                font-roboto
                font-light
                leading-relaxed
                text-base
                max-w-xl
                mx-auto lg:mx-0

                transition-all duration-700 delay-300

                ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }
              `}
            >
              Um espaço dedicado à arte, à cultura e ao desenvolvimento de
              talentos, promovendo oportunidades, inclusão e transformação
              por meio da dança e da expressão artística.
            </p>

            <div
              className={`
                pt-4
                flex justify-center lg:justify-start

                transition-all duration-700 delay-500

                ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }
              `}
            >
              <button
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
            <div
              className={`
                transition-all
                duration-1000
                ease-[cubic-bezier(0.22,1,0.36,1)]
                delay-200

                ${
                  isVisible
                    ? 'opacity-100 translate-x-0 scale-100'
                    : 'opacity-0 translate-x-24 scale-95'
                }
              `}
            >
              <div
                className="
                  group
                  relative

                  w-full
                  h-56 sm:h-64 md:h-72

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

                <span
                  className="
                    relative z-10
                    text-blue-300
                    text-xs sm:text-sm
                    font-roboto

                    transition-all duration-500

                    group-hover:scale-105
                    group-hover:text-blue-200
                  "
                >
                  Placeholder Imagem Superior
                </span>
              </div>
            </div>

            {/* IMAGEM 2 */}
            <div
              className={`
                transition-all
                duration-1000
                ease-[cubic-bezier(0.22,1,0.36,1)]
                delay-400

                ${
                  isVisible
                    ? 'opacity-100 translate-x-0 scale-100'
                    : 'opacity-0 translate-x-24 scale-95'
                }
              `}
            >
              <div
                className="
                  group
                  relative

                  w-full
                  h-56 sm:h-64 md:h-72

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

                <span
                  className="
                    relative z-10
                    text-blue-300
                    text-xs sm:text-sm
                    font-roboto

                    transition-all duration-500

                    group-hover:scale-105
                    group-hover:text-blue-200
                  "
                >
                  Placeholder Imagem Inferior
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}