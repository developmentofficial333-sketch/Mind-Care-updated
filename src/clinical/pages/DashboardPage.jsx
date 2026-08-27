import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { getMemberProfile } from "../firebase/memberProfiles";
import { listAppointments } from "../firebase/appointments";
import { listApprovedProviders } from "../firebase/providers";
import { resources } from "../data/resources";
import { CATEGORY_STYLES, DEFAULT_CATEGORY_STYLE } from "../data/resourceStyles";
import { ResourceModal } from "../components/ResourceCard";
import VideoCallModal from "../components/VideoCallModal";
import { Spinner } from "../../components/ui/LoadingSpinner";

const MOODS = [
  { id: "calm", emoji: "☀️", label: "Calm", tint: "bg-clinical-teal-soft", border: "border-clinical-teal" },
  { id: "focused", emoji: "🎯", label: "Focused", tint: "bg-clinical-sky", border: "border-clinical-sky-dark" },
  {
    id: "overwhelmed",
    emoji: "🌧️",
    label: "Overwhelmed",
    tint: "bg-clinical-amber/20",
    border: "border-clinical-amber-dark",
  },
  {
    id: "tired",
    emoji: "🌙",
    label: "Tired",
    tint: "bg-clinical-success/15",
    border: "border-clinical-success",
  },
];

const MOOD_RESPONSES = {
  calm: "Beautiful — carry that steadiness with you today.",
  focused: "Great headspace for deep work. Ride the momentum.",
  overwhelmed: "That's okay — be gentle with yourself today. Our crisis line is always here if you need it.",
  tired: "Low energy days happen. A short Sleepcast or an early night might help.",
};

// Same verified, real Pakistan helpline surfaced on CrisisBar.jsx and
// CrisisSupportPage.jsx — never hardcode a different/placeholder number here.
const QUICK_HELPLINE = { label: "Umang mental health helpline", number: "0311-7786264" };

// The three shortcut cards under "Recommended for You" — one real resource
// per topic (Focus / Sleep / Stress), with a small display-only emoji glyph.
const QUICK_LAUNCH = [
  { id: "box-breathing-focus", emoji: "🎯" },
  { id: "deep-sleep-soundscape", emoji: "🌙" },
  { id: "grounding-technique", emoji: "🧘" },
];

const MEDIA_SUFFIX = { Audio: "audio", Article: "read", Exercise: "exercise" };

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function VideoGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="M16 10l4-2v8l-4-2" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 5l12 7-12 7V5z" />
    </svg>
  );
}

