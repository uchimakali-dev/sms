import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Building, 
  User, 
  ArrowLeft, 
  Loader2, 
  Sparkles, 
  Calendar, 
  IndianRupee, 
  CheckCircle 
} from 'lucide-react';

export default function AddStudent({ onAdd }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE_URL = "/api";
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    student_name: '',
    dateofjoin: new Date().toISOString().split('T')[0], // Defaults to YYYY-MM-DD
    amount_due: 0,
    amount_paid: 0,
    department: '',
    paid: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Format payload to ensure numeric types are sent properly
    const payload = {
      ...form,
      amount_due: Number(form.amount_due),
      amount_paid: Number(form.amount_paid)
    };

    try {
      const response = await fetch(`${API_BASE_URL}/add_student`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create student');
      }

      const data = await response.json();
      console.log('Success:', data);

      if (onAdd) onAdd(payload);
      
      // Redirect back to view all students list on success
      navigate('/viewstudents');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 pt-10 md:flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-x-hidden">
      
      {/* Background Radial Glow Effects */}
      <div className="absolute -top-32 -left-32 w-64 h-64 sm:w-80 sm:h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 sm:w-80 sm:h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-xl p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl shadow-emerald-950/20 relative z-10 my-auto">
        
        {/* Navigation Button */}
        <button 
          onClick={() => navigate('/viewstudents')} 
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-emerald-400 mb-4 sm:mb-6 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-1" /> Back to directory
        </button>

        {/* Header Section */}
        <div className="flex items-center gap-3 sm:gap-3.5 mb-5 sm:mb-6">
          <div className="p-2.5 sm:p-3 bg-linear-to-tr from-emerald-600 to-teal-400 rounded-xl sm:rounded-2xl text-white shadow-lg shadow-emerald-500/30 shrink-0">
            <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">Add New Student</h1>
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Enter details to register a student into the system</p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 p-3 sm:p-3.5 bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-2.5 backdrop-blur-md">
            <span className="shrink-0">⚠️</span> 
            <p>{error}</p>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          
          {/* Student Name */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 sm:mb-1.5">
              Student Name
            </label>
            <div className="relative group">
              <User className="w-4 h-4 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="text"
                required
                className="w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-xl sm:rounded-2xl text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition duration-200"
                value={form.student_name}
                onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                placeholder="mariyappa"
              />
            </div>
          </div>

          {/* Grid Layout for Department and Date of Join */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Department */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 sm:mb-1.5">
                Department
              </label>
              <div className="relative group">
                <Building className="w-4 h-4 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-xl sm:rounded-2xl text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition duration-200"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="CSE"
                />
              </div>
            </div>

            {/* Date of Join */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 sm:mb-1.5">
                Date of Join
              </label>
              <div className="relative group">
                <Calendar className="w-4 h-4 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="date"
                  required
                  className="w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-xl sm:rounded-2xl text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition duration-200 [scheme-dark]"
                  value={form.dateofjoin}
                  onChange={(e) => setForm({ ...form, dateofjoin: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Grid Layout for Amount Paid and Amount Due */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Amount Paid */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 sm:mb-1.5">
                Amount Paid
              </label>
              <div className="relative group">
                <IndianRupee className="w-4 h-4 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  className="w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-xl sm:rounded-2xl text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition duration-200"
                  value={form.amount_paid}
                  onChange={(e) => setForm({ ...form, amount_paid: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Amount Due */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 sm:mb-1.5">
                fees Amount
              </label>
              <div className="relative group">
                <IndianRupee className="w-4 h-4 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  className="w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-xl sm:rounded-2xl text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition duration-200"
                  value={form.amount_due}
                  onChange={(e) => setForm({ ...form, amount_due: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Paid Status Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-800/30 border border-slate-700/50 rounded-xl sm:rounded-2xl hover:bg-slate-800/50 transition duration-200">
              <input
                type="checkbox"
                checked={form.paid}
                onChange={(e) => setForm({ ...form, paid: e.target.checked })}
                className="w-4 h-4 text-emerald-500 bg-slate-800 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2 focus:ring-offset-slate-900 cursor-pointer"
              />
              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <CheckCircle className={`w-4 h-4 ${form.paid ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>Mark Fee Payment as Fully Settled</span>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 sm:mt-4 py-2.5 sm:py-3 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 active:scale-[0.99] text-slate-950 font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl transition duration-200 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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