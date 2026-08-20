import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QUIZ_NEEDS, MODALITY_OPTIONS, LANGUAGE_OPTIONS, URGENCY_OPTIONS } from "../data/quiz";
import { matchProviders } from "../data/providerMatching";

const TOTAL_STEPS = 3;

function StepHeader({ step, title }) {
  return (
    <>
      <p className="text-xs font-bold text-clinical-teal-dark">
        STEP {step} OF {TOTAL_STEPS}
      </p>
      <h1 className="font-clinical-heading mt-1.5 text-2xl font-bold text-clinical-ink">{title}</h1>
    </>
  );
}

function NeedStep({ onSelect }) {
  return (
    <div>
      <StepHeader step={1} title="What is bringing you here today?" />
      <div className="mt-5 flex flex-col gap-3">
        {QUIZ_NEEDS.map((need) => (
          <button
            key={need.id}
            type="button"
            onClick={() => onSelect(need.id)}
            className="flex items-center gap-4 rounded-2xl border-2 border-clinical-border bg-clinical-surface p-4 text-left transition-colors hover:border-clinical-teal hover:bg-clinical-teal-soft"
          >
            <span className="text-3xl" aria-hidden="true">
              {need.emoji}
            </span>
            <span className="font-clinical-heading text-sm font-bold text-clinical-ink">{need.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FormatStep({ modality, language, onSetModality, onSetLanguage, onContinue }) {
  return (
    <div>
      <StepHeader step={2} title="How would you like to connect?" />

      <p className="mt-5 text-xs font-bold text-clinical-ink-soft">FORMAT</p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        {MODALITY_OPTIONS.map((option) => {
          const isSelected = modality === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSetModality(option.id)}
              className={`flex flex-1 items-center gap-3 rounded-2xl border-2 p-4 text-left ${
                isSelected
                  ? "border-clinical-teal bg-clinical-teal-soft"
                  : "border-clinical-border bg-clinical-surface"
              }`}
            >
              <span className="text-2xl" aria-hidden="true">
                {option.emoji}
              </span>
              <span className="font-clinical-heading text-sm font-bold text-clinical-ink">{option.label}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-xs font-bold text-clinical-ink-soft">LANGUAGE</p>
      <div className="mt-2 flex gap-2">
        {LANGUAGE_OPTIONS.map((option) => {
          const isSelected = language === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSetLanguage(option.id)}
              className={`flex-1 rounded-full border-2 px-3 py-2.5 text-center text-sm font-bold ${
                isSelected
                  ? "border-clinical-teal bg-clinical-teal text-white"
                  : "border-clinical-border bg-clinical-surface text-clinical-ink"
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
        className="font-clinical-heading mt-6 w-full rounded-full bg-clinical-amber px-5 py-3.5 text-sm font-bold text-clinical-ink hover:bg-clinical-amber-dark disabled:opacity-50"
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
      <div className="mt-5 flex flex-col gap-3">
        {URGENCY_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className="flex items-center gap-4 rounded-2xl border-2 border-clinical-border bg-clinical-surface p-4 text-left transition-colors hover:border-clinical-teal hover:bg-clinical-teal-soft"
          >
            <span className="text-2xl" aria-hidden="true">
              {option.emoji}
            </span>
            <div>
              <p className="font-clinical-heading text-sm font-bold text-clinical-ink">{option.label}</p>
              <p className="text-xs text-clinical-ink-soft">{option.description}</p>
            </div>
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
            {provider.credentials} &middot; {provider.concerns.join(", ")}
          </p>
          <p className="mt-0.5 text-xs text-clinical-ink-soft">
            &#9733; {provider.rating} &middot; {provider.fee} &middot; {provider.location}
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
  const ranked = useMemo(() => matchProviders(need, answers.language), [need, answers.language]);
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
        {ranked.map(({ provider, score, matched, speaksLanguage }) => (
          <MatchedProviderCard
            key={provider.id}
            provider={provider}
            score={score}
            matched={matched}
            speaksLanguage={speaksLanguage}
            isTopMatch={provider.id === topMatchId}
            onBook={() => handleBook(provider.id)}
          />
        ))}
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

  function restart() {
    setAnswers(INITIAL_ANSWERS);
    setStep(0);
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-9">
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
          className="mt-4 block text-center text-xs font-semibold text-clinical-ink-soft"
        >
          &larr; Back
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
  );
}
