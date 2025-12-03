import React from 'react';import React, { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import Modal from '../components/Modal';
import { courseService, assignmentService } from '../services';

const AssignmentsPage = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    due_date: '',
    max_marks: '',
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(data);
      if (data.length > 0) {
        setSelectedCourse(data[0]);
        loadAssignments(data[0].id);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      alert('Failed to load courses: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async (courseId) => {
    try {
      const data = await courseService.getCourseAssignments(courseId);
      setAssignments(data);
    } catch (error) {
      console.error('Error loading assignments:', error);
      setAssignments([]);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    loadAssignments(course.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await assignmentService.createAssignment({
        ...formData,
        course_id: parseInt(formData.course_id),
        max_marks: parseInt(formData.max_marks),
      });
      setShowModal(false);
      setFormData({
        course_id: '',
        title: '',
        description: '',
        due_date: '',
        max_marks: '',
      });
      if (selectedCourse) {
        loadAssignments(selectedCourse.id);
      }
      alert('Assignment created successfully!');
    } catch (error) {
      alert('Failed to create assignment: ' + error.message);
    }
  };

  const openModal = () => {
    setFormData({
      ...formData,
      course_id: selectedCourse ? selectedCourse.id : '',
    });
    setShowModal(true);
  };

  const getStatusBadge = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3" />
          <span>Overdue</span>
        </span>
      );
    } else if (diffDays === 0) {
      return (
        <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <Clock className="w-3 h-3" />
          <span>Due Today</span>
        </span>
      );
    } else if (diffDays <= 3) {
      return (
        <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3" />
          <span>Due in {diffDays} days</span>
        </span>
      );
    } else {
      return (
        <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3" />
          <span>Active</span>
        </span>
      );
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Assignments</h2>
          <p className="text-gray-600 mt-1">Manage course assignments and track submissions</p>
        </div>
        {(user.role === 'admin' || user.role === 'teacher') && (
          <button
            onClick={openModal}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Course List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Courses</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {courses.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No courses available</p>
            ) : (
              courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => handleCourseSelect(course)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    selectedCourse?.id === course.id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <p className="font-medium text-gray-800">{course.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{course.course_id}</p>
                  {course.teacher_name && (
                    <p className="text-xs text-gray-500">{course.teacher_name}</p>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Assignments Display */}
        <div className="lg:col-span-3">
          {selectedCourse ? (
            <>
              {/* Course Header */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{selectedCourse.name}</h3>
                    <p className="text-gray-600 mt-1">{selectedCourse.description}</p>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {assignments.length} Assignment{assignments.length !== 1 ? 's' : ''}
                      </span>
                      {selectedCourse.teacher_name && (
                        <span>Instructor: {selectedCourse.teacher_name}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignments List */}
              <div className="space-y-4">
                {assignments.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No assignments yet</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {user.role === 'admin' || user.role === 'teacher'
                        ? 'Create your first assignment to get started'
                        : 'Your teacher will post assignments here'}
                    </p>
                  </div>
                ) : (
                  assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-800 mb-2">
                            {assignment.title}
                          </h4>
                          {assignment.description && (
                            <p className="text-gray-600 mb-3">{assignment.description}</p>
                          )}
                        </div>
                        {getStatusBadge(assignment.due_date)}
                      </div>

                      <div className="border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                            <div>
                              <p className="text-xs text-gray-500">Due Date</p>
                              <p className="font-medium">{formatDate(assignment.due_date)}</p>
                            </div>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <FileText className="w-4 h-4 mr-2 text-green-500" />
                            <div>
                              <p className="text-xs text-gray-500">Max Marks</p>
                              <p className="font-medium">{assignment.max_marks} points</p>
                            </div>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2 text-purple-500" />
                            <div>
                              <p className="text-xs text-gray-500">Posted</p>
                              <p className="font-medium">
                                {new Date(assignment.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {user.role === 'student' && (
                          <div className="mt-4 flex space-x-3">
                            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                              Submit Assignment
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                              View Details
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Select a course to view assignments</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Assignment"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course *
            </label>
            <select
              value={formData.course_id}
              onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.course_id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Final Project, Quiz 1, Homework 3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="Provide instructions and details about the assignment..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Marks *
              </label>
              <input
                type="number"
                value={formData.max_marks}
                onChange={(e) => setFormData({ ...formData, max_marks: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100"
                min="1"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Assignment
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AssignmentsPage;