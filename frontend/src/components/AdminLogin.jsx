import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { Lock, User, ArrowRight, AlertCircle, Shield, Sparkles } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  // --- IMPORTANT FIX: Clear state on load & block browser autofill ---
  useEffect(() => {
    setUsername("");
    setPassword("");
  }, []);

  const doLogin = async (u, p) => {
    setError("");
    setLoading(true);
    try {
      const response = await api.post(
        "/admin-login/",
        { username: u, password: p },
        { withCredentials: true }
      );
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      alert("Admin Login Successful!");
      navigate("/admin-dashboard");
    } catch (err) {
      let msg = "Invalid username or password";
      if (err.response) {
        if (err.response.data?.detail) msg = err.response.data.detail;
        else if (typeof err.response.data === "object")
          msg = Object.values(err.response.data).flat().join(" ");
        else msg = `Server: ${err.response.status}`;
      } else if (err.request) msg = "No response from server.";
      else msg = err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    doLogin(username, password);
  };

  return (
    <div className={`flex min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>

      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 hover:scale-110 transition-all duration-300 group"
      >
        {isDark ? (
          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Animated Background */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Left Section */}
      <div className="hidden md:flex w-1/2 items-center justify-center relative z-10 p-8">
        <div className="relative group">
          <div className={`absolute -inset-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl ${isDark ? 'opacity-30' : 'opacity-20'} group-hover:opacity-50 transition-opacity duration-700 animate-pulse`}></div>
          <div className={`relative ${isDark ? 'bg-white/5' : 'bg-white'} backdrop-blur-2xl rounded-3xl p-8 border ${isDark ? 'border-white/10' : 'border-gray-200'} shadow-2xl`}>
            <div className="absolute top-4 right-4 flex gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              <Shield className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div className="text-center space-y-4">
              <h1 className={`text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ${isDark ? 'animate-pulse' : ''}`}>
                Welcome Back
              </h1>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg font-medium`}>
                Secure Admin Portal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center relative z-10 p-6">
        <div className="w-full max-w-md">
          <div className="relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur ${isDark ? 'opacity-25' : 'opacity-15'} group-hover:opacity-40 transition duration-500`}></div>
            <div className={`relative ${isDark ? 'bg-slate-900/90' : 'bg-white'} backdrop-blur-xl rounded-3xl shadow-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} p-10`}>

              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
                  <Lock className="w-10 h-10 text-white animate-pulse" />
                </div>
                <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Admin Portal
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center gap-2`}>
                    <User className="w-4 h-4 text-cyan-400" />
                    Username
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center gap-2`}>
                    <Lock className="w-4 h-4 text-purple-400" />
                    Password
                  </label>
                  <input
                    autoComplete="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />

                  <div className="flex justify-end py-2 -mt-1">
                    <Link to="/forgot-password" className="text-sm font-semibold text-cyan-600 hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 text-white font-bold tracking-wide flex justify-center items-center gap-2"
                >
                  {loading ? "AUTHENTICATING..." : <>Access Portal <ArrowRight /></>}
                </button>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm font-bold">
                    <AlertCircle className="w-5 h-5" /> {error}
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
                Protected by 256-bit encryption
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminLogin;
