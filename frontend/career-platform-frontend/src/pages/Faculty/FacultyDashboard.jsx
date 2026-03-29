import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function FacultyDashboard() {
  const { logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Admin / Faculty Dashboard</h1>

      <ul>
        <li>Manage Students</li>
        <li>Post Jobs</li>
        <li>Post Internships</li>
        <li>View Analytics</li>
      </ul>

      <button onClick={logout}>Logout</button>
    </div>
  );
}