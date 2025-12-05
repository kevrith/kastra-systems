import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardPage from '../pages/DashboardPage';
import StudentsPage from '../pages/StudentsPage';
import TeachersPage from '../pages/TeachersPage';
import CoursesPage from '../pages/CoursesPage';
import AssignmentsPage from '../pages/AssignmentsPage';
import GradesPage from '../pages/GradesPage';
import AttendancePage from '../pages/AttendancePage';
import ReportCardPage from '../pages/ReportCardPage';
import FeeStructurePage from '../pages/FeeStructurePage';
import AnnouncementsPage from '../pages/AnnouncementsPage';

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
        return <TeachersPage user={user} />;
      case 'courses':
        return <CoursesPage />;
      case 'assignments':
        return <AssignmentsPage user={user} />;
      case 'grades':
        return <GradesPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'reports':
        return <ReportCardPage />;
      case 'fees':
        return <FeeStructurePage />;
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
        <main className="flex-1 overflow-y-auto p-6" key={activeTab}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
