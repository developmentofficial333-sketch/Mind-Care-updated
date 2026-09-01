// Pakistan is a single timezone (PKT, UTC+5) with no DST, so plain local
// Date arithmetic is used throughout rather than a timezone library — this
// would need Intl.DateTimeFormat with an explicit "Asia/Karachi" zone if
// MindCare ever serves users browsing from outside Pakistan directly.

// A 50-minute session (the "50-minute hour", the real convention this app
// already advertises — see "50 minutes" on BookPage.jsx/SessionPage.jsx)
// plus a 10-minute gap between sessions. Was 90 — that number didn't match
// any stated session length, which is why a modest availability range only
// ever produced one or two bookable slots.
const SLOT_INTERVAL_MINUTES = 60;

function pad(n) {
  return String(n).padStart(2, "0");
}

/**
 * Local Y-M-D, not UTC. Date.prototype.toISOString() converts to UTC
 * first, which silently shifts the calendar day for any non-UTC
 * timezone (local midnight in PKT/UTC+5 is still the previous day in
 * UTC) — never use toISOString() to derive an isoDate from a local
 * calendar date.
 */
export function toLocalIsoDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function dayOfWeek(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

function parseTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function formatTime(hhmm) {
  const totalMinutes = parseTime(hhmm);
  const h24 = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${pad(m)} ${period}`;
}

/**
 * Generates a day's bookable time-of-day slots from a provider's weekly
 * availability (see providerAvailability.js), in SLOT_INTERVAL_MINUTES
 * steps, formatted for display ("9:00 AM"). Excludes slots at/before `now`
 * when isoDate is today, so a provider's own hours never offer a time
 * that's already passed.
 */
export function generateOpenSlots(weekly, isoDate, { now = new Date() } = {}) {
  if (!weekly) return [];
  const ranges = weekly[String(dayOfWeek(isoDate))];
  if (!ranges?.length) return [];

  const isToday = isoDate === toLocalIsoDate(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // A Set of minute-values, not formatted strings — the provider's own
  // ranges can overlap or duplicate each other (nothing in the
  // Availability tab UI stops adding "9-5" twice, or two overlapping
  // ranges), and without deduping here that renders the same time slot
  // twice in BookPage's grid (and trips a React duplicate-key warning).
  const minutes = new Set();
  for (const range of ranges) {
    const start = parseTime(range.start);
    const end = parseTime(range.end);
    for (let t = start; t + SLOT_INTERVAL_MINUTES <= end; t += SLOT_INTERVAL_MINUTES) {
      if (isToday && t <= nowMinutes) continue;
      minutes.add(t);
    }
  }
  return [...minutes]
    .sort((a, b) => a - b)
    .map((t) => formatTime(`${pad(Math.floor(t / 60))}:${pad(t % 60)}`));
}
