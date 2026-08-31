import { Link } from "react-router-dom";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import SelectField from "../components/ui/SelectField";
import { useProviderApplicationForm } from "../hooks/useProviderApplicationForm";
import { disciplines, languageOptions, concernOptions } from "../data/providerApplicationForm";

const VALUE_PROPS = [
  {
    title: "Reach clients across Pakistan",
    description: "Get matched with people looking for exactly the support you offer.",
  },
  {
    title: "Set your own schedule",
    description: "Choose your own hours and modality — online, in-person, or both.",
  },
  {
    title: "Secure, confidential platform",
    description: "Identity and clinical data are kept separate and protected by design.",
  },
];

export default function ProviderApplicationPage() {
  const { form, updateField, toggleLanguage, toggleConcern, status, submit } = useProviderApplicationForm();

  function handleSubmit(event) {
    event.preventDefault();
    submit();
  }

  return (
    <section className="bg-white py-16">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Bring your practice to mindcare
        </h1>
        <p className="mt-3 text-sm text-ink-soft">
          Join our network of licensed therapists and psychiatrists. Every provider is
          credential-verified by our team before joining — this form starts that review, it
          doesn&apos;t create an account automatically.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="rounded-lg border border-border bg-surface p-4">
              <h3 className="text-sm font-semibold text-ink">{prop.title}</h3>
              <p className="mt-1 text-xs text-ink-soft">{prop.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-border p-6 shadow-card md:p-8">
          {status === "success" ? (
            <div className="py-10 text-center">
              <h2 className="text-xl font-semibold text-ink">Application received.</h2>
              <p className="mt-2 text-sm text-ink-soft">
                Our team will review your credentials and reach out to your email within a few
                business days.
              </p>
              <p className="mt-4 text-sm text-ink-soft">
                Once approved, come back and{" "}
                <Link to="/app/register" className="font-semibold text-ink underline">
                  create your account
                </Link>{" "}
                using this same email address — that&apos;s what activates your provider
                dashboard.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <FormField
                id="fullName"
                label="Full name*"
                required
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
              />
              <FormField
                id="email"
                label="Email address*"
                type="email"
                required
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
              <FormField
                id="phone"
                label="Phone number*"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />

              <SelectField
                id="discipline"
                label="Discipline*"
                required
                value={form.discipline}
                onChange={(e) => updateField("discipline", e.target.value)}
              >
                <option value="" disabled>
                  Please select
                </option>
                {disciplines.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </SelectField>

              <FormField
                id="licenseNumber"
                label="License / registration number*"
                required
                value={form.licenseNumber}
                onChange={(e) => updateField("licenseNumber", e.target.value)}
              />
              <FormField
                id="yearsExperience"
                label="Years of experience*"
                type="number"
                min="0"
                required
                value={form.yearsExperience}
                onChange={(e) => updateField("yearsExperience", e.target.value)}
              />
              <FormField
                id="city"
                label="City*"
                required
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
              <FormField
                id="address"
                label="Practice address (for in-person sessions)"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
              <FormField
                id="feeAmount"
                label="Session fee (PKR)*"
                type="number"
                min="0"
                step="50"
                required
                value={form.feeAmount}
                onChange={(e) => updateField("feeAmount", e.target.value)}
              />

              <div className="flex flex-col gap-1.5 text-left">
                <span className="text-sm font-medium text-ink">Specialties / concerns you treat*</span>
                <p className="text-xs text-ink-soft">
                  This drives how you're matched to members — pick everything that applies.
                </p>
                <div className="flex flex-wrap gap-2">
                  {concernOptions.map((concern) => {
                    const isSelected = form.concerns.includes(concern);
                    return (
                      <button
                        key={concern}
                        type="button"
                        onClick={() => toggleConcern(concern)}
                        className={`rounded-pill border px-3 py-1.5 text-xs font-semibold ${
                          isSelected ? "border-ink bg-ink text-white" : "border-border text-ink-soft"
                        }`}
                      >
                        {concern}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <span className="text-sm font-medium text-ink">Languages you practice in*</span>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map((language) => {
                    const isSelected = form.languages.includes(language);
                    return (
                      <button
                        key={language}
                        type="button"
                        onClick={() => toggleLanguage(language)}
                        className={`rounded-pill border px-3 py-1.5 text-xs font-semibold ${
                          isSelected
                            ? "border-ink bg-ink text-white"
                            : "border-border text-ink-soft"
                        }`}
                      >
                        {language}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="message" className="text-sm font-medium text-ink">
                  Anything else we should know?
                </label>
                <textarea
                  id="message"
                  rows={3}
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  className="resize-none rounded-md border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
              )}

              <Button type="submit" variant="primary" disabled={status === "loading"}>
                {status === "loading" ? "Submitting..." : "Submit application"}
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
