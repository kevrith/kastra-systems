import { get, post, put, del } from './api';

// Teacher Service
export const teacherService = {
  getAllTeachers: async () => await get('/teachers'),
  createTeacher: async (data) => await post('/teachers', data),
  updateTeacher: async (id, data) => await put(`/teachers/${id}`, data),
  deleteTeacher: async (id) => await del(`/teachers/${id}`),
};