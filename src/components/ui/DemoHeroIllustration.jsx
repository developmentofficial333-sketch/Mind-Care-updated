import Icon from "./Icon";

const ROLES = [
  { label: "Psychiatrist", dot: "bg-brand-pink" },
  { label: "Therapist", dot: "bg-brand-green" },
  { label: "Coach", dot: "bg-brand-orange" },
];

export default function DemoHeroIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm">
      <div className="absolute inset-6 rounded-full bg-brand-blue/15" />
      <div className="absolute inset-16 rounded-full bg-gradient-to-br from-brand-orange to-brand-pink" />

      <div className="absolute left-0 top-4 w-40 rounded-lg bg-white p-3 shadow-card">
        {ROLES.map((role) => (
          <div key={role.label} className="flex items-center gap-2 py-1 text-xs font-medium text-ink">
            <span className={`h-2.5 w-2.5 rounded-full ${role.dot}`} />
            {role.label}
          </div>
        ))}
      </div>

      <div className="absolute right-0 top-0 flex w-36 items-center gap-2 rounded-lg bg-white p-3 shadow-card">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#6b5ce6]">
          <Icon name="moon" className="h-4 w-4 text-white" />
        </span>
        <div>
          <p className="text-xs font-semibold text-ink">Let Go of Tension</p>
          <p className="text-[11px] text-ink-soft">Sleepcast</p>
        </div>
      </div>

      <div className="absolute bottom-6 left-2 flex w-40 items-center gap-2 rounded-lg bg-white p-3 shadow-card">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-orange">
          <Icon name="leaf" className="h-4 w-4 text-white" />
        </span>
        <div>
          <p className="text-xs font-semibold text-ink">CBT for Anxiety &amp; Depression</p>
          <p className="text-[11px] text-ink-soft">Guided Program</p>
        </div>
      </div>

      <div className="absolute bottom-0 right-4 flex items-center gap-1.5 rounded-pill bg-white px-3 py-2 shadow-card">
        <Icon name="sparkle" className="h-3.5 w-3.5 text-brand-orange" />
        <p className="text-[11px] font-semibold text-ink">Empathetic AI companion</p>
      </div>
    </div>
  );
}
