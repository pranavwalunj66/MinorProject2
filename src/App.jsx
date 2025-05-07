import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import PageLayout from './components/layout/PageLayout';
import AppRoutes from './routes';

function App() {
  useEffect(() => {
    // Test if environment variables are accessible
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    console.log('API Base URL:', apiBaseUrl);
  }, []);

  return (
    <>
      {/* Global Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <PageLayout>
        <AppRoutes />
      </PageLayout>
    </>
  );
}

export default App; 