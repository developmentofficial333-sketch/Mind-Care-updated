import { Link } from "react-router-dom";
import { CONSENT_VERSION } from "../firebase/memberProfiles";

/**
 * Referenced by RegisterPage's consent checkbox. Real terms/privacy policy
 * copy needs to come from MindCare's legal counsel, not be authored here —
 * this is an honest outline of what the real document will cover, not a
 * substitute for actual legal review. Nothing below is a binding clause;
 * don't treat any line here as actual policy text.
 */
const SECTIONS = [
  {
    title: "What we collect",
    body: "Identity data (name, email, language preference) is kept separate from clinical data (needs, assessments, session history) — this section will explain what falls into each category and why they're split.",
  },
  {
    title: "How your data is protected",
    body: "Real architecture facts, not aspirational promises: every record is scoped so only its owner can read or write it, enforced by Firestore security rules rather than app-level checks alone.",
  },
  {
    title: "Who can see what",
    body: "Members see only their own records. A provider sees only the appointments booked with them — never a member's full profile. MindCare staff review provider applications, not member clinical content.",
  },
  {
    title: "Withdrawing consent / deleting your account",
    body: "What happens to your identity vs. clinical data on request. The request path itself isn't built yet — this section will describe it once it is.",
  },
  {
    title: "Crisis situations",
    body: "Any circumstance where information might need to be shared beyond the platform to keep someone safe. This needs explicit clinical and legal input, not a default assumption.",
  },
  {
    title: "Third-party processors",
    body: "Infrastructure providers that handle data on MindCare's behalf — currently Firebase/Google Cloud, and in future any email/SMS provider used for reminders — named by category here, not by data-sharing terms.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="font-clinical-heading text-2xl font-bold text-clinical-ink">
        Privacy Policy &amp; Terms
      </h1>
      <div className="mt-5 rounded-2xl border border-clinical-border bg-clinical-surface p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-clinical-crisis">
          Outline version {CONSENT_VERSION} — pending legal review
        </p>
        <p className="mt-2 text-sm leading-relaxed text-clinical-ink-soft">
          This page outlines what MindCare&apos;s real privacy policy and terms &amp; conditions
          will cover. The binding text itself still needs to be drafted and approved by
          MindCare&apos;s legal counsel before launch — nothing below is a substitute for that
          review.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {SECTIONS.map((section) => (
          <div key={section.title} className="border-b border-clinical-border pb-4 last:border-0">
            <h2 className="font-clinical-heading text-sm font-bold text-clinical-ink">
              {section.title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-clinical-ink-soft">{section.body}</p>
          </div>
        ))}
      </div>

      <Link to="/app" className="mt-8 inline-block text-sm font-semibold text-clinical-teal-dark underline">
        &larr; Back to MindCare
      </Link>
    </div>
  );
}
