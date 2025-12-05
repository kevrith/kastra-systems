import { get, post, put, del } from './api';

const feeService = {
  // Fee Structure endpoints
  getAllFeeStructures: async () => {
    return await get('/fees/structures');
  },

  getFeeStructure: async (academicYear, gradeLevel) => {
    return await get(`/fees/structures/${academicYear}/${gradeLevel}`);
  },

  createFeeStructure: async (structureData) => {
    return await post('/fees/structures', structureData);
  },

  updateFeeStructure: async (structureId, structureData) => {
    return await put(`/fees/structures/${structureId}`, structureData);
  },

  deleteFeeStructure: async (structureId) => {
    return await del(`/fees/structures/${structureId}`);
  },

  // Fee Record endpoints
  getAllFeeRecords: async () => {
    return await get('/fees/records');
  },

  getStudentFeeRecords: async (studentId) => {
    return await get(`/fees/records/student/${studentId}`);
  },

  getFeeRecord: async (recordId) => {
    return await get(`/fees/records/${recordId}`);
  },

  createFeeRecord: async (recordData) => {
    return await post('/fees/records', recordData);
  },

  updateFeeRecord: async (recordId, recordData) => {
    return await put(`/fees/records/${recordId}`, recordData);
  },

  deleteFeeRecord: async (recordId) => {
    return await del(`/fees/records/${recordId}`);
  },

  // Generate fee records for a student
  generateFeeRecords: async (studentId, academicYear) => {
    return await post(`/fees/records/generate/${studentId}?academic_year=${academicYear}`);
  }
};

export default feeService;
