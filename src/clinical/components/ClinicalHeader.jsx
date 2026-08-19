import { Link } from "react-router-dom";

export default function ClinicalHeader() {
  return (
    <header className="flex items-center justify-between border-b border-clinical-border bg-clinical-surface px-4 py-3.5">
      <Link to="/app" className="flex items-center gap-2" aria-label="MindCare home">
        <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
          <circle cx="13" cy="13" r="13" className="fill-clinical-teal" />
          <path
            d="M8 14c1.5-4 3-4 4.5 0s3 4 4.5 0"
            stroke="white"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-clinical-heading text-base font-bold text-clinical-ink">
          MindCare
        </span>
      </Link>

      {/* Visual language preference for now — full Urdu translation is not
          wired up yet; see project memory for scope notes. */}
      <div className="flex rounded-full bg-clinical-teal-soft p-0.5">
        <span className="rounded-full bg-clinical-surface px-2.5 py-1 text-xs font-bold text-clinical-teal-dark">
          EN
        </span>
        <span className="px-2.5 py-1 text-xs font-semibold text-clinical-ink-soft">اردو</span>
      </div>
    </header>
  );
}
