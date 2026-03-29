import api from "./axiousInstance";

export const getStudentDashboard = () => {
  return api.get("/students/dashboard");
};