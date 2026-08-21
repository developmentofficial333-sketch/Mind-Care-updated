export const disciplines = [
  "Clinical Psychologist",
  "Psychiatrist",
  "Counsellor / Therapist",
  "Psychiatric Nurse",
  "Other licensed mental health professional",
];

export const languageOptions = ["English", "Urdu", "Punjabi", "Pashto", "Sindhi", "Other"];

// Kept in the exact same vocabulary as QUIZ_NEEDS' matchKeywords
// (clinical/data/quiz.js) — the member-facing matching quiz scores a
// provider by keyword overlap between what a member is looking for and
// this list, so a provider's chosen concerns must speak the same language
// as the quiz or they'll never surface as a match.
export const concernOptions = [
  "Anxiety",
  "Panic",
  "CBT",
  "Mood disorders",
  "Stress",
  "Burnout",
  "Relationships",
  "Family",
  "Grief",
  "Sleep",
  "Insomnia",
  "Focus",
  "ADHD",
];
