import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, Calendar } from 'lucide-react';
import StatCard from '../components/StatCard';
import { dashboardService } from '../services';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    total_students: 0,
    total_teachers: 0,
    total_courses: 0,
    total_enrollments: 0,
  });
  const [health, setHealth] = useState({
    status: 'unknown',
    components: {
      api: { status: 'offline', message: 'Checking...' },
      database: { status: 'offline', message: 'Checking...' }
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
    loadHealth();
    // Poll health status every 30 seconds
    const healthInterval = setInterval(loadHealth, 30000);
    return () => clearInterval(healthInterval);
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadHealth = async () => {
    try {
      const healthData = await dashboardService.getHealth();
      setHealth(healthData);
    } catch (err) {
      console.error('Error loading health:', err);
      setHealth({
        status: 'unhealthy',
        components: {
          api: { status: 'offline', message: 'Cannot reach API' },
          database: { status: 'offline', message: 'Cannot check database' }
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error loading dashboard</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
        <p className="text-gray-600 mt-2">Here's what's happening in your school today.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Total Students"
          value={stats.total_students}
          color="border-blue-500"
          bgColor="bg-blue-100"
        />
        <StatCard
          icon={GraduationCap}
          title="Total Teachers"
          value={stats.total_teachers}
          color="border-green-500"
          bgColor="bg-green-100"
        />
        <StatCard
          icon={BookOpen}
          title="Total Courses"
          value={stats.total_courses}
          color="border-purple-500"
          bgColor="bg-purple-100"
        />
        <StatCard
          icon={Calendar}
          title="Total Enrollments"
          value={stats.total_enrollments}
          color="border-orange-500"
          bgColor="bg-orange-100"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
              Add New Student
            </button>
            <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition">
              Add New Teacher
            </button>
            <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition">
              Create New Course
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <p className="text-gray-600">New student enrolled</p>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <p className="text-gray-600">Grades updated</p>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <p className="text-gray-600">New announcement posted</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">System Health</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Database</span>
                <span className={`font-medium ${
                  health.components.database.status === 'online'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {health.components.database.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    health.components.database.status === 'online'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                  style={{
                    width: health.components.database.status === 'online' ? '100%' : '0%'
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{health.components.database.message}</p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">API Status</span>
                <span className={`font-medium ${
                  health.components.api.status === 'online'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {health.components.api.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    health.components.api.status === 'online'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                  style={{
                    width: health.components.api.status === 'online' ? '100%' : '0%'
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{health.components.api.message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;