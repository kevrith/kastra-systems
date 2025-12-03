import { get } from './api';

export const dashboardService = {
  getStats: async () => await get('/dashboard/stats'),
};