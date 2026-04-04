import api from './axiosInstance';

export const jobService = {
  getJobs: (filters) => api.get('/jobs', { params: filters }),
  getJob: (id) => api.get(`/jobs/${id}`),
  applyJob: (jobId) => api.post(`/jobs/${jobId}/apply`),
  postJob: (data) => api.post('/jobs/create', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getInternships: (filters) => api.get('/internships', { params: filters }),
  getAllInternships: () => api.get('/internships/all'),
  postInternship: (data) => api.post('/internships/create', data),
  applyInternship: (id) => api.post(`/internships/${id}/apply`),
};
