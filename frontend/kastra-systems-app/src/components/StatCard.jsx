import React from 'react';

const StatCard = ({ icon: Icon, title, value, color, bgColor }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color} hover:shadow-lg transition-shadow duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {value}
          </p>
        </div>
        <div className={`${bgColor} p-4 rounded-full`}>
          <Icon className={`w-8 h-8 ${color.replace('border-', 'text-')}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;