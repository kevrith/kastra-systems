import { VALIDATION } from './constants';

//  Validate email

export const validateEmail = (email) => {
  if (!email) return { valid: false, error: 'Email is required' };
  
  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true };
};

// Validate password

export const validatePassword = (password) => {
  if (!password) return { valid: false, error: 'Password is required' };
  
  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return { 
      valid: false, 
      error: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters` 
    };
  }
  
  if (password.length > VALIDATION.MAX_PASSWORD_LENGTH) {
    return { 
      valid: false, 
      error: `Password must be less than ${VALIDATION.MAX_PASSWORD_LENGTH} characters` 
    };
  }
  
  return { valid: true };
};

// Validate username

export const validateUsername = (username) => {
  if (!username) return { valid: false, error: 'Username is required' };
  
  if (username.length < VALIDATION.MIN_USERNAME_LENGTH) {
    return { 
      valid: false, 
      error: `Username must be at least ${VALIDATION.MIN_USERNAME_LENGTH} characters` 
    };
  }
  
  if (username.length > VALIDATION.MAX_USERNAME_LENGTH) {
    return { 
      valid: false, 
      error: `Username must be less than ${VALIDATION.MAX_USERNAME_LENGTH} characters` 
    };
  }
  
  // Only allow alphanumeric and underscore
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { 
      valid: false, 
      error: 'Username can only contain letters, numbers, and underscores' 
    };
  }
  
  return { valid: true };
};

// Validate phone number

export const validatePhone = (phone) => {
  if (!phone) return { valid: true }; // Phone is optional
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (!VALIDATION.PHONE_REGEX.test(cleaned)) {
    return { valid: false, error: 'Invalid phone number format' };
  }
  
  return { valid: true };
};

// Validate grade
 
export const validateGrade = (grade) => {
  if (grade === '' || grade === null || grade === undefined) {
    return { valid: false, error: 'Grade is required' };
  }
  
  const numGrade = Number(grade);
  
  if (isNaN(numGrade)) {
    return { valid: false, error: 'Grade must be a number' };
  }
  
  if (numGrade < VALIDATION.MIN_GRADE) {
    return { valid: false, error: `Grade cannot be less than ${VALIDATION.MIN_GRADE}` };
  }
  
  if (numGrade > VALIDATION.MAX_GRADE) {
    return { valid: false, error: `Grade cannot be more than ${VALIDATION.MAX_GRADE}` };
  }
  
  return { valid: true };
};

// Validate required field
 
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
};

//  Validate student ID format

export const validateStudentId = (studentId) => {
  if (!studentId) return { valid: false, error: 'Student ID is required' };
  
  // Example format: STU0001 or similar
  if (!/^[A-Z]{3}\d{4}$/.test(studentId)) {
    return { 
      valid: false, 
      error: 'Student ID must be in format: STU0001' 
    };
  }
  
  return { valid: true };
};

//  Validate teacher ID format

export const validateTeacherId = (teacherId) => {
  if (!teacherId) return { valid: false, error: 'Teacher ID is required' };
  
  if (!/^[A-Z]{3}\d{4}$/.test(teacherId)) {
    return { 
      valid: false, 
      error: 'Teacher ID must be in format: TCH0001' 
    };
  }
  
  return { valid: true };
};

//  Validate course ID format

export const validateCourseId = (courseId) => {
  if (!courseId) return { valid: false, error: 'Course ID is required' };
  
  if (!/^[A-Z]{3}\d{3,4}$/.test(courseId)) {
    return { 
      valid: false, 
      error: 'Course ID must be in format: CRS001 or MATH101' 
    };
  }
  
  return { valid: true };
};

// Validate date

export const validateDate = (date, fieldName = 'Date') => {
  if (!date) return { valid: false, error: `${fieldName} is required` };
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: `Invalid ${fieldName.toLowerCase()}` };
  }
  
  return { valid: true };
};

// Validate future date

export const validateFutureDate = (date, fieldName = 'Date') => {
  const validation = validateDate(date, fieldName);
  if (!validation.valid) return validation;
  
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dateObj < today) {
    return { 
      valid: false, 
      error: `${fieldName} must be in the future` 
    };
  }
  
  return { valid: true };
};

// Validate date range

export const validateDateRange = (startDate, endDate) => {
  const startValidation = validateDate(startDate, 'Start date');
  if (!startValidation.valid) return startValidation;
  
  const endValidation = validateDate(endDate, 'End date');
  if (!endValidation.valid) return endValidation;
  
  if (new Date(startDate) > new Date(endDate)) {
    return { 
      valid: false, 
      error: 'Start date must be before end date' 
    };
  }
  
  return { valid: true };
};

// Validate number range
 
export const validateNumberRange = (value, min, max, fieldName = 'Value') => {
  if (value === '' || value === null || value === undefined) {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  const num = Number(value);
  
  if (isNaN(num)) {
    return { valid: false, error: `${fieldName} must be a number` };
  }
  
  if (num < min) {
    return { valid: false, error: `${fieldName} cannot be less than ${min}` };
  }
  
  if (num > max) {
    return { valid: false, error: `${fieldName} cannot be more than ${max}` };
  }
  
  return { valid: true };
};

// Validate form (multiple fields)

export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData[field];
    
    for (const rule of rules) {
      const result = rule(value);
      if (!result.valid) {
        errors[field] = result.error;
        break; // Stop at first error for this field
      }
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Example usage:
 * 
 * const validationRules = {
 *   email: [validateEmail],
 *   password: [validatePassword],
 *   username: [validateUsername],
 *   phone: [validatePhone],
 * };
 * 
 * const { valid, errors } = validateForm(formData, validationRules);
 */