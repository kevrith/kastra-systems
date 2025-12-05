import React, { useState, useEffect } from 'react';
import { Download, Printer, Mail, User, BookOpen, TrendingUp } from 'lucide-react';
import studentService from '../services/studentService';
import reportCardService from '../services/reportCardService';
import { printReportCard } from '../utils/printReportCard';
import OverviewSection from '../components/reportCard/OverviewSection';
import GradesSection from '../components/reportCard/GradesSection';
import ProgressSection from '../components/reportCard/ProgressSection';

const ReportCardPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [editingRemarks, setEditingRemarks] = useState(false);
  const [teacherRemarks, setTeacherRemarks] = useState('');
  const [principalRemarks, setPrincipalRemarks] = useState('');
  const [reportCardId, setReportCardId] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
      if (data.length > 0) {
        loadReportCard(data[0].id, data);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReportCard = async (studentId, studentsData = null) => {
    try {
      setLoading(true);
      const allStudents = studentsData || students;
      const student = allStudents.find(s => s.id === studentId) || await studentService.getStudentById(studentId);
      const courses = await studentService.getStudentCourses(studentId);
      const gradesData = await studentService.getStudentGrades(studentId);
      const attendance = await studentService.getStudentAttendance(studentId);

      let existingReportCard = null;
      try {
        const reportCards = await reportCardService.getStudentReportCards(studentId);
        if (reportCards && reportCards.length > 0) {
          existingReportCard = reportCards[0];
        }
      } catch (err) {
        console.log('No existing report card found');
      }

      const totalStudents = allStudents.length;
      const reportCard = generateReportCard(student, courses, gradesData, attendance, totalStudents, existingReportCard);

      setSelectedStudent(student);
      setReportData(reportCard);

      if (existingReportCard) {
        setReportCardId(existingReportCard.id);
        setTeacherRemarks(existingReportCard.teacher_remarks || '');
        setPrincipalRemarks(existingReportCard.principal_remarks || '');
      } else {
        setReportCardId(null);
        setTeacherRemarks(reportCard.teacherRemarks);
        setPrincipalRemarks(reportCard.principalRemarks);
      }
      setEditingRemarks(false);
    } catch (error) {
      console.error('Error loading report card:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReportCard = (student, courses, gradesData, attendance, totalStudents, existingReportCard = null) => {
    const currentTerm = 'Fall 2024';
    const academicYear = '2024-2025';

    const courseAverages = courses.map(course => {
      const courseGrades = gradesData.filter(g => g.assignment.course_id === course.id);
      const average = courseGrades.length > 0
        ? courseGrades.reduce((sum, g) => sum + (g.points_earned / g.assignment.max_points) * 100, 0) / courseGrades.length
        : 0;

      return {
        courseName: course.name,
        credits: course.credits || 3,
        average: Math.round(average),
        letter: getLetterGrade(average),
        grades: courseGrades
      };
    });

    const gpa = courseAverages.length > 0
      ? (courseAverages.reduce((sum, c) => sum + c.average, 0) / courseAverages.length / 25).toFixed(2)
      : '0.00';

    const attendancePercentage = attendance.length > 0
      ? Math.round((attendance.filter(a => a.status === 'present' || a.status === 'late').length / attendance.length) * 100)
      : 0;

    const classRank = Math.ceil(totalStudents * 0.15);

    const progressData = [
      { term: 'Term 1', gpa: 3.2, attendance: 92 },
      { term: 'Term 2', gpa: 3.5, attendance: 94 },
      { term: 'Term 3', gpa: parseFloat(gpa), attendance: attendancePercentage }
    ];

    const skills = [
      { skill: 'Academic Performance', score: parseFloat(gpa) * 25 },
      { skill: 'Participation', score: 85 },
      { skill: 'Assignment Completion', score: 92 },
      { skill: 'Behavior', score: 95 },
      { skill: 'Teamwork', score: 88 },
      { skill: 'Creativity', score: 90 }
    ];

    return {
      student,
      academicYear,
      currentTerm,
      gpa,
      attendance: attendancePercentage,
      classRank,
      totalStudents,
      courseAverages,
      progressData,
      skills,
      conductGrade: existingReportCard?.conduct_grade || 'A',
      teacherRemarks: existingReportCard?.teacher_remarks || 'Excellent student with consistent performance.',
      principalRemarks: existingReportCard?.principal_remarks || 'Keep up the excellent work.'
    };
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const handleSaveRemarks = async () => {
    if (!reportCardId) {
      alert('Please generate the report card first before saving remarks');
      return;
    }

    try {
      await reportCardService.updateReportCard(reportCardId, {
        teacher_remarks: teacherRemarks,
        principal_remarks: principalRemarks
      });

      setReportData({
        ...reportData,
        teacherRemarks,
        principalRemarks
      });

      setEditingRemarks(false);
      alert('Remarks saved successfully!');
    } catch (error) {
      alert('Failed to save remarks: ' + error.message);
    }
  };

  const handlePrint = () => {
    if (!reportData || !selectedStudent) {
      alert('Please select a student and load their report card first.');
      return;
    }
    printReportCard(reportData, selectedStudent, activeSection);
  };

  const handleDownload = () => {
    alert('Use Print button and select "Save as PDF" option.');
  };

  const handleEmail = () => {
    alert('Sending report card to guardian email...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Student Report Card</h1>
            <p className="text-gray-600 mt-1">Academic Performance & Progress Report</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleEmail}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Selector */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
        <select
          onChange={(e) => loadReportCard(parseInt(e.target.value))}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={selectedStudent?.id || ''}
        >
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.user?.first_name} {student.user?.last_name} - {student.student_id}
            </option>
          ))}
        </select>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'grades', label: 'Grades', icon: BookOpen },
              { id: 'progress', label: 'Progress', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${activeSection === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {reportData && (
        <>
          {activeSection === 'overview' && (
            <OverviewSection
              reportData={reportData}
              editingRemarks={editingRemarks}
              teacherRemarks={teacherRemarks}
              principalRemarks={principalRemarks}
              setEditingRemarks={setEditingRemarks}
              setTeacherRemarks={setTeacherRemarks}
              setPrincipalRemarks={setPrincipalRemarks}
              handleSaveRemarks={handleSaveRemarks}
            />
          )}

          {activeSection === 'grades' && (
            <GradesSection courseAverages={reportData.courseAverages} />
          )}

          {activeSection === 'progress' && (
            <ProgressSection
              progressData={reportData.progressData}
              classRank={reportData.classRank}
              totalStudents={reportData.totalStudents}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ReportCardPage;
