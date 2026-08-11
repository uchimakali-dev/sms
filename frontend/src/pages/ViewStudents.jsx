import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Eye, Edit, Trash2, UserPlus, Search, Loader2, ArrowUpDown, ChevronLeft, ChevronRight, Users, GraduationCap, Calendar } from 'lucide-react';

export default function ViewStudents({ onDelete }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = "/api/";
  const [error, setError] = useState(null);

  // Search and Sort query parameters
  const [search, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSortBy] = useState('name');

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Helper for generating dynamic user avatars based on name
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST';
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');

    const params = new URLSearchParams();
    if (debouncedSearch) params.append('search', debouncedSearch);
    if (sort) params.append('sort', sort);

    fetch(`${API_BASE_URL}/students/?${params.toString()}`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setStudents(data || []);
        setCurrentPage(1);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Error fetching students:', err);
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedSearch, sort]);

  // --- Delete Handler Helper ---
  const handleDelete = async (studentId) => {
    if (onDelete) {
      const success = await onDelete(studentId);
      if (success !== false) {
        setStudents((prev) => prev.filter((s) => s.id !== studentId));
      }
    }
  };

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

  const dateFormat = (d) => {
    if (!d) return "N/A";
    try {
      return format(parseISO(d), "dd-MM-yyyy");
    } catch {
      return d;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-8 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Directory</h1>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 ml-10">
              Manage and view registered student records, departments, and enrollment details
            </p>
          </div>

          <Link
            to="/add"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl transition duration-150 shadow-sm hover:shadow-blue-500/10 shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Add Student
          </Link>
        </div>

        {/* --- Metric Cards Summary Bar --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total Registered</p>
              <p className="text-lg font-bold text-slate-900">{students.length}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Current View</p>
              <p className="text-lg font-bold text-slate-900">{currentStudents.length} Students</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Page Navigation</p>
              <p className="text-lg font-bold text-slate-900">{currentPage} of {totalPages}</p>
            </div>
          </div>
        </div>

        {/* --- Control Bar (Search & Sort) --- */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name or department..."
              value={search}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-150"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-900 font-semibold outline-none cursor-pointer"
              >
                <option value="name">Name</option>
                <option value="dateofjoin">Date Joined</option>
                <option value="department">Department</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- Main Data Container --- */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-sm font-medium">Fetching directory records...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 px-4 text-red-600 bg-red-50/50 border-b border-red-100">
              <p className="font-semibold text-sm">Error loading data</p>
              <p className="text-xs text-red-500 mt-1">{error}</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-20 px-4 text-slate-500">
              <div className="p-3 bg-slate-100 rounded-full w-fit mx-auto mb-3">
                <Search className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-base font-semibold text-slate-800">No records found</p>
              <p className="text-xs text-slate-500 mt-1">
                {search ? "No student records matched your search." : 'No students found in the directory.'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Student Info</th>
                      <th className="py-4 px-6">Department</th>
                      <th className="py-4 px-6">Date Joined</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {currentStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/60 transition-colors group">
                        
                        {/* Avatar & Name */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center font-bold text-xs text-slate-600 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                              {getInitials(student.student_name)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {student.student_name}
                              </p>
                              <p className="text-xs text-slate-400">ID: #{student.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Department Badge */}
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                            {student.department}
                          </span>
                        </td>

                        {/* Date Joined */}
                        <td className="py-4 px-6">
                          <span className="text-slate-600 text-xs font-mono">
                            {dateFormat(student.dateofjoin)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            <Link
                              to={`/student/${student.id}`}
                              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            
                            <Link
                              to={`/update/${student.id}`}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Student"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDelete(student.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

              {/* Mobile Card View */}
              <div className="block md:hidden divide-y divide-slate-100">
                {currentStudents.map((student) => (
                  <div key={student.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0">
                          {getInitials(student.student_name)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-sm">{student.student_name}</h3>
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                            {student.department}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400 shrink-0 pt-1">
                        {dateFormat(student.dateofjoin)}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <Link
                        to={`/student/${student.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                      
                      <Link
                        to={`/update/${student.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(student.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- Pagination Footer --- */}
              <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <p className="text-center sm:text-left">
                  Showing <span className="font-bold text-slate-800">{indexOfFirstStudent + 1}</span> to{' '}
                  <span className="font-bold text-slate-800">
                    {Math.min(indexOfLastStudent, students.length)}
                  </span>{' '}
                  of <span className="font-bold text-slate-800">{students.length}</span> students
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="p-2 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 text-slate-700 rounded-xl transition disabled:cursor-not-allowed shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`w-8 h-8 rounded-xl text-xs font-semibold transition border ${
                          currentPage === number
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 text-slate-700 rounded-xl transition disabled:cursor-not-allowed shadow-sm"
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