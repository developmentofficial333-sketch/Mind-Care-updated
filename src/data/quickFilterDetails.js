/**
 * Content for the popup opened by each QuickFilters pill (QuickFilterModal).
 * `gradient` is a bright, saturated Tailwind gradient built from theme.css
 * popup-* tokens — the same hue family as the pill itself, just brightened,
 * not a muted pastel and not an unrelated dark theme.
 */
export const quickFilterDetails = {
  "Quick help": {
    gradient: "bg-gradient-to-br from-popup-orange-from to-popup-orange-to",
    icon: "sparkle",
    title: "Find calm right now",
    subtitle: "Fast, in-the-moment tools for when stress hits hard.",
    items: [
      { icon: "wind", title: "SOS breathing", description: "Quick relief when it's urgent" },
      { icon: "target", title: "Grounding exercises", description: "A 5-4-3-2-1 sensory reset" },
      { icon: "shield", title: "Crisis support", description: "Always-on safety resources" },
      { icon: "clock", title: "3-minute resets", description: "Short enough for any day" },
    ],
  },
  "Sleep soundly": {
    gradient: "bg-gradient-to-br from-popup-indigo-from to-popup-indigo-to",
    icon: "moon",
    title: "Get the sleep you deserve",
    subtitle: "Wind down with soothing sounds and sleep-focused meditations.",
    items: [
      { icon: "moon", title: "Sleepcasts", description: "Dreamy bedtime stories" },
      { icon: "headphones", title: "Soundscapes", description: "Rain, waves, and white noise" },
      { icon: "sparkle", title: "Sleep meditations", description: "Guided wind-downs" },
      { icon: "bookOpen", title: "Sleep science", description: "Learn what actually works" },
    ],
  },
  "Manage anxiety": {
    gradient: "bg-gradient-to-br from-popup-blue-from to-popup-blue-to",
    icon: "wave",
    title: "Release anxious thoughts",
    subtitle: "Learn to manage everyday anxiety, even when things get tough.",
    items: [
      { icon: "sparkle", title: "Guided meditations", description: "1,000+ sessions for anxiety" },
      { icon: "target", title: "Reframing techniques", description: "See things differently" },
      { icon: "wind", title: "Breathing exercises", description: "Calm your nervous system" },
      { icon: "bookOpen", title: "Expert-led courses", description: "Built with clinical psychologists" },
    ],
  },
  "Deep recovery": {
    gradient: "bg-gradient-to-br from-popup-green-from to-popup-green-to",
    icon: "leaf",
    title: "Recharge from the inside out",
    subtitle: "Restorative practices to help your mind and body truly recover.",
    items: [
      { icon: "heart", title: "Body scans", description: "Release tension you're holding" },
      { icon: "bookOpen", title: "Recovery courses", description: "Multi-day guided programs" },
      { icon: "leaf", title: "Gentle movement", description: "Yoga & stretch for recovery" },
      { icon: "headphones", title: "Rest soundscapes", description: "Sink into deep rest" },
    ],
  },
  "Practice meditation": {
    gradient: "bg-gradient-to-br from-popup-amber-from to-popup-amber-to",
    textClass: "text-ink",
    icon: "flower",
    title: "Make meditation a habit",
    subtitle: "Simple, guided sessions for every experience level.",
    items: [
      { icon: "flower", title: "Guided meditations", description: "1,000+ sessions, any length" },
      { icon: "target", title: "Beginner courses", description: "Start from zero" },
      { icon: "clock", title: "Daily reminders", description: "Build a consistent habit" },
      { icon: "users", title: "Themed collections", description: "Focus, calm, gratitude & more" },
    ],
  },
  "Daily clarity": {
    gradient: "bg-gradient-to-br from-popup-pink-from to-popup-pink-to",
    icon: "chat",
    title: "Meet Ebb, your AI companion",
    subtitle: "Talk through what's on your mind, anytime you need to.",
    items: [
      { icon: "heart", title: "Explore your emotions", description: "Process what's weighing on you" },
      { icon: "sparkle", title: "Personalized suggestions", description: "Picked for how you're feeling" },
      { icon: "clock", title: "Available 24/7", description: "Anytime, anywhere" },
      { icon: "shield", title: "Private & secure", description: "Built with clinical safety in mind" },
    ],
  },
};
