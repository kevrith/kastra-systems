import { get } from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

export const dashboardService = {
  getStats: async () => await get('/dashboard/stats'),
  getHealth: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      // If fetch fails completely (API not reachable)
      return {
        status: 'unhealthy',
        components: {
          api: {
            status: 'offline',
            message: 'Cannot reach API server'
          },
          database: {
            status: 'offline',
            message: 'Cannot check database status'
          }
        }
      };
    }
  }
};