import Hero from "../components/sections/Hero";
import QuickFilters from "../components/sections/QuickFilters";
import GuidanceShowcase from "../components/sections/GuidanceShowcase";
import Testimonials from "../components/sections/Testimonials";
import OrgBanner from "../components/sections/OrgBanner";
import PartnerMarquee from "../components/sections/PartnerMarquee";
import Library from "../components/sections/Library";
import AppStats from "../components/sections/AppStats";
import FAQ from "../components/sections/FAQ";
import CTABanner from "../components/sections/CTABanner";
import Newsletter from "../components/sections/Newsletter";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <QuickFilters />
      <GuidanceShowcase />
      <Testimonials />
      <OrgBanner />
      <PartnerMarquee />
      <Library />
      <AppStats />
      <FAQ />
      <CTABanner />
      <Newsletter />
    </>
  );
}
