import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QUIZ_NEEDS, MODALITY_OPTIONS, LANGUAGE_OPTIONS, URGENCY_OPTIONS } from "../data/quiz";
import { matchProviders } from "../data/providerMatching";
import { listApprovedProviders } from "../firebase/providers";
import { Spinner } from "../../components/ui/LoadingSpinner";

const TOTAL_STEPS = 3;

function ChevronIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function BackIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

// Soft, moderate cloud-like blurs on the light background — subtle gray/
// white patches, not a saturated color gradient.
function CloudBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/70 blur-3xl" />
      <div className="absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-white/60 blur-3xl" />
      <div className="absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-white/50 blur-3xl" />
    </div>
  );
}

function ProgressDots({ step }) {
  return (
    <div className="mb-7 flex items-center gap-1.5">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? "bg-clinical-teal" : "bg-clinical-border"}`}
        />
      ))}
    </div>
  );
}

function StepHeader({ step, title }) {
  return (
    <>
      <span className="inline-flex rounded-full bg-clinical-teal-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-clinical-teal-dark">
        Step {step} of {TOTAL_STEPS}
      </span>
      <h1 className="font-clinical-heading mt-3 text-2xl font-extrabold leading-snug text-clinical-ink md:text-3xl">{title}</h1>
    </>
  );
}

// Shared card treatment for the option list: clean solid white with a soft,
// moderate shadow and thin border — enough elevation to lift off the light
// cloud background without a heavy dramatic effect.
const OPTION_CARD = "border border-clinical-border bg-white shadow-md";

// Tap-to-advance option: white pill, icon badge + label + a chevron
// affordance (this step has no persistent "selected" state since choosing
// it immediately moves to the next step).
function OptionPill({ emoji, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-4 rounded-full px-5 py-4 text-left transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-lg ${OPTION_CARD}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clinical-teal-soft text-xl" aria-hidden="true">
        {emoji}
      </span>
      <span className="font-clinical-heading flex-1 text-sm font-bold text-clinical-ink">{label}</span>
      <ChevronIcon className="h-4 w-4 shrink-0 text-clinical-ink-soft transition-transform duration-150 group-hover:translate-x-0.5" />
    </button>
  );
}

// Toggle-style option with a radio indicator — used where the selection
// persists on screen until the user presses Continue.
function RadioCard({ emoji, label, isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center gap-3 rounded-2xl border-2 bg-white px-4 py-4 text-left shadow-md transition-colors ${
        isSelected ? "border-clinical-teal" : "border-transparent"
      }`}
    >
      {emoji && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-clinical-teal-soft text-lg" aria-hidden="true">
          {emoji}
        </span>
      )}
      <span className="font-clinical-heading flex-1 text-sm font-bold text-clinical-ink">{label}</span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          isSelected ? "border-clinical-teal" : "border-clinical-border"
        }`}
      >
        {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-clinical-teal" />}
      </span>
    </button>
  );
}

function NeedStep({ onSelect }) {
  return (
    <div>
      <StepHeader step={1} title="What is bringing you here today?" />
      <div className="mt-6 flex flex-col gap-3">
        {QUIZ_NEEDS.map((need) => (
          <OptionPill key={need.id} emoji={need.emoji} label={need.label} onClick={() => onSelect(need.id)} />
        ))}
      </div>
    </div>
  );
}

function FormatStep({ modality, language, onSetModality, onSetLanguage, onContinue }) {
  return (
    <div>
      <StepHeader step={2} title="How would you like to connect?" />

      <p className="mt-6 text-xs font-bold uppercase tracking-wide text-clinical-ink-soft">Format</p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        {MODALITY_OPTIONS.map((option) => (
          <RadioCard
            key={option.id}
            emoji={option.emoji}
            label={option.label}
            isSelected={modality === option.id}
            onClick={() => onSetModality(option.id)}
          />
        ))}
      </div>

      <p className="mt-6 text-xs font-bold uppercase tracking-wide text-clinical-ink-soft">Language</p>
      <div className="mt-2 flex gap-2">
        {LANGUAGE_OPTIONS.map((option) => {
          const isSelected = language === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSetLanguage(option.id)}
              className={`flex-1 rounded-full border-2 px-3 py-2.5 text-center text-sm font-bold transition-colors ${
                isSelected
                  ? "border-clinical-teal bg-clinical-teal text-white"
                  : "border-clinical-border bg-white text-clinical-ink"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!modality || !language}
        className="font-clinical-heading mt-8 w-full rounded-full bg-clinical-teal px-5 py-3.5 text-sm font-extrabold text-white transition-colors hover:bg-clinical-teal-dark disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  );
}

function UrgencyStep({ onSelect }) {
  return (
    <div>
      <StepHeader step={3} title="How soon would you like to speak to someone?" />
      <div className="mt-6 flex flex-col gap-3">
        {URGENCY_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`group flex items-center gap-4 rounded-2xl p-4 text-left transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-lg ${OPTION_CARD}`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clinical-teal-soft text-xl" aria-hidden="true">
              {option.emoji}
            </span>
            <div className="flex-1">
              <p className="font-clinical-heading text-sm font-bold text-clinical-ink">{option.label}</p>
              <p className="text-xs text-clinical-ink-soft">{option.description}</p>
            </div>
            <ChevronIcon className="h-4 w-4 shrink-0 text-clinical-ink-soft transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>
        ))}
      </div>
    </div>
  );
}

