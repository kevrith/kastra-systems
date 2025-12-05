import { get } from './api';

export const dashboardService = {
  getStats: async () => await get('/dashboard/stats'),
  getHealth: async () => {
    try {
      const response = await fetch('http://localhost:8000/health');
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