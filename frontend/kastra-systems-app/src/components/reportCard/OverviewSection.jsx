import React from 'react';
import StudentInfoCard from './StudentInfoCard';
import QuickStatsCards from './QuickStatsCards';
import SkillsRadarChart from './SkillsRadarChart';
import RemarksCard from './RemarksCard';

const OverviewSection = ({
  reportData,
  editingRemarks,
  teacherRemarks,
  principalRemarks,
  setEditingRemarks,
  setTeacherRemarks,
  setPrincipalRemarks,
  handleSaveRemarks
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Student Information */}
      <StudentInfoCard
        student={reportData.student}
        academicYear={reportData.academicYear}
        currentTerm={reportData.currentTerm}
      />

      {/* Quick Stats */}
      <QuickStatsCards
        gpa={reportData.gpa}
        attendance={reportData.attendance}
        classRank={reportData.classRank}
        totalStudents={reportData.totalStudents}
      />

      {/* Skills Assessment */}
      <SkillsRadarChart skills={reportData.skills} />

      {/* Remarks */}
      <RemarksCard
        teacherRemarks={teacherRemarks}
        principalRemarks={principalRemarks}
        editingRemarks={editingRemarks}
        onEditingChange={setEditingRemarks}
        onTeacherRemarksChange={setTeacherRemarks}
        onPrincipalRemarksChange={setPrincipalRemarks}
        onSave={handleSaveRemarks}
        onCancel={() => {
          setEditingRemarks(false);
          setTeacherRemarks(reportData.teacherRemarks);
          setPrincipalRemarks(reportData.principalRemarks);
        }}
      />
    </div>
  );
};

export default OverviewSection;
