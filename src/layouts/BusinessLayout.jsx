import { Outlet } from "react-router-dom";
import BusinessHeader from "../components/layout/BusinessHeader";
import Footer from "../components/layout/Footer";

export default function BusinessLayout() {
  return (
    <>
      <BusinessHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
