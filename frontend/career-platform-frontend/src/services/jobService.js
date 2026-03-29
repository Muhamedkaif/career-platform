import axiosInstance from './axiosInstance';

export const jobService = {
  getJobs: (filters) => axiosInstance.get('/jobs', { params: filters }),
  getJob: (id) => axiosInstance.get(`/jobs/${id}`),
  applyJob: (jobId) => axiosInstance.post(`/jobs/${jobId}/apply`),
  postJob: (data) => axiosInstance.post('/jobs', data),
  updateJob: (id, data) => axiosInstance.put(`/jobs/${id}`, data),
  deleteJob: (id) => axiosInstance.delete(`/jobs/${id}`),
  getInternships: (filters) => axiosInstance.get('/internships', { params: filters }),
  postInternship: (data) => axiosInstance.post('/internships', data),
  applyInternship: (id) => axiosInstance.post(`/internships/${id}/apply`),
};
