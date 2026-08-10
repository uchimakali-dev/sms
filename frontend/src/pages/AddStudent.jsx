import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserPlus, 
  Building, 
  User, 
  ArrowLeft, 
  Loader2, 
  Calendar, 
  IndianRupee, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function AddStudent({ onAdd }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE_URL = "/api/";
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
          <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center gap-3.5">
            <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">Add New Student</h1>
              <p className="text-slate-500 text-xs mt-0.5">Enter details to register a student into the directory</p>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            
            {/* Error Notification */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Student Name Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Student Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. mariyappa"
                  className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  value={form.student_name}
                  onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                />
              </div>
            </div>

            {/* Department & Date of Join Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Department */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Department
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSE"
                    className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition uppercase tracking-wide"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                  />
                </div>
              </div>

              {/* Date of Join */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Date of Join
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    value={form.dateofjoin}
                    onChange={(e) => setForm({ ...form, dateofjoin: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Financial Details Section */}
            <div className="pt-4 border-t border-slate-100">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Financial Setup
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Amount Paid */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Amount Paid (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      placeholder="0"
                      className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                      value={form.amount_paid}
                      onChange={(e) => setForm({ ...form, amount_paid: e.target.value })}
                    />
                  </div>
                </div>

                {/* Amount Due / Total Fees */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Fees Amount (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      placeholder="0"
                      className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                      value={form.amount_due}
                      onChange={(e) => setForm({ ...form, amount_due: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Full Paid Checkbox Toggle */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <input
                  type="checkbox"
                  id="paid"
                  checked={form.paid}
                  onChange={(e) => setForm({ ...form, paid: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="paid" className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                  <CheckCircle className={`w-4 h-4 ${form.paid ? 'text-emerald-600' : 'text-slate-400'}`} />
                  Mark Fee Payment as Fully Settled
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
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg transition duration-150 text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  'Add Student'
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}