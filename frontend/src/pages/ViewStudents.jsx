import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {format,parseISO} from "date-fns";
import { Eye, Edit, Trash2, UserPlus, Search, Sparkles, Loader2, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ViewStudents({ onDelete }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = "http://127.0.0.1:8000";
  const [error, setError] = useState(null);
  

  // Search and Sort query parameters for Backend API
  const [search, setSearchTerm] = useState('');
  const [sort, setSortBy] = useState('name');

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    setLoading(true);
    const token= localStorage.getItem('token')
    
    

    // Construct request URL with backend query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);

    fetch(`${API_BASE_URL}/students?${params.toString()}`,{
        method:"GET",
        headers:{
          "Authorization":`Bearer ${token}`
        }
    }
  )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setStudents(data || []);
        setCurrentPage(1); // Reset to page 1 whenever new search or sort data arrives
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching students:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [search, sort]); // Re-fetches automatically when search or sort state changes!

  // --- Calculate Pagination Slices ---
  const totalPages = Math.ceil(students.length / itemsPerPage) || 1;
  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  // Helper page handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const dateFormat=(d)=>{
    const formated=format(parseISO(d),"dd-MM-yyyy");
    return formated

  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 md:p-8 relative overflow-hidden text-slate-100">
      
      {/* Background Radial Glow Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 relative z-10">
        
        {/* --- Header & Action Section --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl shadow-emerald-950/10">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Student Directory</h1>
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Manage and view all registered students</p>
          </div>

          <Link
            to="/add"
            className="w-full sm:w-auto px-5 py-3 bg-linear-to-r via-teal-500 to-cyan-500 from-emerald-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 active:scale-[0.99] text-slate-950 font-bold rounded-2xl transition duration-200 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm"
          >
            <UserPlus className="w-4 h-4 text-slate-950" /> Add New
          </Link>
        </div>

        {/* --- Search and Sort Controls --- */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-center bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-lg">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80 group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition duration-200"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sort by:</span>
            </div>
            <select
              value={sort}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-4 sm:pl-10 pr-10 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-200 text-sm outline-none hover:border-slate-700 hover:bg-slate-900/60 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition duration-200 cursor-pointer shadow-inner"
            >
              <option value="name" className="bg-slate-900 text-slate-100 py-2">
                Name
              </option>
              <option value="email" className="bg-slate-900 text-slate-100 py-2">
                Dateofjoin
              </option>
              <option value="department" className="bg-slate-900 text-slate-100 py-2">
                Department
              </option>
            </select>
          </div>
        </div>

        {/* --- Main Data Container --- */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-emerald-950/20 border border-slate-800 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="text-sm font-medium">Loading students...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 px-4 text-rose-400 bg-rose-950/20">
              ⚠️ <span className="font-semibold">Error:</span> {error}
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-16 px-4 text-slate-400">
              <p className="text-base font-medium">
                {search ? "No students match your query." : 'No students found.'}
              </p>
              {!search && (
                <p className="text-xs text-slate-500 mt-1">Click "Add New" above to register a student.</p>
              )}
            </div>
          ) : (
            <>
              {/* Desktop & Tablet Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="p-4 pl-6">Name</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">dateofjoin</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                    {currentStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 pl-6 font-semibold text-white">{student.student_name}</td>
                        <td className="p-4 text-slate-400">{student.department}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                            {dateFormat(student.dateofjoin)}
                          </span>
                        </td>

                        <td className="p-4 pr-6 text-right">
                          <div className="flex justify-end gap-1.5">
                            {/* View Button */}
                            <Link
                              to={`/student/${student.id}`}
                              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            
                            {/* Edit Button */}
                            <Link
                              to={`/update/${student.id}`}
                              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl transition-colors"
                              title="Edit Student"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>

                            {/* Delete Button */}
                            <button
                              onClick={async () => {
                                const success=await onDelete(student.id);
                                if(success){
                                setStudents((prevStudents) => prevStudents.filter((s) => s.id !== student.id));
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout */}
              <div className="block md:hidden divide-y divide-slate-800/60">
                {currentStudents.map((student) => (
                  <div key={student.id} className="p-4 space-y-3 bg-slate-900/40">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-semibold text-white text-base">{student.student_name}</h3>
                        <p className="text-xs text-slate-400 break-all">{student.department}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide shrink-0">
                        {student.dateofjoin}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/40">
                      <Link
                        to={`/student/${student.id}`}
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-colors flex items-center gap-1 text-xs"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      
                      <Link
                        to={`/update/${student.id}`}
                        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl transition-colors flex items-center gap-1 text-xs"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => {
                          onDelete(student.id);
                          setStudents((prevStudents) => prevStudents.filter((s) => s.id !== student.id));
                        }}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-1 text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- Pagination Footer Controls --- */}
              <div className="px-4 sm:px-6 py-4 bg-slate-950/40 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <p className="text-slate-400 text-center sm:text-left">
                  Showing <span className="font-semibold text-white">{indexOfFirstStudent + 1}</span> to{' '}
                  <span className="font-semibold text-white">
                    {Math.min(indexOfLastStudent, students.length)}
                  </span>{' '}
                  of <span className="font-semibold text-white">{students.length}</span> students
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="p-2 bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-30 border border-slate-700/80 text-slate-200 rounded-xl transition disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex gap-1 overflow-x-auto  sm:max-w-none py-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`w-8 h-8 rounded-xl text-xs font-semibold transition border shrink-0 ${
                          currentPage === number
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800 border-slate-800'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-30 border border-slate-700/80 text-slate-200 rounded-xl transition disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}