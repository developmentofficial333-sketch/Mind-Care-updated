import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import PhoneMockup from "../ui/PhoneMockup";
import { guidanceTabs } from "../../data/guidanceTabs";

const WAVEFORM = [6, 10, 16, 8, 14, 20, 10, 6, 12, 18, 9, 5];
const MEDITATION_DURATIONS = ["3", "10", "20"];

const FLOATERS = [
  { emoji: "☁️", className: "left-[6%] top-8 text-4xl", delay: "0s", duration: "7s" },
  { emoji: "✨", className: "right-[12%] top-4 text-2xl", delay: "1.2s", duration: "5s" },
  { emoji: "🌙", className: "left-[16%] bottom-10 text-3xl", delay: "0.6s", duration: "8s" },
  { emoji: "🧘", className: "right-[7%] bottom-14 text-3xl", delay: "1.8s", duration: "6.5s" },
];

function FloatingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {FLOATERS.map((f, i) => (
        <span
          key={i}
          className={`animate-float absolute opacity-30 ${f.className}`}
          style={{ animationDelay: f.delay, animationDuration: f.duration }}
        >
          {f.emoji}
        </span>
      ))}
    </div>
  );
}

function MeditationScreen({ duration }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-gradient-to-b from-brand-yellow via-brand-yellow-soft to-white px-4 pb-6 pt-8">
      <div className="pointer-events-none absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/60">Now playing</p>
        <p className="mt-1 text-sm font-semibold text-ink">Sukoon &bull; سکون (Deep Breathing)</p>
        <p className="text-[11px] text-ink/60">{duration} min session</p>
      </div>
      <div className="relative flex h-10 items-end justify-center gap-1">
        {WAVEFORM.map((h, i) => (
          <span
            key={i}
            className={`w-1 rounded-full bg-ink/70 ${playing ? "animate-pulse" : ""}`}
            style={{ height: `${h}px`, animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
      <div className="relative flex items-center justify-center gap-4">
        <Icon name="chevronRight" className="h-4 w-4 rotate-180 text-ink/50" />
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause session" : "Play session"}
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white transition-transform duration-200 hover:scale-110"
        >
          {playing && <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-ink/40" />}
          <Icon name={playing ? "pause" : "play"} className={playing ? "h-4 w-4" : "h-4 w-4 translate-x-0.5"} />
        </button>
        <Icon name="chevronRight" className="h-4 w-4 text-ink/50" />
      </div>
    </div>
  );
}

function SleepcastsScreen() {
  return (
    <div className="relative flex h-full flex-col justify-end overflow-hidden bg-gradient-to-b from-[#0b1d3a] to-[#1c3d6b] px-4 pb-6 pt-8 text-white">
      <div className="absolute right-6 top-6 h-8 w-8 rounded-full bg-white/80 shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
      <div className="absolute left-9 top-16 h-1 w-1 rounded-full bg-white/70" />
      <div className="absolute left-16 top-10 h-1 w-1 rounded-full bg-white/50" />
      <div className="absolute left-24 top-24 h-1 w-1 rounded-full bg-white/60" />
      <div className="absolute left-10 top-32 h-1 w-1 rounded-full bg-white/40" />
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/60">Sleepcast</p>
      <p className="mt-1 text-sm font-semibold">Moonlit Harbor</p>
      <p className="text-[11px] text-white/60">45 min soundscape</p>
    </div>
  );
}

function TherapyScreen() {
  return (
    <div className="flex h-full flex-col justify-between bg-white px-4 pb-6 pt-8">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-xs font-semibold text-white">
          AK
        </div>
        <div>
          <p className="text-xs font-semibold text-ink">Dr. Ayesha Khan</p>
          <p className="text-[10px] text-brand-green">&#9679; Online now</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-surface px-3 py-2 text-[11px] text-ink">
          How have you been feeling this week?
        </div>
        <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-brand-blue px-3 py-2 text-[11px] text-white">
          A bit better, thanks!
        </div>
      </div>
      <button type="button" className="rounded-pill bg-ink px-3 py-2 text-[11px] font-semibold text-white">
        Join session
      </button>
    </div>
  );
}

function FocusScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-between bg-gradient-to-b from-brand-green to-[#3d7a66] px-4 pb-6 pt-8 text-white">
      <div className="flex flex-col items-center gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">Focus session</p>
        <p className="text-3xl font-semibold tabular-nums">18:24</p>
      </div>
      <div className="flex h-8 items-end gap-1">
        {WAVEFORM.map((h, i) => (
          <span key={i} className="w-1 rounded-full bg-white/50" style={{ height: `${h * 0.7}px` }} />
        ))}
      </div>
      <p className="text-[11px] text-white/70">Rainfall + Lo-fi</p>
    </div>
  );
}

function CrisisScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-clinical-crisis px-4 text-center text-white">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-xl">
        &#9742;
      </span>
      <div>
        <p className="text-sm font-semibold">24/7 Crisis Line</p>
        <p className="mt-1 text-[11px] text-white/80">Talk to someone right now</p>
      </div>
      <Link
        to="/app/crisis-support"
        className="rounded-pill bg-white px-4 py-2 text-[11px] font-semibold text-clinical-crisis"
      >
        Call now
      </Link>
    </div>
  );
}

export default function GuidanceShowcase() {
  const [activeTab, setActiveTab] = useState(guidanceTabs[0]);
  const [duration, setDuration] = useState("10");
  const isMeditation = activeTab.id === "meditation";

  return (
    <section className="relative overflow-hidden bg-white py-16">
      <FloatingBackground />

      <Container className="relative">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-ink md:text-5xl">
          Support for every moment
        </h2>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {guidanceTabs.map((tab) => {
            const isActive = tab.id === activeTab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab)}
                aria-pressed={isActive}
                className={`rounded-pill px-5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-ink text-white"
                    : "border border-border text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div
            className={`relative flex flex-col justify-center gap-4 overflow-hidden rounded-lg p-10 ${activeTab.box} transition-colors duration-300`}
          >
            {isMeditation && (
              <>
                <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-xl" aria-hidden="true" />
                <span className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-brand-orange/30 blur-lg" aria-hidden="true" />
                <span className="absolute right-5 top-5 rotate-12 text-3xl drop-shadow" aria-hidden="true">
                  😌
                </span>
              </>
            )}

            <div className="relative max-w-sm">
              {isMeditation && (
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-pill bg-white/70 px-3 py-1 text-xs font-semibold text-ink">
                    ✨ Most Loved
                  </span>
                  <span className="rounded-pill bg-white/70 px-3 py-1 text-xs font-semibold text-ink">
                    Urdu &amp; English
                  </span>
                </div>
              )}

              <h3 className={`mt-3 text-2xl font-bold md:text-3xl ${activeTab.text}`}>{activeTab.heading}</h3>
              <p className={`mt-2 text-sm ${activeTab.subtext}`}>{activeTab.description}</p>

              {isMeditation && (
                <div className="mt-4 flex gap-2">
                  {MEDITATION_DURATIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      aria-pressed={duration === d}
                      className={`rounded-pill px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        duration === d ? "bg-ink text-white" : "bg-white/70 text-ink hover:bg-white"
                      }`}
                    >
                      {d} min
                    </button>
                  ))}
                </div>
              )}

              <Button as={Link} to={activeTab.to} variant="primary" className="mt-6">
                {activeTab.cta}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center rounded-lg border border-border bg-surface p-10">
            <PhoneMockup>
              {activeTab.id === "meditation" && <MeditationScreen duration={duration} />}
              {activeTab.id === "sleepcasts" && <SleepcastsScreen />}
              {activeTab.id === "therapy" && <TherapyScreen />}
              {activeTab.id === "focus" && <FocusScreen />}
              {activeTab.id === "crisis" && <CrisisScreen />}
            </PhoneMockup>
          </div>
        </div>
      </Container>
    </section>
  );
}
