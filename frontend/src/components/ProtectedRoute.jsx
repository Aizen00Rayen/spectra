import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    axios
      .get('/api/auth/verify', { withCredentials: true })
      .then(() => setStatus('ok'))
      .catch(() => setStatus('redirect'));
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="text-[#06b6d4] text-lg">Verifying...</div>
      </div>
    );
  }

  if (status === 'redirect') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
