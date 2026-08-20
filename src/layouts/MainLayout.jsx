import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopBanner from "../components/layout/TopBanner";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CrisisBar from "../clinical/components/CrisisBar";

export default function MainLayout() {
  const location = useLocation();

  // Nav links like "Resources" point at "/#resources" so they work from any
  // page under this layout, not just when already on the landing page.
  // React Router's <Link> updates the URL without triggering the browser's
  // native hash-scroll, so it's done manually here once the target section
  // has had a chance to mount.
  useEffect(() => {
    if (!location.hash) return;
    const target = document.getElementById(location.hash.slice(1));
    target?.scrollIntoView({ behavior: "smooth" });
  }, [location.pathname, location.hash]);

  return (
    <>
      <TopBanner />
      <Header />
      <CrisisBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
