export default function Logo({ light = false, className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <circle cx="14" cy="14" r="14" className="fill-brand-orange" />
        <circle cx="10.5" cy="13" r="3.4" fill="white" />
        <circle cx="17.5" cy="13" r="3.4" fill="white" />
      </svg>
      <span className={`text-lg font-semibold ${light ? "text-white" : "text-ink"}`}>
        mindcare
      </span>
    </div>
  );
}
