import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Building, User, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

export default function AddStudent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE_URL = "https://sms-mxnw.onrender.com";

  const [form, setForm] = useState({
    student_name: '',
    email: '',
    department: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/add_student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          age: parseInt(form.age, 10) // Convert g input to number
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create student');
      }

      const data = await response.json();
      console.log('Success:', data);
      
      // Redirect back to view all students list on success
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
      
      {/* Background Radial Glow Effects */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card (Constrained with max-h and internal scroll if needed) */}
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl shadow-emerald-950/20 relative z-10">
        
        {/* Navigation Button */}
        <button 
          onClick={() => navigate('/')} 
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-emerald-400 mb-4 sm:mb-6 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-1" /> Back to directory
        </button>

        {/* Header Section */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="p-3 bg-linear-to-tr from-emerald-600 to-teal-400 rounded-2xl text-white shadow-lg shadow-emerald-500/30">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Add New Student</h1>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-slate-400 text-xs mt-0.5">Enter details to register a student into the system</p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-2xl text-xs font-medium flex items-center gap-2.5 backdrop-blur-md">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Student Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Student Name
            </label>
            <div className="relative group">
              <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="text"
                required
                className="w-full pl-11 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-2xl text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition duration-200"
                value={form.student_name}
                onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                placeholder="mariyappa"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="email"
                required
                className="w-full pl-11 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-2xl text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition duration-200"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="mariyappa@gmail.com"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Department
            </label>
            <div className="relative group">
              <Building className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="text"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/80 rounded-2xl text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition duration-200"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="cse"
              />
            </div>
          </div>

          {/* Gradient Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 active:scale-[0.99] text-slate-950 font-bold rounded-2xl transition duration-200 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Submitting...</span>
              </>
            ) : (
              'Add Student'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}