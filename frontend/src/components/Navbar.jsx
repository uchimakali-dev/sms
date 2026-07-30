import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, UserPlus, GraduationCap, Sparkles } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md text-white border-b border-slate-800/80 sticky top-0 z-50 transition-all duration-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-linear-to-tr from-emerald-500 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 transition-transform group-hover:scale-105">
            <GraduationCap className="w-6 h-6 text-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              Tuition Center
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 opacity-80" />
            </span>
            <span className="text-[10px] text-slate-400 tracking-wider font-semibold uppercase">Management System</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isActive('/') 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Users className="w-4 h-4" /> 
            <span>View All</span>
          </Link>

          <Link
            to="/add"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isActive('/add') 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <UserPlus className="w-4 h-4" /> 
            <span>Add Student</span>
          </Link>
        </div>

      </div>
    </nav>
  );
}