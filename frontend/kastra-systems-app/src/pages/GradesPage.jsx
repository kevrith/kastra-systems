import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Edit2 } from 'lucide-react';
import studentService from '../services/studentService';
import { assignmentService } from '../services/assignmentService';
import { gradeService } from '../services/gradeService';

export const GradesPage = () => {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [gpa, setGpa] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [formData, setFormData] = useState({
    assignment_id: '',
    points_earned: '',
    feedback: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadStudents();
    loadAssignments();
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

  const loadAssignments = async () => {
    try {
      const data = await assignmentService.getAllAssignments();
      setAssignments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadGrades = async (studentId) => {
    try {
      const data = await studentService.getStudentGrades(studentId);
      // Backend returns array directly, not wrapped in object
      setGrades(Array.isArray(data) ? data : []);
      // Calculate GPA if we have grades
      if (Array.isArray(data) && data.length > 0) {
        const totalPercentage = data.reduce((sum, grade) => {
          const percentage = (grade.points_earned / grade.max_points) * 100;
          return sum + percentage;
        }, 0);
        const avgPercentage = totalPercentage / data.length;
        // Convert percentage to 4.0 scale (assuming 90+ = 4.0, 80-89 = 3.0, etc.)
        const calculatedGpa = avgPercentage >= 90 ? 4.0 :
                             avgPercentage >= 80 ? 3.0 :
                             avgPercentage >= 70 ? 2.0 :
                             avgPercentage >= 60 ? 1.0 : 0.0;
        setGpa(calculatedGpa);
      } else {
        setGpa(0);
      }
    } catch (error) {
      console.error(error);
      setGrades([]);
      setGpa(0);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    loadGrades(student.id);
    setShowAddForm(false);
    setEditMode(false);
    setEditingGrade(null);
    setError(null);
    setSuccess(null);
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedStudent) {
      setError('Please select a student first');
      return;
    }

    try {
      if (editMode && editingGrade) {
        // Update existing grade
        await gradeService.updateGrade(editingGrade.id, {
          points_earned: parseFloat(formData.points_earned),
          feedback: formData.feedback
        });
        setSuccess('Grade updated successfully!');
      } else {
        // Add new grade
        await gradeService.addGrade({
          student_id: selectedStudent.id,
          assignment_id: parseInt(formData.assignment_id),
          points_earned: parseFloat(formData.points_earned),
          feedback: formData.feedback
        });
        setSuccess('Grade added successfully!');
      }

      loadGrades(selectedStudent.id);
      setShowAddForm(false);
      setEditMode(false);
      setEditingGrade(null);
      setFormData({
        assignment_id: '',
        points_earned: '',
        feedback: ''
      });
    } catch (error) {
      setError(error.message || `Failed to ${editMode ? 'update' : 'add'} grade`);
    }
  };

  const handleEditGrade = (grade) => {
    setEditMode(true);
    setEditingGrade(grade);
    setShowAddForm(true);
    setFormData({
      assignment_id: grade.assignment_id?.toString() || '',
      points_earned: grade.points_earned.toString(),
      feedback: grade.feedback || ''
    });
    setError(null);
    setSuccess(null);
  };

  const calculatePercentage = (pointsEarned, maxPoints) => {
    if (!maxPoints || maxPoints === 0) return 0;
    return ((pointsEarned / maxPoints) * 100).toFixed(1);
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Student List */}
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

      {/* Grades Display */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
        {selectedStudent ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold">
                  {selectedStudent.user?.first_name} {selectedStudent.user?.last_name}
                </h3>
                <p className="text-gray-500">Student Grades</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Current GPA</p>
                  <p className="text-3xl font-bold text-blue-600">{gpa.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddForm(!showAddForm);
                    if (showAddForm) {
                      setEditMode(false);
                      setEditingGrade(null);
                      setFormData({
                        assignment_id: '',
                        points_earned: '',
                        feedback: ''
                      });
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {showAddForm ? <X size={20} /> : <Plus size={20} />}
                  {showAddForm ? 'Cancel' : 'Add Grade'}
                </button>
              </div>
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
              <form onSubmit={handleSubmitGrade} className="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 className="font-bold mb-4">{editMode ? 'Edit Grade (Remarking)' : 'Add Grade'}</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignment
                    </label>
                    <select
                      value={formData.assignment_id}
                      onChange={(e) => {
                        const assignment = assignments.find(a => a.id === parseInt(e.target.value));
                        setFormData({ ...formData, assignment_id: e.target.value });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                      disabled={editMode}
                    >
                      <option value="">Select Assignment</option>
                      {assignments.map((assignment) => (
                        <option key={assignment.id} value={assignment.id}>
                          {assignment.title} (Max: {assignment.max_points} points)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points Earned
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.points_earned}
                      onChange={(e) => setFormData({ ...formData, points_earned: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter points earned"
                      required
                    />
                    {formData.assignment_id && (
                      <p className="text-xs text-gray-500 mt-1">
                        Max points: {assignments.find(a => a.id === parseInt(formData.assignment_id))?.max_points || 0}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback (Optional)
                    </label>
                    <textarea
                      value={formData.feedback}
                      onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Add feedback for the student..."
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editMode ? 'Update Grade' : 'Submit Grade'}
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {grades.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No grades recorded yet.</p>
              ) : (
                grades.map((grade, index) => {
                  const percentage = calculatePercentage(grade.points_earned, grade.max_points);
                  const letterGrade = getLetterGrade(parseFloat(percentage));

                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold">{grade.assignment_title || 'Assignment'}</h4>
                          <p className="text-sm text-gray-500">{grade.course_name || 'Course'}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {grade.points_earned} / {grade.max_points} points
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">{letterGrade}</p>
                            <p className="text-sm text-gray-500">{percentage}%</p>
                          </div>
                          <button
                            onClick={() => handleEditGrade(grade)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit grade"
                          >
                            <Edit2 size={18} />
                          </button>
                        </div>
                      </div>
                      {grade.feedback && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm font-medium text-gray-700">Feedback:</p>
                          <p className="text-sm text-gray-600 mt-1">{grade.feedback}</p>
                        </div>
                      )}
                      {grade.graded_at && (
                        <p className="text-xs text-gray-400 mt-2">
                          Graded on: {new Date(grade.graded_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Select a student to view and add grades</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradesPage;
