import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Images10 from "../assets/admin1.png";
import { Lock, User, ArrowRight, AlertCircle, Shield, Sparkles } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  // perform login (reusable)
  const doLogin = async (u, p) => {
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/admin-login/",
        { username: u, password: p },
        { withCredentials: true }
      );
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      alert("Admin Login Successful!");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      let msg = "Invalid username or password";
      if (err.response) {
        if (err.response.data && err.response.data.detail)
          msg = err.response.data.detail;
        else if (err.response.data && typeof err.response.data === "object")
          msg = Object.values(err.response.data).flat().join(" ");
        else
          msg = `Server: ${err.response.status} ${err.response.statusText || ""}`;
      } else if (err.request) {
        msg = "No response from server (network/CORS).";
      } else {
        msg = err.message;
      }
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
      {/* Theme Toggle Button */}
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

      {/* Animated Background Elements */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Left Illustration */}
      <div className="w-1/2 flex items-center justify-center relative z-10 p-8">
        <div className="relative group">
          {/* Glow effect */}
          <div className={`absolute -inset-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl ${isDark ? 'opacity-30' : 'opacity-20'} group-hover:opacity-50 transition-opacity duration-700 animate-pulse`}></div>

          <div className={`relative ${isDark ? 'bg-white/5' : 'bg-white'} backdrop-blur-2xl rounded-3xl p-8 border ${isDark ? 'border-white/10' : 'border-gray-200'} shadow-2xl`}>
            <div className="absolute top-4 right-4 flex gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              <Shield className="w-6 h-6 text-cyan-400 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* <div className="relative overflow-hidden rounded-2xl mb-6">
              <img
                src={Images10}
                alt="Admin Login Illustration"
                className="w-full transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-purple-900/80 to-transparent' : 'bg-gradient-to-t from-purple-100/50 to-transparent'}`}></div>
            </div> */}

            <div className="text-center space-y-4">
              <h1 className={`text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ${isDark ? 'animate-pulse' : ''}`}>
                Welcome Back
              </h1>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg font-medium`}>
                Secure Admin Portal
              </p>
              <div className="flex justify-center gap-2 pt-4">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex items-center justify-center relative z-10 p-8">
        <div className="w-full max-w-md">
          {/* Floating card with glow */}
          <div className="relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur ${isDark ? 'opacity-25' : 'opacity-15'} group-hover:opacity-40 transition duration-500`}></div>

            <div className={`relative ${isDark ? 'bg-slate-900/90' : 'bg-white'} backdrop-blur-xl rounded-3xl shadow-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} p-10`}>
              {/* Animated header */}
              <div className="text-center mb-8 relative">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg transform hover:rotate-12 transition-transform duration-300 relative">
                  <Lock className="w-10 h-10 text-white animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                </div>

                <h2 className="text-4xl font-black mb-2">
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Admin Portal
                  </span>
                </h2>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Protected Access Zone</p>
              </div>

              <div className="space-y-6">
                {/* Username Field */}
                <div className="group">
                  <label className={`block text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center gap-2`}>
                    <User className="w-4 h-4 text-cyan-400" />
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className={`w-full px-4 py-4 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} border-2 rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none group-hover:border-${isDark ? 'white/20' : 'gray-400'}`}
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="group">
                  <label className={`block text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center gap-2`}>
                    <Lock className="w-4 h-4 text-purple-400" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={`w-full px-4 py-4 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} border-2 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 outline-none group-hover:border-${isDark ? 'white/20' : 'gray-400'}`}
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <a
                    href="/forgot-password"
                    className="text-cyan-400 text-sm font-bold hover:text-pink-400 transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    Forgot password?
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="relative w-full group overflow-hidden"
                  disabled={loading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative px-6 py-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 rounded-xl group-hover:bg-none transition-all duration-300 font-black text-white text-lg tracking-wider flex items-center justify-center gap-3 transform group-hover:scale-105 group-active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        AUTHENTICATING...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        ACCESS PORTAL
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </div>
                </button>

                {/* Error Message */}
                {error && (
                  <div className="relative overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 animate-pulse"></div>
                    <div className="relative flex items-center gap-3 p-4 bg-red-950/50 backdrop-blur-sm border-2 border-red-500/50 rounded-xl">
                      <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 animate-pulse" />
                      <p className="text-red-300 text-sm font-bold">
                        {error}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`mt-8 pt-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} text-center`}>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>
                  Protected by <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-bold">256-bit encryption</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
