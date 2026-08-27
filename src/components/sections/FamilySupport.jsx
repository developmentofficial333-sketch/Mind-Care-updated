import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

const TRUST_POINTS = [
  { icon: "chat", text: "Sessions in Urdu & English" },
  { icon: "users", text: "Therapists who understand your culture" },
  { icon: "shield", text: "Private, judgment-free care" },
  { icon: "heart", text: "Plans for the whole family" },
];

const BORDER_COLORS = ["#f4793b", "#ffc738", "#5da88f", "#1c6dd0", "#f5b8cb"];

function TruckArtBorder({ flip = false }) {
  const triangles = Array.from({ length: 20 });
  return (
    <svg
      viewBox="0 0 400 14"
      preserveAspectRatio="none"
      className={`h-3.5 w-full ${flip ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      {triangles.map((_, i) => (
        <polygon
          key={i}
          points={`${i * 20},0 ${i * 20 + 20},0 ${i * 20 + 10},14`}
          fill={BORDER_COLORS[i % BORDER_COLORS.length]}
          opacity="0.85"
        />
      ))}
    </svg>
  );
}

function FamilyIllustration() {
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-border bg-gradient-to-b from-cream-soft to-cream shadow-card">
      <TruckArtBorder />

      <svg viewBox="0 70 400 250" className="h-auto w-full" role="img" aria-label="An illustration of a family relaxing together at home">
        {/* soft crescent + star, a quiet nod to home */}
        <g opacity="0.5">
          <path d="M352 108a16 16 0 1 0 4 20 12 12 0 1 1-4-20z" fill="#5da88f" />
          <path d="M368 100l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#5da88f" />
        </g>

        {/* potted plant */}
        <g>
          <path d="M52 210c-10-18-2-34 6-40 3 14 2 26-6 40z" fill="#5da88f" />
          <path d="M58 206c4-20 18-30 28-30-2 16-10 28-28 30z" fill="#7fbfa1" />
          <rect x="46" y="208" width="26" height="20" rx="4" fill="#e35f1e" />
          <rect x="46" y="208" width="26" height="6" rx="3" fill="#f4793b" />
        </g>

        {/* rug */}
        <ellipse cx="205" cy="272" rx="168" ry="34" fill="#f4793b" opacity="0.18" />
        <ellipse cx="205" cy="268" rx="132" ry="26" fill="#5da88f" opacity="0.22" />
        <ellipse cx="205" cy="264" rx="96" ry="18" fill="#fbf1e5" />

        {/* low table with chai */}
        <rect x="178" y="232" width="56" height="14" rx="4" fill="#8b5e34" />
        <rect x="184" y="244" width="8" height="16" fill="#6f4726" />
        <rect x="220" y="244" width="8" height="16" fill="#6f4726" />
        <g>
          <path d="M188 214c1-4 6-4 7 0s-2 5-2 8h-3c0-3-3-4-2-8z" fill="#c9c9c9" opacity="0.6" />
          <rect x="184" y="222" width="14" height="11" rx="3" fill="#fdf8f1" />
          <rect x="185.5" y="225" width="11" height="6" rx="2" fill="#c78a3d" />
        </g>
        <g>
          <path d="M214 214c1-4 6-4 7 0s-2 5-2 8h-3c0-3-3-4-2-8z" fill="#c9c9c9" opacity="0.6" />
          <rect x="210" y="222" width="14" height="11" rx="3" fill="#fdf8f1" />
          <rect x="211.5" y="225" width="11" height="6" rx="2" fill="#c78a3d" />
        </g>

        {/* dad */}
        <path d="M96 268c-4-30 10-56 40-56s44 26 40 56z" fill="#124a94" />
        <circle cx="136" cy="196" r="22" fill="#c68a5c" />
        <path d="M114 190a22 22 0 0 1 44 0c-8-6-36-6-44 0z" fill="#2b2622" />
        <path d="M104 244c6-8 14-12 14-12" stroke="#124a94" strokeWidth="10" strokeLinecap="round" fill="none" />

        {/* mum */}
        <path d="M264 268c-4-30 10-56 40-56s44 26 40 56z" fill="#e35f1e" />
        <circle cx="304" cy="196" r="22" fill="#d9a06b" />
        <path d="M282 184c4-16 40-16 44 0 4 10-2 20-2 20-6-10-34-10-40 0 0 0-6-10-2-20z" fill="#f5b8cb" />
        <path d="M323 202c8 8 13 20 13 30" stroke="#f5b8cb" strokeWidth="9" strokeLinecap="round" fill="none" />

        {/* child, arms up */}
        <path d="M172 268c-3-22 7-40 28-40s31 18 28 40z" fill="#ffc738" />
        <circle cx="200" cy="216" r="16" fill="#e0a874" />
        <path d="M184 210a16 16 0 0 1 32 0c-6-5-26-5-32 0z" fill="#3a2f26" />
        <path d="M182 232c-6-8-8-16-6-20M218 232c6-8 8-16 6-20" stroke="#ffc738" strokeWidth="8" strokeLinecap="round" fill="none" />
      </svg>

      <TruckArtBorder flip />
    </div>
  );
}

export default function FamilySupport() {
  return (
    <section className="bg-white py-16">
      <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <div className="order-2 flex justify-center md:order-1">
          <FamilyIllustration />
        </div>

        <div className="order-1 text-center md:order-2 md:text-left">
          <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Built for Pakistani families
          </h2>
          <p className="mt-4 max-w-md text-base text-ink-soft md:mx-0 mx-auto">
            Mental health support that speaks your language and understands your home —
            for parents, kids, and everyone in between.
          </p>

          <ul className="mt-6 flex flex-col gap-3">
            {TRUST_POINTS.map((point) => (
              <li key={point.text} className="flex items-center justify-center gap-3 md:justify-start">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-ink">
                  <Icon name={point.icon} className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-ink">{point.text}</span>
              </li>
            ))}
          </ul>

          <Button as={Link} to="/app/register" variant="primary" className="mt-8">
            Start your family's journey
          </Button>
        </div>
      </Container>
    </section>
  );
}
