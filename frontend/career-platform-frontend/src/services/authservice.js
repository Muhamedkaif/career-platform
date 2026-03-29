import api from './axiosInstance';


export const authService = {
  loginStudent: (data) => api.post("/students/login", data),
  loginAdmin: (data) => api.post("/admin/login", data),
};