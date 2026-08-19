import { partnerNames } from "../../data/partners";

const loopedNames = [...partnerNames, ...partnerNames];

export default function PartnerMarquee() {
  return (
    <div className="overflow-hidden border-y border-border bg-white py-6">
      <div className="flex w-max animate-marquee gap-16">
        {loopedNames.map((name, index) => (
          <span
            key={`${name}-${index}`}
            className="whitespace-nowrap text-sm font-semibold uppercase tracking-wide text-ink-soft"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