function CarePlanCard({ appointment, providers, onJoin }) {
  const isOnline = appointment.mode === "Online";
  const provider = providers.find((p) => p.id === appointment.providerId);
  const initials =
    provider?.initials ||
    appointment.providerName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="rounded-3xl bg-white p-6 shadow-card">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-clinical-teal-soft text-sm font-extrabold text-clinical-teal-dark">
          {initials}
        </div>
        <div className="flex-1">
          <p className="font-clinical-heading text-sm font-bold text-clinical-ink">
            {appointment.providerName}
          </p>
          {provider && (
            <p className="mt-0.5 text-xs text-clinical-ink-soft">
              {provider.discipline}
              {provider.concerns.length > 0 && ` · ${provider.concerns.join(", ")}`}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold ${
            isOnline
              ? "bg-clinical-teal-soft text-clinical-teal-dark"
              : "bg-clinical-amber/25 text-clinical-amber-dark"
          }`}
        >
          {appointment.mode}
        </span>
      </div>

      <p className="mt-3 text-xs font-semibold text-clinical-ink-soft">
        {appointment.dateLabel}, {appointment.time}
      </p>

      {isOnline ? (
        <button
          type="button"
          onClick={() => onJoin(appointment.providerName)}
          className="font-clinical-heading mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-blue px-4 py-3 text-sm font-bold text-white hover:bg-brand-blue-dark"
        >
          <VideoGlyph /> Join Video Call
        </button>
      ) : (
        <Link
          to={`/app/session/${appointment.id}`}
          className="font-clinical-heading mt-4 block rounded-full border-2 border-clinical-teal py-3 text-center text-sm font-bold text-clinical-teal-dark"
        >
          View appointment
        </Link>
      )}
    </div>
  );
}

function QuickLaunchCard({ resource, emoji, onOpen }) {
  const styles = CATEGORY_STYLES[resource.category] ?? DEFAULT_CATEGORY_STYLE;

  return (
    <button
      type="button"
      onClick={() => onOpen(resource)}
      className={`flex flex-col items-start gap-2 rounded-3xl p-5 text-left shadow-card transition-transform duration-150 hover:-translate-y-0.5 ${styles.card}`}
    >
      <span className="text-2xl">{emoji}</span>
      <p className="font-clinical-heading text-sm font-bold text-clinical-ink">{resource.title}</p>
      <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold text-clinical-ink-soft">
        {resource.length} {MEDIA_SUFFIX[resource.type]}
      </span>
    </button>
  );
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-soft">
      <Spinner />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [mood, setMood] = useState(null);
  const [openResource, setOpenResource] = useState(null);
  const [callProvider, setCallProvider] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all([getMemberProfile(user.uid), listAppointments(user.uid), listApprovedProviders()])
      .then(([memberProfile, memberAppointments, approvedProviders]) => {
        if (cancelled) return;
        setProfile(memberProfile);
        setAppointments(memberAppointments);
        setProviders(approvedProviders);
        setLoadError(false);
      })
      .catch((err) => {
        // Firestore reads can fail (misconfigured Firebase, offline, denied
        // rules) — fall back to a friendly demo state instead of leaving the
        // page stuck on "Loading..." forever.
        console.error("Failed to load dashboard data:", err);
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) return <LoadingScreen />;

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-soft px-6">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-10 text-center shadow-card">
          <h1 className="font-clinical-heading text-xl font-bold text-clinical-ink">
            Welcome to MindCare
          </h1>
          <p className="mt-2 text-sm text-clinical-ink-soft">
            Sign in to see your personalized dashboard — upcoming sessions, mood check-ins, and
            saved resources.
          </p>
          <Link
            to="/app/login"
            className="font-clinical-heading mt-5 inline-block rounded-full bg-clinical-amber px-5 py-3 text-sm font-bold text-clinical-ink hover:bg-clinical-amber-dark"
          >
            Log in
          </Link>
          <p className="mt-3 text-sm">
            New here?{" "}
            <Link to="/app/register" className="font-semibold text-clinical-teal-dark">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const firstName =
    profile?.fullName?.split(" ")[0] || user.displayName?.split(" ")[0] || user.email?.split("@")[0] || "Member";
  const today = todayIso();
  const upcoming = appointments
    .filter((a) => a.isoDate >= today && a.status !== "cancelled")
    .slice(0, 3);
  const showLoadErrorNotice = loadError && upcoming.length === 0;

  const featuredResource = resources.find((r) => r.id === "5-min-breathing");
  const quickLaunchResources = QUICK_LAUNCH.map((entry) => ({
    ...entry,
    resource: resources.find((r) => r.id === entry.id),
  })).filter((entry) => entry.resource);

  return (
    <div className="min-h-screen bg-cream-soft">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Hero greeting */}
        <h1 className="font-clinical-heading text-3xl font-bold tracking-tight text-clinical-ink sm:text-4xl">
          {t("dashboard.greeting")}, {firstName}
        </h1>
        <p className="mt-2 text-sm text-clinical-ink-soft">
          {todayLabel()} &middot; {t("dashboard.feelingPrompt")}
        </p>

        {/* Mood pill selector */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MOODS.map((option) => {
            const isSelected = mood === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setMood(option.id)}
                aria-pressed={isSelected}
                className={`flex flex-col items-center gap-2 rounded-3xl border-2 p-5 transition-all duration-200 ${option.tint} ${
                  isSelected ? `${option.border} shadow-card` : "border-transparent hover:border-clinical-border"
                }`}
              >
                <span className="text-3xl">{option.emoji}</span>
                <span className="text-sm font-semibold text-clinical-ink">{option.label}</span>
              </button>
            );
          })}
        </div>
        {mood && (
          <p className="mt-3 text-sm text-clinical-ink-soft">{MOOD_RESPONSES[mood]}</p>
        )}

        {/* Featured for today */}
        {featuredResource && (
          <div className="mt-8 rounded-3xl bg-gradient-to-r from-amber-100 to-orange-100 p-8">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-800/70">
              Featured for today
            </p>
            <h2 className="font-clinical-heading mt-1 text-2xl font-bold text-clinical-ink sm:text-3xl">
              Today&apos;s Mindful Moment
            </h2>
            <p className="mt-2 max-w-sm text-sm text-clinical-ink-soft">
              5-min breathing reset to ground your thoughts.
            </p>
            <button
              type="button"
              onClick={() => setOpenResource(featuredResource)}
              className="font-clinical-heading mt-5 inline-flex items-center gap-2 rounded-full bg-clinical-ink px-6 py-3 text-sm font-bold text-white hover:bg-clinical-ink/90"
            >
              <PlayGlyph /> Start Session
            </button>
          </div>
        )}

        {/* Two-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-clinical-heading text-xl font-bold text-clinical-ink">Your Care Plan</h2>
              <Link to="/app/quiz" className="text-xs font-semibold text-clinical-teal-dark">
                Find a provider
              </Link>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              {upcoming.length ? (
                upcoming.map((appointment) => (
                  <CarePlanCard key={appointment.id} appointment={appointment} providers={providers} onJoin={setCallProvider} />
                ))
              ) : showLoadErrorNotice ? (
                <div className="rounded-3xl bg-white p-8 text-center shadow-card">
                  <p className="text-3xl">⚠️</p>
                  <p className="font-clinical-heading mt-2 text-sm font-bold text-clinical-ink">
                    Couldn&apos;t load your appointments
                  </p>
                  <p className="mt-1 text-xs text-clinical-ink-soft">
                    Please check your connection and refresh the page.
                  </p>
                </div>
              ) : (
                <div className="rounded-3xl bg-white p-8 text-center shadow-card">
                  <p className="text-3xl">🌱</p>
                  <p className="font-clinical-heading mt-2 text-sm font-bold text-clinical-ink">
                    Book your first therapy session
                  </p>
                  <p className="mt-1 text-xs text-clinical-ink-soft">
                    Find a verified provider matched to your needs.
                  </p>
                  <Link
                    to="/app/quiz"
                    className="font-clinical-heading mt-4 inline-block rounded-full bg-clinical-amber px-5 py-2.5 text-xs font-bold text-clinical-ink hover:bg-clinical-amber-dark"
                  >
                    Find a provider
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-clinical-heading text-xl font-bold text-clinical-ink">Recommended for You</h2>
              <Link
                to="/app/care"
                state={{ tab: "resources" }}
                className="text-xs font-semibold text-clinical-teal-dark"
              >
                Browse all
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {quickLaunchResources.map(({ resource, emoji }) => (
                <QuickLaunchCard key={resource.id} resource={resource} emoji={emoji} onOpen={setOpenResource} />
              ))}
            </div>
          </div>
        </div>

        {/* Crisis assistance */}
        <div className="mt-8">
          <h2 className="font-clinical-heading text-xl font-bold text-clinical-ink">24/7 Crisis Assistance</h2>
          <div className="mt-4 rounded-3xl bg-clinical-crisis px-6 py-6 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.3 1 5.5 3 2.2-2 3.5-3 5.5-3C21 5 23.5 8.5 21.5 12.5 19 16.65 12 21 12 21z" />
                </svg>
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold">Need help now?</p>
                <p className="text-[11px] text-white/80">Talk to someone right away, day or night.</p>
              </div>
            </div>
            <a
              href={`tel:${QUICK_HELPLINE.number.replace(/[^0-9]/g, "")}`}
              className="font-clinical-heading mt-4 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-xs font-bold hover:bg-white/20"
            >
              {QUICK_HELPLINE.label}
              <span>{QUICK_HELPLINE.number}</span>
            </a>
            <Link
              to="/app/crisis-support"
              className="font-clinical-heading mt-2.5 block rounded-2xl bg-white px-4 py-3 text-center text-xs font-bold text-clinical-crisis"
            >
              See all crisis resources
            </Link>
          </div>
        </div>
      </div>

      {openResource && (
        <ResourceModal resource={openResource} onClose={() => setOpenResource(null)} />
      )}
      {callProvider && (
        <VideoCallModal providerName={callProvider} onClose={() => setCallProvider(null)} />
      )}
    </div>
  );
}
