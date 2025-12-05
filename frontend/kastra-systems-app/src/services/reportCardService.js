import { get, post, put, del } from './api';

const reportCardService = {
  // Get all report cards for a student
  getStudentReportCards: async (studentId) => {
    return await get(`/report-cards/student/${studentId}`);
  },

  // Get a specific report card
  getReportCard: async (reportCardId) => {
    return await get(`/report-cards/${reportCardId}`);
  },

  // Create a new report card
  createReportCard: async (reportCardData) => {
    return await post('/report-cards', reportCardData);
  },

  // Update a report card
  updateReportCard: async (reportCardId, reportCardData) => {
    return await put(`/report-cards/${reportCardId}`, reportCardData);
  },

  // Delete a report card
  deleteReportCard: async (reportCardId) => {
    return await del(`/report-cards/${reportCardId}`);
  },

  // Auto-generate a report card
  generateReportCard: async (studentId, academicYear, term) => {
    return await post(`/report-cards/generate/${studentId}?academic_year=${academicYear}&term=${term}`);
  }
};

export default reportCardService;
