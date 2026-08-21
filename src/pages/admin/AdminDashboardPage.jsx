import { useEffect, useMemo, useState } from "react";
import Toast from "../../components/ui/Toast";
import { useAuth } from "../../hooks/useAuth";
import {
  listProviderApplications,
  approveProviderApplication,
  rejectProviderApplication,
  resetProviderApplicationStatus,
} from "../../firebase/adminApplications";

const PAGE_SIZE = 8;

const FILTERS = [
  { id: "all", label: "All" },
  { id: "pending_review", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const STATUS_STYLES = {
  pending_review: { label: "Pending review", dot: "bg-brand-orange", className: "bg-brand-yellow-soft text-brand-orange-dark" },
  approved: { label: "Approved", dot: "bg-emerald-500", className: "bg-emerald-50 text-emerald-700" },
  rejected: { label: "Rejected", dot: "bg-red-500", className: "bg-red-50 text-red-700" },
};

const AVATAR_COLORS = ["bg-brand-blue", "bg-brand-orange", "bg-brand-green", "bg-brand-blue-dark", "bg-brand-orange-dark"];

function avatarColor(name) {
  const seed = (name || "?").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_COLORS[seed % AVATAR_COLORS.length];
}

function initialsOf(name) {
  return (name || "?")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function UsersGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ClockGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function CheckGlyph({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </svg>
  );
}

function XCircleGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" />
    </svg>
  );
}

function ChevronRightGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function SearchGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function MailGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function PhoneGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8.1 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.9 2.2z" />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending_review;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-semibold ${style.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}

function formatDate(timestamp) {
  if (!timestamp?.toDate) return "—";
  return timestamp.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function InlineSpinner() {
  return <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200 border-t-ink" role="status" aria-label="Loading" />;
}

const STAT_CONFIG = [
  { key: "all", label: "Total applications", icon: UsersGlyph, badge: "bg-gray-100 text-gray-600" },
  { key: "pending_review", label: "Pending review", icon: ClockGlyph, badge: "bg-brand-yellow-soft text-brand-orange-dark" },
  { key: "approved", label: "Approved", icon: CheckGlyph, badge: "bg-emerald-50 text-emerald-600" },
  { key: "rejected", label: "Rejected", icon: XCircleGlyph, badge: "bg-red-50 text-red-600" },
];

function StatCard({ label, value, icon: StatIcon, badgeClassName }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${badgeClassName}`}>
        <StatIcon />
      </span>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">{value}</p>
      <p className="mt-0.5 text-sm text-gray-500">{label}</p>
    </div>
  );
}

function DetailField({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-sm text-ink">{value}</p>
    </div>
  );
}

function ApplicationDetailPanel({ application, onClose, onApprove, onReject, onReset, actionLoading }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40" />

      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${avatarColor(application.fullName)}`}>
              {initialsOf(application.fullName)}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-ink">{application.fullName}</h2>
              <p className="mt-0.5 text-sm text-gray-500">{application.discipline}</p>
              <div className="mt-2">
                <StatusBadge status={application.status} />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-ink"
          >
            <CloseGlyph />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <a href={`mailto:${application.email}`} className="flex items-center gap-2.5 text-sm font-medium text-brand-blue hover:underline">
              <span className="shrink-0 text-gray-400">
                <MailGlyph />
              </span>
              <span className="break-all">{application.email}</span>
            </a>
            <a href={`tel:${application.phone}`} className="flex items-center gap-2.5 text-sm font-medium text-brand-blue hover:underline">
              <span className="shrink-0 text-gray-400">
                <PhoneGlyph />
              </span>
              <span className="break-all">{application.phone}</span>
            </a>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-5">
            <DetailField label="License / registration #" value={application.licenseNumber} />
            <DetailField label="Years of experience" value={application.yearsExperience} />
            <DetailField label="City" value={application.city} />
            <DetailField label="Session fee" value={application.feeAmount ? `Rs ${Number(application.feeAmount).toLocaleString()}` : null} />
            <DetailField label="Submitted" value={formatDate(application.createdAt)} />
          </div>

          {application.concerns?.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Specialties / concerns treated</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {application.concerns.map((concern) => (
                  <span key={concern} className="rounded-pill border border-gray-200 px-3 py-1 text-xs font-semibold text-ink">
                    {concern}
                  </span>
                ))}
              </div>
            </div>
          )}

          {application.languages?.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Languages</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {application.languages.map((language) => (
                  <span key={language} className="rounded-pill border border-gray-200 px-3 py-1 text-xs font-semibold text-ink">
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}

          {application.message && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Additional notes</p>
              <p className="mt-1.5 whitespace-pre-wrap rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-ink">
                {application.message}
              </p>
            </div>
          )}

          {application.reviewedAt && (
            <p className="mt-6 text-xs text-gray-400">Reviewed {formatDate(application.reviewedAt)}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 bg-white px-6 py-5">
          {application.status === "pending_review" ? (
            <>
              <button
                type="button"
                disabled={actionLoading}
                onClick={onApprove}
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
              >
                <CheckGlyph size={16} /> {actionLoading ? "Working..." : "Approve application"}
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={onReject}
                className="rounded-lg border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
              >
                Reject application
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={actionLoading}
              onClick={onReset}
              className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 disabled:opacity-60"
            >
              Reset to pending
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  function loadApplications() {
    setLoading(true);
    setLoadError(false);
    listProviderApplications()
      .then(setApplications)
      .catch((err) => {
        console.error("Failed to load provider applications:", err);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  }

  useEffect(loadApplications, []);
  useEffect(() => setPage(1), [filter, search]);

  const counts = useMemo(
    () => ({
      all: applications.length,
      pending_review: applications.filter((a) => a.status === "pending_review").length,
      approved: applications.filter((a) => a.status === "approved").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
    }),
    [applications]
  );

  const filteredApplications = useMemo(() => {
    const term = search.trim().toLowerCase();
    return applications.filter((application) => {
      if (filter !== "all" && application.status !== filter) return false;
      if (!term) return true;
      return [application.fullName, application.email, application.discipline, application.city]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term));
    });
  }, [applications, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const visibleApplications = filteredApplications.slice(pageStart, pageStart + PAGE_SIZE);

  const selectedApplication = applications.find((a) => a.id === selectedId) || null;

  function patchApplication(id, patch) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  async function handleApprove() {
    if (!selectedApplication) return;
    setActionLoading(true);
    try {
      await approveProviderApplication(selectedApplication, user.uid);
      patchApplication(selectedApplication.id, { status: "approved" });
      setSelectedId(null);
      setToast({ show: true, message: `${selectedApplication.fullName} approved — access unlocks on their next login.` });
    } catch (err) {
      console.error("Failed to approve application:", err);
      setToast({ show: true, message: "Something went wrong approving this application." });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (!selectedApplication) return;
    setActionLoading(true);
    try {
      await rejectProviderApplication(selectedApplication.id, user.uid);
      patchApplication(selectedApplication.id, { status: "rejected" });
      setSelectedId(null);
      setToast({ show: true, message: `${selectedApplication.fullName}'s application was rejected.` });
    } catch (err) {
      console.error("Failed to reject application:", err);
      setToast({ show: true, message: "Something went wrong rejecting this application." });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReset() {
    if (!selectedApplication) return;
    setActionLoading(true);
    try {
      await resetProviderApplicationStatus(selectedApplication.id);
      patchApplication(selectedApplication.id, { status: "pending_review" });
      setSelectedId(null);
      setToast({ show: true, message: "Moved back to pending review." });
    } catch (err) {
      console.error("Failed to reset application:", err);
      setToast({ show: true, message: "Something went wrong updating this application." });
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Provider applications</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-gray-500">
          Review credentials submitted through "Join as a provider." Approving an application unlocks
          the provider dashboard for that person automatically the next time they log in.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STAT_CONFIG.map((stat) => (
            <StatCard key={stat.key} label={stat.label} value={counts[stat.key]} icon={stat.icon} badgeClassName={stat.badge} />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilter(option.id)}
                className={`rounded-pill px-4 py-2 text-sm font-semibold transition-colors ${
                  filter === option.id ? "bg-ink text-white" : "bg-white text-gray-600 hover:text-ink border border-gray-200"
                }`}
              >
                {option.label} <span className="opacity-60">({counts[option.id]})</span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchGlyph />
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applicants"
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-ink outline-none transition-colors focus:border-ink"
            />
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white">
          {loading ? (
            <div className="flex justify-center py-20">
              <InlineSpinner />
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <p className="text-sm text-gray-500">Couldn't load applications.</p>
              <button
                type="button"
                onClick={loadApplications}
                className="rounded-pill border border-gray-200 px-4 py-2 text-sm font-semibold text-ink hover:bg-gray-50"
              >
                Try again
              </button>
            </div>
          ) : visibleApplications.length === 0 ? (
            <div className="py-20 text-center text-sm text-gray-500">
              {applications.length === 0 ? "No applications yet." : "No applications match this filter."}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <th className="px-6 py-3.5 font-semibold">Applicant</th>
                      <th className="px-6 py-3.5 font-semibold">Discipline</th>
                      <th className="px-6 py-3.5 font-semibold">City</th>
                      <th className="px-6 py-3.5 font-semibold">Experience</th>
                      <th className="px-6 py-3.5 font-semibold">Submitted</th>
                      <th className="px-6 py-3.5 font-semibold">Status</th>
                      <th className="px-6 py-3.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {visibleApplications.map((application) => (
                      <tr
                        key={application.id}
                        onClick={() => setSelectedId(application.id)}
                        className="cursor-pointer border-b border-gray-100 last:border-0 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${avatarColor(application.fullName)}`}>
                              {initialsOf(application.fullName)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-ink">{application.fullName}</p>
                              <p className="truncate text-xs text-gray-500">{application.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{application.discipline}</td>
                        <td className="px-6 py-4 text-gray-600">{application.city}</td>
                        <td className="px-6 py-4 text-gray-600">{application.yearsExperience} yrs</td>
                        <td className="px-6 py-4 text-gray-600">{formatDate(application.createdAt)}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={application.status} />
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          <ChevronRightGlyph />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                <p className="text-xs text-gray-500">
                  Showing {pageStart + 1}&ndash;{Math.min(pageStart + PAGE_SIZE, filteredApplications.length)} of{" "}
                  {filteredApplications.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="px-1 text-xs font-medium text-gray-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedApplication && (
        <ApplicationDetailPanel
          application={selectedApplication}
          onClose={() => setSelectedId(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onReset={handleReset}
          actionLoading={actionLoading}
        />
      )}

      <Toast message={toast.message} show={toast.show} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />
    </div>
  );
}
