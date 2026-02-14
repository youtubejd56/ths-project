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


// NEW Manage Event Posts component
import ManageEventPosts from "./components/ManageEventPosts";
import ManageShortPosts from "./components/ManageShortPosts";

function App() {
  return (
    <>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<><Navbar /><Hero /><Footer /></>} />
        <Route path="/admission" element={<><Navbar /><Admission /><Footer /></>} />
        <Route path="/event" element={<><Navbar /><Event /><Footer /></>} />
        <Route path="/admin-login" element={<><Navbar /><AdminLogin /><Footer /></>} />
        <Route path="/adminlogin" element={<><Navbar /><AdminLogin /><Footer /></>} />
        <Route path="/forgot-password" element={<><Navbar /><ForgotPassword /><Footer /></>} />
        <Route path="/reset-password" element={<><Navbar /><ResetPassword /><Footer /></>} />
        <Route path="/verify-otp" element={<><Navbar /><VerifyOtp /><Footer /></>} />
        <Route path="/shorts" element={<><Navbar /><Short /><Footer /></>} />
        <Route path="/videos" element={<><Navbar /><VideoUpload /><Footer /></>} />
        <Route path="/privacy-policy" element={<><Navbar /><PrivacyPolicy /><Footer /></>} />
        <Route path="/terms-of-service" element={<><Navbar /><TermsOfService /><Footer /></>} />

        {/* ================= ADMIN DASHBOARD ROUTES ================= */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="ml-64 w-full bg-gray-100 min-h-screen p-6">
                <AdminDashboard />
              </div>
            </div>
          </ProtectedRoute>
        } />

        <Route path="/admin-dashboard/marklist" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="ml-64 w-full bg-gray-100 min-h-screen p-6">
                <MarkList />
              </div>
            </div>
          </ProtectedRoute>
        } />

        <Route path="/admin-dashboard/admissiondata" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="ml-64 w-full bg-gray-100 min-h-screen p-6">
                <AdmissionData />
              </div>
            </div>
          </ProtectedRoute>
        } />

        <Route path="/admin-dashboard/attendance" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="ml-64 w-full bg-gray-100 min-h-screen p-6">
                <StudentAttendance />
              </div>
            </div>
          </ProtectedRoute>
        } />

        <Route path="/admin-dashboard/attendance-view" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="ml-64 w-full bg-gray-100 min-h-screen p-6">
                <ViewAttendance />
              </div>
            </div>
          </ProtectedRoute>
        } />

        <Route path="/admin-dashboard/view-result" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="ml-64 w-full bg-gray-100 min-h-screen p-6">
                <ViewResult />
              </div>
            </div>
          </ProtectedRoute>
        } />

        {/* ================= NEW: Manage Event Posts ================= */}
        <Route path="/admin-dashboard/manage-events" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="ml-64 w-full bg-gray-100 min-h-screen p-6">
                <ManageEventPosts />
              </div>
            </div>
          </ProtectedRoute>
        } />

        {/* ================= NEW: Manage Short Posts ================= */}
        <Route path="/admin-dashboard/manage-shorts" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="ml-64 w-full bg-gray-100 min-h-screen p-6">
                <ManageShortPosts />
              </div>
            </div>
          </ProtectedRoute>
        } />

        {/* ================= REDIRECTS ================= */}
        <Route path="/attendance" element={<Navigate to="/admin-dashboard/attendance" replace />} />
        <Route path="/attendance-view" element={<Navigate to="/admin-dashboard/attendance-view" replace />} />

        {/* ================= FALLBACK 404 ================= */}
        <Route path="*" element={
          <div className="flex items-center justify-center h-screen text-2xl">
            404 | Page Not Found
          </div>
        } />
      </Routes>
    </>
  );
}

export default App;
