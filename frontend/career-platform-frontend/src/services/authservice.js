import api from "./axiousInstance";

export const loginStudent = (data) => {
  return api.post("/students/login", data);
};

export const registerStudent = (data) => {
  return api.post("/students/register", data);
};

export const loginAdmin = (data) => {
  return api.post("/admin/login", data);
};