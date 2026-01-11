import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft, Shield, CheckCircle, Lock } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isDark, setIsDark] = useState(true);


  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post("http://127.0.0.1:8000/api/admin-send-otp/", { email });
      setMessage("OTP sent to your email.");
      setTimeout(() => navigate("/verify-otp", { state: { email } }), 800);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to send OTP. Try again.";
      setMessage(errorMsg);
    }
  };

  return (
    <div className={`flex min-h-screen items-center justify-center transition-colors duration-500 ${isDark ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-6 right-6 p-3 py-12 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 hover:scale-110 transition-all duration-300"
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
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md px-6 relative z-10">
        {/* Back Button */}
        <Link
          to="/admin-login"
          className={`inline-flex items-center gap-2 mb-6 ${isDark ? 'text-blue-300 hover:text-blue-200' : 'text-indigo-600 hover:text-indigo-700'} font-semibold transition-colors group`}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        {/* Card with Glow Effect */}
        <div className="relative group">
          <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur ${isDark ? 'opacity-30' : 'opacity-20'} group-hover:opacity-50 transition duration-500`}></div>

          <div className={`relative ${isDark ? 'bg-slate-900/90' : 'bg-white'} backdrop-blur-xl rounded-3xl shadow-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} p-8 md:p-10`}>

            {/* Header with Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg relative">
                <Lock className="w-8 h-8 text-white" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs">?</span>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-2">
                <span className={`${isDark ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'}`}>
                  Forgot Password?
                </span>
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                No worries, we'll send you reset instructions
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div className="group">
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center gap-2`}>
                  <Mail className="w-4 h-4 text-blue-500" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full px-4 py-3.5 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} border-2 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none`}
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSendOtp}
                className="relative w-full group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl group-hover:bg-none transition-all duration-300 font-bold text-white tracking-wide flex items-center justify-center gap-2 transform group-hover:scale-105 group-active:scale-95 shadow-lg">
                  <Mail className="w-5 h-5" />
                  Send OTP
                </div>
              </button>

              {/* Success Message */}
              {message && (
                <div className="relative overflow-hidden rounded-xl animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-blue-500/20 to-green-500/20' : 'bg-gradient-to-r from-blue-100 to-green-100'}`}></div>
                  <div className={`relative flex items-start gap-3 p-4 ${isDark ? 'bg-blue-950/50 border-blue-500/50' : 'bg-blue-50 border-blue-200'} backdrop-blur-sm border-2 rounded-xl`}>
                    <CheckCircle className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'} flex-shrink-0 mt-0.5`} />
                    <p className={`${isDark ? 'text-blue-200' : 'text-blue-800'} text-sm font-medium`}>
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
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your information is secure and encrypted
                </p>
              </div>
            </div>

            {/* Help Section */}
            <div className={`mt-6 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>
                Remember your password?{' '}
                <Link to="/admin-login" className={`font-semibold ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-indigo-600 hover:text-indigo-700'} transition-colors`}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        {/* <div className={`mt-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
          <p>
            Need help? <a href="/support" className={`font-semibold ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-indigo-600 hover:text-indigo-700'} transition-colors`}>Contact Support</a>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default ForgotPassword;
