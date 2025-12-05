import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X } from 'lucide-react';
import studentService from '../services/studentService';
import { courseService } from '../services';
import { attendanceService } from '../services/attendanceServices';

export const AttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    course_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    notes: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadStudents();
    loadCourses();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadAttendance = async (studentId) => {
    try {
      const data = await studentService.getStudentAttendance(studentId);
      setAttendance(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    loadAttendance(student.id);
    setShowAddForm(false);
    setError(null);
    setSuccess(null);
  };

  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedStudent) {
      setError('Please select a student first');
      return;
    }

    try {
      await attendanceService.markAttendance({
        student_id: selectedStudent.id,
        course_id: parseInt(formData.course_id),
        date: formData.date,
        status: formData.status,
        notes: formData.notes
      });

      setSuccess('Attendance marked successfully!');
      loadAttendance(selectedStudent.id);
      setShowAddForm(false);
      setFormData({
        course_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        notes: ''
      });
    } catch (error) {
      setError(error.message || 'Failed to mark attendance');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Select Student</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {students.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No students found</p>
          ) : (
            students.map((student) => (
              <button
                key={student.id}
                onClick={() => handleStudentSelect(student)}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  selectedStudent?.id === student.id
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <p className="font-medium">
                  {student.user?.first_name} {student.user?.last_name}
                </p>
                <p className="text-xs text-gray-500">{student.user?.email}</p>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
        {selectedStudent ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold">
                  {selectedStudent.user?.first_name} {selectedStudent.user?.last_name} - Attendance
                </h3>
                {attendance.length > 0 && (
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-gray-600">
                      Total Records: <span className="font-semibold">{attendance.length}</span>
                    </span>
                    <span className="text-green-600">
                      Present: <span className="font-semibold">
                        {attendance.filter(r => r.status === 'present').length}
                        ({((attendance.filter(r => r.status === 'present').length / attendance.length) * 100).toFixed(1)}%)
                      </span>
                    </span>
                    <span className="text-red-600">
                      Absent: <span className="font-semibold">
                        {attendance.filter(r => r.status === 'absent').length}
                        ({((attendance.filter(r => r.status === 'absent').length / attendance.length) * 100).toFixed(1)}%)
                      </span>
                    </span>
                    <span className="text-yellow-600">
                      Late: <span className="font-semibold">
                        {attendance.filter(r => r.status === 'late').length}
                        ({((attendance.filter(r => r.status === 'late').length / attendance.length) * 100).toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {showAddForm ? <X size={20} /> : <Plus size={20} />}
                {showAddForm ? 'Cancel' : 'Mark Attendance'}
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            {showAddForm && (
              <form onSubmit={handleSubmitAttendance} className="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 className="font-bold mb-4">Mark Attendance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course
                    </label>
                    <select
                      value={formData.course_id}
                      onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name} ({course.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add notes..."
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Submit Attendance
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {attendance.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No attendance records.</p>
              ) : (
                attendance.map((record, index) => (
                  <div key={index} className="flex items-center justify-between border rounded-lg p-4">
                    <div>
                      <p className="font-medium">{record.course_name || 'Course'}</p>
                      <p className="text-sm text-gray-500">{record.date}</p>
                      {record.notes && (
                        <p className="text-sm text-gray-600 mt-1">Note: {record.notes}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Select a student to view and mark attendance</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default AttendancePage;
