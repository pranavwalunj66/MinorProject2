import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { checkEnvVars } from './envCheck.js';

// Check if environment variables are accessible
console.log('Testing environment variables:');
const envVarsAccessible = checkEnvVars();
console.log('Environment variables accessible:', envVarsAccessible ? 'YES' : 'NO');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
); 