export function FooterSection() {
  return (
    <footer className="bg-[#1C2126] text-white pt-16 pb-8 px-6 font-poppins border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Grid Superior */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Coluna 1: Logo e Descrição */}
          <div className="space-y-4">
            <div className="w-36 h-20 bg-white rounded-lg flex items-center justify-center p-2 shadow-md">
              <span className="text-[#0b1b3d] text-xs font-bold text-center">Logo Associação</span>
            </div>
            <p className="text-slate-300 font-roboto text-xs leading-relaxed">
              Associação Comunitária João Maria - Fortalecendo vínculos, gerando oportunidades e transformando vidas em Coruripe-AL através do artesanato e da agricultura familiar.
            </p>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 tracking-wide">
              Navegação
            </h3>
            <ul className="space-y-3 text-xs font-roboto text-slate-300">
              <li><a href="#quem-somos" className="hover:text-blue-300 transition-colors">QUEM SOMOS</a></li>
              <li><a href="#estudio" className="hover:text-blue-300 transition-colors">ESTÚDIO ADÁGIO</a></li>
              <li><a href="#artesanato" className="hover:text-blue-300 transition-colors">ARTESANATO</a></li>
              <li><a href="#agricultura" className="hover:text-blue-300 transition-colors">AGRICULTURA FAMILIAR</a></li>
            </ul>
          </div>

          {/* Coluna 3: Contatos */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 tracking-wide">
              Contatos
            </h3>
            <ul className="space-y-3 text-xs font-roboto text-slate-300 leading-relaxed">
              <li><strong className="text-white">EMAIL:</strong> contato@associacaojoaomaria.org</li>
              <li><strong className="text-white">INSTAGRAM:</strong> @associacaojoaomaria</li>
              <li><strong className="text-white">TELEFONE:</strong> (82) 99898-9898</li>
              <li><strong className="text-white">WHATSAPP:</strong> (82) 99898-9898</li>
            </ul>
          </div>

          {/* Coluna 4: Redes Sociais */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 tracking-wide">
              Redes Sociais
            </h3>
            <div className="flex items-center space-x-3">
              {/* Facebook Icon */}
              <a href="#" aria-label="Facebook" className="bg-[#3b5998] text-white p-2.5 rounded-md hover:opacity-90 transition-opacity">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* Instagram Icon */}
              <a href="#" aria-label="Instagram" className="bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white p-2.5 rounded-md hover:opacity-90 transition-opacity">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Linha Divisória */}
        <hr className="border-slate-800 mb-8" />

        {/* Rodapé Inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs font-roboto text-slate-400 gap-4 text-center md:text-left">
          <p>© 2026 Associação Comunitária João Maria. Todos os direitos reservados.</p>
          <p>Desenvolvido com carinho para a nossa comunidade.</p>
        </div>
      </div>
    </footer>
  );
}