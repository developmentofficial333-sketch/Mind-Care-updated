import { useState } from "react";

export default function TopBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative bg-brand-yellow py-2 text-center text-xs font-medium text-ink">
      <span className="underline underline-offset-2">
        HSA/FSA eligible: save with one tap. Learn more
      </span>
      <button
        type="button"
        aria-label="Dismiss banner"
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/70 hover:text-ink"
      >
        ✕
      </button>
    </div>
  );
}
