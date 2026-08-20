import { useEffect } from "react";

/** Auto-dismissing confirmation toast, fixed to the bottom of the viewport. */
export default function Toast({ message, show, onClose, duration = 5000 }) {
  useEffect(() => {
    if (!show) return undefined;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-pill bg-ink px-5 py-3 text-sm font-medium text-white shadow-card">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green text-[11px]">
          &#10003;
        </span>
        <span>{message}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="ml-1 text-lg leading-none text-white/60 hover:text-white"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
