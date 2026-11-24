// Estado exibido nas páginas de detalhe quando o item ainda está carregando
// ou não existe mais (link antigo, item excluído ou indisponível).
// Também serve como página de "não encontrada" para endereços desconhecidos.
export function DetailState({ isLoading, notFoundTitle, notFoundText, backLabel, onBack, onGoHome }) {
  return (
    <div className="bg-white text-slate-800 font-poppins min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md text-center space-y-4">
        {isLoading ? (
          <p className="text-slate-500 font-roboto" role="status">
            Carregando...
          </p>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1b3d]">
              {notFoundTitle}
            </h1>
            <p className="text-slate-500 font-roboto text-sm sm:text-base">
              {notFoundText}
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="rounded-full bg-[#0b1b3d] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#142D59]"
                >
                  {backLabel}
                </button>
              )}
              <button
                type="button"
                onClick={onGoHome}
                className="rounded-full border border-[#0b1b3d] px-6 py-3 text-sm font-semibold text-[#0b1b3d] transition-colors hover:bg-slate-50"
              >
                Ir para o início
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
