import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";

export default function CTABanner() {
  return (
    <section className="bg-brand-yellow py-20">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-ink">
          Get your mindcare
        </h2>
        <Button as={Link} to="/signup" variant="primary" className="px-8 py-4 text-base">
          Try for free
        </Button>
      </Container>
    </section>
  );
}
