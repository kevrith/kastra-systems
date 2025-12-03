import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { courseService } from '../services';

export const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    course_id: '',
    name: '',
    description: '',
    credits: '',
    semester: '',
    academic_year: '',
  });

  useEffect(() => {
    loadCourses();
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

  const handleSubmit = async () => {
    try {
      await courseService.createCourse({
        ...formData,
        credits: parseInt(formData.credits),
      });
      setShowModal(false);
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
            <p className="text-sm text-gray-600 mb-4">{course.description}</p>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Course ID:</span> {course.course_id}</p>
              <p><span className="font-semibold">Credits:</span> {course.credits}</p>
              <p><span className="font-semibold">Semester:</span> {course.semester}</p>
              <p><span className="font-semibold">Teacher:</span> {course.teacher_name || 'TBA'}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Course">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Course ID *"
            value={formData.course_id}
            onChange={(e) => setFormData({...formData, course_id: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Course Name *"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
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
          />
          <input
            type="text"
            placeholder="Semester (e.g., Fall 2024)"
            value={formData.semester}
            onChange={(e) => setFormData({...formData, semester: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Academic Year (e.g., 2024-2025)"
            value={formData.academic_year}
            onChange={(e) => setFormData({...formData, academic_year: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
          />
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