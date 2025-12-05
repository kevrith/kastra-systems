import React from 'react';
import { Edit, Save, X } from 'lucide-react';

const RemarksCard = ({
  teacherRemarks,
  principalRemarks,
  editingRemarks,
  onEditingChange,
  onTeacherRemarksChange,
  onPrincipalRemarksChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Remarks</h3>
        {!editingRemarks ? (
          <button
            onClick={() => onEditingChange(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={onSave}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={onCancel}
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
              onChange={(e) => onTeacherRemarksChange(e.target.value)}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          ) : (
            <p className="text-gray-600 mt-2">{teacherRemarks}</p>
          )}
        </div>
        <div className="border-l-4 border-purple-500 pl-4">
          <p className="font-semibold text-gray-700">Principal's Remarks:</p>
          {editingRemarks ? (
            <textarea
              value={principalRemarks}
              onChange={(e) => onPrincipalRemarksChange(e.target.value)}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          ) : (
            <p className="text-gray-600 mt-2">{principalRemarks}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemarksCard;
