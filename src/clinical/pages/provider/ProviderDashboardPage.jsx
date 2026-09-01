import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import OverviewTab from "./OverviewTab";
import AppointmentsTab from "./AppointmentsTab";
import PatientsTab from "./PatientsTab";
import AvailabilityTab from "./AvailabilityTab";

function OverviewIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

function AppointmentsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9.5h18M8 3v3M16 3v3" />
    </svg>
  );
}

function PatientsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AvailabilityIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

const TABS = [
  { id: "overview", label: "Overview", Icon: OverviewIcon },
  { id: "appointments", label: "Appointments", Icon: AppointmentsIcon },
  { id: "patients", label: "Patients", Icon: PatientsIcon },
  { id: "availability", label: "Availability", Icon: AvailabilityIcon },
];

function initialsOf(text) {
  return (text || "?")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ProviderDashboardPage() {
  const { user, providerProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const providerId = useMemo(() => user?.uid, [user]);

  const activeTab = TABS.some((t) => t.id === searchParams.get("tab")) ? searchParams.get("tab") : "overview";
  const displayName = providerProfile?.fullName || user?.email?.split("@")[0] || "Provider";

  function selectTab(id) {
    setSearchParams(id === "overview" ? {} : { tab: id });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div>
        <h1 className="font-clinical-heading text-2xl font-extrabold tracking-tight text-clinical-ink">
          Provider dashboard
        </h1>
        <p className="mt-1 text-sm text-clinical-ink-soft">
          Your patients, schedule, and practice — all in one place.
        </p>
      </div>

      <div className="mt-7 lg:grid lg:grid-cols-[252px_1fr] lg:items-start lg:gap-8">
        {/* Sidebar on large screens, horizontal tab strip below that */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-clinical-border bg-clinical-surface shadow-card lg:mb-0 lg:sticky lg:top-6">
          <div className="hidden items-center gap-3 bg-clinical-mint/70 px-4 py-4 lg:flex">
            <div className="font-clinical-heading flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-clinical-emerald text-sm font-extrabold text-white shadow-card">
              {initialsOf(providerProfile?.fullName)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-clinical-ink">{displayName}</p>
              <p className="truncate text-xs font-medium text-clinical-emerald-dark">
                {providerProfile?.discipline || "Provider"}
              </p>
            </div>
          </div>

          <nav className="flex gap-1.5 overflow-x-auto p-2.5 lg:flex-col lg:gap-1 lg:overflow-visible">
            {TABS.map((t) => {
              const isActive = t.id === activeTab;
              const Icon = t.Icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => selectTab(t.id)}
                  className={`font-clinical-heading flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2.5 text-left text-sm font-bold transition-all duration-150 lg:w-full lg:rounded-xl ${
                    isActive
                      ? "bg-clinical-emerald text-white shadow-card lg:bg-clinical-mint lg:text-clinical-emerald-dark lg:shadow-none"
                      : "text-clinical-ink-soft hover:bg-clinical-mint/70 hover:text-clinical-emerald-dark"
                  }`}
                >
                  <Icon />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="min-w-0">
          {activeTab === "overview" && (
            <OverviewTab providerId={providerId} providerName={providerProfile?.fullName?.split(" ")[0]} />
          )}
          {activeTab === "appointments" && <AppointmentsTab providerId={providerId} />}
          {activeTab === "patients" && <PatientsTab providerId={providerId} />}
          {activeTab === "availability" && <AvailabilityTab providerId={providerId} />}
        </div>
      </div>
    </div>
  );
}
