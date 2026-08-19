import { useState } from "react";
import Container from "../ui/Container";
import Icon from "../ui/Icon";
import { faqItems } from "../../data/faqItems";

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-border py-5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-ink">{item.question}</span>
        <Icon
          name={isOpen ? "minus" : "plus"}
          className="h-5 w-5 flex-shrink-0 text-ink-soft"
        />
      </button>
      {isOpen && <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.answer}</p>}
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="bg-white py-16">
      <Container className="max-w-3xl">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Frequently asked questions
        </h2>

        <div className="mt-8">
          {faqItems.map((item, index) => (
            <FAQItem
              key={item.question}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
