import { Outlet } from "react-router-dom";
import TopBanner from "../components/layout/TopBanner";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function MainLayout() {
  return (
    <>
      <TopBanner />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
