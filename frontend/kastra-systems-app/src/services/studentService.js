import { get, post, put, del } from './api';

const studentService = {
  // Get all students
  getAllStudents: async () => {
    return await get('/students');
  },

  // Get student by ID
  getStudentById: async (id) => {
    return await get(`/students/${id}`);
  },

  // Create new student
  createStudent: async (studentData) => {
    return await post('/students', studentData);
  },

  // Update student
  updateStudent: async (id, studentData) => {
    return await put(`/students/${id}`, studentData);
  },

  // Delete student
  deleteStudent: async (id) => {
    return await del(`/students/${id}`);
  },

  // Get student courses
  getStudentCourses: async (id) => {
    return await get(`/students/${id}/courses`);
  },

  // Get student grades
  getStudentGrades: async (id) => {
    return await get(`/students/${id}/grades`);
  },

  // Get student attendance
  getStudentAttendance: async (id, courseId = null) => {
    const endpoint = courseId 
      ? `/students/${id}/attendance?course_id=${courseId}`
      : `/students/${id}/attendance`;
    return await get(endpoint);
  },
};

export default studentService;