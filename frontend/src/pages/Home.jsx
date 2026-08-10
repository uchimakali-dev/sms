import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  UserPlus, 
  ShieldCheck, 
  CreditCard, 
  ArrowRight, 
  LogIn,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleGetStarted = () => {
    if (token) {
      navigate('/viewstudents');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      
      {/* --- Main Hero Section --- */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex-1 flex flex-col justify-center">
        
        {/* Top Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-medium shadow-xs">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Secure & Efficient Student Management</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Simplify Tuition & <br className="hidden sm:inline" />
            <span className="text-blue-600">Student Administration</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            A streamlined dashboard to manage student enrollments, keep track of departmental directory records, and monitor fee payments with ease.
          </p>
        </div>

        {/* Call to Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto w-full">
          {token ? (
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg text-sm shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-1/2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg text-sm shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Login to Portal</span>
              </button>
              
              
            </>
          )}
        </div>

        {/* --- Feature Grid --- */}
        <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Directory Records</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Maintain organized profiles for every registered student with department, join date, and personal info.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Fee Tracking</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Track paid amounts, due balances, and mark payment status as fully settled with ease.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Quick Registration</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Fast and simple forms to register new students and update existing records in real time.
            </p>
          </div>

        </div>

      </main>

      {/* --- Simple Footer --- */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-slate-700">Tuition Center Management System</span>
          </div>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}