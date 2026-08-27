const SIZE_CLASSES = { sm: "h-7 w-7", md: "h-8 w-8" };
const TONE_CLASSES = {
  clinical: "border-clinical-border border-t-clinical-teal",
  neutral: "border-gray-200 border-t-ink",
};

/**
 * The bare spinning circle, with no wrapper — for embedding inline within
 * existing page content (e.g. a results list still loading). Previously
 * duplicated verbatim across CarePage, ClinicalQuizPage, DashboardPage, and
 * AdminDashboardPage's local InlineSpinner; consolidated here instead.
 */
export function Spinner({ size = "md", tone = "clinical", label = "Loading", className = "" }) {
  return (
    <div
      className={`animate-spin rounded-full border-[3px] ${SIZE_CLASSES[size]} ${TONE_CLASSES[tone]} ${className}`}
      role="status"
      aria-label={label}
    />
  );
}

/** Full-viewport centered spinner — used by route guards and page-level loading states. */
export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner />
    </div>
  );
}
