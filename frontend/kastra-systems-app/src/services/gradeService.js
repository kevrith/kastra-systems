import { post, put, del } from './api';

export const gradeService = {
  addGrade: async (data) => await post('/grades', data),
  updateGrade: async (id, data) => await put(`/grades/${id}`, data),
  deleteGrade: async (id) => await del(`/grades/${id}`),
};