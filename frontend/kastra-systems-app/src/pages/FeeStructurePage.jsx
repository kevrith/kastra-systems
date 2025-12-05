import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle, XCircle, Clock, Printer } from 'lucide-react';
import studentService from '../services/studentService';
import feeService from '../services/feeService';
import { printFeeStructure } from '../utils/printFeeStructure';

const FeeStructurePage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feeStructure, setFeeStructure] = useState(null);
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
      if (data.length > 0) {
        loadFeeData(data[0]);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeeData = async (student) => {
    try {
      setLoading(true);
      setSelectedStudent(student);

      // Get fee structure
      let structure = null;
      try {
        if (student.grade_level) {
          structure = await feeService.getFeeStructure('2024-2025', student.grade_level);
        }
      } catch (err) {
        console.log('No fee structure found');
      }

      // Get fee records
      let records = null;
      try {
        records = await feeService.getStudentFeeRecords(student.id);
      } catch (err) {
        console.log('No fee records found');
      }

      setFeeStructure(structure || generateDefaultFeeStructure());
      setFeeRecords(records || generateDefaultFeeRecords());
    } catch (error) {
      console.error('Error loading fee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultFeeStructure = () => ({
    academic_year: '2024-2025',
    tuition: 18000,
    lab: 2000,
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
    development_fee: 3000,
    misc: 500,
    total_annual: 41000,
    sibling_discount: 0.10,
    merit_discount: 0.05,
    early_payment_discount: 0.02,
    late_fee: 500,
    refund_policy: 'Refundable within 30 days of admission with 20% processing fee'
  });

  const generateDefaultFeeRecords = () => [
    { term: 'Term 1', due_date: '2024-09-01', amount_due: 13667, amount_paid: 13667, status: 'Paid' },
    { term: 'Term 2', due_date: '2025-01-01', amount_due: 13667, amount_paid: 10000, status: 'Partial' },
    { term: 'Term 3', due_date: '2025-05-01', amount_due: 13666, amount_paid: 0, status: 'Pending' }
  ];

  const handlePrint = () => {
    if (!selectedStudent || !feeStructure) {
      alert('Please select a student to print their fee structure.');
      return;
    }

    const feeData = {
      breakdown: [
        { item: 'Tuition Fee', amount: feeStructure.tuition },
        { item: 'Laboratory Fee', amount: feeStructure.lab },
        { item: 'Library Fee', amount: feeStructure.library },
        { item: 'Sports & Activities', amount: feeStructure.sports },
        { item: 'Computer Lab Fee', amount: feeStructure.computer },
        { item: 'Books & Materials', amount: feeStructure.books },
        { item: 'Examination Fee', amount: feeStructure.examination },
        { item: 'Insurance', amount: feeStructure.insurance },
        { item: 'Development Fee', amount: feeStructure.development_fee },
        { item: 'Miscellaneous', amount: feeStructure.misc },
      ],
      discount: 0,
      discountPercent: 0,
      schedule: feeRecords.map((record, index) => ({
        term: record.term,
        dueDate: new Date(record.due_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        amount: record.amount_due
      }))
    };

    printFeeStructure(feeData, selectedStudent);
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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Fee Structure & Payment</h1>
            <p className="text-gray-600 mt-1">Manage student fees and payment records</p>
          </div>
          {selectedStudent && (
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Printer className="w-5 h-5" />
              <span>Print Fee Structure</span>
            </button>
          )}
        </div>
      </div>

      {/* Student Selector */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
        <select
          onChange={(e) => {
            const student = students.find(s => s.id === parseInt(e.target.value));
            if (student) loadFeeData(student);
          }}
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

      {selectedStudent && feeStructure && (
        <div className="space-y-6">
          {/* Fee Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Annual Fee Structure - {feeStructure.academic_year}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries({
                Tuition: feeStructure.tuition,
                Lab: feeStructure.lab,
                Library: feeStructure.library,
                Sports: feeStructure.sports,
                Technology: feeStructure.technology,
                Activities: feeStructure.activities,
                Transport: feeStructure.transport,
                Meals: feeStructure.meals,
                Uniforms: feeStructure.uniforms,
                Books: feeStructure.books,
                Examination: feeStructure.examination,
                Insurance: feeStructure.insurance,
                'Development Fee': feeStructure.development_fee,
                Miscellaneous: feeStructure.misc
              }).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{key}</span>
                  <span className="font-bold text-gray-900">Ksh{value.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total Annual Fee</span>
                <span className="text-3xl font-bold text-blue-600">
                  Ksh{feeStructure.total_annual.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Discounts & Policies */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Discounts & Policies</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-medium">Sibling Discount</p>
                <p className="text-2xl font-bold text-green-700">
                  {(feeStructure.sibling_discount * 100)}%
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 font-medium">Merit Scholarship</p>
                <p className="text-2xl font-bold text-blue-700">
                  {(feeStructure.merit_discount * 100)}%
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-600 font-medium">Early Payment</p>
                <p className="text-2xl font-bold text-purple-700">
                  {(feeStructure.early_payment_discount * 100)}%
                </p>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Late Fee:</span> Ksh{feeStructure.late_fee}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">Refund Policy:</span> {feeStructure.refund_policy}
              </p>
            </div>
          </div>

          {/* Payment Schedule */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Payment Schedule</h3>
            <div className="space-y-4">
              {feeRecords.map((term, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-bold text-gray-900">{term.term}</h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            term.status === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : term.status === 'Partial'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {term.status === 'Paid' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                          {term.status === 'Partial' && <Clock className="w-3 h-3 inline mr-1" />}
                          {term.status === 'Pending' && <XCircle className="w-3 h-3 inline mr-1" />}
                          {term.status}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Due Date</p>
                          <p className="font-semibold">
                            {new Date(term.due_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Amount Due</p>
                          <p className="font-semibold">Ksh{term.amount_due.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Amount Paid</p>
                          <p className="font-semibold text-green-600">
                            Ksh{term.amount_paid.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Balance</p>
                          <p className="font-semibold text-red-600">
                            Ksh{(term.amount_due - term.amount_paid).toLocaleString()}
                          </p>
                        </div>
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
    </div>
  );
};

export default FeeStructurePage;
