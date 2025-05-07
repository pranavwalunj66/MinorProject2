/**
 * Test function to check if environment variables are accessible
 * @returns {boolean} True if the API base URL is available
 */
export const testEnvironmentVariables = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  console.log('API Base URL:', apiBaseUrl);
  return !!apiBaseUrl;
}; 