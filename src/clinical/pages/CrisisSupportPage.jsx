import { Link } from "react-router-dom";

/**
 * Reached from CrisisBar on every screen. Numbers below are real, public
 * Pakistan emergency/mental-health helplines (verified via web search,
 * August 2026) — not fabricated. Per the Development Plan (Stage 0:
 * "Clinical governance requirements... defined with your clinical team"),
 * this list should still be reviewed and formally signed off by MindCare's
 * clinical governance lead before launch, since that's who owns clinical
 * safety content — but it's real information now, not placeholder text.
 */
const RESOURCES = [
  {
    label: "Police emergency",
    number: "15",
    description: "Crime, threats, or urgent law enforcement help, anywhere in Pakistan.",
  },
  {
    label: "Rescue 1122",
    number: "1122",
    description: "Medical emergencies, accidents, fire, or disaster response.",
  },
  {
    label: "Umang mental health helpline",
    number: "0311-7786264",
    description:
      "Pakistan's first 24/7 mental health helpline — free, confidential, staffed by clinical psychologists and therapists. WHO-recognized.",
  },
  {
    label: "National Youth Helpline",
    number: "0800-69457",
    description: "HEC/UNFPA-backed helpline focused on youth mental health and suicide prevention.",
  },
];

export default function CrisisSupportPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="font-clinical-heading text-2xl font-bold text-clinical-ink">
        You're not alone. Help is available right now.
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-clinical-ink-soft">
        If you or someone you know is in immediate danger, please contact emergency services or
        one of the resources below. Emergency numbers work from any phone, even without a SIM or
        balance.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {RESOURCES.map((resource) => (
          <a
            key={resource.label}
            href={`tel:${resource.number.replace(/[^0-9]/g, "")}`}
            className="block rounded-2xl border border-clinical-border bg-clinical-surface p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-clinical-heading text-sm font-bold text-clinical-ink">
                {resource.label}
              </span>
              <span className="font-clinical-heading text-base font-extrabold text-clinical-crisis">
                {resource.number}
              </span>
            </div>
            <p className="mt-1 text-xs text-clinical-ink-soft">{resource.description}</p>
          </a>
        ))}
      </div>

      <p className="mt-6 text-xs text-clinical-ink-soft">
        These are real, publicly listed services, current as of August 2026. MindCare&apos;s
        clinical governance lead should still review and formally confirm this list before launch.
      </p>

      <Link to="/app" className="mt-8 inline-block text-sm font-semibold text-clinical-teal-dark underline">
        &larr; Back to MindCare
      </Link>
    </div>
  );
}
