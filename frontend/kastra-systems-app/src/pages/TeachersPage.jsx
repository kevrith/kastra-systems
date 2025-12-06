import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { teacherService } from '../services';

const TeachersPage = ({ user }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTeacher, setEditingTeacher] = useState(null);
  const isAdmin = user?.role === 'admin';
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
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

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      first_name: teacher.user?.first_name || '',
      last_name: teacher.user?.last_name || '',
      email: teacher.user?.email || '',
      password: '', // Password not needed for editing
      phone: teacher.phone || '',
      department: teacher.department || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await teacherService.deleteTeacher(id);
        loadTeachers();
        alert('Teacher deleted successfully!');
      } catch (error) {
        alert('Failed to delete teacher: ' + error.message);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const teacherData = {
        ...formData,
      };

      // Remove password field if editing (not required for updates)
      if (editingTeacher) {
        delete teacherData.password;
        await teacherService.updateTeacher(editingTeacher.id, teacherData);
        alert('Teacher updated successfully!');
      } else {
        // For new teachers, password is required
        if (!teacherData.password) {
          alert('Password is required for new teachers');
          return;
        }
        await teacherService.createTeacher(teacherData);
        alert('Teacher added successfully!');
      }

      setShowModal(false);
      setEditingTeacher(null);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone: '',
        department: '',
      });
      loadTeachers();
    } catch (error) {
      alert(`Failed to ${editingTeacher ? 'update' : 'add'} teacher: ` + error.message);
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const fullName = `${teacher.user?.first_name || ''} ${teacher.user?.last_name || ''}`.toLowerCase();
    const email = (teacher.user?.email || '').toLowerCase();
    const dept = (teacher.department || '').toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           email.includes(searchTerm.toLowerCase()) ||
           dept.includes(searchTerm.toLowerCase());
  });

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
        {isAdmin && (
          <button
            onClick={() => {
              setEditingTeacher(null);
              setFormData({
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                phone: '',
                department: '',
              });
              setShowModal(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>Add Teacher</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? 'No teachers found matching your search.' : 'No teachers yet. Add your first teacher!'}
                </td>
              </tr>
            ) : (
              filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{teacher.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.user?.first_name} {teacher.user?.last_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.user?.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.department || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{teacher.phone || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {isAdmin ? (
                      <>
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm">View only</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTeacher(null);
        }}
        title={editingTeacher ? "Edit Teacher" : "Add New Teacher"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name *"
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Last Name *"
              value={formData.last_name}
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="px-4 py-2 border rounded-lg"
              required
            />
            {!editingTeacher && (
              <input
                type="password"
                placeholder="Password *"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="px-4 py-2 border rounded-lg"
                required
              />
            )}
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowModal(false);
                setEditingTeacher(null);
              }}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeachersPage;