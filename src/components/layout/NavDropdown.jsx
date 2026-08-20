import { Link } from "react-router-dom";
import Icon from "../ui/Icon";

function ColumnSection({ heading, items }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{heading}</h3>
      <ul className="mt-3 flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.label}>
            <a href={item.href} className="text-sm text-ink hover:text-brand-orange">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function NavDropdown({ label, href, submenu }) {
  const { columnGroups, promo } = submenu;

  return (
    <div className="group relative">
      <Link
        to={href}
        className="flex items-center gap-1 py-2 text-sm font-medium text-ink-soft hover:text-ink"
      >
        {label}
        <Icon name="chevronDown" className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
      </Link>

      <div
        className="invisible absolute left-1/2 top-full z-40 -translate-x-1/2 pt-3 opacity-0 transition-all
          duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible
          group-focus-within:opacity-100"
      >
        <div className="flex w-150 gap-10 rounded-lg border border-border bg-white p-6 shadow-card">
          {columnGroups.map((group, index) => (
            <div key={index} className="flex flex-1 flex-col gap-6">
              {group.sections.map((section) => (
                <ColumnSection key={section.heading} heading={section.heading} items={section.items} />
              ))}
            </div>
          ))}

          {promo && (
            <Link
              to={promo.href}
              className="flex w-44 shrink-0 flex-col justify-between self-start overflow-hidden rounded-md bg-brand-blue p-4"
            >
              <Icon name="sparkle" className="h-6 w-6 text-white/80" />
              <span className="flex items-center gap-1 text-sm font-semibold text-white">
                {promo.title}
                <Icon name="arrowRight" className="h-4 w-4" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
