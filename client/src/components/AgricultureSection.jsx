import { useEffect, useRef, useState } from 'react';

export function AgricultureSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const products = [
    {
      id: 1,
      tag: 'Produto',
      title: 'Tomates',
      info: 'INSERIR O PREÇO',
    },
    {
      id: 2,
      tag: 'Produto',
      title: 'Batata doce',
      info: 'INSERIR O PREÇO',
    },
    {
      id: 3,
      tag: 'Produto',
      title: 'Alface',
      info: 'INSERIR O PREÇO',
    },
  ];

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
          {products.map((item, index) => (
            <div
              key={item.id}
              style={{
                transitionDelay: `${200 + index * 150}ms`,
              }}
              className={`
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

                {/* Placeholder */}
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
                  Placeholder Imagem
                </span>

                {/* Tag */}
                <span
                  className="
                    absolute
                    bottom-3
                    left-3

                    bg-[#0b1b3d]
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
                    {item.info}
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