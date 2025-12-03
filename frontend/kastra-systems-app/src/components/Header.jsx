import React from 'react';
import { LogOut, User } from 'lucide-react';

const Header = ({ user, activeTab, onLogout }) => {
  const getPageTitle = () => {
    return activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
  };

  return (
    <div className="bg-white shadow-md p-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {activeTab === 'dashboard' && 'Overview of school statistics'}
          {activeTab === 'students' && 'Manage student records'}
          {activeTab === 'teachers' && 'Manage teacher information'}
          {activeTab === 'courses' && 'Manage courses and curriculum'}
          {activeTab === 'grades' && 'View and manage student grades'}
          {activeTab === 'attendance' && 'Track student attendance'}
          {activeTab === 'announcements' && 'School-wide announcements'}
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Info */}
        <div className="flex items-center space-x-2 text-gray-600">
          <User className="w-5 h-5" />
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">{user.username}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Header;