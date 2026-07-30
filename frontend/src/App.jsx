import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ViewStudents from "./pages/ViewStudents";
import AddStudent from "./pages/AddStudent";
import UpdateStudent from "./pages/UpdateStudent";
import StudentDetails from "./pages/StudentDetails";
import { Loader2, Sparkles } from "lucide-react";

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = "https://sms-eta-eosin.vercel.app";

  useEffect(() => {
    // Perform the GET request
    fetch(`${API_BASE_URL}/all_students`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []); // Empty dependency array ensures this runs once on component mount

  // Initial Full-Page Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-4 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col items-center gap-4 bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <p className="text-sm font-medium text-slate-300">Loading student portal...</p>
        </div>
      </div>
    );
  }

  // Initial Full-Page Error State
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="bg-rose-950/40 border border-rose-800/60 backdrop-blur-xl p-8 rounded-3xl text-center max-w-md shadow-2xl">
          <span className="text-3xl mb-3 block">⚠️</span>
          <h2 className="text-xl font-bold text-rose-300 mb-2">Connection Error</h2>
          <p className="text-sm text-rose-200/80">{error}</p>
        </div>
      </div>
    );
  }

  // Create
  const handleAddStudent = (newStudent) => {
    setStudents([...students, { ...newStudent, id: Date.now() }]);
  };

  // Update
  const handleUpdateStudent = async (id, updatedStudent) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update_student/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedStudent,
        }),
      });

      if (!response.ok) throw new Error('Failed to update student');

    } catch (err) {
      console.error('Error updating student:', err);
      alert('Could not update student record.');
      return false;
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student record?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/delete_student/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete student. Status: ${response.status}`);
      }

      // Update state locally so the deleted student instantly disappears from the UI
      setStudents((prevStudents) => prevStudents.filter((s) => s.id !== id));
      
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Could not delete the student. Please try again.");
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1 w-full">
          <Routes>
            <Route
              path="/"
              element={
                <ViewStudents
                  students={students}
                  onDelete={handleDelete}
                />
              }
            />
            <Route
              path="/add"
              element={<AddStudent onAdd={handleAddStudent} />}
            />
            <Route
              path="/update/:id"
              element={
                <UpdateStudent
                  students={students}
                  onUpdate={handleUpdateStudent}
                />
              }
            />
            <Route
              path="/student/:id"
              element={
                <StudentDetails
                  students={students}
                  onDelete={handleDelete}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}