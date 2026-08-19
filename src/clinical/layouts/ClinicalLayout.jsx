import { Outlet } from "react-router-dom";
import ClinicalHeader from "../components/ClinicalHeader";
import CrisisBar from "../components/CrisisBar";

export default function ClinicalLayout() {
  return (
    <div className="min-h-screen bg-clinical-bg font-clinical-body text-clinical-ink">
      <ClinicalHeader />
      <CrisisBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
