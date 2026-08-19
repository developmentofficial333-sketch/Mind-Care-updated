/**
 * PLACEHOLDER provider directory. There is no real provider-onboarding
 * pipeline yet (providers must be credential-verified before launch, per
 * the plan's clinical safety requirements — see the "For Providers"
 * discussion in project notes), so this is fictional data to unblock
 * building the member-facing browsing/booking UI. Replace with a real
 * Firestore-backed `providers` collection once verified provider records
 * exist. The filter fields (discipline, concerns, languages, location,
 * feeAmount) are real and drive genuinely functional filtering in
 * CarePage.jsx — only the underlying provider data itself is fictional.
 */
export const providers = [
  {
    id: "sara-nadeem",
    initials: "SN",
    name: "Dr. Sara Nadeem",
    credentials: "Clinical Psychologist",
    discipline: "Psychologist",
    concerns: ["Anxiety", "CBT"],
    languages: ["English", "Urdu"],
    location: "Karachi",
    rating: 4.9,
    fee: "Rs 3,500 / session",
    feeAmount: 3500,
  },
  {
    id: "bilal-ahmed",
    initials: "BA",
    name: "Dr. Bilal Ahmed",
    credentials: "Psychiatrist",
    discipline: "Psychiatrist",
    concerns: ["Mood disorders"],
    languages: ["English", "Urdu"],
    location: "Lahore",
    rating: 4.8,
    fee: "Rs 4,000 / session",
    feeAmount: 4000,
  },
  {
    id: "hina-raza",
    initials: "HR",
    name: "Hina Raza, LPC",
    credentials: "Counsellor",
    discipline: "Counsellor",
    concerns: ["Relationships", "Grief"],
    languages: ["English"],
    location: "Islamabad",
    rating: 5.0,
    fee: "Rs 2,800 / session",
    feeAmount: 2800,
  },
];
