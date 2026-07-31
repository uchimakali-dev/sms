import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { User, Mail, Building2, Save, X, Sparkles, ArrowLeft, AlertCircle, Hash } from 'lucide-react';

export default function UpdateStudent({ students, onUpdate }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    student_name: '',
    email: '',
    department: '',
    age: ''
  });

  useEffect(() => {
    const student = students.find((s) => s.id === parseInt(id, 10));
    if (student) {
      setForm(student);
    }
  }, [students, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.id) {
      onUpdate(form.id, {
        ...form,
        age: parseInt(form.age, 10) || 0
      });
      navigate("/viewstudents");
    }
  };

  // Record Not Found State
  const studentExists = students.some((s) => s.id === parseInt(id, 10));
  if (students.length > 0 && !studentExists) {
    return (
      <div className="w-full min-h-[50vh] pt-10 md:flex items-center justify-center p-4">
        <div className="w-full max-w-md my-8 text-center p-6 sm:p-8 bg-slate-900/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl">
          <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-100 mb-1">Student Not Found</h2>
          <p className="text-slate-400 text-xs sm:text-sm mb-6">
            The record you are trying to edit does not exist
          </p>
          <Link 
            to="/viewstudents" 
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition border border-slate-700 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-10 md:flex bg-slate-950 items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-x-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-lg space-y-4 sm:space-y-6 relative z-10 my-auto">
        
        {/* Top Back Navigation Link */}
        <Link 
          to="/viewstudents" 
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" /> 
          Back to Directory
        </Link>

        {/* Main Glass Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800/80 shadow-2xl shadow-emerald-950/20 relative overflow-hidden">
          
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Update Student</h1>
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <p className="text-slate-400 text-xs mt-0.5 sm:mt-1">
                Modify records for Student <span className="text-emerald-400 font-semibold">#{id}</span>
              </p>
            </div>
            <span className="self-start sm:self-center text-[10px] sm:text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Edit Mode
            </span>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            
            {/* Full Name Input */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 sm:mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition"
                  value={form?.student_name || ''}
                  onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 sm:mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@example.com"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition"
                  value={form?.email || ''}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Grid Layout for Department and Age */}
            
              
              {/* Department / Course Input */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 sm:mb-1.5">
                  Department
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition uppercase tracking-wide"
                    value={form?.department || ''}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                  />
                </div>
              </div>

              

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 pt-4 sm:pt-6 border-t border-slate-800/80 mt-5 sm:mt-6">
              <button
                type="button"
                onClick={() => navigate('/viewstudents')}
                className="w-full sm:flex-1 py-2.5 sm:py-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 font-semibold rounded-xl sm:rounded-2xl transition duration-200 border border-slate-700/80 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-400" /> Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:flex-1 py-2.5 sm:py-3 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl sm:rounded-2xl transition duration-200 text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4 text-slate-950" /> Save Changes
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}