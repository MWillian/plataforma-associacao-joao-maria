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
      <div
        className="
          max-w-7xl mx-auto
          px-4 sm:px-6 lg:px-8
          min-h-[clamp(480px,60vh,680px)]
          flex items-center
        "
      >
        <div
          className="
            w-full
            grid grid-cols-1 md:grid-cols-2
            gap-8 lg:gap-14 xl:gap-20
            items-center
            py-[clamp(2rem,4vh,3rem)]
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
            className="relative h-[clamp(320px,42vh,500px)] w-full max-w-[640px] overflow-hidden"
          >
            <div
              className={`h-full w-full transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] delay-200 ${
                loaded
                  ? 'opacity-100 translate-x-0 scale-100'
                  : 'opacity-0 translate-x-24 scale-95'
              }`}
            >
              <img
                src="/logo-joao-maria.png"
                alt="Logo da Associação Comunitária João Maria"
                className="h-full w-full object-contain transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}