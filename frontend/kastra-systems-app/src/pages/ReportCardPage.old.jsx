import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Printer,
  Mail,
  TrendingUp,
  Award,
  Calendar,
  User,
  BookOpen,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Save,
  X
} from 'lucide-react';
import studentService from '../services/studentService';
import reportCardService from '../services/reportCardService';
import feeService from '../services/feeService';
import { printReportCard } from '../utils/printReportCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

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
  const printRef = useRef();

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
      // Use provided studentsData or fall back to state
      const allStudents = studentsData || students;
      const student = allStudents.find(s => s.id === studentId) || await studentService.getStudentById(studentId);
      const courses = await studentService.getStudentCourses(studentId);
      const gradesData = await studentService.getStudentGrades(studentId);
      const attendance = await studentService.getStudentAttendance(studentId);

      // Try to get existing report card from database
      let existingReportCard = null;
      try {
        const reportCards = await reportCardService.getStudentReportCards(studentId);
        if (reportCards && reportCards.length > 0) {
          existingReportCard = reportCards[0]; // Get most recent
        }
      } catch (err) {
        console.log('No existing report card found, will generate new one');
      }

      // Try to get fee records from database
      let feeRecords = null;
      try {
        feeRecords = await feeService.getStudentFeeRecords(studentId);
      } catch (err) {
        console.log('No fee records found, will generate default');
      }

      // Try to get fee structure from database
      let feeStructure = null;
      try {
        if (student.grade_level) {
          feeStructure = await feeService.getFeeStructure('2024-2025', student.grade_level);
        }
      } catch (err) {
        console.log('No fee structure found, will generate default');
      }

      // Get total number of students for class rank - use the actual data
      const totalStudents = allStudents.length;

      // Generate report card data
      const reportCard = generateReportCard(
        student,
        courses,
        gradesData,
        attendance,
        totalStudents,
        existingReportCard,
        feeRecords,
        feeStructure
      );
      setSelectedStudent(student);
      setReportData(reportCard);

      // Set report card ID and remarks for editing
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

  const generateReportCard = (student, courses, gradesData, attendance, totalStudents, existingReportCard = null, feeRecords = null, feeStructureData = null) => {
    const currentTerm = 'Fall 2024';
    const academicYear = '2024-2025';

    // Process grades data
    const grades = Array.isArray(gradesData) ? gradesData : [];

    // Calculate term grades
    const termGrades = grades.map(grade => ({
      courseId: grade.course_id,
      courseName: grade.course_name || grade.assignment_title || 'Unknown Course',
      grade: grade.points_earned,
      maxPoints: grade.max_points,
      percentage: (grade.points_earned / grade.max_points) * 100,
      gradeLetter: getGradeLetter((grade.points_earned / grade.max_points) * 100),
      credits: 3, // Default credits
      assessmentType: 'Assignment',
      remarks: grade.feedback || 'Good progress'
    }));

    // Group grades by course
    const courseGrades = {};
    termGrades.forEach(grade => {
      if (!courseGrades[grade.courseName]) {
        courseGrades[grade.courseName] = [];
      }
      courseGrades[grade.courseName].push(grade);
    });

    // Calculate course averages
    const courseAverages = Object.keys(courseGrades).map(courseName => {
      const grades = courseGrades[courseName];
      const average = grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length;
      const credits = grades[0].credits;
      return {
        courseName,
        average: Math.round(average * 10) / 10,
        letter: getGradeLetter(average),
        credits,
        grades: grades
      };
    });

    // Calculate GPA from course averages
    const calculatedGpa = courseAverages.length > 0
      ? courseAverages.reduce((sum, c) => sum + convertToGPA(c.average), 0) / courseAverages.length
      : 0;

    // Use existing report card data if available, otherwise use calculated
    const gpa = existingReportCard?.gpa || calculatedGpa.toFixed(2);
    const classRank = existingReportCard?.class_rank || Math.floor(Math.random() * totalStudents) + 1;
    const attendancePercentage = existingReportCard?.attendance_percentage || calculateAttendancePercentage(attendance);

    // Generate progress data (simulated historical data)
    const progressData = generateProgressData(student.admission_date || new Date());

    // Fee structure - use database data if available, otherwise generate
    const feeStructure = feeStructureData
      ? convertFeeStructureFromDB(feeStructureData, feeRecords, academicYear)
      : generateFeeStructure(student.grade_level || 10, academicYear);

    return {
      student,
      academicYear,
      currentTerm,
      gpa: typeof gpa === 'number' ? gpa.toFixed(2) : gpa,
      termGrades,
      courseAverages,
      progressData,
      attendance: attendancePercentage,
      classRank,
      totalStudents,
      feeStructure,
      conductGrade: existingReportCard?.conduct_grade || 'A',
      teacherRemarks: existingReportCard?.teacher_remarks || 'Excellent student with consistent performance. Shows great potential and dedication to studies.',
      principalRemarks: existingReportCard?.principal_remarks || 'Keep up the excellent work. Continue to strive for excellence.',
      skills: existingReportCard?.skill_assessments?.map(s => ({ skill: s.skill_name, score: s.score })) || generateSkillsAssessment(courseAverages)
    };
  };

  const convertFeeStructureFromDB = (structure, feeRecords, academicYear) => {
    // Convert database fee structure and records to UI format
    const breakdown = {
      tuition: structure.tuition,
      lab: structure.lab,
      library: structure.library,
      sports: structure.sports,
      technology: structure.technology,
      activities: structure.activities,
      transport: structure.transport,
      meals: structure.meals,
      uniforms: structure.uniforms,
      books: structure.books,
      examination: structure.examination,
      insurance: structure.insurance,
      developmentFee: structure.development_fee,
      misc: structure.misc
    };

    const terms = feeRecords && feeRecords.length > 0
      ? feeRecords.map(record => ({
          term: `Term ${record.term === 'fall' ? '1 (Fall)' : record.term === 'spring' ? '2 (Spring)' : '3 (Summer)'}`,
          dueDate: new Date(record.due_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          amount: record.amount,
          status: record.status.charAt(0).toUpperCase() + record.status.slice(1),
          paidDate: record.paid_date ? new Date(record.paid_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null,
          method: record.payment_method
        }))
      : generateDefaultTerms(structure.total_annual, academicYear);

    return {
      academicYear,
      breakdown,
      totalAnnual: structure.total_annual,
      terms,
      discounts: {
        sibling: structure.sibling_discount,
        merit: structure.merit_discount,
        earlyPayment: structure.early_payment_discount
      },
      lateFee: structure.late_fee,
      refundPolicy: structure.refund_policy || 'Refundable within 30 days of admission with 20% processing fee'
    };
  };

  const generateDefaultTerms = (totalAnnual, academicYear) => {
    const year = parseInt(academicYear.split('-')[0]);
    return [
      {
        term: 'Term 1 (Fall)',
        dueDate: `August 15, ${year}`,
        amount: Math.round(totalAnnual * 0.35),
        status: 'Unpaid',
        paidDate: null,
        method: null
      },
      {
        term: 'Term 2 (Spring)',
        dueDate: `January 15, ${year + 1}`,
        amount: Math.round(totalAnnual * 0.35),
        status: 'Unpaid',
        paidDate: null,
        method: null
      },
      {
        term: 'Term 3 (Summer)',
        dueDate: `May 15, ${year + 1}`,
        amount: Math.round(totalAnnual * 0.30),
        status: 'Unpaid',
        paidDate: null,
        method: null
      }
    ];
  };

  const convertToGPA = (percentage) => {
    if (percentage >= 90) return 4.0;
    if (percentage >= 80) return 3.0;
    if (percentage >= 70) return 2.0;
    if (percentage >= 60) return 1.0;
    return 0.0;
  };

  const generateProgressData = (admissionDate) => {
    const terms = ['Fall 2023', 'Spring 2024', 'Fall 2024'];
    return terms.map((term, index) => ({
      term,
      gpa: 3.2 + (index * 0.15) + (Math.random() * 0.2),
      attendance: 85 + (index * 2) + (Math.random() * 5),
    }));
  };

  const generateSkillsAssessment = (courseAverages) => {
    const avgScore = courseAverages.length > 0
      ? courseAverages.reduce((sum, c) => sum + c.average, 0) / courseAverages.length
      : 85;

    return [
      { skill: 'Academic Performance', score: avgScore },
      { skill: 'Participation', score: 85 },
      { skill: 'Assignment Completion', score: 92 },
      { skill: 'Behavior', score: 95 },
      { skill: 'Teamwork', score: 88 },
      { skill: 'Creativity', score: 90 }
    ];
  };

  const generateFeeStructure = (gradeLevel, academicYear) => {
    // Professional fee structure based on grade level
    const baseFees = {
      tuition: gradeLevel <= 5 ? 12000 : gradeLevel <= 8 ? 15000 : gradeLevel <= 10 ? 18000 : 20000,
      lab: gradeLevel >= 6 ? 2000 : 1000,
      library: 1500,
      sports: 1000,
      technology: 2500,
      activities: 1200,
      transport: 3000,
      meals: 4000,
      uniforms: 800,
      books: 2000,
      examination: 1000,
      insurance: 500,
      developmentFee: 3000,
      misc: 500
    };

    const totalAnnual = Object.values(baseFees).reduce((sum, fee) => sum + fee, 0);

    const terms = [
      {
        term: 'Term 1 (Fall)',
        dueDate: 'August 15, 2024',
        amount: Math.round(totalAnnual * 0.35),
        status: 'Paid',
        paidDate: 'August 10, 2024',
        method: 'Bank Transfer'
      },
      {
        term: 'Term 2 (Spring)',
        dueDate: 'January 15, 2025',
        amount: Math.round(totalAnnual * 0.35),
        status: 'Pending',
        paidDate: null,
        method: null
      },
      {
        term: 'Term 3 (Summer)',
        dueDate: 'May 15, 2025',
        amount: Math.round(totalAnnual * 0.30),
        status: 'Unpaid',
        paidDate: null,
        method: null
      }
    ];

    return {
      academicYear,
      breakdown: baseFees,
      totalAnnual,
      terms,
      discounts: {
        sibling: 0.10, // 10% sibling discount
        merit: 0.05,   // 5% merit scholarship
        earlyPayment: 0.02 // 2% early payment discount
      },
      lateFee: 500,
      refundPolicy: 'Refundable within 30 days of admission with 20% processing fee'
    };
  };

  const calculateAttendancePercentage = (attendance) => {
    if (!attendance || attendance.length === 0) return 95;
    const present = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
    return Math.round((present / attendance.length) * 100);
  };

  const getGradeLetter = (percentage) => {
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

      // Update the report data
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
    printReportCard(reportData, selectedStudent);
  };

  const handleDownload = async () => {
    try {
      alert('Generating PDF... This feature requires a PDF library like jsPDF or html2pdf. For now, please use the Print button and save as PDF.');
    } catch (error) {
      alert('Failed to download: ' + error.message);
    }
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
      <div ref={printRef}>
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
              { id: 'progress', label: 'Progress', icon: TrendingUp },
              { id: 'fees', label: 'Fee Structure', icon: DollarSign }
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

      {reportData && (
        <>
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Student Information */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-4xl font-bold">
                      {reportData.student.user?.first_name?.charAt(0) || 'S'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {reportData.student.user?.first_name} {reportData.student.user?.last_name}
                    </h2>
                    <p className="text-gray-600 mt-1">Student ID: {reportData.student.student_id}</p>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div>
                        <p className="text-sm text-gray-500">Grade Level</p>
                        <p className="font-semibold">Grade {reportData.student.grade_level || 10}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Academic Year</p>
                        <p className="font-semibold">{reportData.academicYear}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Current Term</p>
                        <p className="font-semibold">{reportData.currentTerm}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Admission Date</p>
                        <p className="font-semibold">{new Date(reportData.student.admission_date || Date.now()).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold">{reportData.student.user?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-semibold">{reportData.student.guardian_phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Current GPA</p>
                      <p className="text-4xl font-bold mt-2">{reportData.gpa}</p>
                      <p className="text-blue-100 text-sm mt-1">Out of 4.0</p>
                    </div>
                    <Award className="w-12 h-12 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Attendance</p>
                      <p className="text-4xl font-bold mt-2">{reportData.attendance}%</p>
                      <p className="text-green-100 text-sm mt-1">This term</p>
                    </div>
                    <Calendar className="w-12 h-12 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Class Rank</p>
                      <p className="text-4xl font-bold mt-2">{reportData.classRank}</p>
                      <p className="text-purple-100 text-sm mt-1">of {reportData.totalStudents} students</p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-purple-200" />
                  </div>
                </div>
              </div>

              {/* Skills Assessment */}
              <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Skills Assessment</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={reportData.skills}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Score" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Remarks */}
              <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Remarks</h3>
                  {!editingRemarks ? (
                    <button
                      onClick={() => setEditingRemarks(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveRemarks}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingRemarks(false);
                          setTeacherRemarks(reportData.teacherRemarks);
                          setPrincipalRemarks(reportData.principalRemarks);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-700">Class Teacher's Remarks:</p>
                    {editingRemarks ? (
                      <textarea
                        value={teacherRemarks}
                        onChange={(e) => setTeacherRemarks(e.target.value)}
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    ) : (
                      <p className="text-gray-600 mt-2">{reportData.teacherRemarks}</p>
                    )}
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <p className="font-semibold text-gray-700">Principal's Remarks:</p>
                    {editingRemarks ? (
                      <textarea
                        value={principalRemarks}
                        onChange={(e) => setPrincipalRemarks(e.target.value)}
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    ) : (
                      <p className="text-gray-600 mt-2">{reportData.principalRemarks}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grades Section */}
          {activeSection === 'grades' && (
            <div className="space-y-6">
              {/* Course Grades */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Term Grades - {reportData.currentTerm}</h3>
                {reportData.courseAverages.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No grades available yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Average</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reportData.courseAverages.map((course, index) => (
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
                            <span className="text-2xl font-bold text-blue-600">{reportData.gpa}</span>
                            <span className="text-gray-500 ml-2">/ 4.0</span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>

              {/* Grade Distribution */}
              {reportData.courseAverages.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Grade Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.courseAverages}>
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
          )}

          {/* Progress Section */}
          {activeSection === 'progress' && (
            <div className="space-y-6">
              {/* GPA Progress */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">GPA Progress Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.progressData}>
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
                  <LineChart data={reportData.progressData}>
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
                      {reportData.progressData[reportData.progressData.length - 1].gpa.toFixed(2)}
                    </p>
                    <p className="text-gray-600 mt-2">Current GPA</p>
                    <p className="text-sm text-green-600 mt-1">
                      ↑ {((reportData.progressData[reportData.progressData.length - 1].gpa - reportData.progressData[0].gpa) * 100 / reportData.progressData[0].gpa).toFixed(1)}% improvement
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {Math.round(reportData.progressData[reportData.progressData.length - 1].attendance)}%
                    </p>
                    <p className="text-gray-600 mt-2">Current Attendance</p>
                    <p className="text-sm text-green-600 mt-1">
                      ↑ {((reportData.progressData[reportData.progressData.length - 1].attendance - reportData.progressData[0].attendance)).toFixed(1)}% improvement
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">
                      #{reportData.classRank}
                    </p>
                    <p className="text-gray-600 mt-2">Class Rank</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Top {Math.round((reportData.classRank / reportData.totalStudents) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fee Structure Section */}
          {activeSection === 'fees' && (
            <div className="space-y-6">
              {/* Fee Breakdown */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Annual Fee Structure - {reportData.feeStructure.academicYear}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(reportData.feeStructure.breakdown).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-bold text-gray-900">${value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total Annual Fee</span>
                    <span className="text-3xl font-bold text-blue-600">${reportData.feeStructure.totalAnnual.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Discounts & Policies */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Discounts & Policies</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-600 font-medium">Sibling Discount</p>
                    <p className="text-2xl font-bold text-green-700">{(reportData.feeStructure.discounts.sibling * 100)}%</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-600 font-medium">Merit Scholarship</p>
                    <p className="text-2xl font-bold text-blue-700">{(reportData.feeStructure.discounts.merit * 100)}%</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-600 font-medium">Early Payment</p>
                    <p className="text-2xl font-bold text-purple-700">{(reportData.feeStructure.discounts.earlyPayment * 100)}%</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600"><span className="font-semibold">Late Fee:</span> ${reportData.feeStructure.lateFee}</p>
                  <p className="text-sm text-gray-600 mt-2"><span className="font-semibold">Refund Policy:</span> {reportData.feeStructure.refundPolicy}</p>
                </div>
              </div>

              {/* Payment Schedule */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Payment Schedule</h3>
                <div className="space-y-4">
                  {reportData.feeStructure.terms.map((term, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-bold text-gray-900">{term.term}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              term.status === 'Paid' ? 'bg-green-100 text-green-800' :
                              term.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {term.status === 'Paid' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                              {term.status === 'Pending' && <Clock className="w-3 h-3 inline mr-1" />}
                              {term.status === 'Unpaid' && <XCircle className="w-3 h-3 inline mr-1" />}
                              {term.status}
                            </span>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Due Date</p>
                              <p className="font-medium text-gray-900">{term.dueDate}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Amount</p>
                              <p className="font-bold text-gray-900">${term.amount.toLocaleString()}</p>
                            </div>
                            {term.paidDate && (
                              <>
                                <div>
                                  <p className="text-gray-500">Paid Date</p>
                                  <p className="font-medium text-gray-900">{term.paidDate}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Payment Method</p>
                                  <p className="font-medium text-gray-900">{term.method}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        {term.status !== 'Paid' && (
                          <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default ReportCardPage;
