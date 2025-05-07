import { useEffect, useState } from 'react';
import { testEnvironmentVariables } from '../utils/envTest';

export default function EnvTest() {
  const [envVarsAvailable, setEnvVarsAvailable] = useState(false);
  
  useEffect(() => {
    const result = testEnvironmentVariables();
    setEnvVarsAvailable(result);
  }, []);
  
  return (
    <div className="p-4 border rounded bg-white">
      <h2 className="text-xl font-bold">Environment Variables Test</h2>
      <p className="mt-2">
        Environment Variables Available: 
        <span className={envVarsAvailable ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
          {envVarsAvailable ? ' YES' : ' NO'}
        </span>
      </p>
      <p className="mt-1 text-sm text-gray-600">
        Check console for more details
      </p>
    </div>
  );
} 