import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Logo from "../ui/Logo";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <section className="bg-cream py-16">
      <Container className="max-w-md">
        <div className="rounded-lg bg-white p-8 text-center shadow-card">
          <Link to="/" className="inline-flex justify-center">
            <Logo />
          </Link>

          <h1 className="mt-6 text-2xl font-semibold text-ink">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>}

          <div className="mt-6">{children}</div>

          {footer && <p className="mt-6 text-sm text-ink-soft">{footer}</p>}
        </div>
      </Container>
    </section>
  );
}
