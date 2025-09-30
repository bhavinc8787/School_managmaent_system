import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;