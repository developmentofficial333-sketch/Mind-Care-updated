import { useState } from "react";
import Container from "../ui/Container";
import Button from "../ui/Button";
import PhoneMockup from "../ui/PhoneMockup";
import { guidanceTabs } from "../../data/guidanceTabs";

export default function GuidanceShowcase() {
  const [activeTab, setActiveTab] = useState(guidanceTabs[0]);

  return (
    <section className="bg-white py-16">
      <Container>
        <h2 className="text-center text-3xl font-semibold tracking-tight text-ink md:text-5xl">
          Support for every moment
        </h2>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {guidanceTabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-pill px-5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-ink text-white"
                    : "border border-border text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="flex flex-col justify-between gap-8 rounded-lg bg-brand-yellow p-10 md:flex-row md:items-center">
            <div className="max-w-xs">
              <h3 className="text-2xl font-semibold text-ink">Always-there support</h3>
              <p className="mt-2 text-sm text-ink/80">
                Unpack what&apos;s on your mind with Ebb, our empathetic AI companion, and get
                personalized guidance.
              </p>
              <Button variant="primary" className="mt-6">
                Chat with Ebb
              </Button>
            </div>
            <div className="w-full max-w-40 rounded-lg bg-white p-4 shadow-card">
              <div className="h-3 w-2/3 rounded-full bg-cream" />
              <div className="mt-3 h-10 rounded-2xl bg-surface" />
              <div className="mt-2 ml-auto h-8 w-2/3 rounded-2xl bg-brand-orange" />
            </div>
          </div>

          <div className="flex items-center justify-center rounded-lg bg-brand-pink p-10">
            <PhoneMockup accent="brand-blue" />
          </div>
        </div>
      </Container>
    </section>
  );
}
