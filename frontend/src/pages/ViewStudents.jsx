import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Eye, Edit, Trash2, UserPlus, Search, Loader2, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">Student Directory</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Manage and view registered student records</p>
          </div>

          <Link
            to="/add"
            className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg transition duration-150 shadow-sm flex items-center justify-center gap-2 text-sm"
          >
            <UserPlus className="w-4 h-4" /> Add Student
          </Link>
        </div>

        {/* --- Control Bar (Search & Sort) --- */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort by:</span>
            </div>
            <select
              value={sort}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 cursor-pointer"
            >
              <option value="name">Name</option>
              <option value="dateofjoin">Date of Join</option>
              <option value="department">Department</option>
            </select>
          </div>
        </div>

        {/* --- Main Table Container --- */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-sm">Loading records...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 px-4 text-red-600 bg-red-50 border-b border-red-100">
              <span className="font-semibold">Error loading data:</span> {error}
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-16 px-4 text-slate-500">
              <p className="text-sm font-medium">
                {search ? "No student records matched your search." : 'No students found in the directory.'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3.5 px-5">Name</th>
                      <th className="py-3.5 px-5">Department</th>
                      <th className="py-3.5 px-5">Date Joined</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                    {currentStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-5 font-medium text-slate-900">{student.student_name}</td>
                        <td className="py-3.5 px-5 text-slate-600">{student.department}</td>
                        <td className="py-3.5 px-5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200">
                            {dateFormat(student.dateofjoin)}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex justify-end items-center gap-1">
                            <Link
                              to={`/student/${student.id}`}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            
                            <Link
                              to={`/update/${student.id}`}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Student"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDelete(student.id)}
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
              <div className="block md:hidden divide-y divide-slate-200">
                {currentStudents.map((student) => (
                  <div key={student.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-medium text-slate-900 text-base">{student.student_name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{student.department}</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                        {dateFormat(student.dateofjoin)}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100">
                      <Link
                        to={`/student/${student.id}`}
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      
                      <Link
                        to={`/update/${student.id}`}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- Pagination Footer --- */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                <p className="text-center sm:text-left">
                  Showing <span className="font-semibold text-slate-900">{indexOfFirstStudent + 1}</span> to{' '}
                  <span className="font-semibold text-slate-900">
                    {Math.min(indexOfLastStudent, students.length)}
                  </span>{' '}
                  of <span className="font-semibold text-slate-900">{students.length}</span> entries
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 text-slate-700 rounded-lg transition disabled:cursor-not-allowed shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition border ${
                          currentPage === number
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 text-slate-700 rounded-lg transition disabled:cursor-not-allowed shadow-sm"
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