// Validation utility functions

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return !value || value.length <= maxLength;
};

export const validateNumber = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

export const validatePositiveNumber = (value) => {
  return validateNumber(value) && parseFloat(value) > 0;
};

export const validateInteger = (value) => {
  return Number.isInteger(Number(value));
};

export const validateRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

// Form validation helper
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    fieldRules.forEach(rule => {
      if (errors[field]) return; // Skip if already has error
      
      switch (rule.type) {
        case 'required':
          if (!validateRequired(value)) {
            errors[field] = rule.message || `${field} is required`;
          }
          break;
          
        case 'email':
          if (value && !validateEmail(value)) {
            errors[field] = rule.message || 'Invalid email format';
          }
          break;
          
        case 'phone':
          if (value && !validatePhone(value)) {
            errors[field] = rule.message || 'Invalid phone number';
          }
          break;
          
        case 'minLength':
          if (value && !validateMinLength(value, rule.value)) {
            errors[field] = rule.message || `Minimum length is ${rule.value}`;
          }
          break;
          
        case 'maxLength':
          if (value && !validateMaxLength(value, rule.value)) {
            errors[field] = rule.message || `Maximum length is ${rule.value}`;
          }
          break;
          
        case 'number':
          if (value && !validateNumber(value)) {
            errors[field] = rule.message || 'Must be a valid number';
          }
          break;
          
        case 'positiveNumber':
          if (value && !validatePositiveNumber(value)) {
            errors[field] = rule.message || 'Must be a positive number';
          }
          break;
          
        case 'range':
          if (value && !validateRange(value, rule.min, rule.max)) {
            errors[field] = rule.message || `Must be between ${rule.min} and ${rule.max}`;
          }
          break;
          
        default:
          break;
      }
    });
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Example usage:
// const validationRules = {
//   email: [
//     { type: 'required', message: 'Email is required' },
//     { type: 'email', message: 'Invalid email format' }
//   ],
//   password: [
//     { type: 'required', message: 'Password is required' },
//     { type: 'minLength', value: 6, message: 'Password must be at least 6 characters' }
//   ]
// };
// 
// const { isValid, errors } = validateForm(formData, validationRules);
