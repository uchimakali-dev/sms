import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import ViewStudents from "./pages/ViewStudents";
import AddStudent from "./pages/AddStudent";
import UpdateStudent from "./pages/UpdateStudent";
import StudentDetails from "./pages/StudentDetails";
import { Loader2, AlertCircle } from "lucide-react";
import LoginPage from "./pages/Login";
import PublicRoute from "./components/PublicRoute";
import Home1 from "./pages/Home";

// Protected Route Guard Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = "/api";
  const [token, setToken] = useState(localStorage.getItem('token'));

  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = atob(payloadBase64);
      const decodedPayload = JSON.parse(decodedJson);
      const currentTime = Math.floor(Date.now() / 1000); 

      return decodedPayload.exp < currentTime; 
    } catch (error) {
      return true; 
    }
  };

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      setLoading(false);
      return;
    }
    
    fetch(`${API_BASE_URL}/all_students`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
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
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  // Initial Full-Page Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 p-4">
        <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center max-w-sm w-full">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-600">Loading student portal...</p>
        </div>
      </div>
    );
  }

  // Initial Full-Page Error State
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-red-200 p-8 rounded-xl text-center max-w-md shadow-sm w-full space-y-4">
          <div className="w-12 h-12 bg-red-50 border border-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Connection Error</h2>
            <p className="text-xs sm:text-sm text-slate-500">{error}</p>
          </div>
          <Link 
            to="/login" 
            className="inline-block w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs sm:text-sm shadow-xs transition"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  // Create
  const handleAddStudent = (newStudent) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  // Update
  const handleUpdateStudent = async (id, updatedStudent) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/update_student/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
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
      return false;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/delete_student/${id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete student. Status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Could not delete the student. Please try again.");
      return false;
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-blue-500 selection:text-white">
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/" element={<PublicRoute><Home1/></PublicRoute>} />
            
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddStudent onAdd={handleAddStudent} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/viewstudents"
              element={
                <ProtectedRoute>
                  <ViewStudents
                    students={students}
                    onDelete={handleDelete}
                  />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/update/:id"
              element={
                <ProtectedRoute>
                  <UpdateStudent
                    students={students}
                    onUpdate={handleUpdateStudent}
                  />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/student/:id"
              element={
                <ProtectedRoute>
                  <StudentDetails
                    students={students}
                    onDelete={handleDelete}
                  />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}