import { useEffect, useState } from 'react';

export function FeedbackToast({ message, type = 'success', duration = 7000 }) {
  const [hiddenMessage, setHiddenMessage] = useState(null);

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setHiddenMessage(message);
    }, duration);

    return () => window.clearTimeout(timeoutId);
  }, [message, duration]);

  if (!message || hiddenMessage === message) return null;

  const styles = type === 'error'
    ? 'border-red-200 bg-red-50 text-red-700'
    : 'border-green-200 bg-green-50 text-green-700';

  return (
    // Fica no canto inferior para não cobrir os botões do cabeçalho das telas,
    // e pode ser fechado antes de sumir sozinho.
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`fixed bottom-4 right-4 z-[60] flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${styles}`}
    >
      <span className="min-w-0 wrap-anywhere">{message}</span>
      <button
        type="button"
        onClick={() => setHiddenMessage(message)}
        aria-label="Fechar aviso"
        className="-mr-1 shrink-0 rounded px-1 leading-none opacity-70 transition hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
