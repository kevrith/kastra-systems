import React, { useState } from 'react';
// import Sidebar from './Sidebar';
// import Header from './Header';
import DashboardPage from '../pages/DashboardPage';
// import StudentsPage from '../pages/StudentsPage';
// import TeachersPage from '../pages/TeachersPage';
// import CoursesPage from '../pages/CoursesPage';
// import GradesPage from '../pages/GradesPage';
// import AttendancePage from '../pages/AttendancePage';
// import AnnouncementsPage from '../pages/AnnouncementsPage';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'students':
        return <StudentsPage />;
      case 'teachers':
        return <TeachersPage />;
      case 'courses':
        return <CoursesPage />;
      case 'grades':
        return <GradesPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'announcements':
        return <AnnouncementsPage user={user} />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          user={user} 
          activeTab={activeTab} 
          onLogout={onLogout} 
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;