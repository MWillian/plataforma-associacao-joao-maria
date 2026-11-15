export function FeedbackToast({ message, type = 'success' }) {
  if (!message) return null;

  const styles = type === 'error'
    ? 'border-red-200 bg-red-50 text-red-700'
    : 'border-green-200 bg-green-50 text-green-700';

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`fixed right-4 top-4 z-[60] max-w-sm rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${styles}`}
    >
      {message}
    </div>
  );
}
