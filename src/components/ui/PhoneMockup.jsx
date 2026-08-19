// Tailwind needs static class names to detect them at build time, so accent
// colors are mapped explicitly rather than interpolated into a class string.
const ACCENT_CLASSES = {
  "brand-orange": "bg-brand-orange",
  "brand-blue": "bg-brand-blue",
  "brand-pink": "bg-brand-pink",
  "brand-yellow": "bg-brand-yellow",
};

export default function PhoneMockup({ accent = "brand-orange", className = "" }) {
  return (
    <div
      className={`relative aspect-9/16 w-full max-w-55 overflow-hidden rounded-lg border-4 border-ink bg-white shadow-card ${className}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1/2 ${ACCENT_CLASSES[accent]}`} />
      <div className="absolute inset-x-4 top-6 h-3 rounded-full bg-white/70" />
      <div className="absolute inset-x-4 top-12 h-3 w-2/3 rounded-full bg-white/50" />
      <div className="absolute inset-x-4 bottom-6 flex flex-col gap-3">
        <div className="h-16 rounded-2xl bg-cream" />
        <div className="h-10 rounded-2xl bg-surface" />
      </div>
    </div>
  );
}
