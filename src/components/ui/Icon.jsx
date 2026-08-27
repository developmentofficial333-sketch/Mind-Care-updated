const PATHS = {
  sparkle: "M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z",
  moon: "M20 14.5A8.5 8.5 0 119.5 4a7 7 0 1010.5 10.5z",
  wave: "M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0M2 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0",
  leaf: "M5 21c9-1 14-6 15-15-9 1-14 6-15 15zM5 21c1-4 3-7 6-9",
  flower:
    "M12 8a3 3 0 100 6 3 3 0 000-6zM12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1",
  chat: "M4 5h16v11H8l-4 4V5z",
  chevronDown: "M6 9l6 6 6-6",
  chevronRight: "M9 6l6 6-6 6",
  chevronLeft: "M15 6l-6 6 6 6",
  star: "M12 2l2.9 6 6.6.6-5 4.5 1.5 6.5L12 16.5 6 19.6 7.5 13.1l-5-4.5 6.6-.6L12 2z",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  play: "M7 5l12 7-12 7V5z",
  pause: "M7 5h4v14H7zM13 5h4v14h-4z",
  shield: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z",
  clock: "M12 7v5l3.5 2M12 21a9 9 0 100-18 9 9 0 000 18z",
  heart: "M12 20s-7-4.35-9.5-8.5C.5 8 3 4.5 6.5 4.5c2 0 3.3 1 5.5 3 2.2-2 3.5-3 5.5-3C21 4.5 23.5 8 21.5 11.5 19 15.65 12 20 12 20z",
  users: "M17 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  wind: "M3 8h11a3 3 0 100-6M3 16h15a3 3 0 110 6M3 12h9",
  headphones: "M4 14v-3a8 8 0 0116 0v3M2 14a2 2 0 012-2h1a2 2 0 012 2v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3zM17 14a2 2 0 012-2h1a2 2 0 012 2v3a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3z",
  bookOpen: "M12 6c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13c-3-.5-6 0-8 1.5zM12 6v13",
  target: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 16a4 4 0 100-8 4 4 0 000 8zM12 13a1 1 0 100-2 1 1 0 000 2z",
};

const FILLED = new Set(["play", "pause"]);

export default function Icon({ name, className = "w-5 h-5", strokeWidth = 1.8 }) {
  const path = PATHS[name];
  if (!path) return null;

  const isFilled = FILLED.has(name);

  return (
    <svg
      viewBox="0 0 24 24"
      fill={isFilled ? "currentColor" : "none"}
      stroke={isFilled ? "none" : "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}
