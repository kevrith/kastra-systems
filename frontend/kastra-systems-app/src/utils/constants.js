// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
};

// Grade Letters
export const GRADE_LETTERS = {
  A: { min: 90, max: 100, color: 'green' },
  B: { min: 80, max: 89, color: 'blue' },
  C: { min: 70, max: 79, color: 'yellow' },
  D: { min: 60, max: 69, color: 'orange' },
  F: { min: 0, max: 59, color: 'red' },
};

// Assessment Types
export const ASSESSMENT_TYPES = [
  'exam',
  'quiz',
  'assignment',
  'project',
  'midterm',
  'final',
  'homework',
];

// Status Types
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
};

// Pagination
export const ITEMS_PER_PAGE = 10;
export const MAX_PAGE_SIZE = 100;

// Date Formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DISPLAY_DATE_FORMAT = 'MMM DD, YYYY';

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
};

// Navigation Items
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'students', label: 'Students', path: '/students' },
  { id: 'teachers', label: 'Teachers', path: '/teachers' },
  { id: 'courses', label: 'Courses', path: '/courses' },
  { id: 'grades', label: 'Grades', path: '/grades' },
  { id: 'attendance', label: 'Attendance', path: '/attendance' },
  { id: 'assignments', label: 'Assignments', path: '/assignments' },
  { id: 'announcements', label: 'Announcements', path: '/announcements' },
];

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully!',
  UPDATED: 'Updated successfully!',
  DELETED: 'Deleted successfully!',
  SAVED: 'Saved successfully!',
};

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  MIN_GRADE: 0,
  MAX_GRADE: 100,
  PHONE_REGEX: /^[0-9]{10,15}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};