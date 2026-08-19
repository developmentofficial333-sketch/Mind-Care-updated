import { Link } from "react-router-dom";

/**
 * Referenced by RegisterPage's consent checkbox. Real terms/privacy policy
 * copy needs to come from MindCare's legal counsel, not be authored here —
 * this is an honest placeholder so the checkbox doesn't point at a dead
 * link, not a substitute for actual legal review.
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="font-clinical-heading text-2xl font-bold text-clinical-ink">
        Privacy Policy &amp; Terms
      </h1>
      <div className="mt-5 rounded-2xl border border-clinical-border bg-clinical-surface p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-clinical-crisis">
          Placeholder — pending legal review
        </p>
        <p className="mt-2 text-sm leading-relaxed text-clinical-ink-soft">
          This page is a placeholder. Real privacy policy and terms &amp; conditions text needs to
          be drafted and approved by MindCare&apos;s legal counsel before launch — it isn&apos;t
          something to generate automatically, since it&apos;s a binding document covering how
          identity and clinical data are collected, stored, and shared.
        </p>
      </div>
      <Link to="/app" className="mt-8 inline-block text-sm font-semibold text-clinical-teal-dark underline">
        &larr; Back to MindCare
      </Link>
    </div>
  );
}
