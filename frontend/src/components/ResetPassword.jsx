import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/axiosInstance";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft, Shield, Key, Sparkles } from 'lucide-react';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [isDark, setIsDark] = useState(true);

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    try {
      await api.post("/admin-reset-password/", {
        email,
        password,
      });
      setIsSuccess(true);
      setMessage("Password reset successful!");
      setTimeout(() => navigate("/admin-login"), 1000);
    } catch (error) {
      setIsSuccess(false);
      const errorMsg = error.response?.data?.error || "Failed to reset password. Try again.";
      setMessage(errorMsg);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 25, label: 'Weak', color: 'red' };
    if (password.length < 10) return { strength: 50, label: 'Fair', color: 'yellow' };
    if (password.length < 14) return { strength: 75, label: 'Good', color: 'blue' };
    return { strength: 100, label: 'Strong', color: 'green' };
  };

  const strength = getPasswordStrength();

  return (
    <div className={`flex min-h-screen items-center justify-center transition-colors duration-500 ${isDark ? 'bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900' : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50'}`}>
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
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-md px-6 relative z-10">
        {/* Back Button */}
        <Link
          to="/verify-otp"
          state={{ email }}
          className={`inline-flex items-center gap-2 mb-6 ${isDark ? 'text-emerald-300 hover:text-emerald-200' : 'text-emerald-600 hover:text-emerald-700'} font-semibold transition-colors group`}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </Link>

        {/* Card with Glow Effect */}
        <div className="relative group">
          <div className={`absolute -inset-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 rounded-3xl blur ${isDark ? 'opacity-30' : 'opacity-20'} group-hover:opacity-50 transition duration-500 animate-pulse`}></div>

          <div className={`relative ${isDark ? 'bg-slate-900/90' : 'bg-white'} backdrop-blur-xl rounded-3xl shadow-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} p-8 md:p-10`}>

            {/* Header with Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 rounded-2xl mb-4 shadow-lg relative animate-pulse">
                <Key className="w-10 h-10 text-white" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-black mb-3">
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
                  Reset Password
                </span>
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                Choose a strong password for your account
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div className="group">
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3 flex items-center gap-2`}>
                  <Lock className="w-4 h-4 text-emerald-500" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full px-4 py-4 pr-12 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} border-2 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Password Strength</span>
                      <span className={`${strength.color === 'red' ? 'text-red-500' :
                        strength.color === 'yellow' ? 'text-yellow-500' :
                          strength.color === 'blue' ? 'text-blue-500' :
                            'text-green-500'
                        }`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className={`h-2 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                      <div
                        className={`h-full transition-all duration-500 ${strength.color === 'red' ? 'bg-red-500' :
                          strength.color === 'yellow' ? 'bg-yellow-500' :
                            strength.color === 'blue' ? 'bg-blue-500' :
                              'bg-green-500'
                          }`}
                        style={{ width: `${strength.strength}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                <div className={`mt-4 p-3 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Password must contain:</p>
                  <ul className="space-y-1 text-xs">
                    <li className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-500' : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
                      <CheckCircle className="w-3 h-3" />
                      At least 8 characters
                    </li>
                    <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-500' : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
                      <CheckCircle className="w-3 h-3" />
                      One uppercase letter
                    </li>
                    <li className={`flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-green-500' : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
                      <CheckCircle className="w-3 h-3" />
                      One number
                    </li>
                  </ul>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleReset}
                className="relative w-full group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 rounded-xl group-hover:bg-none transition-all duration-300 font-black text-white text-lg tracking-wide flex items-center justify-center gap-3 transform group-hover:scale-105 group-active:scale-95 shadow-lg">
                  <Shield className="w-5 h-5" />
                  RESET PASSWORD
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
                  Your password is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className={`mt-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
          <p>
            Remember your password? <Link to="/admin-login" className={`font-semibold ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'} transition-colors`}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
