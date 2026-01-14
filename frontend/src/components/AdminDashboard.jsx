// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
          Welcome Admin Dashboard {adminData ? `- ${adminData.username ?? ""}` : ""}
        </h1>

        <div className="flex items-center gap-3 self-start md:self-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition shadow-md text-sm md:text-base"
          >
            <FaSignOutAlt />
            Logout
          </button>
          <FaUserCircle className="text-3xl md:text-4xl text-gray-600" />
        </div>
      </div>

      {/* Updates */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
          Student Activities & Updates
        </h2>
        <p className="text-gray-500 text-sm md:text-base">
          View attendance performance and live updates from your students.
        </p>
      </div>

      {/* Attendance */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h2 className="text-lg md:text-xl font-semibold">
            {viewMode === "week"
              ? `Class Attendance (${selectedDivision} - This Week)`
              : `Monthly Attendance (${selectedDivision})`}
          </h2>

          <div className="flex flex-wrap gap-2">
            {divisions.map((div) => (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-3 py-1 rounded-lg text-sm ${selectedDivision === div
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                  }`}
              >
                {div}
              </button>
            ))}

            <button
              className={`px-3 py-1 rounded-lg text-sm ${viewMode === "week" ? "bg-green-500 text-white" : "bg-gray-200"
                }`}
              onClick={() => setViewMode("week")}
            >
              Weekly
            </button>

            <button
              className={`px-3 py-1 rounded-lg text-sm ${viewMode === "month" ? "bg-green-500 text-white" : "bg-gray-200"
                }`}
              onClick={() => setViewMode("month")}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Chart Responsive */}
        <div className="w-full h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={viewMode === "week" ? weeklyData : monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={viewMode === "week" ? "day" : "month"} />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(v) => `${v} students`} />
              <Legend />
              <Bar dataKey="Present" fill="#34D399" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Absent" fill="#F87171" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Divisions */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg md:text-xl font-semibold mb-3">MarkList Divisions</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {divisions.map((div) => (
            <button
              key={div}
              className={`p-3 rounded-xl text-center shadow font-semibold text-sm md:text-base ${selectedDivision === div
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
                }`}
              onClick={() => setSelectedDivision(div)}
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
