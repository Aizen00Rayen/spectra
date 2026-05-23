import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/login', formData, { withCredentials: true });
      if (res.data.success) navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050810] via-[#0f1528] to-[#050810] flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="relative w-full max-w-md">
        <div className="bg-[#0f1528]/80 backdrop-blur-xl border border-[#1a2444] rounded-2xl p-8 shadow-2xl">

          {/* Logo */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-center mb-8">
            <img src="/logo.png" alt="Spectra" className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#e8eeff] mb-1">Spectra Admin</h1>
            <p className="text-[#7a8ab8] text-sm">Manage your agency</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-sm font-medium text-[#e8eeff] mb-2">Email</label>
              <input type="email" placeholder="admin@spectra.dev" value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                required
                className="w-full px-4 py-2.5 bg-[#1a2444]/50 border border-[#1a2444] rounded-lg text-[#e8eeff] placeholder-[#7a8ab8]/50 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors" />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-sm font-medium text-[#e8eeff] mb-2">Password</label>
              <input type="password" placeholder="••••••••" value={formData.password}
                onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                required
                className="w-full px-4 py-2.5 bg-[#1a2444]/50 border border-[#1a2444] rounded-lg text-[#e8eeff] placeholder-[#7a8ab8]/50 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors" />
            </motion.div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </motion.div>
            )}

            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={isLoading}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 text-[#050810] font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center text-[#7a8ab8] text-xs mt-6">Only authorized admins can access</p>
        </div>
      </motion.div>
    </div>
  );
}