function MatchedProviderCard({ provider, score, matched, speaksLanguage, isTopMatch, onBook }) {
  return (
    <div
      className={`rounded-2xl border-2 bg-clinical-surface p-4 ${
        isTopMatch ? "border-clinical-success" : "border-clinical-border"
      }`}
    >
      {matched && (
        <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-clinical-success/15 px-2.5 py-1 text-[10px] font-bold text-clinical-success">
          &#127775; {score}% {isTopMatch ? "Best Match for Your Needs" : "Match"}
        </span>
      )}
      <div className="flex gap-3">
        <div className="font-clinical-heading flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-clinical-teal-soft text-sm font-extrabold text-clinical-teal-dark">
          {provider.initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-clinical-ink">{provider.name}</h3>
            <span className="text-clinical-success" title="Verified">
              &#10003;
            </span>
          </div>
          <p className="mt-0.5 text-xs text-clinical-ink-soft">
            {provider.credentials}
            {provider.concerns.length > 0 && ` · ${provider.concerns.join(", ")}`}
          </p>
          <p className="mt-0.5 text-xs text-clinical-ink-soft">
            {provider.fee} &middot; {provider.location}
          </p>
          {!speaksLanguage && (
            <p className="mt-0.5 text-[11px] text-clinical-amber-dark">
              Doesn&apos;t list your preferred language
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onBook}
        className="font-clinical-heading mt-3 block w-full rounded-full bg-clinical-amber py-2 text-center text-xs font-bold text-clinical-ink hover:bg-clinical-amber-dark"
      >
        Book now
      </button>
    </div>
  );
}

function ResultsStep({ answers }) {
  const navigate = useNavigate();
  const need = QUIZ_NEEDS.find((n) => n.id === answers.needId);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listApprovedProviders()
      .then((result) => {
        if (!cancelled) setProviders(result);
      })
      .catch((err) => console.error("Failed to load providers:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const ranked = useMemo(
    () => matchProviders(providers, need, answers.language),
    [providers, need, answers.language]
  );
  const topMatchId = ranked.find((r) => r.matched)?.provider.id;

  function handleBook(providerId) {
    navigate(`/app/book/${providerId}/${answers.modality}`);
  }

  return (
    <div>
      <div className="rounded-2xl bg-clinical-teal-soft p-4">
        <p className="text-sm text-clinical-ink">
          Based on your check-in for <span className="font-bold">{need?.label}</span>, here are the
          recommended licensed therapists for you:
        </p>
        {answers.urgency === "today" && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-clinical-crisis/15 px-2.5 py-1 text-[10px] font-bold text-clinical-crisis">
            &#128308; Same-day support requested
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner size="sm" label="Loading providers" />
          </div>
        ) : ranked.length === 0 ? (
          <p className="py-6 text-center text-sm text-clinical-ink-soft">
            No verified providers yet — check back soon.
          </p>
        ) : (
          ranked.map(({ provider, score, matched, speaksLanguage }) => (
            <MatchedProviderCard
              key={provider.id}
              provider={provider}
              score={score}
              matched={matched}
              speaksLanguage={speaksLanguage}
              isTopMatch={provider.id === topMatchId}
              onBook={() => handleBook(provider.id)}
            />
          ))
        )}
      </div>

      <Link
        to="/app/care"
        className="font-clinical-heading mt-5 block rounded-full border-2 border-clinical-teal py-3 text-center text-sm font-bold text-clinical-teal-dark"
      >
        Reset Filters / View All Doctors
      </Link>
    </div>
  );
}

const INITIAL_ANSWERS = { needId: null, modality: "", language: "", urgency: null };

export default function ClinicalQuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const isQuestionStep = step < 3;

  function restart() {
    setAnswers(INITIAL_ANSWERS);
    setStep(0);
  }

  return (
    <div
      className={
        isQuestionStep
          ? "relative overflow-hidden bg-gradient-to-b from-white to-slate-200"
          : ""
      }
    >
      {isQuestionStep && <CloudBlobs />}

      <div className="relative mx-auto max-w-lg px-6 py-10">
        {isQuestionStep && <ProgressDots step={step} />}

        {step === 0 && (
          <NeedStep
            onSelect={(needId) => {
              setAnswers((a) => ({ ...a, needId }));
              setStep(1);
            }}
          />
        )}
        {step === 1 && (
          <FormatStep
            modality={answers.modality}
            language={answers.language}
            onSetModality={(modality) => setAnswers((a) => ({ ...a, modality }))}
            onSetLanguage={(language) => setAnswers((a) => ({ ...a, language }))}
            onContinue={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <UrgencyStep
            onSelect={(urgency) => {
              setAnswers((a) => ({ ...a, urgency }));
              setStep(3);
            }}
          />
        )}
        {step === 3 && <ResultsStep answers={answers} />}

        {step > 0 && step < 3 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="mt-6 flex items-center gap-1.5 text-xs font-bold text-clinical-ink-soft hover:text-clinical-ink"
          >
            <BackIcon className="h-3.5 w-3.5" /> Back
          </button>
        )}
        {step === 3 && (
          <button
            type="button"
            onClick={restart}
            className="mt-3 block w-full text-center text-xs font-semibold text-clinical-ink-soft"
          >
            Start over
          </button>
        )}
      </div>
    </div>
  );
}
