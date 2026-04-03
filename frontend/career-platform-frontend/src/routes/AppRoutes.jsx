import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Sidebar from '../components/Sidebar';

// Pages
import LandingPage from '../pages/Landing/LandingPage';
import Login from '../pages/Auth/Login';
import RoleSelect from '../pages/Auth/RoleSelect';

import StudentDashboard from '../pages/Student/StudentDashboard';
import Profile from '../pages/Student/Profile';
import SkillTracker from '../pages/Student/SkillTracker';
import Jobs from '../pages/Student/Jobs';
import Internships from '../pages/Student/Internships';
import Certificates from '../pages/Student/Certificates';
import Resume from '../pages/Student/Resume';

import FacultyDashboard from '../pages/Faculty/FacultyDashboard';
import Students from '../pages/Faculty/Students';
import PostJob from '../pages/Faculty/PostJob';
import PostInternship from '../pages/Faculty/PostInternship';
import Analytics from '../pages/Faculty/Analytics';
import Announcements from '../pages/Faculty/Announcements';

// Protected route wrapper
function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <Loader fullPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/students'} replace />;

  return children;
}

// Layout with Sidebar
function DashboardLayout({ children }) {
  const location = useLocation();
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-secondary)' }}>
      <Sidebar key={location.pathname.split('/')[1]} />
      <div style={{ flex: 1, marginLeft: 220, minWidth: 0, display: 'flex', flexDirection: 'column', transition: 'margin-left 250ms cubic-bezier(0.4,0,0.2,1)' }}>
        {children}
      </div>
    </div>
  );
}

export default function AppRoutes() {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to={role === 'admin' ? '/admin/dashboard' : '/students/dashboard'} replace /> : <Login />} />
      <Route path="/role-select" element={<RoleSelect />} />

      {/* Student Routes */}
      <Route path="/students/dashboard" element={
        <ProtectedRoute allowedRole="student">
          <DashboardLayout><StudentDashboard /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/students/profile" element={
        <ProtectedRoute allowedRole="student">
          <DashboardLayout><Profile /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/students/skills" element={
        <ProtectedRoute allowedRole="student">
          <DashboardLayout><SkillTracker /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/students/jobs" element={
        <ProtectedRoute allowedRole="student">
          <DashboardLayout><Jobs /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/students/internships" element={
        <ProtectedRoute allowedRole="student">
          <DashboardLayout><Internships /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/students/certificates" element={
        <ProtectedRoute allowedRole="student">
          <DashboardLayout><Certificates /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/students/resume" element={
        <ProtectedRoute allowedRole="student">
          <DashboardLayout><Resume /></DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Faculty Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRole="admin">
          <DashboardLayout><FacultyDashboard /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/students" element={
        <ProtectedRoute allowedRole="admin">
          <DashboardLayout><Students /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/post-job" element={
        <ProtectedRoute allowedRole="admin">
          <DashboardLayout><PostJob /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/post-internship" element={
        <ProtectedRoute allowedRole="admin">
          <DashboardLayout><PostInternship /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute allowedRole="admin">
          <DashboardLayout><Analytics /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/announcements" element={
        <ProtectedRoute allowedRole="admin">
          <DashboardLayout><Announcements /></DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
