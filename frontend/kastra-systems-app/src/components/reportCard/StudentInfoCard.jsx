import React from 'react';

const StudentInfoCard = ({ student, academicYear, currentTerm }) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start space-x-6">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-4xl font-bold">
            {student.user?.first_name?.charAt(0) || 'S'}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">
            {student.user?.first_name} {student.user?.last_name}
          </h2>
          <p className="text-gray-600 mt-1">Student ID: {student.student_id}</p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-500">Grade Level</p>
              <p className="font-semibold">Grade {student.grade_level || 10}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Academic Year</p>
              <p className="font-semibold">{academicYear}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Term</p>
              <p className="font-semibold">{currentTerm}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Admission Date</p>
              <p className="font-semibold">
                {new Date(student.admission_date || Date.now()).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{student.user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p className="font-semibold">{student.guardian_phone || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfoCard;
