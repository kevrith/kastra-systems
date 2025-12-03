import { get, post, del } from './api';

export const announcementService = {
  getAllAnnouncements: async () => await get('/announcements'),
  createAnnouncement: async (data) => await post('/announcements', data),
  deleteAnnouncement: async (id) => await del(`/announcements/${id}`),
};
