import { useEffect, useState } from "react";
import { getStudentDashboard } from "../../services/StudentService";

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStudentDashboard();
        setStudent(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Student Dashboard</h1>

      {student && (
        <div>
          <p>Name: {student.name}</p>
          <p>Email: {student.email}</p>
          <p>Dept: {student.dept}</p>
        </div>
      )}
    </div>
  );
}