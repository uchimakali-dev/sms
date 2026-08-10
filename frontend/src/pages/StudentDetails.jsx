import React from 'react';
import { format, formatDate, parseISO } from "date-fns";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Mail, Building2, Sparkles, User, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function StudentDetails({ students, onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = students.find((s) => s.id === parseInt(id, 10));
  console.log(students);

  const dateFormat = (d) => {
    if (!d) return "-";
    const formated = format(parseISO(d), "dd-MM-yyyy");
    return formated;
  };

  // Not Found State
  if (!student) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md my-8 text-center p-6 sm:p-8 bg-slate-900/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl">
          <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-100 mb-1">Student Not Found</h2>
          <p className="text-slate-400 text-xs sm:text-sm mb-6">
            The student record you are looking for does not exist or has been removed.
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

  const NumberofDue=(fees)=>{
    const [date,month,year]=student.dateofjoin.split("-")
    const lst_mnt=parseInt(month)

    const cur_mon=new Date().getMonth()+1;
  
    const lst_paid=fees.paid
    const due=(cur_mon-lst_mnt)
    if ((!lst_paid)){
      return due+1
    }
    else{
      return due
    }
  }
  

  
  // Determine fee payment status (Checks student.fees_paid boolean or string)
  const isFeesPaid = Boolean(student.fees[0].paid);
  const duecount=NumberofDue(student.fees)
  
  

  return (
    <div className="w-full min-h-screen bg-slate-950 pt-10 md:flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-x-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl space-y-4 sm:space-y-6 relative z-10 my-auto">
        
        {/* Top Back Navigation Link */}
        <Link 
          to="/viewstudents" 
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" /> 
          Back to Directory
        </Link>

        {/* Main Glass Profile Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800/80 shadow-2xl shadow-emerald-950/20 relative overflow-hidden">
          
          {/* Top Right Fees Paid Status Indicator */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
            {isFeesPaid ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Fees Paid
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-xs">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                 Fees Pending : Due count {duecount}
              </span>
            )}
          </div>

          {/* Student Avatar & Basic Info */}
          <div className="flex items-center gap-3.5 sm:gap-4 mb-6 sm:mb-8 relative z-10 pr-20 sm:pr-24">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-tr from-emerald-600 via-teal-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-950 font-extrabold text-2xl shadow-lg shadow-emerald-500/20 shrink-0">
              <User className="w-7 h-7 sm:w-8 sm:h-8 text-slate-950" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                  {student.student_name}
                </h1>
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <span className="inline-block text-[10px] sm:text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                ID #{student.id}
              </span>
            </div>
          </div>

          {/* Detailed Attribute Blocks */}
          <div className="space-y-3 my-4 sm:my-6 pt-4 sm:pt-6 border-t border-slate-800/80">
            
            {/* Email / Date Card */}
            <div className="flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 bg-slate-950/40 hover:bg-slate-950/60 transition rounded-xl sm:rounded-2xl border border-slate-800/60 group">
              <div className="p-2.5 bg-slate-900 rounded-xl text-emerald-400 border border-slate-800 group-hover:border-emerald-500/30 transition shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Date of Join</p>
                <p className="text-slate-200 font-medium text-xs sm:text-sm mt-0.5 truncate">{dateFormat(student.dateofjoin)}</p>
              </div>
            </div>

            {/* Department / Course Card */}
            <div className="flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 bg-slate-950/40 hover:bg-slate-950/60 transition rounded-xl sm:rounded-2xl border border-slate-800/60 group">
              <div className="p-2.5 bg-slate-900 rounded-xl text-teal-400 border border-slate-800 group-hover:border-teal-500/30 transition shrink-0">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Department</p>
                <p className="text-slate-200 font-medium text-xs sm:text-sm mt-0.5 uppercase tracking-wide truncate">
                  {student.department}
                </p>
              </div>
            </div>

          </div>

          {/* Action Controls */}
          <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 pt-4 border-t border-slate-800/80 mt-5 sm:mt-6">
            <Link
              to={`/update/${student.id}`}
              className="w-full sm:flex-1 py-2.5 sm:py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold rounded-xl sm:rounded-2xl transition duration-200 border border-slate-700/80 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Edit className="w-4 h-4 text-amber-400" /> Edit Profile
            </Link>

            <button
              onClick={async () => {
                const success = await onDelete(student.id);
                if (success) {
                  navigate("/viewstudents");
                }
              }}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-3 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 font-semibold rounded-xl sm:rounded-2xl transition duration-200 border border-rose-800/40 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-400" /> Delete
            </button>
          </div>

        </div>
      </div>
    </div>
  );
} 