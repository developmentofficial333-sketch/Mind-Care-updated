import Container from "../ui/Container";
import { testimonials } from "../../data/testimonials";

export default function Testimonials() {
  return (
    <section className="bg-cream-soft py-16">
      <Container>
        <h2 className="max-w-lg text-3xl font-semibold tracking-tight text-ink md:text-5xl">
          Members are enjoying happier and healthier lives
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex flex-col justify-between rounded-lg bg-surface p-6"
            >
              <blockquote className="text-sm leading-relaxed text-ink">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-6 text-xs font-medium text-ink-soft">
                {testimonial.name} · {testimonial.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
