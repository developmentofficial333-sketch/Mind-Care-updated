import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import SelectField from "../components/ui/SelectField";
import Toast from "../components/ui/Toast";
import DemoHeroIllustration from "../components/ui/DemoHeroIllustration";
import { useDemoRequestForm } from "../hooks/useDemoRequestForm";
import { helpOptions, countries, headquarterRegions } from "../data/demoForm";
import { partnerNames } from "../data/partners";
import { suiteTiers, suiteFeatures } from "../data/suite";
import { businessTestimonial } from "../data/businessTestimonial";

function Cloud({ className }) {
  return (
    <svg viewBox="0 0 120 70" className={className} aria-hidden="true">
      <ellipse cx="40" cy="45" rx="35" ry="22" fill="currentColor" />
      <ellipse cx="75" cy="35" rx="30" ry="26" fill="currentColor" />
    </svg>
  );
}

export default function RequestDemoPage() {
  const { form, updateField, status, submit } = useDemoRequestForm();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (status === "success") setShowToast(true);
  }, [status]);

  function handleSubmit(event) {
    event.preventDefault();
    submit();
  }

  return (
    <>
      <section className="bg-white py-16">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-ink md:text-5xl">
              Request a demo to learn more about how we can support your team
            </h1>
            <p className="mt-4 max-w-md text-sm text-ink-soft">
              We partner with more than 4,000+ employers and health plans to deliver
              outcomes-driven care — from proactive support to licensed therapy and
              psychiatry.
            </p>
            <div className="mt-12">
              <DemoHeroIllustration />
            </div>
          </div>

          <div id="demo-form" className="rounded-lg border border-border p-6 shadow-card md:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <SelectField
                id="helpType"
                label="How can we help?*"
                required
                value={form.helpType}
                onChange={(e) => updateField("helpType", e.target.value)}
              >
                <option value="" disabled>
                  Please Select
                </option>
                {helpOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </SelectField>

              <p className="-mt-2 text-xs text-ink-soft">
                Individual therapist or psychiatrist looking to join mindcare yourself?{" "}
                <Link to="/providers" className="font-semibold text-ink underline">
                  Apply as a provider instead
                </Link>
                .
              </p>

              <FormField
                id="firstName"
                label="First name*"
                required
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
              />
              <FormField
                id="lastName"
                label="Last name*"
                required
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
              />
              <FormField
                id="email"
                label="Work email*"
                type="email"
                required
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />

              <div>
                <span className="text-sm font-medium text-ink">Phone number*</span>
                <div className="mt-1.5 flex gap-2">
                  <select
                    aria-label="Country code"
                    value={form.dialCode}
                    onChange={(e) => updateField("dialCode", e.target.value)}
                    className="w-32 rounded-md border border-border bg-white px-2 py-2.5 text-sm text-ink outline-none focus:border-ink"
                  >
                    {countries.map((country) => (
                      <option key={country.name} value={country.dialCode}>
                        {country.name} ({country.dialCode})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    required
                    aria-label="Phone number"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="flex-1 rounded-md border border-border bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-ink"
                  />
                </div>
              </div>

              <FormField
                id="jobTitle"
                label="Job title"
                value={form.jobTitle}
                onChange={(e) => updateField("jobTitle", e.target.value)}
              />
              <FormField
                id="companyName"
                label="Company name*"
                required
                value={form.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
              />

              <SelectField
                id="headquarters"
                label="Where is your company's global headquarters?*"
                required
                value={form.headquarters}
                onChange={(e) => updateField("headquarters", e.target.value)}
              >
                <option value="" disabled>
                  Please Select
                </option>
                {headquarterRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </SelectField>

              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="message" className="text-sm font-medium text-ink">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  className="resize-none rounded-md border border-border bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-ink"
                />
              </div>

              <p className="text-xs text-ink-soft">
                By submitting this form, you agree that we may use the data you provide to
                contact you with information related to your request. Your data will be used
                subject to mindcare&apos;s privacy policy.
              </p>

              {status === "error" && (
                <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
              )}

              <Button type="submit" variant="primary" disabled={status === "loading"}>
                {status === "loading" ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </div>
        </Container>
      </section>

      <Toast
        message="Thank you! Our workplace wellness team will reach out within 24 hours."
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      <section className="bg-white pb-16">
        <Container>
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Leading organizations trust mindcare
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-border pt-8">
            {partnerNames.map((name) => (
              <span key={name} className="text-sm font-semibold uppercase tracking-wide text-ink-soft/70">
                {name}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16">
        <Container>
          <h2 className="text-center text-3xl font-semibold tracking-tight text-ink">
            The Global mindcare Suite
          </h2>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-1/4" />
                  {suiteTiers.map((tier, index) => (
                    <th key={tier} className="px-2 pb-4">
                      <span
                        className={`block rounded-pill px-4 py-2 text-sm font-semibold text-white ${
                          index === 0 ? "bg-brand-orange" : index === 1 ? "bg-brand-yellow text-ink" : "bg-brand-blue"
                        }`}
                      >
                        {tier}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {suiteFeatures.map((feature) => (
                  <tr key={feature.label} className="border-t border-border">
                    <td className="py-3 text-ink">{feature.label}</td>
                    {feature.availability.map((available, index) => (
                      <td key={index} className="py-3 text-center">
                        {available && <span className="text-brand-green">&#10003;</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 flex justify-center">
            <a href="#demo-form">
              <Button variant="primary">Request a demo</Button>
            </a>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-white py-20">
        <Cloud className="absolute -left-4 top-10 h-16 w-28 text-brand-blue/80" />
        <Cloud className="absolute -right-4 bottom-10 h-16 w-28 text-brand-blue/80" />
        <Container className="max-w-2xl text-center">
          <p className="text-xl font-medium leading-relaxed text-ink md:text-2xl">
            &ldquo;{businessTestimonial.quote}&rdquo;
          </p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-ink-soft">
            {businessTestimonial.name} · {businessTestimonial.role}
          </p>
        </Container>
      </section>
    </>
  );
}
