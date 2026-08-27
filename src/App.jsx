import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { LanguageProvider } from "./context/LanguageProvider";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import ProviderRoute from "./components/routing/ProviderRoute";
import AdminRoute from "./components/routing/AdminRoute";
import MainLayout from "./layouts/MainLayout";
import BusinessLayout from "./layouts/BusinessLayout";
import AdminLayout from "./layouts/AdminLayout";
import ClinicalLayout from "./clinical/layouts/ClinicalLayout";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Every page is its own chunk, fetched only when that route is visited —
// a member never downloads the admin dashboard's code, a marketing visitor
// never downloads the booking/session code, etc. Layouts stay eager (tiny,
// needed immediately for every route in their group).
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const RequestDemoPage = lazy(() => import("./pages/RequestDemoPage"));
const ProviderApplicationPage = lazy(() => import("./pages/ProviderApplicationPage"));
const VisitPage = lazy(() => import("./clinical/pages/VisitPage"));
const RegisterPage = lazy(() => import("./clinical/pages/RegisterPage"));
const ClinicalLoginPage = lazy(() => import("./clinical/pages/ClinicalLoginPage"));
const IdentifyNeedPage = lazy(() => import("./clinical/pages/IdentifyNeedPage"));
const ClinicalQuizPage = lazy(() => import("./clinical/pages/ClinicalQuizPage"));
const DashboardPage = lazy(() => import("./clinical/pages/DashboardPage"));
const ProviderDashboardPage = lazy(() => import("./clinical/pages/ProviderDashboardPage"));
const CrisisSupportPage = lazy(() => import("./clinical/pages/CrisisSupportPage"));
const CarePage = lazy(() => import("./clinical/pages/CarePage"));
const ChooseModePage = lazy(() => import("./clinical/pages/ChooseModePage"));
const BookPage = lazy(() => import("./clinical/pages/BookPage"));
const ConfirmationPage = lazy(() => import("./clinical/pages/ConfirmationPage"));
const SessionPage = lazy(() => import("./clinical/pages/SessionPage"));
const FollowUpPage = lazy(() => import("./clinical/pages/FollowUpPage"));
const PrivacyPolicyPage = lazy(() => import("./clinical/pages/PrivacyPolicyPage"));

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/providers" element={<ProviderApplicationPage />} />
            </Route>

            <Route element={<BusinessLayout />}>
              <Route path="/request-demo" element={<RequestDemoPage />} />
            </Route>

            <Route element={<AdminLayout />}>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />
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
        </Suspense>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
