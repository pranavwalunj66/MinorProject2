/**
 * A utility function to check if environment variables are properly loaded
 * @returns {boolean} Whether the VITE_API_BASE_URL environment variable is available
 */
export function checkEnvVars() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  console.log('API Base URL:', apiBaseUrl);
  return !!apiBaseUrl;
} 