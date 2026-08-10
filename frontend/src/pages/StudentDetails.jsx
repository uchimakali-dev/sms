import React from 'react';
import { format, parseISO } from "date-fns";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Trash2, Calendar, Building2, User, 
  AlertCircle, CheckCircle2, XCircle, CreditCard, Hash 
} from 'lucide-react';

export default function StudentDetails({ students, onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = students.find((s) => s.id === parseInt(id, 10));

  const dateFormat = (d) => {
    if (!d) return "N/A";
    try {
      return format(parseISO(d), "dd-MM-yyyy");
    } catch {
      return d;
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8 text-slate-800 flex items-center justify-center">
        <div className="w-full max-w-md text-center p-8 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Student Not Found</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              The record you are looking for does not exist or has been deleted.
            </p>
          </div>
          <Link 
            to="/viewstudents" 
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm transition-colors border border-slate-200 w-full"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  const NumberofDue = (fees) => {
    if (!student.dateofjoin) return 0;
    const parts = student.dateofjoin.split("-");
    if (parts.length < 2) return 0;
    const month = parts[1];
    const lst_mnt = parseInt(month, 10);
    const cur_mon = new Date().getMonth() + 1;
    const lst_paid = Array.isArray(fees) ? fees[0]?.paid : fees?.paid;
    const due = cur_mon - lst_mnt;
    return !lst_paid ? Math.max(0, due + 1) : Math.max(0, due);
  };

  const isFeesPaid = Boolean(Array.isArray(student.fees) ? student.fees[0]?.paid : student.fees?.paid);
  const duecount = NumberofDue(student.fees);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* --- Top Navigation --- */}
        <div className="flex items-center justify-between">
          <Link 
            to="/viewstudents" 
            className="inline-flex items-center text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" /> 
            Back to Directory
          </Link>
        </div>

        {/* --- Header Profile Card --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">{student.student_name}</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                  #{student.id}
                </span>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5 uppercase tracking-wide font-medium">
                {student.department || 'No Department Assigned'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              to={`/update/${student.id}`}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium rounded-lg transition duration-150 border border-slate-300 shadow-sm flex items-center justify-center gap-2 text-sm"
            >
              <Edit className="w-4 h-4 text-slate-500" /> Edit Student
            </Link>
            
            <button
              onClick={async () => {
                const success = await onDelete(student.id);
                if (success) navigate("/viewstudents");
              }}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 font-medium rounded-lg transition duration-150 border border-red-200 shadow-sm flex items-center justify-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4 text-red-600" /> Delete
            </button>
          </div>
        </div>

        {/* --- Main Information Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Detailed Info Card */}
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Academic & Personal Details</h2>
            </div>
            
            <div className="p-5 sm:p-6 divide-y divide-slate-100">
              <div className="py-3 flex items-center justify-between first:pt-0">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-500">Full Name</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{student.student_name}</span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Hash className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-500">Student ID</span>
                </div>
                <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                  {student.id}
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-500">Department</span>
                </div>
                <span className="text-sm font-medium text-slate-900 uppercase">{student.department || 'N/A'}</span>
              </div>

              <div className="py-3 flex items-center justify-between last:pb-0">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-500">Date Joined</span>
                </div>
                <span className="text-xs font-mono bg-slate-100 px-2.5 py-0.5 rounded text-slate-700 border border-slate-200">
                  {dateFormat(student.dateofjoin)}
                </span>
              </div>
            </div>
          </div>

          {/* Fee Status Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Financial Overview</h2>
            </div>
            
            <div className="p-5 sm:p-6 space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Current Status</span>
                <div className="mt-2">
                  {isFeesPaid ? (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">Fees Up To Date</p>
                        <p className="text-xs text-emerald-600 mt-0.5">No pending dues recorded</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                      <XCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">Payment Pending</p>
                        <p className="text-xs text-amber-600 mt-0.5">
                          {duecount > 0 ? `${duecount} month(s) overdue` : 'Payment required'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Overdue Months</span>
                  <span className="font-semibold text-slate-900">{isFeesPaid ? 0 : duecount}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Last Checked</span>
                  <span className="font-mono text-slate-600">{format(new Date(), "dd-MM-yyyy")}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}