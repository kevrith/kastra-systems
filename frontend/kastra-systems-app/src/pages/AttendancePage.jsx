import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import studentService from '../services/studentService';

export const AttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
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
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'excused': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Select Student</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => handleStudentSelect(student)}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                selectedStudent?.id === student.id ? 'bg-blue-100' : 'bg-gray-50'
              }`}
            >
              <p className="font-medium">{student.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
        {selectedStudent ? (
          <>
            <h3 className="text-2xl font-bold mb-6">{selectedStudent.name} - Attendance</h3>
            <div className="space-y-3">
              {attendance.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No attendance records.</p>
              ) : (
                attendance.map((record, index) => (
                  <div key={index} className="flex items-center justify-between border rounded-lg p-4">
                    <div>
                      <p className="font-medium">{record.course_name}</p>
                      <p className="text-sm text-gray-500">{record.date}</p>
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
            <p>Select a student to view attendance</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default AttendancePage;
