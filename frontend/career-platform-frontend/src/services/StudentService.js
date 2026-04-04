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
  getResume: () => api.get('/resume/get'),
  analyzeRecommendations: () => api.post('/ai/analyze'),
  uploadResume: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/resume/upload', form);
  },
  uploadGithub: (link) => api.post('/students/github', { githubLink: link }),
};
