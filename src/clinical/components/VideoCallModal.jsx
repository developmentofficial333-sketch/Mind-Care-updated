import { useEffect, useState } from "react";

function initialsOf(name) {
  if (!name) return "DR";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Mock telehealth meeting UI — simulates a Zoom-style video consultation.
 * There is no real video/audio backend wired up yet; this demonstrates the
 * intended member-facing flow (camera placeholder, mic toggle, end call).
 */
export default function VideoCallModal({ providerName, onClose }) {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-clinical-ink">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-sm font-bold text-white">Session with {providerName}</p>
          <p className="text-[11px] text-white/60">Secure video &middot; simulated connection</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-clinical-success" /> Live
        </span>
      </div>

      <div className="relative mx-5 flex flex-1 items-center justify-center overflow-hidden rounded-2xl bg-white/5">
        {cameraOn ? (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-clinical-teal-soft text-2xl font-extrabold text-clinical-teal-dark">
            {initialsOf(providerName)}
          </div>
        ) : (
          <p className="text-sm text-white/50">Camera is off</p>
        )}
        <div className="absolute bottom-4 right-4 flex h-16 w-12 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-[10px] font-semibold text-white/70">
          You
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 px-5 py-6">
        <button
          type="button"
          onClick={() => setMicOn((v) => !v)}
          aria-pressed={micOn}
          aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            micOn ? "bg-white/10 text-white" : "bg-white text-clinical-ink"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 11a7 7 0 0014 0M12 18v4" />
            {!micOn && <path d="M4 4l16 16" />}
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setCameraOn((v) => !v)}
          aria-pressed={cameraOn}
          aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            cameraOn ? "bg-white/10 text-white" : "bg-white text-clinical-ink"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="6" width="14" height="12" rx="2" />
            <path d="M16 10l4-2v8l-4-2" />
            {!cameraOn && <path d="M4 4l16 16" />}
          </svg>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="font-clinical-heading flex h-12 items-center gap-2 rounded-full bg-clinical-crisis px-6 text-sm font-bold text-white"
        >
          End call
        </button>
      </div>
    </div>
  );
}
