import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Career Platform</h1>

      <div style={{ marginTop: "40px" }}>
        {/* 🎓 STUDENT */}
        <button
          onClick={() => navigate("/login/student")}
          style={{ marginRight: "20px", padding: "10px 20px" }}
        >
          Student Login
        </button>

        {/* 👨‍🏫 FACULTY */}
        <button
          onClick={() => navigate("/login/admin")}
          style={{ padding: "10px 20px" }}
        >
          Faculty Login
        </button>
      </div>
    </div>
  );
}