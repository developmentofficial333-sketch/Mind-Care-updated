import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { resources } from "../data/resources";
import { providers } from "../data/providers";

const FEE_BANDS = [
  { label: "Under Rs 3,000", test: (fee) => fee < 3000 },
  { label: "Rs 3,000–4,000", test: (fee) => fee >= 3000 && fee <= 4000 },
  { label: "Above Rs 4,000", test: (fee) => fee > 4000 },
];

function uniqueValues(list, getValue) {
  const values = list.flatMap(getValue);
  return [...new Set(values)].sort();
}

function ResourceCard({ resource }) {
  return (
    <div className="rounded-2xl border border-clinical-border bg-clinical-surface p-3.5">
      <span className="text-[11px] font-bold uppercase text-clinical-teal-dark">
        {resource.type} &middot; {resource.length}
      </span>
      <h3 className="font-clinical-heading mt-1 text-sm font-bold text-clinical-ink">
        {resource.title}
      </h3>
    </div>
  );
}

function ProviderCard({ provider }) {
  return (
    <div className="rounded-2xl border border-clinical-border bg-clinical-surface p-3.5">
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
        </div>
      </div>
      <Link
        to={`/app/choose-mode/${provider.id}`}
        className="font-clinical-heading mt-2.5 block rounded-full border-[1.5px] border-clinical-teal py-2 text-center text-xs font-bold text-clinical-teal-dark"
      >
        View profile
      </Link>
    </div>
  );
}

const INITIAL_FILTERS = { discipline: "", concern: "", language: "", location: "", feeBand: "" };

export default function CarePage() {
  const [tab, setTab] = useState("providers");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const disciplines = useMemo(() => uniqueValues(providers, (p) => p.discipline), []);
  const concerns = useMemo(() => uniqueValues(providers, (p) => p.concerns), []);
  const languages = useMemo(() => uniqueValues(providers, (p) => p.languages), []);
  const locations = useMemo(() => uniqueValues(providers, (p) => p.location), []);

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProviders = providers.filter((provider) => {
    if (filters.discipline && provider.discipline !== filters.discipline) return false;
    if (filters.concern && !provider.concerns.includes(filters.concern)) return false;
    if (filters.language && !provider.languages.includes(filters.language)) return false;
    if (filters.location && provider.location !== filters.location) return false;
    if (filters.feeBand) {
      const band = FEE_BANDS.find((b) => b.label === filters.feeBand);
      if (band && !band.test(provider.feeAmount)) return false;
    }
    return true;
  });

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-6">
      <div className="flex border-b border-clinical-border">
        <button
          type="button"
          onClick={() => setTab("resources")}
          className={`font-clinical-heading flex-1 border-b-2 py-3 text-sm font-bold ${
            tab === "resources"
              ? "border-clinical-teal text-clinical-teal-dark"
              : "border-transparent text-clinical-ink-soft"
          }`}
        >
          Resource Library
        </button>
        <button
          type="button"
          onClick={() => setTab("providers")}
          className={`font-clinical-heading flex-1 border-b-2 py-3 text-sm font-bold ${
            tab === "providers"
              ? "border-clinical-teal text-clinical-teal-dark"
              : "border-transparent text-clinical-ink-soft"
          }`}
        >
          Find a Provider
        </button>
      </div>

      {tab === "resources" && (
        <div className="mt-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full rounded-full border border-clinical-border bg-clinical-surface px-4 py-2.5 text-sm outline-none focus:border-clinical-teal"
          />
          <div className="mt-4 flex flex-col gap-3">
            {filteredResources.length ? (
              filteredResources.map((resource) => (
                <ResourceCard key={resource.title} resource={resource} />
              ))
            ) : (
              <p className="py-6 text-center text-sm text-clinical-ink-soft">
                No resources match &ldquo;{search}&rdquo;.
              </p>
            )}
          </div>
        </div>
      )}

      {tab === "providers" && (
        <div className="mt-5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <select
              value={filters.discipline}
              onChange={(e) => updateFilter("discipline", e.target.value)}
              className="rounded-full border border-clinical-border bg-clinical-surface px-3 py-1.5 text-xs font-semibold text-clinical-ink"
            >
              <option value="">Discipline</option>
              {disciplines.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <select
              value={filters.concern}
              onChange={(e) => updateFilter("concern", e.target.value)}
              className="rounded-full border border-clinical-border bg-clinical-surface px-3 py-1.5 text-xs font-semibold text-clinical-ink"
            >
              <option value="">Concern</option>
              {concerns.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <select
              value={filters.language}
              onChange={(e) => updateFilter("language", e.target.value)}
              className="rounded-full border border-clinical-border bg-clinical-surface px-3 py-1.5 text-xs font-semibold text-clinical-ink"
            >
              <option value="">Language</option>
              {languages.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <select
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              className="rounded-full border border-clinical-border bg-clinical-surface px-3 py-1.5 text-xs font-semibold text-clinical-ink"
            >
              <option value="">Location</option>
              {locations.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <select
              value={filters.feeBand}
              onChange={(e) => updateFilter("feeBand", e.target.value)}
              className="rounded-full border border-clinical-border bg-clinical-surface px-3 py-1.5 text-xs font-semibold text-clinical-ink"
            >
              <option value="">Fee</option>
              {FEE_BANDS.map((band) => (
                <option key={band.label} value={band.label}>
                  {band.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {filteredProviders.length ? (
              filteredProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))
            ) : (
              <p className="py-6 text-center text-sm text-clinical-ink-soft">
                No providers match those filters.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
