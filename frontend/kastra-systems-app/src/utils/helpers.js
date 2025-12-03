import { GRADE_LETTERS } from './constants';

// Format date to readable string

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format date to short string

export const formatShortDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format datetime to readable string

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Get grade letter from numeric grade

export const getGradeLetter = (grade) => {
  if (grade >= 90) return 'A';
  if (grade >= 80) return 'B';
  if (grade >= 70) return 'C';
  if (grade >= 60) return 'D';
  return 'F';
};

// Get grade color

export const getGradeColor = (grade) => {
  const letter = getGradeLetter(grade);
  return GRADE_LETTERS[letter]?.color || 'gray';
};

// Calculate GPA from grades

export const calculateGPA = (grades) => {
  if (!grades || grades.length === 0) return 0;
  
  const totalPoints = grades.reduce((sum, g) => sum + (g.grade * g.credits), 0);
  const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);
  
  if (totalCredits === 0) return 0;
  
  // Convert to 4.0 scale
  const gpa = (totalPoints / totalCredits) / 25;
  return Math.round(gpa * 100) / 100;
};

// Calculate attendance percentage

export const calculateAttendancePercentage = (attendanceRecords) => {
  if (!attendanceRecords || attendanceRecords.length === 0) return 0;
  
  const presentCount = attendanceRecords.filter(
    record => record.status === 'present' || record.status === 'late'
  ).length;
  
  return Math.round((presentCount / attendanceRecords.length) * 100);
};

// Truncate text

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalize first letter

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Format phone number

export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

//  Get initials from name

export const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Check if date is past

export const isPastDate = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
};

// Get days until date

export const getDaysUntil = (dateString) => {
  if (!dateString) return null;
  const today = new Date();
  const targetDate = new Date(dateString);
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

//  Sort array by key

export const sortByKey = (array, key, ascending = true) => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (ascending) {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

// Filter array by search term

export const filterBySearch = (array, searchTerm, keys) => {
  if (!searchTerm) return array;
  
  const term = searchTerm.toLowerCase();
  return array.filter(item => 
    keys.some(key => 
      item[key]?.toString().toLowerCase().includes(term)
    )
  );
};

// Group array by key

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

// Download data as JSON

export const downloadJSON = (data, filename = 'data.json') => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate random ID

export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

//  Debounce function

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Copy to clipboard

export const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    return true;
  }
  return false;
};

// Get status color class

export const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};