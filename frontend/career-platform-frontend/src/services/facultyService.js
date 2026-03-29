import axiosInstance from './axiosInstance';

export const facultyService = {
  getAnalytics: () => axiosInstance.get('/faculty/analytics'),
  getStudents: (params) => axiosInstance.get('/faculty/students', { params }),
  getStudent: (id) => axiosInstance.get(`/faculty/students/${id}`),
  postAnnouncement: (data) => axiosInstance.post('/faculty/announcements', data),
  getAnnouncements: () => axiosInstance.get('/faculty/announcements'),
  getDashboard: () => axiosInstance.get('/faculty/dashboard'),
};
