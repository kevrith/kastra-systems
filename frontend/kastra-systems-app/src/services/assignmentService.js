import { get, post, put, del } from './api';

export const assignmentService = {
  getAllAssignments: async () => await get('/assignments'),
  getAssignmentsByCourse: async (courseId) => await get(`/courses/${courseId}/assignments`),
  createAssignment: async (data) => await post('/assignments', data),
  updateAssignment: async (id, data) => await put(`/assignments/${id}`, data),
  deleteAssignment: async (id) => await del(`/assignments/${id}`),
};
