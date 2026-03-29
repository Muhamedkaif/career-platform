import api from './axiosInstance';

export const studentService = {
  getDashboard: () => api.get('/students/dashboard'),
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data),
  getSkills: () => api.get('/student/skills'),
  updateSkills: (data) => api.put('/student/skills', data),
  getJobs: (filters) => api.get('/student/jobs', { params: filters }),
  getInternships: (filters) => api.get('/student/internships', { params: filters }),
  getCertificates: () => api.get('/student/certificates'),
  getResume: () => api.get('/student/resume'),
  uploadResume: (file) => {
    const form = new FormData();
    form.append('resume', file);
    return api.post('/student/resume', form, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    });
  },
};