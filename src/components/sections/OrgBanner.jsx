import Container from "../ui/Container";
import Button from "../ui/Button";

const AVATAR_POSITIONS = [
  "bg-brand-orange top-4 left-6 h-20 w-20",
  "bg-brand-yellow top-24 left-32 h-16 w-16",
  "bg-brand-pink top-2 right-10 h-24 w-24",
  "bg-brand-green top-28 right-32 h-14 w-14",
];

export default function OrgBanner() {
  return (
    <section className="bg-brand-blue py-16 text-white">
      <Container className="flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
        <div className="flex-1">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Over 4,000 leading organizations choose mindcare
          </h2>
          <p className="mt-4 max-w-md text-sm text-white/80">
            Support your team today with mindfulness, coaching, EAP, therapy, and psychiatry.
          </p>
          <Button variant="onDark" className="mt-6">
            Learn more
          </Button>
        </div>

        <div className="relative h-64 flex-1">
          {AVATAR_POSITIONS.map((classes, index) => (
            <span
              key={index}
              className={`absolute rounded-full border-4 border-white/20 ${classes}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
