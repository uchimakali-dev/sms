import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate=useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const API_BASE_URL = "http://127.0.0.1:8000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:new URLSearchParams({
            username: formData.username,
            password: formData.password,
        }),
      });

      const data = await response.json();
      

      if (!response.ok) {
        // Uses error message from server response or falls back to default
        throw new Error(data.message || data.error || 'Invalid username or password');
      }

      

      // Save token or user details if returned by backend
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }
      localStorage.setItem('user', JSON.stringify(data.user || { username: formData.username }));

      // Redirect to main directory
      navigate('/viewstudents');
    } catch (err) {
      setError(err.message || 'Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Radial Background Glow Effects */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Glassmorphism Container Card */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl shadow-emerald-950/20 relative z-10">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex p-3 bg-linear-to-tr from-emerald-600 to-teal-400 rounded-2xl text-white shadow-lg shadow-emerald-500/30 mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Please enter your details to sign in
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2.5 backdrop-blur-md">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Field */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Username
            </label>
            <div className="relative group">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition duration-200"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative group">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me / Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center text-slate-400 hover:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500/20 mr-2"
              />
              Remember me
            </label>
            <a href="#" className="text-emerald-400 hover:underline font-medium">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 active:scale-[0.99] text-slate-950 font-bold text-sm sm:text-base rounded-xl transition duration-200 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}