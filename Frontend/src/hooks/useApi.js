import { useState, useCallback } from 'react';
import useUiStore from '../store/uiStore';

/**
 * Custom hook for simplified API calls with loading and error handling
 * @param {Function} apiFunction - The API service function to call
 * @param {Object} options - Additional options
 * @param {boolean} options.showNotifications - Whether to show success/error notifications
 * @param {string} options.successMessage - Message to show on success
 * @param {Object} options.defaultData - Default data value
 * @returns {Object} API call utilities
 */
const useApi = (apiFunction, options = {}) => {
  const {
    showNotifications = true,
    successMessage = 'Operation successful!',
    defaultData = null,
  } = options;

  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const showNotification = useUiStore((state) => state.showNotification);

  /**
   * Execute the API call with provided parameters
   * @param {...any} args - Arguments to pass to the API function
   * @returns {Promise<any>} The API response data
   */
  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiFunction(...args);
        setData(response.data || response);

        if (showNotifications) {
          showNotification(successMessage, 'success');
        }

        return response.data || response;
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);

        if (showNotifications) {
          showNotification(errorMessage, 'error');
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, showNotifications, successMessage, showNotification]
  );

  /**
   * Reset the hook state
   */
  const reset = useCallback(() => {
    setData(defaultData);
    setLoading(false);
    setError(null);
  }, [defaultData]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export default useApi;
