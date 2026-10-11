export function DonationSection() {
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
                            <button className="bg-white text-[#0b1b3d] px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors shadow-md cursor-pointer tracking-wider">
                                Transformar vidas
                            </button>
                        </div>
                    </div>

                    {/* Coluna da Direita: Placeholder da Foto das Crianças */}
                    <div className="w-full h-72 sm:h-80 md:h-96 bg-blue-900/40 rounded-3xl border border-blue-800 flex items-center justify-center shadow-xl overflow-hidden relative p-6 text-center">
                        <span className="text-blue-300 text-sm sm:text-base font-roboto">
                            Inserir uma foto das crianças da associação
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}