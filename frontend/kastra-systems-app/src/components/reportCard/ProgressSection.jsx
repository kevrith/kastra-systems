import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProgressSection = ({ progressData, classRank, totalStudents }) => {
  return (
    <div className="space-y-6">
      {/* GPA Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">GPA Progress Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="term" />
            <YAxis domain={[0, 4]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="gpa" stroke="#3B82F6" strokeWidth={3} name="GPA" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Attendance Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Attendance Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="term" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={3} name="Attendance %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Progress Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Progress Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {progressData[progressData.length - 1].gpa.toFixed(2)}
            </p>
            <p className="text-gray-600 mt-2">Current GPA</p>
            <p className="text-sm text-green-600 mt-1">
              ↑ {((progressData[progressData.length - 1].gpa - progressData[0].gpa) * 100 / progressData[0].gpa).toFixed(1)}% improvement
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {Math.round(progressData[progressData.length - 1].attendance)}%
            </p>
            <p className="text-gray-600 mt-2">Current Attendance</p>
            <p className="text-sm text-green-600 mt-1">
              ↑ {((progressData[progressData.length - 1].attendance - progressData[0].attendance)).toFixed(1)}% improvement
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              #{classRank}
            </p>
            <p className="text-gray-600 mt-2">Class Rank</p>
            <p className="text-sm text-gray-500 mt-1">
              Top {Math.round((classRank / totalStudents) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSection;
