import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, Building2, Save, X, ArrowLeft, 
  AlertCircle, DollarSign, CheckCircle2, Calendar, Edit3 
} from 'lucide-react';

export default function UpdateStudent({ students, onUpdate }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    student_name: '',
    department: '',
    age: '',
    amount_due: '',
    amount_paid: '',
    date_of_pay: '',
    fees_paid: false
  });

  useEffect(() => {
    const student = students.find((s) => s.id === parseInt(id, 10));
    if (student) {
      setForm({
        ...student,
        amount_due: student.amount_due ?? '',
        amount_paid: student.amount_paid ?? '',
        date_of_pay: student.date_of_pay ?? '',
        fees_paid: Boolean(student.paid)
      });
    }
  }, [students, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.id) {
      onUpdate(form.id, {
        ...form,
        age: parseInt(form.age, 10) || 0,
        amount_due: parseFloat(form.amount_due) || 0,
        amount_paid: parseFloat(form.amount_paid) || 0,
        date_of_pay: form.date_of_pay || '',
        fees_paid: Boolean(form.fees_paid)
      });
      navigate("/viewstudents");
    }
  };

  // Record Not Found State
  const studentExists = students.some((s) => s.id === parseInt(id, 10));
  if (students.length > 0 && !studentExists) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8 text-slate-800 flex items-center justify-center">
        <div className="w-full max-w-md text-center p-8 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Student Not Found</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              The record you are trying to edit does not exist or has been removed.
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

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8 text-slate-800">
      <div className="max-w-2xl mx-auto space-y-6">
        
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

        {/* --- Main Form Card --- */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Card Header */}
          <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">Update Student Record</h1>
                <p className="text-slate-500 text-xs mt-0.5">
                  Editing profile for Student <span className="font-mono text-slate-700 font-medium">#{id}</span>
                </p>
              </div>
            </div>
            <span className="self-start sm:self-center text-[11px] font-mono font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md uppercase tracking-wide">
              Edit Mode
            </span>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            
            {/* Full Name Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  value={form?.student_name || ''}
                  onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                />
              </div>
            </div>

            {/* Department Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Department
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science"
                  className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition uppercase tracking-wide"
                  value={form?.department || ''}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
              </div>
            </div>

            {/* Fee Details Section */}
            <div className="pt-4 border-t border-slate-100">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Financial Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Amount Due */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Amount Due ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                      value={form?.amount_due || ''}
                      onChange={(e) => setForm({ ...form, amount_due: e.target.value })}
                    />
                  </div>
                </div>

                {/* Amount Paid */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Amount Paid ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                      value={form?.amount_paid || ''}
                      onChange={(e) => setForm({ ...form, amount_paid: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Date of Payment */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Date of Payment
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    value={form?.date_of_pay || ''}
                    onChange={(e) => setForm({ ...form, date_of_pay: e.target.value })}
                  />
                </div>
              </div>

              {/* Full Paid Checkbox Toggle */}
              <div className="mt-4 flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <input
                  type="checkbox"
                  id="fees_paid"
                  checked={Boolean(form?.fees_paid)}
                  onChange={(e) => setForm({ ...form, fees_paid: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="fees_paid" className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                  <CheckCircle2 className={`w-4 h-4 ${form?.fees_paid ? 'text-emerald-600' : 'text-slate-400'}`} />
                  Mark as Fully Paid
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/viewstudents')}
                className="w-full sm:flex-1 py-2.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium rounded-lg transition duration-150 border border-slate-300 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <X className="w-4 h-4 text-slate-500" /> Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg transition duration-150 text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4 text-white" /> Save Changes
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}