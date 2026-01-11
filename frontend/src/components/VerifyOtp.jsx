import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Shield, CheckCircle, AlertCircle, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';


const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [isDark, setIsDark] = useState(true);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    try {
      await axios.post("http://127.0.0.1:8000/api/admin-verify-otp/", { email, otp });
      setIsSuccess(true);
      setMessage("OTP Verified! Redirecting...");
      setTimeout(() => navigate("/reset-password", { state: { email } }), 800);
    } catch (error) {
      setIsSuccess(false);
      const errorMsg = error.response?.data?.error || "Invalid OTP. Try again.";
      setMessage(errorMsg);
    }
  };

  const handleResend = async () => {
    if (!email) return setMessage("Email not found. Please go back.");
    setMessage("");
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/admin-send-otp/", { email });
      setIsSuccess(true);
      setMessage("New OTP sent to your email.");
    } catch (error) {
      setIsSuccess(false);
      setMessage("Failed to resend OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen items-center justify-center transition-colors duration-500 ${isDark ? 'bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'}`}>
      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-6 right-6 p-3 rounded-full py-12 bg-white/10 backdrop-blur-lg border border-white/20 hover:scale-110 transition-all duration-300"
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-md px-6 relative z-10">
        {/* Back Button */}
        <Link
          to="/forgot-password"
          className={`inline-flex items-center gap-2 mb-6 ${isDark ? 'text-indigo-300 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-700'} font-semibold transition-colors group`}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </Link>

        {/* Card with Glow Effect */}
        <div className="relative group">
          <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl blur ${isDark ? 'opacity-30' : 'opacity-20'} group-hover:opacity-50 transition duration-500 animate-pulse`}></div>

          <div className={`relative ${isDark ? 'bg-slate-900/90' : 'bg-white'} backdrop-blur-xl rounded-3xl shadow-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} p-8 md:p-10`}>

            {/* Header with Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg relative animate-pulse">
                <Shield className="w-10 h-10 text-white" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-black mb-3">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Verify OTP
                </span>
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                Enter the 6-digit code sent to your email
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div className="group">
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3 flex items-center gap-2`}>
                  <KeyRound className="w-4 h-4 text-indigo-500" />
                  One-Time Password
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className={`w-full px-6 py-4 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} border-2 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 outline-none text-center text-2xl font-bold tracking-widest`}
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                </div>

                {/* Resend OTP */}
                <div className="mt-3 text-center">
                  <button
                    onClick={handleResend}
                    disabled={loading}
                    className={`text-sm font-semibold ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} transition-colors disabled:opacity-50`}
                  >
                    {loading ? "Sending..." : "Didn't receive code? Resend"}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleVerify}
                className="relative w-full group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative px-6 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl group-hover:bg-none transition-all duration-300 font-black text-white text-lg tracking-wide flex items-center justify-center gap-3 transform group-hover:scale-105 group-active:scale-95 shadow-lg">
                  <Shield className="w-5 h-5" />
                  VERIFY CODE
                  <CheckCircle className="w-5 h-5" />
                </div>
              </button>

              {/* Message */}
              {message && (
                <div className="relative overflow-hidden rounded-xl animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className={`absolute inset-0 ${isSuccess ? (isDark ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-r from-green-100 to-emerald-100') : (isDark ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20' : 'bg-gradient-to-r from-red-100 to-pink-100')} animate-pulse`}></div>
                  <div className={`relative flex items-start gap-3 p-4 ${isSuccess ? (isDark ? 'bg-green-950/50 border-green-500/50' : 'bg-green-50 border-green-200') : (isDark ? 'bg-red-950/50 border-red-500/50' : 'bg-red-50 border-red-200')} backdrop-blur-sm border-2 rounded-xl`}>
                    {isSuccess ? (
                      <CheckCircle className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'} flex-shrink-0 animate-bounce`} />
                    ) : (
                      <AlertCircle className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-600'} flex-shrink-0`} />
                    )}
                    <p className={`${isSuccess ? (isDark ? 'text-green-200' : 'text-green-800') : (isDark ? 'text-red-200' : 'text-red-800')} text-sm font-semibold`}>
                      {message}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className={`mt-8 pt-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="flex items-center justify-center gap-2 text-sm">
                <Shield className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                  This code expires in <span className="font-bold text-indigo-400">5 minutes</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className={`mt-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
          <p>
            Having trouble? try again <a href="/support" className={`font-semibold ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} transition-colors`}></a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
