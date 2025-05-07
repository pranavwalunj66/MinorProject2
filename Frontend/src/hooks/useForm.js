import { useState, useCallback } from 'react';

/**
 * Custom hook for form handling and validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} validate - Optional validation function
 * @param {Function} onSubmit - Submit handler function
 * @returns {Object} Form handling utilities
 */
const useForm = (initialValues = {}, validate, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input change
   * @param {Event|Object} e - Event object or { name, value } object
   */
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target ? e.target : e;
      const fieldValue = type === 'checkbox' ? checked : value;

      setValues((prevValues) => ({
        ...prevValues,
        [name]: fieldValue,
      }));

      // Mark field as touched when it changes
      if (!touched[name]) {
        setTouched((prevTouched) => ({
          ...prevTouched,
          [name]: true,
        }));
      }

      // Clear error for this field when it changes
      if (errors[name]) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors, touched]
  );

  /**
   * Handle input blur (mark field as touched)
   * @param {Event} e - Event object
   */
  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;

      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));

      // Validate on blur if validation function exists
      if (validate) {
        const validationErrors = validate(values);
        if (validationErrors[name]) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validationErrors[name],
          }));
        }
      }
    },
    [values, validate]
  );

  /**
   * Reset form to initial state or new values
   * @param {Object} newValues - Optional new values
   */
  const resetForm = useCallback(
    (newValues = initialValues) => {
      setValues(newValues);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    },
    [initialValues]
  );

  /**
   * Set specific form value
   * @param {string} name - Field name
   * @param {any} value - Field value
   */
  const setFieldValue = useCallback((name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }, []);

  /**
   * Set specific form error
   * @param {string} name - Field name
   * @param {string} error - Error message
   */
  const setFieldError = useCallback((name, error) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  }, []);

  /**
   * Validate and handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      let formErrors = {};
      if (validate) {
        formErrors = validate(values);
        setErrors(formErrors);
      }

      // Mark all fields as touched on submit
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      // If no errors and onSubmit handler exists, call it
      if (Object.keys(formErrors).length === 0 && onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validate, onSubmit]
  );

  /**
   * Check if a specific field has an error and has been touched
   * @param {string} name - Field name
   * @returns {string|null} Error message or null
   */
  const getFieldError = useCallback(
    (name) => {
      return touched[name] && errors[name] ? errors[name] : null;
    },
    [errors, touched]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    getFieldError,
  };
};

export default useForm;
