import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { courseService, teacherService } from '../services';

export const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    credits: 3,
    teacher_id: '',
  });

  useEffect(() => {
    loadCourses();
    loadTeachers();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeachers = async () => {
    try {
      const data = await teacherService.getAllTeachers();
      setTeachers(data);
    } catch (error) {
      console.error('Error loading teachers:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.teacher_id) {
        alert('Please select a teacher');
        return;
      }
      await courseService.createCourse({
        ...formData,
        credits: parseInt(formData.credits),
        teacher_id: parseInt(formData.teacher_id),
      });
      setShowModal(false);
      setFormData({
        code: '',
        name: '',
        description: '',
        credits: 3,
        teacher_id: '',
      });
      loadCourses();
      alert('Course added successfully!');
    } catch (error) {
      alert('Failed: ' + error.message);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Courses</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{course.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{course.description || 'No description'}</p>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Course Code:</span> {course.code}</p>
              <p><span className="font-semibold">Credits:</span> {course.credits}</p>
              <p><span className="font-semibold">Teacher ID:</span> {course.teacher_id}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Course">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Course Code (e.g., CS101) *"
            value={formData.code}
            onChange={(e) => setFormData({...formData, code: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Course Name *"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
            rows="3"
          />
          <input
            type="number"
            placeholder="Credits *"
            value={formData.credits}
            onChange={(e) => setFormData({...formData, credits: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
            min="1"
            max="6"
            required
          />
          <select
            value={formData.teacher_id}
            onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">Select Teacher *</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.user?.first_name} {teacher.user?.last_name} - {teacher.department || 'N/A'}
              </option>
            ))}
          </select>
          <div className="flex justify-end space-x-3">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Course</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default CoursesPage;