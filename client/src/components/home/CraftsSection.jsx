import { useEffect, useRef, useState } from 'react';

export function CraftsSection({ products = [], onNavigate, onSelectProduct }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const items = products.slice(0, 3);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="artesanato"
      ref={sectionRef}
      className="
        bg-white
        py-16
        md:py-20
        px-4
        sm:px-6
        font-poppins
        text-slate-800
        overflow-hidden
        scroll-mt-24
      "
    >
      <div className="max-w-7xl mx-auto">

        {/* =====================================================
            TÍTULO
        ====================================================== */}
        <div
          className={`
            text-center
            mb-12
            md:mb-16

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
          <h2
            className="
              text-3xl
              md:text-4xl
              font-bold
              text-[#142D59]
              tracking-wide
            "
          >
            Artesanato
          </h2>

          {/* Linha decorativa */}
          <div
            className={`
              mx-auto
              mt-4
              h-[3px]
              bg-[#3570FC]
              rounded-full

              transition-all
              duration-1000
              delay-200

              ${
                isVisible
                  ? 'w-16 opacity-100'
                  : 'w-0 opacity-0'
              }
            `}
          />
        </div>

        {/* =====================================================
            CARDS
        ====================================================== */}
        <div
          className="
            flex
            flex-wrap
            justify-center
            gap-6
            md:gap-8
          "
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              role="link"
              tabIndex={0}
              aria-label={`Ver detalhes: ${item.title}`}
              onClick={() => onSelectProduct?.(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelectProduct?.(item);
                }
              }}
              style={{
                transitionDelay: `${200 + index * 150}ms`,
              }}
              className={`
                cursor-pointer
                focus:outline-none
                focus-visible:ring-4
                focus-visible:ring-[#3570FC]/40
                w-full
                max-w-[360px]
                min-h-[430px]
                sm:min-h-[450px]

                bg-white

                rounded-2xl

                shadow-lg

                border
                border-slate-100

                flex
                flex-col
                justify-between

                overflow-hidden

                group

                transition-all
                duration-1000
                ease-[cubic-bezier(0.22,1,0.36,1)]

                ${
                  isVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-16 scale-95'
                }

                hover:-translate-y-3
                hover:shadow-2xl
                hover:border-slate-200
              `}
            >
              {/* =================================================
                  IMAGEM
              ================================================== */}
              <div
                className="
                  w-full
                  h-[190px]
                  sm:h-[200px]

                  bg-slate-100

                  relative

                  flex
                  items-center
                  justify-center

                  overflow-hidden

                  border-b
                  border-slate-100

                  flex-shrink-0
                "
              >
                {/* Área da imagem */}
                <div
                  className="
                    absolute
                    inset-0

                    bg-slate-100

                    transition-transform
                    duration-700

                    group-hover:scale-105
                  "
                />

                {item.images?.[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="relative z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <span
                  className="
                    relative
                    z-10

                    text-slate-400
                    text-xs
                    font-roboto

                    transition-all
                    duration-500

                    group-hover:text-slate-500
                    group-hover:scale-105
                  "
                >
                  Sem imagem
                </span>
                )}

                {/* =================================================
                    TAG
                ================================================== */}
                <span
                  className="
                    absolute
                    bottom-3
                    left-3

                    bg-[#1d3557]
                    text-white

                    text-xs
                    font-medium

                    px-3
                    py-1

                    rounded

                    shadow-sm

                    transition-all
                    duration-300

                    group-hover:-translate-y-1
                    group-hover:shadow-md
                  "
                >
                  {item.tag}
                </span>
              </div>

              {/* =================================================
                  INFORMAÇÕES
              ================================================== */}
              <div
                className="
                  p-7
                  sm:p-8

                  flex
                  flex-col
                  justify-between

                  flex-1
                "
              >
                <h3
                  className="
                    text-2xl
                    font-bold
                    text-[#142D59]
                    leading-tight

                    transition-colors
                    duration-300

                    group-hover:text-[#3570FC]
                    wrap-anywhere
                  "
                >
                  {item.title}
                </h3>

                <div
                  className="
                    pt-4
                    border-t
                    border-slate-100
                  "
                >
                    <span
                      className="
                        text-slate-400
                        font-roboto
                        text-sm
                        tracking-wide
                        block
                        font-medium

                        transition-colors
                        duration-300

                        group-hover:text-slate-500
                      "
                    >
                      {item.price || 'Sob consulta'}
                    </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* =====================================================
            BOTÃO
        ====================================================== */}
        <div
          className={`
            flex
            justify-center

            mt-12
            md:mt-16

            transition-all
            duration-800
            delay-700

            ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }
          `}
        >
          <button
            type="button"
            onClick={() => onNavigate?.('crafts')}
            className="
              group
              relative
              overflow-hidden

              bg-[#0b1b3d]
              text-white

              px-8
              sm:px-10

              py-3
              sm:py-4

              rounded-xl

              font-semibold
              text-sm

              shadow-md

              cursor-pointer

              tracking-wider

              transition-all
              duration-300

              hover:bg-[#142d59]
              hover:-translate-y-1
              hover:shadow-xl

              active:translate-y-0
            "
          >
            <span className="relative z-10">
              MAIS PRODUTOS
            </span>

            {/* Efeito de brilho */}
            <span
              className="
                absolute
                inset-0

                bg-white/10

                translate-x-[-110%]

                group-hover:translate-x-0

                transition-transform
                duration-500
              "
            />
          </button>
        </div>
      </div>
    </section>
  );
}