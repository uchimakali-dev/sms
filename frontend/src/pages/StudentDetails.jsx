import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Mail, Building2, Sparkles, User, AlertCircle } from 'lucide-react';

export default function StudentDetails({ students, onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = students.find((s) => s.id === parseInt(id));

  // Not Found State
  if (!student) {
    return (
      <div className="max-w-md mx-auto my-2 text-center p-8 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl">
        <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-100 mb-1">Student Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">
          The student record you are looking for does not exist or has been removed.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      {/* Top Back Navigation Li*/}
      <Link 
        to="/" 
        className="inline-flex items-center text-xs mt-6 font-semibold text-slate-400 hover:text-emerald-400 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" /> 
        Back to Directory
      </Link>

      {/* Main Glass Profile Card */}
      <div className="bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl shadow-emerald-950/20 relative overflow-hidden">
        
        {/* Glow Accent inside Card */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Student Avatar & Basic Info */}
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="w-16 h-16 bg-linear-to-tr from-emerald-600 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center text-slate-950 font-extrabold text-2xl shadow-lg shadow-emerald-500/20 shrink-0">
            <User className="w-8 h-8 text-slate-950" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">{student.student_name}</h1>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="inline-block text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              ID #{student.id}
            </span>
          </div>
        </div>

        {/* Detailed Attribute Blocks */}
        <div className="space-y-3 my-6 pt-6 border-t border-slate-800/80">
          
          {/* Email Card */}
          <div className="flex items-center gap-4 p-4 bg-slate-950/40 hover:bg-slate-950/60 transition rounded-2xl border border-slate-800/60 group">
            <div className="p-2.5 bg-slate-900 rounded-xl text-emerald-400 border border-slate-800 group-hover:border-emerald-500/30 transition">
              <Mail className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Email Address</p>
              <p className="text-slate-200 font-medium text-sm mt-0.5 truncate">{student.email}</p>
            </div>
          </div>

          {/* Department / Course Card */}
          <div className="flex items-center gap-4 p-4 bg-slate-950/40 hover:bg-slate-950/60 transition rounded-2xl border border-slate-800/60 group">
            <div className="p-2.5 bg-slate-900 rounded-xl text-teal-400 border border-slate-800 group-hover:border-teal-500/30 transition">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Department / Course</p>
              <p className="text-slate-200 font-medium text-sm mt-0.5 uppercase tracking-wide">{student.department}</p>
            </div>
          </div>

        </div>

        {/* Action Controls */}
        <div className="flex gap-3 pt-4 border-t border-slate-800/80">
          <Link
            to={`/update/${student.id}`}
            className="flex-1 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold rounded-2xl transition duration-200 border border-slate-700/80 text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            <Edit className="w-4 h-4 text-amber-400" /> Edit Profile
          </Link>

          <button
            onClick={() => {
              onDelete(student.id);
              navigate("/");
            }}
            className="px-5 py-3 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 font-semibold rounded-2xl transition duration-200 border border-rose-800/40 text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            <Trash2 className="w-4 h-4 text-rose-400" /> Delete
          </button>
        </div>

      </div>
    </div>
  );
}