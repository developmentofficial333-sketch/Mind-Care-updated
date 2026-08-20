import { useEffect, useRef, useState } from "react";
import { CATEGORY_STYLES, DEFAULT_CATEGORY_STYLE, MEDIA_LABELS, CTA_LABELS } from "../data/resourceStyles";

// Stand-in ambient track — there's no licensed per-resource audio yet, so
// every Audio/Exercise resource plays this same royalty-free meditation
// track rather than the player being purely decorative. Pixabay's signed
// "/download/audio/...?filename=..." URLs expire and 403 once generated —
// this is the same file ("meditation-relax-healing-binaural-tones") served
// from Pixabay's stable, unsigned CDN path instead.
const AMBIENT_TRACK_URL = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3";

function PlayIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M7 5l12 7-12 7V5z" />
    </svg>
  );
}

function PauseIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

export function ResourceCard({ resource, onOpen }) {
  const styles = CATEGORY_STYLES[resource.category] ?? DEFAULT_CATEGORY_STYLE;

  return (
    <div className={`rounded-2xl border border-clinical-border p-4 ${styles.card}`}>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${styles.badge}`}>
          {resource.category}
        </span>
        <span className="rounded-full bg-clinical-surface px-2.5 py-1 text-[10px] font-bold text-clinical-ink-soft">
          {MEDIA_LABELS[resource.type]} &middot; {resource.length}
        </span>
      </div>
      <h3 className="font-clinical-heading mt-2 text-sm font-bold text-clinical-ink">{resource.title}</h3>
      <p className="mt-0.5 text-xs text-clinical-ink-soft">{resource.tag}</p>
      <button
        type="button"
        onClick={() => onOpen(resource)}
        className="font-clinical-heading mt-3 rounded-full border-[1.5px] border-clinical-teal px-4 py-2 text-xs font-bold text-clinical-teal-dark"
      >
        {CTA_LABELS[resource.type]}
      </button>
    </div>
  );
}

export function ResourceModal({ resource, onClose }) {
  const styles = CATEGORY_STYLES[resource.category] ?? DEFAULT_CATEGORY_STYLE;
  const isReadable = resource.type === "Article";
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Belt-and-suspenders: also pause on unmount, in case the parent ever
  // removes this modal from the tree through a path other than handleClose.
  useEffect(() => {
    const audio = audioRef.current;
    return () => audio?.pause();
  }, []);

  function stopAudio() {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setProgress(0);
  }

  function handleClose() {
    stopAudio();
    onClose();
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.error("Audio playback failed:", err));
    }
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setProgress(audio.currentTime / audio.duration);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-clinical-ink/50 sm:items-center sm:p-6"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl bg-white p-6 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${styles.badge}`}>
            {resource.category}
          </span>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="text-lg leading-none text-clinical-ink-soft"
          >
            &times;
          </button>
        </div>
        <h2 className="font-clinical-heading mt-3 text-lg font-bold text-clinical-ink">{resource.title}</h2>
        <p className="mt-1 text-xs text-clinical-ink-soft">
          {resource.tag} &middot; {resource.length}
        </p>
        <p className="mt-3 text-sm text-clinical-ink-soft">{resource.description}</p>

        {isReadable ? (
          <div className="mt-5 rounded-2xl bg-clinical-surface p-4 text-sm leading-relaxed text-clinical-ink">
            {resource.description}
          </div>
        ) : (
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-clinical-surface p-4">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-clinical-teal text-white transition-transform duration-150 hover:scale-105"
            >
              {isPlaying ? (
                <PauseIcon className="h-4 w-4" />
              ) : (
                <PlayIcon className="h-4 w-4 translate-x-0.5" />
              )}
            </button>
            <div className="h-1.5 flex-1 rounded-full bg-clinical-border">
              <div
                className="h-1.5 rounded-full bg-clinical-teal"
                style={{ width: `${Math.min(progress, 1) * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-clinical-ink-soft">{resource.length}</span>
            <audio
              ref={audioRef}
              src={AMBIENT_TRACK_URL}
              preload="none"
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                setIsPlaying(false);
                setProgress(0);
              }}
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleClose}
          className="font-clinical-heading mt-5 w-full rounded-full bg-clinical-amber px-5 py-3 text-sm font-bold text-clinical-ink hover:bg-clinical-amber-dark"
        >
          Done
        </button>
      </div>
    </div>
  );
}
