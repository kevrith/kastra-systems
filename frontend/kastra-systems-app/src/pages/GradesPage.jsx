import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import studentService from '../services/studentService';

export const GradesPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [gpa, setGpa] = useState(0);
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

  const loadGrades = async (studentId) => {
    try {
      const data = await studentService.getStudentGrades(studentId);
      setGrades(data.grades || []);
      setGpa(data.gpa || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    loadGrades(student.id);
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Student List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Select Student</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => handleStudentSelect(student)}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                selectedStudent?.id === student.id
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <p className="font-medium">{student.name}</p>
              <p className="text-xs text-gray-500">{student.student_id}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Grades Display */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
        {selectedStudent ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold">{selectedStudent.name}</h3>
                <p className="text-gray-500">Grade {selectedStudent.grade_level}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Current GPA</p>
                <p className="text-3xl font-bold text-blue-600">{gpa.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-4">
              {grades.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No grades recorded yet.</p>
              ) : (
                grades.map((grade, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold">{grade.course_name}</h4>
                        <p className="text-sm text-gray-500">{grade.assessment_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{grade.grade_letter}</p>
                        <p className="text-sm text-gray-500">{grade.grade}%</p>
                      </div>
                    </div>
                    {grade.remarks && (
                      <p className="mt-2 text-sm text-gray-600">{grade.remarks}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Select a student to view grades</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradesPage;