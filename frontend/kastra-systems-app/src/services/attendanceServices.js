import { get, post } from './api';

export const attendanceService = {
  markAttendance: async (data) => await post('/attendance', data),
  getAttendanceByDate: async (date) => await get(`/attendance?date=${date}`),
};
