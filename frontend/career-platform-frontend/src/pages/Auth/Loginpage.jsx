import { useState, useContext } from "react";
import { loginStudent, loginAdmin } from "../../services/authservice";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login({ role }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (role === "ADMIN") {
        res = await loginAdmin(form);
      } else {
        res = await loginStudent(form);
      }

      const token = res.data.token;

      // ✅ STORE FIRST
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      login(token, role);

      // ✅ THEN NAVIGATE
      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/students/dashboard");
      }

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>{role} Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}