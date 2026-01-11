import { Route, Routes, Navigate } from "react-router-dom";
import MarkList from "./components/MarkList";
import Event from "./components/Event";
import Hero from "./components/Hero";
import Admission from "./components/Admission";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import StudentAttendance from "./components/StudentAttendance";
import AdmissionData from "./components/AdmissionData";
import ViewResult from "./components/ViewResult";
import ForgotPassword from "./components/ForgotPassword";
import Short from "./components/Short";
import VideoUpload from "./components/VideoUpload";
import ViewAttendance from "./components/ViewAttendance";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import ResetPassword from "./components/ResetPassword";
import VerifyOtp from "./components/VerifyOtp";

function App() {
  return (
    <>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <Footer />
            </>
          }
        />
        <Route
          path="/admission"
          element={
            <>
              <Navbar />
              <Admission />
              <Footer />
            </>
          }
        />
        <Route
          path="/event"
          element={
            <>
              <Navbar />
              <Event />
              <Footer />
            </>
          }
        />
        <Route
          path="/admin-login"
          element={
            <>
              <Navbar />
              <AdminLogin />
              <Footer />
            </>
          }
        />
        <Route
          path="/adminlogin"
          element={
            <>
              <Navbar />
              <AdminLogin />
              <Footer />
            </>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <>
              <Navbar />
              <ForgotPassword />
              <Footer />
            </>
          }
        />

        {/* Reset password (expects user id param from reset email link) */}
        <Route
          path="/reset-password"
          element={
            <>
              <Navbar />
              <ResetPassword />
              <Footer />
            </>
          }
        />

        {/* Verify OTP page */}
        <Route
          path="/verify-otp"
          element={
            <>
              <Navbar />
              <VerifyOtp />
              <Footer />
            </>
          }
        />

        <Route
          path="/shorts"
          element={
            <>
              <Navbar />
              <Short />
              <Footer />
            </>
          }
        />
        <Route
          path="/videos"
          element={
            <>
              <Navbar />
              <VideoUpload />
              <Footer />
            </>
          }
        />

        {/* ================= PRIVACY & TERMS ================= */}
        <Route
          path="/privacy-policy"
          element={
            <>
              <Navbar />
              <PrivacyPolicy />
              <Footer />
            </>
          }
        />
        <Route
          path="/terms-of-service"
          element={
            <>
              <Navbar />
              <TermsOfService />
              <Footer />
            </>
          }
        />

        {/* ================= ADMIN DASHBOARD ROUTES ================= */}
        <Route
          path="/admin-dashboard"
          element={
            <div className="flex">
              <Sidebar />
              <div className="ml-64 w-full bg-gray-100 min-h-screen p-6">
                <AdminDashboard />
              </div>
            </div>
          }
        />
        <Route
          path="/admin-dashboard/marklist"
          element={
            <div className="flex">
              <Sidebar />
              <div className="ml-64 w-full bg-gray-100 min-h-screen p-6">
                <MarkList />
              </div>
            </div>
          }
        />
        <Route
          path="/admin-dashboard/admissiondata"
          element={
            <div className="flex">
              <Sidebar />
              <div className="ml-64 w-full bg-gray-100 min-h-screen p-6">
                <AdmissionData />
              </div>
            </div>
          }
        />
        <Route
          path="/protectedroute"
          element={
            <div className="flex">
              <Sidebar />
              <div className="ml-64 w-full bg-gray-100 min-h-screen p-6">
                <ProtectedRoute />
              </div>
            </div>
          }
        />
        <Route
          path="/admin-dashboard/attendance"
          element={
            <div className="flex">
              <Sidebar />
              <div className="ml-64 w-full bg-gray-100 min-h-screen p-6">
                <StudentAttendance />
              </div>
            </div>
          }
        />
        <Route
          path="/admin-dashboard/attendance-view"
          element={
            <div className="flex">
              <Sidebar />
              <div className="ml-64 w-full bg-gray-100 min-h-screen p-6">
                <ViewAttendance />
              </div>
            </div>
          }
        />
        <Route
          path="/admin-dashboard/view-result"
          element={
            <div className="flex">
              <Sidebar />
              <div className="ml-64 w-full bg-gray-100 min-h-screen p-6">
                <ViewResult />
              </div>
            </div>
          }
        />

        {/* ================= REDIRECTS ================= */}
        <Route
          path="/attendance"
          element={<Navigate to="/admin-dashboard/attendance" replace />}
        />
        <Route
          path="/attendance-view"
          element={<Navigate to="/admin-dashboard/attendance-view" replace />}
        />

        {/* ================= FALLBACK 404 ================= */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen text-2xl">
              404 | Page Not Found
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
