import { Link } from "react-router-dom";

const VALUE_PROPS = [
  {
    title: "Self-guided resources",
    description: "Meditations, sleep support, and focus tools for everyday moments.",
    icon: (
      <path d="M12 3a5 5 0 015 5v3a5 5 0 01-10 0V8a5 5 0 015-5z" />
    ),
  },
  {
    title: "Verified providers",
    description: "Licensed therapists and psychiatrists, online or in-person.",
    icon: (
      <>
        <path d="M12 2a4 4 0 014 4v3a4 4 0 01-8 0V6a4 4 0 014-4z" />
        <path d="M5 20c1.5-3.5 4.5-5 7-5s5.5 1.5 7 5" />
      </>
    ),
  },
  {
    title: "Private & confidential",
    description: "Your identity and clinical records are kept separate and secure.",
    icon: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 018 0v3" />
      </>
    ),
  },
];

export default function VisitPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-9">
      <span className="inline-block rounded-full bg-clinical-teal-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-clinical-teal-dark">
        Pakistan's National Mental Health Platform
      </span>

      <h1 className="font-clinical-heading mt-4 text-3xl font-bold leading-tight text-clinical-ink">
        You don't have to carry this alone.
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-clinical-ink-soft">
        Confidential meditations, licensed therapy, and psychiatry — online or in person, in
        English or Urdu.
      </p>

      <Link
        to="/app/register"
        className="font-clinical-heading mt-5 block rounded-full bg-clinical-amber px-5 py-3.5 text-center text-sm font-bold text-clinical-ink hover:bg-clinical-amber-dark"
      >
        Get started
      </Link>
      <Link
        to="/app/login"
        className="mt-3.5 block text-center text-sm font-semibold text-clinical-teal-dark"
      >
        Already have an account? Log in
      </Link>

      <div className="mt-7 flex flex-col gap-4">
        {VALUE_PROPS.map((prop) => (
          <div
            key={prop.title}
            className="flex items-start gap-3.5 rounded-2xl border border-clinical-border bg-clinical-surface p-4"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0 text-clinical-teal-dark"
            >
              {prop.icon}
            </svg>
            <div>
              <h3 className="font-clinical-heading text-sm font-bold text-clinical-ink">
                {prop.title}
              </h3>
              <p className="mt-1 text-xs text-clinical-ink-soft">{prop.description}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-clinical-ink-soft">
        Free resources · Licensed therapy &amp; psychiatry · Available in English and Urdu
      </p>
    </div>
  );
}
