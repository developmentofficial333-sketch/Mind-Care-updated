import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import PhoneMockup from "../ui/PhoneMockup";
import { useLanguage } from "../../hooks/useLanguage";

const RING_CIRCUMFERENCE = 2 * Math.PI * 34;

// Rotates through the hero's opening word — "all with mindcare" always
// follows as the fixed second line, matching Headspace's own rotating
// headline pattern ("Feel less anxious / all with Headspace", etc.). The
// rotating word reads as a smaller lead-in (h2-scale); "all with mindcare"
// stays the larger, fixed headline (h1-scale) underneath it.
const HEADLINE_WORDS = ["Stress less", "Sleep better", "Feel calmer", "Ease anxiety", "Improve focus"];
const ENTER_MS = 600;
const HOLD_MS = 1900;
const EXIT_MS = 450;

function RotatingHeadline() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("enter");

  useEffect(() => {
    const toHold = setTimeout(() => setPhase("hold"), ENTER_MS);
    const toExit = setTimeout(() => setPhase("exit"), ENTER_MS + HOLD_MS);
    const toNext = setTimeout(() => {
      setIndex((i) => (i + 1) % HEADLINE_WORDS.length);
      setPhase("enter");
    }, ENTER_MS + HOLD_MS + EXIT_MS);
    return () => {
      clearTimeout(toHold);
      clearTimeout(toExit);
      clearTimeout(toNext);
    };
  }, [index]);

  return (
    <span className="flex flex-col items-center">
      <span
        className={`inline-block text-3xl font-semibold text-brand-orange sm:text-4xl md:text-5xl ${
          phase === "exit" ? "animate-headline-out" : "animate-headline-in"
        }`}
      >
        {HEADLINE_WORDS[index]}
      </span>
      <span className="-mt-1 text-6xl font-bold leading-[1.05] tracking-tight text-ink sm:text-7xl md:text-8xl">
        all with mindcare
      </span>
    </span>
  );
}

// Modern "gradient orb" decoration for the hero cards: a glossy, layered
// sphere (soft blurred halo + gradient fill + glass highlight) with a
// minimal calm face, rather than a flat sticker-style icon. Motion is
// layered on two nested elements — an outer drift (animate-float) and an
// inner breathing scale-pulse — since a single element can't run two
// independent transform animations at once.
function FaceOrb({ from, to, face, className, floatDelay, floatDuration, breatheDelay }) {
  const gradientId = useId();
  return (
    <span
      aria-hidden="true"
      className={`animate-float pointer-events-none absolute ${className}`}
      style={{ animationDelay: floatDelay, animationDuration: floatDuration }}
    >
      <span className="animate-orb-breathe block h-full w-full" style={{ animationDelay: breatheDelay }}>
        <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible">
          <defs>
            <radialGradient id={gradientId} cx="35%" cy="28%" r="80%">
              <stop offset="0%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="27" fill={to} opacity="0.35" className="blur-md" />
          <circle cx="32" cy="32" r="23" fill={`url(#${gradientId})`} />
          <ellipse cx="24" cy="21" rx="8" ry="5" fill="white" opacity="0.4" transform="rotate(-24 24 21)" />
          <path d="M20 30c1.5-3 5.5-3 7 0M32 30c1.5-3 5.5-3 7 0" stroke={face} strokeWidth="2.3" strokeLinecap="round" fill="none" />
          <path d="M21 37c3.5 4.5 12.5 4.5 16 0" stroke={face} strokeWidth="2.3" strokeLinecap="round" fill="none" />
        </svg>
      </span>
    </span>
  );
}

// Soft blurred gradient blobs used purely for atmosphere alongside FaceOrb —
// the layered gradient-mesh look modern product sites use behind hero content.
function GlowOrb({ from, to, className, delay, duration }) {
  return (
    <span
      aria-hidden="true"
      className={`animate-float pointer-events-none absolute rounded-full opacity-40 blur-xl ${className}`}
      style={{
        background: `radial-gradient(circle at 35% 30%, ${from}, ${to})`,
        animationDelay: delay,
        animationDuration: duration,
      }}
    />
  );
}

