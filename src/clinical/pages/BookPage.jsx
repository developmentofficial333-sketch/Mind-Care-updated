import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { getApprovedProvider } from "../firebase/providers";
import { useAuth } from "../../hooks/useAuth";
import { getProviderBookedTimes, getMemberBookedTimes } from "../firebase/availability";
import { bookAppointment, BookingConflictError } from "../firebase/booking";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const MODE_LABELS = { online: "Online", inperson: "In-person", either: "Either" };

const TIMES = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"];

const CONFLICT_MESSAGES = {
  "provider-taken": "That time was just booked by someone else — please pick another slot.",
  "member-conflict": "You already have another appointment at this time — please choose a different time.",
};

const CORPORATE_FEE_LABEL = "PKR 0 (Covered by Employer)";

function Toggle({ on, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`relative h-[22px] w-10 shrink-0 rounded-full transition-colors ${
        on ? "bg-clinical-teal" : "bg-clinical-border"
      }`}
    >
      <span
        className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white transition-all ${
          on ? "left-[20px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

/** The next `count` real calendar days, starting today — not placeholder dates. */
function getUpcomingDays(count = 7) {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    return {
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      num: String(date.getDate()),
      isoDate: date.toISOString().slice(0, 10),
    };
  });
}

export default function BookPage() {
  const { providerId, mode } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loadingProvider, setLoadingProvider] = useState(true);
  const days = useMemo(() => getUpcomingDays(), []);
  const [dayIndex, setDayIndex] = useState(0);
  const [time, setTime] = useState(TIMES[1]);
  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [isCorporate, setIsCorporate] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const chosenDay = days[dayIndex];

  useEffect(() => {
    let cancelled = false;
    getApprovedProvider(providerId)
      .then((result) => {
        if (!cancelled) setProvider(result);
      })
      .catch((err) => console.error("Failed to load provider:", err))
      .finally(() => {
        if (!cancelled) setLoadingProvider(false);
      });
    return () => {
      cancelled = true;
    };
  }, [providerId]);

  useEffect(() => {
    if (!provider) return;
    let cancelled = false;
    setCheckingAvailability(true);
    Promise.all([
      getProviderBookedTimes(provider.id, chosenDay.isoDate),
      getMemberBookedTimes(user.uid, chosenDay.isoDate),
    ])
      .then(([providerTaken, memberTaken]) => {
        if (cancelled) return;
        const taken = [...new Set([...providerTaken, ...memberTaken])];
        setUnavailableTimes(taken);
        // If the currently selected time just became unavailable, hop to the first open one.
        if (taken.includes(time)) {
          const nextOpen = TIMES.find((slot) => !taken.includes(slot));
          if (nextOpen) setTime(nextOpen);
        }
      })
      .catch((err) => {
        // Fail open on the display (show all times as available) — the
        // bookAppointment() transaction on confirm still enforces both
        // conflict checks server-side regardless of whether this display
        // check succeeded, so this can't cause an actual double-booking.
        console.error("Availability check failed:", err);
        if (!cancelled) setUnavailableTimes([]);
      })
      .finally(() => {
        if (!cancelled) setCheckingAvailability(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider?.id, user.uid, chosenDay.isoDate]);

  if (loadingProvider) return <LoadingSpinner />;
  if (!provider || !MODE_LABELS[mode]) return <Navigate to="/app/care" replace />;

  const dateLabel = `${chosenDay.label} ${chosenDay.num}`;

  async function handleConfirm() {
    if (isCorporate && !companyName.trim()) {
      setError("Enter your work email or company name to apply your corporate benefit.");
      return;
    }
    setBooking(true);
    setError("");
    try {
      const appointmentId = await bookAppointment(user.uid, {
        providerId: provider.id,
        providerName: provider.name,
        mode: MODE_LABELS[mode],
        dateLabel,
        isoDate: chosenDay.isoDate,
        time,
        fee: isCorporate ? CORPORATE_FEE_LABEL : provider.fee,
        bookingType: isCorporate ? "corporate" : "self-pay",
        companyName: isCorporate ? companyName.trim() : null,
      });
      navigate(`/app/confirmation/${appointmentId}`);
    } catch (err) {
      if (err instanceof BookingConflictError) {
        setError(CONFLICT_MESSAGES[err.reason] ?? "That slot is no longer available.");
        setUnavailableTimes((prev) => [...prev, time]);
      } else {
        console.error("Booking failed:", err);
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setBooking(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-9">
      <h1 className="font-clinical-heading text-xl font-bold text-clinical-ink">
        Choose a time with {provider.name}
      </h1>
      <p className="mt-1 text-xs text-clinical-ink-soft">{MODE_LABELS[mode]} session &middot; 50 minutes</p>

      <p className="mt-5 text-xs font-bold text-clinical-ink-soft">DATE</p>
      <div className="mt-2 flex gap-1.5">
        {days.map((day, index) => {
          const isSelected = index === dayIndex;
          return (
            <button
              key={day.label}
              type="button"
              data-testid={`day-${index}`}
              onClick={() => setDayIndex(index)}
              className={`flex-1 rounded-xl border-[1.5px] py-2.5 text-center ${
                isSelected
                  ? "border-clinical-teal bg-clinical-teal text-white"
                  : "border-clinical-border bg-clinical-surface text-clinical-ink"
              }`}
            >
              <div className={`text-[10px] font-semibold ${isSelected ? "text-white/80" : "text-clinical-ink-soft"}`}>
                {day.label}
              </div>
              <div className="font-clinical-heading text-sm font-extrabold">{day.num}</div>
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-xs font-bold text-clinical-ink-soft">
        AVAILABLE TIMES {checkingAvailability && "(checking...)"}
      </p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {TIMES.map((slot) => {
          const isSelected = slot === time;
          const isTaken = unavailableTimes.includes(slot);
          return (
            <button
              key={slot}
              type="button"
              disabled={isTaken}
              onClick={() => setTime(slot)}
              className={`rounded-lg border-[1.5px] px-1 py-2.5 text-center text-xs font-bold ${
                isTaken
                  ? "cursor-not-allowed border-clinical-border bg-clinical-border/40 text-clinical-ink-soft line-through"
                  : isSelected
                    ? "border-clinical-teal bg-clinical-teal text-white"
                    : "border-clinical-border bg-clinical-surface text-clinical-ink"
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 text-[11px] text-clinical-ink-soft">
        Standard practice hours shown — a provider-managed calendar isn&apos;t built yet. Greyed-out
        times are either already booked with this provider, or clash with another appointment you
        already have.
      </p>

      <div className="mt-6 rounded-2xl border border-clinical-border bg-clinical-surface p-4">
        <div className="mb-1.5 flex justify-between text-xs">
          <span className="text-clinical-ink-soft">Provider</span>
          <span className="font-bold text-clinical-ink">{provider.name}</span>
        </div>
        <div className="mb-1.5 flex justify-between text-xs">
          <span className="text-clinical-ink-soft">Modality</span>
          <span className="font-bold text-clinical-ink">{MODE_LABELS[mode]}</span>
        </div>
        <div className="mb-1.5 flex justify-between text-xs">
          <span className="text-clinical-ink-soft">When</span>
          <span className="font-bold text-clinical-ink">
            {dateLabel}, {time}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-clinical-ink-soft">Fee</span>
          <span className="font-bold text-clinical-ink">{isCorporate ? CORPORATE_FEE_LABEL : provider.fee}</span>
        </div>
        {isCorporate && (
          <div className="mt-2 flex justify-end">
            <span className="inline-flex items-center gap-1 rounded-full bg-clinical-success/15 px-2.5 py-1 text-[10px] font-bold text-clinical-success">
              &#10003; Corporate Benefit Applied
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-clinical-border bg-clinical-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-clinical-ink">Company Sponsored Session</p>
            <p className="text-[11px] text-clinical-ink-soft">B2B Benefit &mdash; covered by your employer</p>
          </div>
          <Toggle on={isCorporate} onClick={() => setIsCorporate((v) => !v)} />
        </div>

        {isCorporate && (
          <label className="mt-3 flex flex-col gap-1.5 border-t border-clinical-border pt-3 text-sm">
            <span className="font-semibold text-clinical-ink">Work email / company name*</span>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="you@company.com or Company Inc."
              className="rounded-lg border border-clinical-border bg-white px-3 py-2.5 text-sm outline-none focus:border-clinical-teal"
            />
          </label>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={booking || checkingAvailability || (isCorporate && !companyName.trim())}
        className="font-clinical-heading mt-4 w-full rounded-full bg-clinical-amber px-5 py-3.5 text-sm font-bold text-clinical-ink hover:bg-clinical-amber-dark disabled:opacity-60"
      >
        {booking ? "Booking..." : "Confirm booking"}
      </button>
    </div>
  );
}
