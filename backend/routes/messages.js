const express = require('express');
const { randomUUID } = require('crypto');
const { readJSON, writeJSON } = require('../config/storage');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/messages — public
router.post('/', (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const messages = readJSON('messages.json');
    const newMsg = {
      id: randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    messages.unshift(newMsg);
    writeJSON('messages.json', messages);

    res.status(201).json({ success: true, id: newMsg.id });
  } catch (err) {
    console.error('Create message error:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// GET /api/messages — admin only
router.get('/', requireAuth, (req, res) => {
  try {
    const messages = readJSON('messages.json');
    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// PATCH /api/messages/:id/read — admin only
router.patch('/:id/read', requireAuth, (req, res) => {
  try {
    const messages = readJSON('messages.json');
    const idx = messages.findIndex((m) => m.id === req.params.id);

    if (idx === -1) return res.status(404).json({ error: 'Message not found' });

    messages[idx].read = true;
    writeJSON('messages.json', messages);

    res.json({ success: true });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// DELETE /api/messages/:id — admin only
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const messages = readJSON('messages.json');
    const filtered = messages.filter((m) => m.id !== req.params.id);

    if (filtered.length === messages.length) {
      return res.status(404).json({ error: 'Message not found' });
    }

    writeJSON('messages.json', filtered);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete message error:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
