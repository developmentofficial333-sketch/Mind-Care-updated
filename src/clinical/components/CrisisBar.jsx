import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

/**
 * Persistent safeguarding element required on every screen of the member
 * journey (Development Plan, Stage 1: "Crisis and safeguarding information
 * and escalation, on every screen"). Never conditionally hide this.
 *
 * The number surfaced here is the same verified, real Pakistan mental
 * health helpline listed on CrisisSupportPage.jsx (Umang, WHO-recognized,
 * 24/7) — never hardcode a placeholder or fabricated number in a
 * crisis-safety UI, since a wrong digit here could send someone in
 * distress nowhere.
 */
const QUICK_HELPLINE = { label: "Umang mental health helpline", number: "0311-7786264" };

function HeartIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.3 1 5.5 3 2.2-2 3.5-3 5.5-3C21 5 23.5 8.5 21.5 12.5 19 16.65 12 21 12 21z" />
    </svg>
  );
}

export default function CrisisBar() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 bg-clinical-crisis px-4 py-2.5 text-white">
        <HeartIcon />
        <span className="text-xs font-bold">{t("crisisBar.headline")}</span>
        <span className="hidden text-xs text-white/80 sm:inline">{t("crisisBar.subtitle")}</span>
        <div className="ml-auto flex shrink-0 gap-2">
          <a
            href={`tel:${QUICK_HELPLINE.number.replace(/[^0-9]/g, "")}`}
            className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold hover:bg-white/25"
          >
            Call {QUICK_HELPLINE.number}
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full bg-white px-3 py-1 text-xs font-bold text-clinical-crisis hover:bg-white/90"
          >
            Chat now
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-clinical-ink/50 sm:items-center sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-t-3xl bg-white p-6 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-clinical-heading text-lg font-bold text-clinical-ink">You&apos;re not alone</h2>
            <p className="mt-1 text-sm text-clinical-ink-soft">
              Immediate, confidential support is available right now.
            </p>
            <a
              href={`tel:${QUICK_HELPLINE.number.replace(/[^0-9]/g, "")}`}
              className="font-clinical-heading mt-4 flex items-center justify-between rounded-2xl bg-clinical-crisis px-4 py-3 text-sm font-bold text-white"
            >
              Call {QUICK_HELPLINE.label}
              <span>{QUICK_HELPLINE.number}</span>
            </a>
            <Link
              to="/app/crisis-support"
              onClick={() => setOpen(false)}
              className="font-clinical-heading mt-3 block rounded-2xl border-[1.5px] border-clinical-teal py-3 text-center text-sm font-bold text-clinical-teal-dark"
            >
              See all crisis resources
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 w-full text-center text-xs font-semibold text-clinical-ink-soft"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
