// Form validation helpers

/**
 * Checks if a value is empty (null, undefined, empty string, or only whitespace)
 */
export const isEmpty = (value) => {
  return value === null || value === undefined || value.trim() === '';
};

/**
 * Validates email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if password meets minimum requirements
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const isStrongPassword = (password) => {
  if (password.length < 8) return false;
  
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return hasUppercase && hasLowercase && hasNumber;
};

/**
 * Validates that a password matches a confirmation password
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validates length of a string between min and max (inclusive)
 */
export const isValidLength = (str, min, max) => {
  return str.length >= min && str.length <= max;
};

/**
 * General validator that returns error messages for form fields
 */
export const validateField = (name, value, options = {}) => {
  const { required, min, max, match, isEmail, isPassword } = options;
  
  // Required check
  if (required && isEmpty(value)) {
    return `${name} is required`;
  }
  
  // Skip other validations if empty and not required
  if (isEmpty(value) && !required) {
    return '';
  }
  
  // Length check
  if (min !== undefined && max !== undefined) {
    if (!isValidLength(value, min, max)) {
      return `${name} must be between ${min} and ${max} characters`;
    }
  } else if (min !== undefined) {
    if (value.length < min) {
      return `${name} must be at least ${min} characters`;
    }
  } else if (max !== undefined) {
    if (value.length > max) {
      return `${name} must be no more than ${max} characters`;
    }
  }
  
  // Email check
  if (isEmail && !isValidEmail(value)) {
    return `Please enter a valid email address`;
  }
  
  // Password strength check
  if (isPassword && !isStrongPassword(value)) {
    return `Password must be at least 8 characters with uppercase, lowercase, and a number`;
  }
  
  // Match check (e.g., for password confirmation)
  if (match !== undefined && value !== match) {
    return `${name} does not match`;
  }
  
  return '';
}; 