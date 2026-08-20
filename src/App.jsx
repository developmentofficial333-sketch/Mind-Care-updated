import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { LanguageProvider } from "./context/LanguageProvider";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import ProviderRoute from "./components/routing/ProviderRoute";
import MainLayout from "./layouts/MainLayout";
import BusinessLayout from "./layouts/BusinessLayout";
import LandingPage from "./pages/LandingPage";
import RequestDemoPage from "./pages/RequestDemoPage";
import ProviderApplicationPage from "./pages/ProviderApplicationPage";
import ClinicalLayout from "./clinical/layouts/ClinicalLayout";
import VisitPage from "./clinical/pages/VisitPage";
import RegisterPage from "./clinical/pages/RegisterPage";
import ClinicalLoginPage from "./clinical/pages/ClinicalLoginPage";
import IdentifyNeedPage from "./clinical/pages/IdentifyNeedPage";
import ClinicalQuizPage from "./clinical/pages/ClinicalQuizPage";
import DashboardPage from "./clinical/pages/DashboardPage";
import ProviderDashboardPage from "./clinical/pages/ProviderDashboardPage";
import CrisisSupportPage from "./clinical/pages/CrisisSupportPage";
import CarePage from "./clinical/pages/CarePage";
import ChooseModePage from "./clinical/pages/ChooseModePage";
import BookPage from "./clinical/pages/BookPage";
import ConfirmationPage from "./clinical/pages/ConfirmationPage";
import SessionPage from "./clinical/pages/SessionPage";
import FollowUpPage from "./clinical/pages/FollowUpPage";
import PrivacyPolicyPage from "./clinical/pages/PrivacyPolicyPage";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/providers" element={<ProviderApplicationPage />} />
          </Route>

          <Route element={<BusinessLayout />}>
            <Route path="/request-demo" element={<RequestDemoPage />} />
          </Route>

          <Route element={<ClinicalLayout />}>
            <Route path="/app" element={<VisitPage />} />
            <Route path="/app/register" element={<RegisterPage />} />
            <Route path="/app/login" element={<ClinicalLoginPage />} />
            <Route path="/app/crisis-support" element={<CrisisSupportPage />} />
            <Route path="/app/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/app/quiz" element={<ClinicalQuizPage />} />
            <Route
              path="/app/identify-need"
              element={
                <ProtectedRoute redirectTo="/app/login">
                  <IdentifyNeedPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute redirectTo="/app/login">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/dashboard"
              element={
                <ProviderRoute redirectTo="/app/login">
                  <ProviderDashboardPage />
                </ProviderRoute>
              }
            />
            <Route
              path="/app/care"
              element={
                <ProtectedRoute redirectTo="/app/login">
                  <CarePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/choose-mode/:providerId"
              element={
                <ProtectedRoute redirectTo="/app/login">
                  <ChooseModePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/book/:providerId/:mode"
              element={
                <ProtectedRoute redirectTo="/app/login">
                  <BookPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/confirmation/:appointmentId"
              element={
                <ProtectedRoute redirectTo="/app/login">
                  <ConfirmationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/session/:appointmentId"
              element={
                <ProtectedRoute redirectTo="/app/login">
                  <SessionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/follow-up/:appointmentId"
              element={
                <ProtectedRoute redirectTo="/app/login">
                  <FollowUpPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
