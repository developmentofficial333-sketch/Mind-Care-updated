import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../ui/Icon";
import { quickFilters } from "../../data/quickFilters";
import { quickFilterDetails } from "../../data/quickFilterDetails";

const LABELS = quickFilters.map((filter) => filter.label);
const SWITCH_MS = 220;

export default function QuickFilterModal({ label, onClose }) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    if (label) setActiveIndex(LABELS.indexOf(label));
  }, [label]);

  useEffect(() => {
    if (!label) return undefined;
    function handleKey(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, onClose]);

  if (!label) return null;

  const detail = quickFilterDetails[LABELS[activeIndex]];

  function go(delta) {
    setSwitching(true);
    window.setTimeout(() => {
      setActiveIndex((i) => (i + delta + LABELS.length) % LABELS.length);
      setSwitching(false);
    }, SWITCH_MS);
  }

  const isDark = detail.textClass !== "text-ink";
  const textClass = detail.textClass ?? "text-white";
  const subtleTextClass = isDark ? "text-white/80" : "text-ink/70";
  const mutedTextClass = isDark ? "text-white/65" : "text-ink/60";
  const cardClass = isDark ? "border-white/25 bg-white/15" : "border-black/10 bg-black/10";
  const badgeClass = isDark ? "bg-white/25" : "bg-black/10";
  const controlClass = isDark ? "bg-white/20 text-white hover:bg-white/30" : "bg-black/10 text-ink hover:bg-black/20";

  function handleCta() {
    onClose();
    navigate("/app/identify-need");
  }

  function handleControlClick(event, action) {
    event.stopPropagation();
    action();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={detail.title}
      onClick={onClose}
    >
      <div
        className={`relative flex h-[85vh] w-[85vw] max-w-6xl flex-col overflow-hidden rounded-3xl shadow-2xl transition-opacity duration-200 md:flex-row ${detail.gradient} ${textClass} ${
          switching ? "opacity-0" : "opacity-100"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors md:right-6 md:top-6 ${controlClass}`}
        >
          <Icon name="plus" className="h-4 w-4 rotate-45" />
        </button>

        <button
          type="button"
          onClick={(event) => handleControlClick(event, () => go(-1))}
          aria-label="Previous"
          className={`absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition-colors ${controlClass}`}
        >
          <Icon name="chevronLeft" className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={(event) => handleControlClick(event, () => go(1))}
          aria-label="Next"
          className={`absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition-colors ${controlClass}`}
        >
          <Icon name="chevronRight" className="h-5 w-5" />
        </button>

        <div
          className="relative flex h-40 shrink-0 items-center justify-center overflow-hidden md:h-auto md:w-2/5"
          style={{ background: "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.32), transparent 70%)" }}
        >
          <span className={`flex h-24 w-24 items-center justify-center rounded-full border border-white/40 md:h-32 md:w-32 ${badgeClass}`}>
            <Icon name={detail.icon} className={`h-12 w-12 md:h-16 md:w-16 ${textClass}`} />
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-8 pt-8 md:flex md:flex-col md:justify-center md:px-14 md:pt-10">
            <h3 className="text-2xl font-semibold md:text-4xl">{detail.title}</h3>
            <p className={`mt-3 max-w-md text-sm md:text-base ${subtleTextClass}`}>{detail.subtitle}</p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-10 md:gap-4">
              {detail.items.map((item) => (
                <div key={item.title} className={`flex items-start gap-3 rounded-xl border p-4 backdrop-blur-sm md:p-5 ${cardClass}`}>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${badgeClass}`}>
                    <Icon name={item.icon} className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className={`mt-0.5 text-xs ${mutedTextClass}`}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-4 px-8 py-6 md:flex-row md:items-center md:justify-between md:px-14 md:py-8">
            <button
              type="button"
              onClick={handleCta}
              className="w-full rounded-pill border-2 border-white bg-brand-orange py-4 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-transform hover:scale-[1.02] hover:bg-brand-orange-dark md:w-auto md:px-12"
            >
              Try for free
            </button>

            <div className="flex items-center justify-center gap-2 md:justify-end">
              {LABELS.map((l, i) => (
                <button
                  key={l}
                  type="button"
                  aria-label={`Go to ${l}`}
                  onClick={(event) =>
                    handleControlClick(event, () => {
                      setSwitching(true);
                      window.setTimeout(() => {
                        setActiveIndex(i);
                        setSwitching(false);
                      }, SWITCH_MS);
                    })
                  }
                  className={`h-2 rounded-pill transition-all ${
                    i === activeIndex ? "w-6 bg-current" : `w-2 ${isDark ? "bg-white/40" : "bg-black/25"}`
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
