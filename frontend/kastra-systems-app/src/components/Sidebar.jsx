import React from 'react';
import {
  TrendingUp,
  Users,
  GraduationCap,
  BookOpen,
  Bell,
  Calendar,
  FileText,
  ClipboardList,
  Award,
  DollarSign,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { id: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
    { id: 'students', icon: Users, label: 'Students' },
    { id: 'teachers', icon: GraduationCap, label: 'Teachers' },
    { id: 'courses', icon: BookOpen, label: 'Courses' },
    { id: 'assignments', icon: ClipboardList, label: 'Assignments' },
    { id: 'grades', icon: FileText, label: 'Grades' },
    { id: 'attendance', icon: Calendar, label: 'Attendance' },
    { id: 'reports', icon: Award, label: 'Report Cards' },
    { id: 'fees',  icon: () => <span style={{ fontWeight: 'bold', fontSize: '18px' }}>KSh</span>,label: 'Fee Structure' },
    { id: 'announcements', icon: Bell, label: 'Announcements' },
  ];

  return (
    <div className={`${
      sidebarOpen ? 'w-64' : 'w-20'
    } bg-blue-900 text-white transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-blue-800">
        {sidebarOpen && (
          <h2 className="text-xl font-bold">School Portal</h2>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-blue-800 rounded-lg transition"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex-1">
        {menuItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center px-4 py-3 hover:bg-blue-800 transition ${
              activeTab === id ? 'bg-blue-800 border-l-4 border-white' : ''
            }`}
            title={!sidebarOpen ? label : ''}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="ml-3">{label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      {sidebarOpen && (
        <div className="p-4 border-t border-blue-800 text-sm text-blue-200">
          <p>© {new Date().getFullYear()} School Management</p>
          <p className="text-xs mt-1">Version 1.0.0</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;