import { Link } from "react-router-dom";

/**
 * Persistent safeguarding element required on every screen of the member
 * journey (Development Plan, Stage 1: "Crisis and safeguarding information
 * and escalation, on every screen"). Never conditionally hide this.
 */
export default function CrisisBar() {
  return (
    <div className="flex items-center gap-2 bg-clinical-crisis px-4 py-2.5 text-white">
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
      >
        <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.3 1 5.5 3 2.2-2 3.5-3 5.5-3C21 5 23.5 8.5 21.5 12.5 19 16.65 12 21 12 21z" />
      </svg>
      <span className="text-xs font-bold">Need help now?</span>
      <Link to="/app/crisis-support" className="ml-auto text-xs font-semibold underline">
        Get immediate support &rarr;
      </Link>
    </div>
  );
}
