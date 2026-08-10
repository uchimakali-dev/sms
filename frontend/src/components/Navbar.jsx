import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, UserPlus, GraduationCap, Menu, X, LogOut } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // Clear user auth session/tokens
    localStorage.removeItem('token'); 
    localStorage.removeItem('user');
    
    // Close mobile menu if open and navigate to login
    setIsOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/viewstudents" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
              Tuition Center
            </span>
            <span className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase">Management System</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/viewstudents"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive('/viewstudents') 
                ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" /> 
            <span>View All</span>
          </Link>

          <Link
            to="/add"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive('/add') 
                ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserPlus className="w-4 h-4" /> 
            <span>Add Student</span>
          </Link>

          {/* Vertical Divider */}
          <div className="h-5 w-px bg-slate-200 mx-1" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-150 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 focus:outline-none transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 shadow-md">
          <Link
            to="/viewstudents"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive('/viewstudents') 
                ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" /> 
            <span>View All</span>
          </Link>

          <Link
            to="/add"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive('/add') 
                ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserPlus className="w-4 h-4" /> 
            <span>Add Student</span>
          </Link>

          <div className="pt-2 border-t border-slate-100">
            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-150 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}