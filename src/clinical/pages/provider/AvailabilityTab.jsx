import { useProviderAvailabilityForm } from "../../../hooks/useProviderAvailabilityForm";
import { Spinner } from "../../../components/ui/LoadingSpinner";

// Displayed Monday-first (a work week), but keyed by Date.getDay() values
// ("0"-"6", Sun-Sat) to match providerAvailability.js's schema and
// slotGeneration.js's lookup.
const WEEKDAYS = [
  { key: "1", label: "Monday" },
  { key: "2", label: "Tuesday" },
  { key: "3", label: "Wednesday" },
  { key: "4", label: "Thursday" },
  { key: "5", label: "Friday" },
  { key: "6", label: "Saturday" },
  { key: "0", label: "Sunday" },
];

export default function AvailabilityTab({ providerId }) {
  const { weekly, loaded, addRange, updateRange, removeRange, status, submit } =
    useProviderAvailabilityForm(providerId);

  if (!loaded) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="sm" label="Loading availability" />
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl bg-clinical-mint/50 p-4 text-sm text-clinical-ink">
        Set the hours you&apos;re open each week. Members will only be able to book real open
        slots within these hours.
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {WEEKDAYS.map((day) => {
          const ranges = weekly[day.key] || [];
          const isWorking = ranges.length > 0;
          return (
            <div
              key={day.key}
              className={`rounded-2xl border p-4 shadow-card transition-shadow duration-150 hover:shadow-lg ${
                isWorking ? "border-clinical-border bg-clinical-surface" : "border-dashed border-clinical-border bg-clinical-surface/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-2 w-2 rounded-full ${isWorking ? "bg-clinical-emerald" : "bg-clinical-border"}`}
                  />
                  <p className="text-sm font-bold text-clinical-ink">{day.label}</p>
                </div>
                <button
                  type="button"
                  onClick={() => addRange(day.key)}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-clinical-emerald-dark transition-colors hover:bg-clinical-mint"
                >
                  + Add hours
                </button>
              </div>

              {ranges.length === 0 ? (
                <p className="mt-1.5 pl-4 text-xs text-clinical-ink-soft">Not working this day.</p>
              ) : (
                <div className="mt-3 flex flex-col gap-2 pl-4">
                  {ranges.map((range, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-xl bg-clinical-bg px-3 py-2"
                    >
                      <input
                        type="time"
                        value={range.start}
                        onChange={(e) => updateRange(day.key, index, "start", e.target.value)}
                        className="rounded-lg border border-clinical-border bg-white px-2 py-1.5 text-xs outline-none transition-colors focus:border-clinical-emerald"
                      />
                      <span className="text-xs font-medium text-clinical-ink-soft">to</span>
                      <input
                        type="time"
                        value={range.end}
                        onChange={(e) => updateRange(day.key, index, "end", e.target.value)}
                        className="rounded-lg border border-clinical-border bg-white px-2 py-1.5 text-xs outline-none transition-colors focus:border-clinical-emerald"
                      />
                      <button
                        type="button"
                        onClick={() => removeRange(day.key, index)}
                        aria-label={`Remove ${day.label} range ${index + 1}`}
                        className="ml-auto rounded-full px-2.5 py-1 text-xs font-semibold text-clinical-crisis transition-colors hover:bg-clinical-crisis/10"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {status === "error" && (
        <p className="mt-3 text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
      {status === "success" && (
        <p className="mt-3 text-sm font-semibold text-clinical-success">✓ Availability saved.</p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={status === "loading"}
        className="font-clinical-heading mt-5 w-full rounded-full bg-clinical-emerald px-5 py-3.5 text-sm font-bold text-white shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:bg-clinical-emerald-dark hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
      >
        {status === "loading" ? "Saving..." : "Save availability"}
      </button>
    </div>
  );
}
