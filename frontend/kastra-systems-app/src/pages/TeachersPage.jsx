import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { teacherService } from '../services';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    teacher_id: '',
    name: '',
    email: '',
    phone: '',
    subject: '',
    qualification: '',
    experience_years: '',
    salary: '',
  });

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getAllTeachers();
      setTeachers(data);
    } catch (error) {
      console.error('Error loading teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await teacherService.createTeacher({
        ...formData,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        salary: formData.salary ? parseFloat(formData.salary) : null,
      });
      setShowModal(false);
      setFormData({
        teacher_id: '',
        name: '',
        email: '',
        phone: '',
        subject: '',
        qualification: '',
        experience_years: '',
        salary: '',
      });
      loadTeachers();
      alert('Teacher added successfully!');
    } catch (error) {
      alert('Failed to add teacher: ' + error.message);
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.teacher_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Add Teacher</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTeachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{teacher.teacher_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.experience_years || 'N/A'} years</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button className="text-blue-600 hover:text-blue-900"><Edit className="w-5 h-5" /></button>
                  <button className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Teacher" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Teacher ID *"
              value={formData.teacher_id}
              onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Full Name *"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Subject *"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Qualification"
              value={formData.qualification}
              onChange={(e) => setFormData({...formData, qualification: e.target.value})}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Experience (years)"
              value={formData.experience_years}
              onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Salary"
              value={formData.salary}
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
              className="px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Teacher</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeachersPage;