import { useState } from "react";
import Container from "../ui/Container";
import Icon from "../ui/Icon";
import QuickFilterModal from "./QuickFilterModal";
import { quickFilters } from "../../data/quickFilters";

const ICON_BG = {
  "brand-orange": "bg-brand-orange-dark",
  "brand-blue": "bg-brand-blue",
  "brand-green": "bg-brand-green",
  "brand-yellow": "bg-brand-yellow",
};

export default function QuickFilters() {
  const [activeLabel, setActiveLabel] = useState(null);

  function handleSelect(label) {
    setActiveLabel(label);
  }

  return (
    <section className="bg-white py-14">
      <Container>
        <h2 className="text-center text-xl font-semibold text-ink md:text-2xl">
          What kind of mindcare are you looking for?
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {quickFilters.map((filter) => {
            const isActive = activeLabel === filter.label;
            return (
              <button
                key={filter.label}
                type="button"
                onClick={() => handleSelect(filter.label)}
                className={`group flex items-center justify-between gap-3 rounded-pill border bg-white px-5 py-4 text-left text-sm font-medium text-ink transition-colors hover:border-ink ${
                  isActive ? "border-ink" : "border-border"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${ICON_BG[filter.color]}`}
                  >
                    <Icon name={filter.icon} className="h-4 w-4" />
                  </span>
                  {filter.label}
                  <span
                    role="img"
                    aria-label=""
                    className={`text-lg transition-transform duration-200 ${
                      isActive ? "scale-125" : "group-hover:scale-125"
                    }`}
                  >
                    {filter.emoji}
                  </span>
                </span>
                <Icon name="chevronRight" className="h-4 w-4 text-ink-soft" />
              </button>
            );
          })}
        </div>
      </Container>

      <QuickFilterModal label={activeLabel} onClose={() => setActiveLabel(null)} />
    </section>
  );
}
