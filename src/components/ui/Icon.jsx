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
  star: "M12 2l2.9 6 6.6.6-5 4.5 1.5 6.5L12 16.5 6 19.6 7.5 13.1l-5-4.5 6.6-.6L12 2z",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  play: "M7 5l12 7-12 7V5z",
  pause: "M7 5h4v14H7zM13 5h4v14h-4z",
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
