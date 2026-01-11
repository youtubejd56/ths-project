// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import API_BASE_URL from "../api/config";

const API_BASE = `${API_BASE_URL}/api`;

// axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// attach access token before request
api.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) config.headers.Authorization = `Bearer ${access}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// refresh token interceptor
api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh");
      if (!refresh) {
        toast.error("Session expired. Please log in again.");
        localStorage.clear();
        window.location.href = "/admin-login";
        return Promise.reject(error);
      }
      try {
        const r = await axios.post(`${API_BASE}/token/refresh/`, { refresh });
        const newAccess = r.data.access;
        localStorage.setItem("access", newAccess);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        toast.error("Login expired. Please log in again.");
        localStorage.clear();
        window.location.href = "/admin-login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [viewMode, setViewMode] = useState("week");
  const [attendanceData, setAttendanceData] = useState({ weekly: [], monthly: [] });
  const [selectedDivision, setSelectedDivision] = useState("10A");
  const [loading, setLoading] = useState({ admin: false, attendance: false });

  const divisions = ["10A", "10B", "9A", "9B", "8A", "8B"];

  // normalize backend attendance response
  const parseAttendance = (raw) => {
    const weeklyRaw = raw?.weekly || [];
    const monthlyRaw = raw?.monthly || [];

    const weekly = weeklyRaw.map((item, idx) => ({
      day: item.day ?? ["Mon", "Tue", "Wed", "Thu", "Fri"][idx],
      Present: Number(item.Present ?? item.present ?? 0) || 0,
      Absent: Number(item.Absent ?? item.absent ?? 0) || 0,
    }));

    const monthly = monthlyRaw.map((item, idx) => ({
      month:
        item.month ??
        ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][idx],
      Present: Number(item.Present ?? item.present ?? 0) || 0,
      Absent: Number(item.Absent ?? item.absent ?? 0) || 0,
    }));

    return { weekly, monthly };
  };

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      setLoading({ admin: true, attendance: true });

      try {
        const [adminRes, attendanceRes] = await Promise.all([
          api.get("/admin-dashboard/"),
          api.get(`/attendance/summary/?division=${encodeURIComponent(selectedDivision)}`),
        ]);

        if (!mounted) return;
        setAdminData(adminRes?.data ?? null);
        setAttendanceData(parseAttendance(attendanceRes?.data ?? {}));
      } catch (err) {
        if (!mounted) return;
        const status = err.response?.status;
        const msg =
          status === 401
            ? "Unauthorized – please login again."
            : "Error fetching data. Try again.";
        toast.error(msg);
        console.error("AdminDashboard fetch error:", status, err.response?.data ?? err.message);
      } finally {
        if (!mounted) return;
        setLoading({ admin: false, attendance: false });
      }
    };

    fetchAll();
    return () => {
      mounted = false;
    };
  }, [selectedDivision]);

  const weeklyData = attendanceData.weekly.length
    ? attendanceData.weekly
    : [
      { day: "Mon", Present: 0, Absent: 0 },
      { day: "Tue", Present: 0, Absent: 0 },
      { day: "Wed", Present: 0, Absent: 0 },
      { day: "Thu", Present: 0, Absent: 0 },
      { day: "Fri", Present: 0, Absent: 0 },
    ];

  const monthlyData = attendanceData.monthly.length
    ? attendanceData.monthly
    : [
      { month: "Jan", Present: 0, Absent: 0 },
      { month: "Feb", Present: 0, Absent: 0 },
      { month: "Mar", Present: 0, Absent: 0 },
      { month: "Apr", Present: 0, Absent: 0 },
      { month: "May", Present: 0, Absent: 0 },
    ];

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    setTimeout(() => {
      window.location.href = "/admin-login";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={4000} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome Admin Dashboard {adminData ? `- ${adminData.username ?? ""}` : ""}
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-md"
          >
            <FaSignOutAlt />
            Logout
          </button>
          <FaUserCircle className="text-4xl text-gray-600" />
        </div>
      </div>

      {/* Updates */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Student Activities & Updates
        </h2>
        <p className="text-gray-500">
          View attendance performance and live updates from your students.
        </p>
      </div>

      {/* Attendance Graph */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">
            {viewMode === "week"
              ? `Class Attendance (${selectedDivision} - This Week)`
              : `Monthly Attendance Performance (${selectedDivision})`}
          </h2>

          <div className="flex items-center gap-4">
            {/* Division Selector */}
            <div className="flex gap-2 flex-wrap">
              {divisions.map((div) => (
                <button
                  key={div}
                  onClick={() => setSelectedDivision(div)}
                  disabled={loading.attendance}
                  className={`px-3 py-1 rounded-lg text-sm ${selectedDivision === div
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {div}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded-lg ${viewMode === "week" ? "bg-green-500 text-white" : "bg-gray-200"
                  }`}
                onClick={() => setViewMode("week")}
              >
                Weekly
              </button>
              <button
                className={`px-3 py-1 rounded-lg ${viewMode === "month" ? "bg-green-500 text-white" : "bg-gray-200"
                  }`}
                onClick={() => setViewMode("month")}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        <div style={{ width: "100%", height: 350 }}>
          {loading.attendance ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading attendance...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viewMode === "week" ? weeklyData : monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={viewMode === "week" ? "day" : "month"} />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(v, name) => [`${v} students`, name]} />
                <Legend />
                <Bar dataKey="Present" fill="#34D399" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Absent" fill="#F87171" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Divisions */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">MarkList Divisions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {divisions.map((div) => (
            <button
              key={div}
              onClick={() => setSelectedDivision(div)}
              disabled={loading.attendance}
              className={`p-4 rounded-xl text-center shadow font-semibold transition ${selectedDivision === div
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-green-100"
                }`}
            >
              {div}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
