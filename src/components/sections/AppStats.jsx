import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { appStats } from "../../data/appStats";

export default function AppStats() {
  return (
    <section className="bg-brand-blue py-16 text-white">
      <Container className="flex flex-col items-center gap-8 text-center">
        <h2 className="max-w-xl text-3xl font-semibold tracking-tight md:text-5xl">
          Join the millions who use mindcare every day
        </h2>
        <Button as={Link} to="/app/register" variant="onDark">
          Try for free
        </Button>

        <dl className="mt-6 grid w-full grid-cols-2 gap-8 border-t border-white/20 pt-8 md:grid-cols-4">
          {appStats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-2xl font-semibold md:text-3xl">{stat.value}</dd>
              <p className="mt-1 text-xs text-white/70">{stat.label}</p>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
