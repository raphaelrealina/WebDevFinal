import React, { useState, useEffect } from 'react';
import './App.css'; 
// Note: Tailwind CSS classes are used here but require Tailwind setup, 
// which is skipped for brevity. The main functionality relies on React/JS.

function App() {
  const [backendStatus, setBackendStatus] = useState('Connecting to backend...');
  
  useEffect(() => {
    // Fetches from /api/status. The 'proxy' setting in client/package.json 
    // redirects this request to http://localhost:5000/api/status
    fetch('/api/status') 
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setBackendStatus(data.message);
      })
      .catch(err => {
        console.error("Backend Connection Failed:", err);
        setBackendStatus(`Connection Error: Server is down or proxy failed. Check console for details.`);
      });
  }, []);

  // Simple UI for testing visibility
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <div className="p-8 bg-white shadow-xl rounded-xl max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-4">
          FitTrack MERN Stack Setup
        </h1>
        <p className="text-center text-lg mb-6">
          System Initialization Complete.
        </p>

        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <p className="font-semibold text-indigo-700">Backend Status:</p>
          <p className="mt-1 text-sm font-medium">{backendStatus}</p>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          If the status reads "operational," your client and server are connected and ready for development!
        </p>
      </div>
    </div>
  );
}

export default App;