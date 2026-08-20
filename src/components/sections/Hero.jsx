import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import PhoneMockup from "../ui/PhoneMockup";
import { useLanguage } from "../../hooks/useLanguage";

const RING_CIRCUMFERENCE = 2 * Math.PI * 34;

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
          DR
        </div>
        <p className="text-sm font-semibold text-ink">Dr. Amelia Reyes</p>
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
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-ink md:text-6xl">
          {language === "ur" ? (
            t("hero.headline")
          ) : (
            <>
              Stress less
              <br />
              all with mindcare
            </>
          )}
        </h1>
      </Container>

      <Container className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="flex flex-col items-center gap-6 rounded-lg bg-surface p-8 text-center md:flex-row md:text-left">
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

        <div className="flex flex-col items-center gap-6 rounded-lg bg-brand-blue p-8 text-center text-white md:flex-row md:text-left">
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
