import { useState } from "react";
import Container from "../ui/Container";
import Icon from "../ui/Icon";
import { libraryItems } from "../../data/libraryItems";
import { ResourceModal } from "../../clinical/components/ResourceCard";

const THEME_CLASSES = {
  "brand-orange": "bg-brand-orange",
  "brand-blue": "bg-brand-blue",
  "brand-orange-dark": "bg-brand-orange-dark",
  "brand-yellow": "bg-brand-yellow",
};

function LibraryCard({ item, onOpen }) {
  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(item.resource);
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item.resource)}
      onKeyDown={handleKeyDown}
      className={`group relative flex aspect-3/4 cursor-pointer flex-col overflow-hidden rounded-lg text-white shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${THEME_CLASSES[item.theme]}`}
    >
      {item.tag && (
        <span className="absolute left-4 top-4 z-10 rounded-pill border border-white/30 bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur-md">
          {item.tag}
        </span>
      )}

      <div className="relative flex flex-1 items-center justify-center">
        <span className="absolute h-20 w-20 rounded-full bg-white/25 blur-2xl" aria-hidden="true" />
        <span className="relative text-6xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
          {item.emoji}
        </span>
      </div>

      <div className="p-6 pt-0">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p className="mt-1 text-sm text-white/85">{item.description}</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-white/75">{item.duration}</span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-pill bg-white px-3 py-1.5 text-xs font-bold text-ink transition-transform duration-200 group-hover:scale-105">
            {item.ctaLabel}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function Library() {
  const [openResource, setOpenResource] = useState(null);

  return (
    <section id="resources" className="scroll-mt-20 bg-white py-16">
      <Container>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Explore our library
          </h2>
          <div className="hidden items-center gap-4 sm:flex">
            <a href="#" className="text-sm font-medium text-ink-soft hover:text-ink">
              View all
            </a>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
              >
                <Icon name="chevronRight" className="h-4 w-4 rotate-180" />
              </button>
              <button
                type="button"
                aria-label="Next"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
              >
                <Icon name="chevronRight" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {libraryItems.map((item) => (
            <LibraryCard key={item.id} item={item} onOpen={setOpenResource} />
          ))}
        </div>
      </Container>

      {openResource && (
        <ResourceModal resource={openResource} onClose={() => setOpenResource(null)} />
      )}
    </section>
  );
}
