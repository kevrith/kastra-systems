import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GradesSection = ({ courseAverages }) => {
  return (
    <div className="space-y-6">
      {/* Grades Table */}
      {courseAverages.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courseAverages.map((course, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{course.courseName}</td>
                    <td className="px-6 py-4 text-gray-600">{course.credits}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-900">{course.average}%</span>
                        <div className="ml-3 w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              course.average >= 90 ? 'bg-green-500' :
                              course.average >= 80 ? 'bg-blue-500' :
                              course.average >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(course.average, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        course.letter === 'A' ? 'bg-green-100 text-green-800' :
                        course.letter === 'B' ? 'bg-blue-100 text-blue-800' :
                        course.letter === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {course.letter}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{course.grades[0]?.remarks}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="2" className="px-6 py-4 font-bold text-gray-900">Overall GPA</td>
                  <td colSpan="3" className="px-6 py-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {(courseAverages.reduce((sum, c) => sum + c.average, 0) / courseAverages.length / 25).toFixed(2)}
                    </span>
                    <span className="text-gray-500 ml-2">/ 4.0</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Grade Distribution Chart */}
      {courseAverages.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseAverages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="courseName" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#3B82F6" name="Grade %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default GradesSection;
