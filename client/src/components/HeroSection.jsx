import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';

export function HeroSection() {
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    const animationFrame = requestAnimationFrame(() => {
      setLoaded(true);
    });

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section className="bg-[#0b1b3d] text-white font-poppins overflow-hidden">
      {/* TOP BAR */}
      <div
        className={`
          border-b border-blue-950
          transition-all duration-700
          ${
            loaded
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-3'
          }
        `}
      >
        <div
          className="
            max-w-7xl mx-auto
            px-4 sm:px-6 lg:px-8
            py-2
            flex flex-col sm:flex-row
            justify-between
            items-center
            gap-2
          "
        >
          <div className="flex items-center gap-5">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-blue-300 hover:scale-110 transition-all duration-300"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-blue-300 hover:scale-110 transition-all duration-300"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618-6.98-.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            <a
              href="#"
              aria-label="E-mail"
              className="hover:text-blue-300 hover:scale-110 transition-all duration-300"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.728v15.441h24v-15.441l-12 9.728z" />
              </svg>
            </a>
          </div>

          <div className="flex items-center gap-2 font-roboto text-xs sm:text-sm">
            <Phone size={14} />
            <span>(82) 99898-9898</span>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <header
        className={`
          max-w-7xl mx-auto
          px-4 sm:px-6 lg:px-8
          flex justify-between items-center
          transition-all duration-500
          ${
            scrolled
              ? 'py-2 bg-[#0b1b3d]/95 backdrop-blur-md'
              : 'py-3 sm:py-4'
          }
        `}
      >
        <div className="flex items-center">
          <div
            className={`
              bg-white/10
              rounded-lg
              border border-white/20
              flex items-center justify-center
              text-[10px] text-blue-200
              text-center p-1
              transition-all duration-500
              ${
                scrolled
                  ? 'w-[85px] h-[55px] scale-90'
                  : 'w-[103px] h-[65px]'
              }
            `}
          >
            Logo 103x85
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-5 lg:gap-8 text-xs lg:text-sm font-medium tracking-wide">
          {[
            ['#quem-somos', 'QUEM SOMOS'],
            ['#estudio', 'ESTÚDIO ADÁGIO'],
            ['#artesanato', 'ARTESANATO'],
            ['#agricultura', 'AGRICULTURA FAMILIAR'],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="
                relative group
                hover:text-blue-300
                transition-colors duration-300
                whitespace-nowrap
              "
            >
              {label}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-300 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <button
          className="
            bg-white text-[#0b1b3d]
            px-5 lg:px-7 py-2.5
            rounded-full
            font-semibold text-xs lg:text-sm
            hover:bg-gray-100
            hover:-translate-y-1
            hover:shadow-xl
            transition-all duration-300
            shadow-md cursor-pointer whitespace-nowrap
          "
        >
          COMO DOAR?
        </button>
      </header>

      {/* HERO */}
      <main
        className="
          max-w-7xl mx-auto
          px-4 sm:px-6 lg:px-8
          min-h-[clamp(560px,72vh,760px)]
          flex items-center
        "
      >
        <div
          className="
            w-full
            grid grid-cols-1 md:grid-cols-2
            gap-8 lg:gap-14 xl:gap-20
            items-center
            py-[clamp(3rem,7vh,5rem)]
          "
        >
          <div
            className={`
              space-y-5
              transition-all duration-1000
              ease-[cubic-bezier(0.22,1,0.36,1)]
              ${
                loaded
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-10'
              }
            `}
          >
            <h1 className="font-bold tracking-tight leading-[0.98] text-[clamp(2.5rem,4.5vw,4.5rem)]">
              ASSOCIAÇÃO
              <br />
              JOÃO MARIA
            </h1>

            <p className="text-[clamp(1rem,1.4vw,1.25rem)] text-blue-100 font-roboto font-light leading-relaxed max-w-xl mx-auto md:mx-0">
              Unindo pessoas, transformando vidas e fortalecendo nossa
              comunidade.
            </p>
          </div>

          <div
            className={`
              relative w-full
              flex justify-center md:justify-end
              transition-all duration-1000
              ease-[cubic-bezier(0.22,1,0.36,1)]
              ${
                loaded
                  ? 'opacity-100 translate-x-0 scale-100'
                  : 'opacity-0 translate-x-10 scale-95'
              }
            `}
          >
            <div
              className="
                w-full max-w-[580px]
                h-[clamp(260px,34vh,420px)]
                bg-blue-900/40
                rounded-[clamp(1.5rem,2vw,2rem)]
                border border-blue-800
                flex items-center justify-center
                overflow-hidden
                shadow-2xl
                transition-all duration-500
                hover:scale-[1.02]
                hover:shadow-blue-900/30
              "
            >
              <span className="text-blue-300 text-[clamp(0.75rem,1vw,0.95rem)] font-roboto px-4 text-center">
                Placeholder da Imagem (Estúdio Adágio)
              </span>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}