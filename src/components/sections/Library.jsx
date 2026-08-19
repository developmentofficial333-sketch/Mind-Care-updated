import Container from "../ui/Container";
import Icon from "../ui/Icon";
import { libraryItems } from "../../data/libraryItems";

const THEME_CLASSES = {
  "brand-orange": "bg-brand-orange",
  "brand-blue": "bg-brand-blue",
  "brand-orange-dark": "bg-brand-orange-dark",
  "brand-yellow": "bg-brand-yellow",
};

export default function Library() {
  return (
    <section className="bg-white py-16">
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
            <article
              key={item.title}
              className={`relative flex aspect-3/4 flex-col justify-end overflow-hidden rounded-lg p-6 text-white ${THEME_CLASSES[item.theme]}`}
            >
              {item.tag && (
                <span className="absolute left-6 top-6 rounded-pill bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  {item.tag}
                </span>
              )}
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-white/85">{item.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
