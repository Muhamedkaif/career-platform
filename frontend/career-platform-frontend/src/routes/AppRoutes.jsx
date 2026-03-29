import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/Landing/LandingPage";
import Login from "../pages/Auth/Loginpage"; // ✅ FIXED
import StudentDashboard from "../pages/Student/StudentDashboard";
import FacultyDashboard from "../pages/Faculty/FacultyDashboard";
import ProtectedRoute from "./protectedRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login/student" element={<Login role="STUDENT" />} />
      <Route path="/login/admin" element={<Login role="ADMIN" />} />

      {/* ✅ STUDENT */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute role="STUDENT">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ FACULTY */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="ADMIN">
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;