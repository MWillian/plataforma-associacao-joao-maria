export function DonationSection() {
    const message = encodeURIComponent(
        'Olá, desejo obter mais informações sobre como fazer uma doação.'
    );

    return (
        <section id="doacao" className="bg-[#0b1b3d] text-white py-16 md:py-20 px-4 sm:px-6 font-poppins">
            <div className="max-w-7xl mx-auto">
                {/* Título Principal da Seção */}
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 tracking-wide max-w-4xl mx-auto leading-snug">
                    Ajude a Associação continuar a construir um futuro melhor!
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Coluna da Esquerda: Texto descritivo e Botão */}
                    <div className="space-y-6 text-center lg:text-left flex flex-col items-center">
                        <h2 className="text-blue-100 font-roboto text-2xl font-bold leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Para mais informações de como doar, envie uma mensagem para nosso Instagram ou WhatsApp. Faça parte da transformação da vida de várias famílias.
                        </h2>

                        <div className="pt-4 flex justify-center lg:justify-start">
                            <a
                                href={`https://wa.me/5582996486572?text=${message}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative inline-flex items-center justify-center overflow-hidden bg-white text-[#0b1b3d] px-8 py-3.5 rounded-full font-semibold text-sm shadow-md cursor-pointer tracking-wider transition-all duration-300 hover:bg-gray-100 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
                            >
                                <span className="relative z-10">
                                    Transformar vidas
                                </span>
                                <span className="absolute inset-0 rounded-full bg-blue-100 translate-x-[-110%] transition-transform duration-500 group-hover:translate-x-0" />
                            </a>
                        </div>
                    </div>

                    {/* Imagem de apoio à campanha de doação */}
                    <div className="relative w-full h-72 sm:h-80 md:h-96">
                        <div className="group relative h-full w-full overflow-hidden rounded-3xl border border-blue-800 bg-blue-900/40 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-500 hover:shadow-2xl">
                            <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
                            <img
                                src="/foto-doacao.jpeg"
                                alt="Integrante da associação apresentando um produto artesanal da comunidade"
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}