export const QUIZ_NEEDS = [
  {
    id: "anxiety",
    emoji: "🌧️",
    label: "Anxiety & Panic Attacks",
    matchKeywords: ["Anxiety", "Panic", "CBT"],
  },
  {
    id: "burnout",
    emoji: "⚡",
    label: "Overwhelming Stress & Burnout",
    matchKeywords: ["Stress", "Burnout", "Mood disorders"],
  },
  {
    id: "sleep",
    emoji: "🌙",
    label: "Sleep & Insomnia Issues",
    matchKeywords: ["Sleep", "Insomnia"],
  },
  {
    id: "relationships",
    emoji: "💔",
    label: "Relationship & Family Stress",
    matchKeywords: ["Relationships", "Family", "Grief"],
  },
  {
    id: "focus",
    emoji: "🎯",
    label: "Focus & Career Clarity",
    matchKeywords: ["Focus", "Career", "ADHD"],
  },
];

export const MODALITY_OPTIONS = [
  { id: "online", emoji: "💻", label: "Online Video Call" },
  { id: "inperson", emoji: "🏥", label: "In-Person Clinic Visit" },
];

export const LANGUAGE_OPTIONS = [
  { id: "Urdu", label: "Urdu" },
  { id: "English", label: "English" },
  { id: "Both", label: "Both" },
];

export const URGENCY_OPTIONS = [
  { id: "today", emoji: "🔴", label: "Today", description: "I need to talk to someone urgently." },
  { id: "week", emoji: "🟡", label: "This Week", description: "Soon, but I can wait a few days." },
  { id: "flexible", emoji: "🟢", label: "Flexible", description: "No rush — whenever works." },
];
