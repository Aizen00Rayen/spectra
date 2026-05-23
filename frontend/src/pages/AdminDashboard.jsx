import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const GRADIENT_OPTIONS = [
  { label: 'Cyan → Blue',     value: 'from-cyan-600 to-blue-500' },
  { label: 'Purple → Pink',   value: 'from-purple-600 to-pink-500' },
  { label: 'Green → Teal',    value: 'from-green-600 to-teal-500' },
  { label: 'Orange → Red',    value: 'from-orange-600 to-red-500' },
  { label: 'Blue → Cyan',     value: 'from-blue-600 to-cyan-500' },
  { label: 'Violet → Purple', value: 'from-violet-600 to-purple-500' },
  { label: 'Rose → Orange',   value: 'from-rose-600 to-orange-500' },
  { label: 'Indigo → Blue',   value: 'from-indigo-600 to-blue-500' },
];

const EMPTY_FORM = {
  name: '', client: '', description: '',
  tags: [], category: [], url: '',
  color: 'from-cyan-600 to-blue-500',
};

const api = axios.create({ withCredentials: true });

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [msgRes, portRes] = await Promise.all([
        api.get('/api/messages'),
        api.get('/api/portfolio'),
      ]);
      setMessages(msgRes.data);
      setPortfolio(portRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.post('/api/auth/logout').catch(() => {});
    navigate('/admin/login');
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/messages/${id}/read`);
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m));
    } catch { alert('Failed to mark as read'); }
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    setDeleteConfirm(null);
    try {
      if (type === 'message') {
        await api.delete(`/api/messages/${id}`);
        setMessages((prev) => prev.filter((m) => m.id !== id));
      } else {
        await api.delete(`/api/portfolio/${id}`);
        setPortfolio((prev) => prev.filter((p) => p.id !== id));
      }
    } catch { alert(`Failed to delete ${type}`); }
  };

  const saveProject = async () => {
    setSaving(true);
    try {
      if (selectedProject) {
        await api.put(`/api/portfolio/${selectedProject.id}`, formData);
        setPortfolio((prev) => prev.map((p) => p.id === selectedProject.id ? { ...p, ...formData } : p));
      } else {
        const res = await api.post('/api/portfolio', formData);
        setPortfolio((prev) => [...prev, { id: res.data.id, ...formData }]);
      }
      closeModal();
    } catch { alert('Failed to save project'); }
    finally { setSaving(false); }
  };

  const openModal = (project = null) => {
    setSelectedProject(project);
    setFormData(project ? { ...project } : { ...EMPTY_FORM });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setSelectedProject(null); };

  const handleArrayChange = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value.split(',').map((s) => s.trim()).filter(Boolean) }));

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-[#050810]">
      {/* Header */}
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#0f1528]/80 backdrop-blur-xl border-b border-[#1a2444] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Spectra" className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold text-[#e8eeff] leading-none">Spectra Admin</h1>
              <p className="text-xs text-[#7a8ab8]">Dashboard</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm">
            Logout
          </button>
        </div>
      </motion.header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('messages')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'messages'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-[#050810]'
                : 'bg-[#0f1528] text-[#7a8ab8] border border-[#1a2444] hover:border-cyan-500'
            }`}>
            Messages
            {unread > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{unread}</span>
            )}
          </button>
          <button onClick={() => setActiveTab('portfolio')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'portfolio'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-[#050810]'
                : 'bg-[#0f1528] text-[#7a8ab8] border border-[#1a2444] hover:border-cyan-500'
            }`}>
            Portfolio ({portfolio.length})
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ── Messages ─────────────────────────────────────────────────── */}
          {activeTab === 'messages' && (
            <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid gap-4">
              {isLoading ? (
                <p className="text-[#7a8ab8]">Loading messages...</p>
              ) : messages.length === 0 ? (
                <div className="text-center py-16 text-[#7a8ab8]">
                  <p className="text-4xl mb-3">📭</p><p>No messages yet</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`border rounded-lg p-4 transition-colors ${
                      msg.read ? 'bg-[#0f1528] border-[#1a2444]'
                               : 'bg-[#0f1528] border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[#e8eeff]">{msg.name}</h3>
                          {!msg.read && (
                            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">New</span>
                          )}
                        </div>
                        <p className="text-sm text-[#7a8ab8]">{msg.email}</p>
                      </div>
                      <div className="flex gap-2">
                        {!msg.read && (
                          <button onClick={() => markAsRead(msg.id)}
                            className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded text-sm hover:bg-cyan-500/20 transition-colors">
                            Mark Read
                          </button>
                        )}
                        <button onClick={() => setDeleteConfirm({ type: 'message', id: msg.id })}
                          className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-sm hover:bg-red-500/20 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-[#e8eeff] text-sm leading-relaxed">{msg.message}</p>
                    <p className="text-xs text-[#7a8ab8] mt-3">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* ── Portfolio ────────────────────────────────────────────────── */}
          {activeTab === 'portfolio' && (
            <motion.div key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button onClick={() => openModal()}
                className="mb-6 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 text-[#050810] font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
                + Add Project
              </button>
              <div className="grid gap-4">
                {isLoading ? (
                  <p className="text-[#7a8ab8]">Loading portfolio...</p>
                ) : portfolio.length === 0 ? (
                  <div className="text-center py-16 text-[#7a8ab8]">
                    <p className="text-4xl mb-3">📂</p><p>No projects yet. Add one!</p>
                  </div>
                ) : (
                  portfolio.map((proj, i) => (
                    <motion.div key={proj.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-[#0f1528] border border-[#1a2444] rounded-lg p-4 hover:border-cyan-500/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-12 rounded-full bg-gradient-to-b ${proj.color || 'from-cyan-600 to-blue-500'}`} />
                          <div>
                            <h3 className="font-semibold text-[#e8eeff]">{proj.name}</h3>
                            <p className="text-sm text-[#7a8ab8]">{proj.client}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openModal(proj)}
                            className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded text-sm hover:bg-cyan-500/20 transition-colors">Edit</button>
                          <button onClick={() => setDeleteConfirm({ type: 'project', id: proj.id })}
                            className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-sm hover:bg-red-500/20 transition-colors">Delete</button>
                        </div>
                      </div>
                      <p className="text-[#e8eeff] text-sm mt-3 ml-5">{proj.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2 ml-5">
                        {proj.tags?.map((t) => (
                          <span key={t} className="text-xs bg-[#1a2444] text-[#7a8ab8] px-2 py-1 rounded">{t}</span>
                        ))}
                      </div>
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noopener noreferrer"
                          className="block mt-2 ml-5 text-cyan-400 hover:text-cyan-300 text-sm">Visit project →</a>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Add/Edit Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}
              className="bg-[#0f1528] border border-[#1a2444] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-[#e8eeff] mb-5">
                {selectedProject ? 'Edit Project' : 'Add Project'}
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'name', placeholder: 'Project Name *' },
                  { name: 'client', placeholder: 'Client Name *' },
                ].map((f) => (
                  <input key={f.name} type="text" placeholder={f.placeholder} value={formData[f.name]}
                    onChange={(e) => setFormData((p) => ({ ...p, [f.name]: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[#1a2444]/50 border border-[#1a2444] rounded-lg text-[#e8eeff] placeholder-[#7a8ab8]/60 focus:outline-none focus:border-cyan-500 transition-colors" />
                ))}
                <textarea placeholder="Short description" value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#1a2444]/50 border border-[#1a2444] rounded-lg text-[#e8eeff] placeholder-[#7a8ab8]/60 focus:outline-none focus:border-cyan-500 transition-colors resize-none" />
                <input type="text" placeholder="Tags (comma-separated): React, Node.js"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('tags', e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1a2444]/50 border border-[#1a2444] rounded-lg text-[#e8eeff] placeholder-[#7a8ab8]/60 focus:outline-none focus:border-cyan-500 transition-colors" />
                <input type="text" placeholder="Categories (comma-separated): Web, Mobile"
                  value={formData.category?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('category', e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1a2444]/50 border border-[#1a2444] rounded-lg text-[#e8eeff] placeholder-[#7a8ab8]/60 focus:outline-none focus:border-cyan-500 transition-colors" />
                <input type="url" placeholder="Project URL (optional)" value={formData.url}
                  onChange={(e) => setFormData((p) => ({ ...p, url: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[#1a2444]/50 border border-[#1a2444] rounded-lg text-[#e8eeff] placeholder-[#7a8ab8]/60 focus:outline-none focus:border-cyan-500 transition-colors" />

                {/* Color picker */}
                <div>
                  <label className="block text-sm text-[#7a8ab8] mb-2">Card Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {GRADIENT_OPTIONS.map((opt) => (
                      <button key={opt.value} type="button"
                        onClick={() => setFormData((p) => ({ ...p, color: opt.value }))}
                        title={opt.label}
                        className={`h-10 rounded-lg bg-gradient-to-r ${opt.value} transition-all ${
                          formData.color === opt.value
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f1528] scale-105'
                            : 'opacity-60 hover:opacity-100'
                        }`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={closeModal}
                  className="flex-1 px-4 py-2.5 bg-[#1a2444] border border-[#1a2444] rounded-lg text-[#e8eeff] hover:border-cyan-500 transition-colors">
                  Cancel
                </button>
                <button onClick={saveProject} disabled={saving || !formData.name || !formData.client}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 text-[#050810] font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  {saving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0f1528] border border-red-500/30 rounded-xl p-6 w-full max-w-sm text-center">
              <p className="text-4xl mb-3">⚠️</p>
              <h3 className="text-lg font-bold text-[#e8eeff] mb-2">Confirm Delete</h3>
              <p className="text-[#7a8ab8] text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 bg-[#1a2444] border border-[#1a2444] rounded-lg text-[#e8eeff] hover:border-cyan-500 transition-colors">
                  Cancel
                </button>
                <button onClick={executeDelete}
                  className="flex-1 px-4 py-2.5 bg-red-500/20 border border-red-500/50 text-red-400 font-semibold rounded-lg hover:bg-red-500/30 transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
