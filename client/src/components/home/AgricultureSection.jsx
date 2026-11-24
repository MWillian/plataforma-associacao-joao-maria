import { useEffect, useRef, useState } from 'react';

export function AgricultureSection({ products = [], onNavigate, onSelectProduct }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const items = products.slice(0, 5);

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
      id="agricultura"
      ref={sectionRef}
      className="
        bg-[#0b1b3d]
        text-white
        py-16
        md:py-20
        px-4
        sm:px-6
        font-poppins
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
              tracking-wide
            "
          >
            Agricultura familiar
          </h2>

          {/* Linha decorativa */}
          <div
            className={`
              mx-auto
              mt-4
              h-[3px]
              bg-blue-400
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
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-blue-100/85 sm:text-base">
            Alimentos cultivados pelas famílias da associação, valorizando a produção local e a economia comunitária.
          </p>
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
                text-slate-800

                rounded-2xl

                shadow-xl

                border
                border-blue-900/20

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

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {item.description || 'Entre em contato para saber mais sobre este produto.'}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <span className="block text-xs font-medium uppercase tracking-wide text-slate-500">
                    Preço
                  </span>
                  <span className="mt-1 block text-xl font-bold text-[#0b1b3d]">
                    {item.price || 'Sob consulta'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* =====================================================
            BOTÃO MAIS PRODUTOS
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
            onClick={() => onNavigate?.('agriculture')}
            className="
              group
              relative
              overflow-hidden

              bg-white
              text-[#0b1b3d]

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

              hover:bg-gray-100
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

                bg-blue-100

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