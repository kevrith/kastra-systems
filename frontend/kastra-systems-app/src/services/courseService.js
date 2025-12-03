import { get, post, put, del } from './api';

export const courseService = {
  getAllCourses: async () => await get('/courses'),
  getCourseById: async (id) => await get(`/courses/${id}`),
  createCourse: async (data) => await post('/courses', data),
  updateCourse: async (id, data) => await put(`/courses/${id}`, data),
  deleteCourse: async (id) => await del(`/courses/${id}`),
  getCourseAssignments: async (id) => await get(`/courses/${id}/assignments`),
};