function MeditationPreview() {
  return (
    <div className="flex h-full flex-col items-center justify-between bg-gradient-to-b from-brand-orange to-brand-orange-dark px-4 pb-6 pt-8 text-white">
      <div className="flex flex-col items-center gap-2">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80" aria-hidden="true">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="6" />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#fff"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE * (1 - 0.68)}
            />
          </svg>
          <span className="absolute text-sm font-semibold">68%</span>
        </div>
        <p className="text-sm font-semibold">Daily Calmer &bull; 10 mins</p>
        <p className="text-[11px] text-white/75">Guided meditation</p>
      </div>

      <button type="button" aria-label="Play daily meditation" className="group relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-orange-dark shadow-card transition-transform duration-200 group-hover:scale-110">
          <Icon name="play" className="h-5 w-5 translate-x-0.5" />
        </span>
      </button>
    </div>
  );
}

function DoctorPreview() {
  return (
    <div className="flex h-full flex-col items-center justify-between bg-white px-4 pb-6 pt-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue text-lg font-semibold text-white">
          AK
        </div>
        <p className="text-sm font-semibold text-ink">Dr. Ayesha Khan</p>
        <span className="rounded-pill bg-surface px-3 py-1 text-[11px] font-medium text-ink-soft">
          Anxiety &amp; CBT
        </span>
        <span className="inline-flex items-center gap-1 rounded-pill bg-brand-yellow-soft px-2.5 py-1 text-[11px] font-semibold text-ink">
          <Icon name="star" className="h-3 w-3 text-brand-orange-dark" /> 4.9
        </span>
      </div>
      <Button as={Link} to="/app/identify-need" variant="primary" className="w-full text-xs">
        Check Coverage
      </Button>
    </div>
  );
}

export default function Hero() {
  const { language, t } = useLanguage();

  return (
    <section id="top" className="bg-cream pb-16 pt-14">
      <Container className="flex flex-col items-center text-center">
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-ink md:text-6xl">
          {language === "ur" ? t("hero.headline") : <RotatingHeadline />}
        </h1>
      </Container>

      <Container className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="relative flex flex-col items-center gap-6 rounded-lg bg-surface p-8 text-center md:flex-row md:text-left">
          <GlowOrb from="#f5b8cb" to="#f4793b" className="-bottom-8 -left-8 h-24 w-24" delay="0.8s" duration="7s" />
          <FaceOrb
            from="#ffc738"
            to="#f4793b"
            face="#a8410f"
            className="-right-5 -top-5 h-16 w-16"
            floatDelay="0s"
            floatDuration="6s"
            breatheDelay="0s"
          />

          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-ink">Mental health app</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Expert-led meditations and tools for a calmer mind.
            </p>
            <Button as={Link} to="/app/register" variant="primary" className="mt-5">
              Try for $0
            </Button>
          </div>
          <PhoneMockup accent="brand-orange" className="mx-auto md:mx-0">
            <MeditationPreview />
          </PhoneMockup>
        </div>

        <div className="relative flex flex-col items-center gap-6 rounded-lg bg-brand-blue p-8 text-center text-white md:flex-row md:text-left">
          <GlowOrb from="#ffc738" to="#f5b8cb" className="-bottom-8 -left-8 h-24 w-24" delay="1.2s" duration="6.5s" />
          <FaceOrb
            from="#ffffff"
            to="#f5b8cb"
            face="#124a94"
            className="-right-5 -top-5 h-16 w-16"
            floatDelay="0.6s"
            floatDuration="6.5s"
            breatheDelay="0.5s"
          />

          <div className="flex-1">
            <h2 className="text-2xl font-semibold">Online therapy</h2>
            <p className="mt-2 text-sm text-white/80">
              Licensed therapists that accept insurance.
            </p>
            <Button as={Link} to="/app/identify-need" variant="onDark" className="mt-5">
              Check your coverage
            </Button>
          </div>
          <PhoneMockup accent="brand-pink" className="mx-auto md:mx-0">
            <DoctorPreview />
          </PhoneMockup>
        </div>
      </Container>
    </section>
  );
}
