import { Phone } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="bg-[#0b1b3d] text-white font-poppins overflow-hidden">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm border-b border-blue-950 gap-2">
        <div className="flex items-center space-x-4">
          {/* Facebook SVG */}
          <a href="#" className="hover:text-blue-300 transition-colors">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          {/* Instagram SVG */}
          <a href="#" className="hover:text-blue-300 transition-colors">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          {/* Gmail / Envelope SVG */}
          <a href="#" className="hover:text-blue-300 transition-colors">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.728v15.441h24v-15.441l-12 9.728z"/>
            </svg>
          </a>
        </div>
        <div className="flex items-center space-x-2 font-roboto">
          <Phone size={14} />
          <span>(82) 99898-9898</span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div 
            style={{ width: '103px', height: '85px' }} 
            className="bg-white/10 rounded-lg border border-white/20 flex items-center justify-center text-[10px] text-blue-200 text-center p-1"
          >
            Logo 103x85
          </div>
        </div>
        <nav className="hidden md:flex space-x-6 lg:space-x-8 text-xs lg:text-sm font-medium tracking-wide">
          <a href="#quem-somos" className="hover:text-blue-300 transition-colors">QUEM SOMOS</a>
          <a href="#estudio" className="hover:text-blue-300 transition-colors">ESTÚDIO ADÁGIO</a>
          <a href="#artesanato" className="hover:text-blue-300 transition-colors">ARTESANATO</a>
          <a href="#agricultura" className="hover:text-blue-300 transition-colors">AGRICULTURA FAMILIAR</a>
        </nav>
        <div>
          <button className="bg-white text-[#0b1b3d] px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors shadow-md cursor-pointer">
            COMO DOAR?
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-center md:text-left">
        <div className="space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            ASSOCIAÇÃO JOÃO MARIA
          </h1>
          <p className="text-base sm:text-lg text-blue-100 font-roboto font-light leading-relaxed max-w-lg mx-auto md:mx-0">
            Unindo pessoas, transformando vidas e fortalecendo nossa comunidade.
          </p>
        </div>
        <div className="relative">
          <div className="w-full h-72 sm:h-80 md:h-96 bg-blue-900/40 rounded-3xl border border-blue-800 flex items-center justify-center overflow-hidden shadow-2xl">
            <span className="text-blue-300 text-xs sm:text-sm font-roboto px-4 text-center">Placeholder da Imagem (Estúdio Adágio)</span>
          </div>
        </div>
      </main>
    </div>
  );
}