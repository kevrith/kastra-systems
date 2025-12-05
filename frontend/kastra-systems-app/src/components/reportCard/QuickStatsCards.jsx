import React from 'react';
import { Award, Calendar, Target } from 'lucide-react';

const QuickStatsCards = ({ gpa, attendance, classRank, totalStudents }) => {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Current GPA</p>
            <p className="text-4xl font-bold mt-2">{gpa}</p>
            <p className="text-blue-100 text-sm mt-1">Out of 4.0</p>
          </div>
          <Award className="w-12 h-12 text-blue-200" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Attendance</p>
            <p className="text-4xl font-bold mt-2">{attendance}%</p>
            <p className="text-green-100 text-sm mt-1">This term</p>
          </div>
          <Calendar className="w-12 h-12 text-green-200" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Class Rank</p>
            <p className="text-4xl font-bold mt-2">{classRank}</p>
            <p className="text-purple-100 text-sm mt-1">
              of {totalStudents} students
            </p>
          </div>
          <Target className="w-12 h-12 text-purple-200" />
        </div>
      </div>
    </div>
  );
};

export default QuickStatsCards;
