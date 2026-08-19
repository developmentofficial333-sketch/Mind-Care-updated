import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";
import PhoneMockup from "../ui/PhoneMockup";

export default function Hero() {
  return (
    <section id="top" className="bg-cream pb-16 pt-14">
      <Container className="flex flex-col items-center text-center">
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-ink md:text-6xl">
          Stress less
          <br />
          all with mindcare
        </h1>
      </Container>

      <Container className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="flex flex-col items-center gap-6 rounded-lg bg-surface p-8 text-center md:flex-row md:text-left">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-ink">Mental health app</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Expert-led meditations and tools for a calmer mind.
            </p>
            <Button as={Link} to="/app/register" variant="primary" className="mt-5">
              Try for $0
            </Button>
          </div>
          <PhoneMockup accent="brand-orange" className="mx-auto md:mx-0" />
        </div>

        <div className="flex flex-col items-center gap-6 rounded-lg bg-brand-blue p-8 text-center text-white md:flex-row md:text-left">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">Online therapy</h2>
            <p className="mt-2 text-sm text-white/80">
              Licensed therapists that accept insurance.
            </p>
            <Button variant="onDark" className="mt-5">
              Check your coverage
            </Button>
          </div>
          <PhoneMockup accent="brand-pink" className="mx-auto md:mx-0" />
        </div>
      </Container>
    </section>
  );
}
