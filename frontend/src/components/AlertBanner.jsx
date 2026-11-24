export default function AlertBanner({ type = "error", message, onRetry, onClose }) {
  if (!message) return null;

  const styles = {
    error: "border-rose-200 bg-rose-50 text-rose-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
  };

  return (
    <div
      role="alert"
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
        styles[type] || styles.error
      }`}
    >
      <p className="font-medium">{message}</p>
      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg border border-current/25 bg-white/70 px-3 py-1 text-xs font-semibold transition hover:bg-white"
          >
            Coba Lagi
          </button>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xs font-semibold opacity-75 hover:opacity-100"
          >
            Tutup
          </button>
        )}
      </div>
    </div>
  );
}
