export default function BusinessNavDropdown({ label, items, align = "left" }) {
  return (
    <div className="group relative">
      <button type="button" className="relative py-2 text-sm font-medium text-ink-soft hover:text-ink">
        {label}
        <span className="absolute -bottom-px left-0 h-0.5 w-full origin-left scale-x-0 bg-brand-blue transition-transform duration-150 group-hover:scale-x-100" />
      </button>

      <div
        className={`invisible absolute top-full z-40 pt-3 opacity-0 transition-all duration-150
          group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100
          ${align === "right" ? "right-0" : "left-0"}`}
      >
        <div className="w-80 rounded-lg border border-border bg-white p-6 shadow-card">
          <ul className="flex flex-col gap-5">
            {items.map((item) => (
              <li key={item.title}>
                <a href="#" className="block">
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm text-ink-soft">{item.description}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
