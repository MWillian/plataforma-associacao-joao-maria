import { useEffect, useState } from 'react';

export function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setLoaded(true);
    });
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <section className="bg-[#0b1b3d] text-white font-poppins overflow-hidden">
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
              ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}
            `}
          >
            <h1 className="font-bold tracking-tight leading-[0.98] text-[clamp(2.5rem,4.5vw,4.5rem)]">
              ASSOCIAÇÃO
              <br />
              JOÃO MARIA
            </h1>

            <p className="text-[clamp(1rem,1.4vw,1.25rem)] text-blue-100 font-roboto font-light leading-relaxed max-w-xl mx-auto md:mx-0">
              Unindo pessoas, transformando vidas e fortalecendo nossa comunidade.
            </p>
          </div>

          <div
            className={`
              relative w-full
              flex justify-center md:justify-end
              transition-all duration-1000
              ease-[cubic-bezier(0.22,1,0.36,1)]
              ${loaded ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-10 scale-95'}
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