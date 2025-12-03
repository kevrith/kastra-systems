import { post, del } from './api';

export const enrollmentService = {
  enrollStudent: async (data) => await post('/enrollments', data),
  unenrollStudent: async (id) => await del(`/enrollments/${id}`),
};