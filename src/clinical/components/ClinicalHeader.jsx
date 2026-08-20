import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

export default function ClinicalHeader() {
  const { language, setLanguage } = useLanguage();

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

      <div className="flex rounded-full bg-clinical-teal-soft p-0.5">
        <button
          type="button"
          onClick={() => setLanguage("en")}
          aria-pressed={language === "en"}
          className={`rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
            language === "en"
              ? "bg-clinical-surface text-clinical-teal-dark"
              : "text-clinical-ink-soft"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage("ur")}
          aria-pressed={language === "ur"}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
            language === "ur"
              ? "bg-clinical-surface font-bold text-clinical-teal-dark"
              : "text-clinical-ink-soft"
          }`}
        >
          اردو
        </button>
      </div>
    </header>
  );
}
