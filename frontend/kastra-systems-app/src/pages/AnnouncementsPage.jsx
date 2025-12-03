import React, { useState, useEffect } from 'react';
import { Bell, Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { announcementService } from '../services';

export const AnnouncementsPage = ({ user }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target_audience: 'all',
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await announcementService.getAllAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await announcementService.createAnnouncement(formData);
      setShowModal(false);
      setFormData({ title: '', content: '', target_audience: 'all' });
      loadAnnouncements();
      alert('Announcement posted!');
    } catch (error) {
      alert('Failed: ' + error.message);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Announcements</h2>
        {(user.role === 'admin' || user.role === 'teacher') && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Announcement
          </button>
        )}
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{announcement.title}</h3>
                <p className="text-gray-600 mb-4">{announcement.content}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>By {announcement.created_by_name}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <Bell className="w-6 h-6 text-blue-500 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Announcement">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title *"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <textarea
            placeholder="Content *"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
            rows="4"
          />
          <select
            value={formData.target_audience}
            onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="all">All</option>
            <option value="students">Students Only</option>
            <option value="teachers">Teachers Only</option>
          </select>
          <div className="flex justify-end space-x-3">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Post</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default AnnouncementsPage;
