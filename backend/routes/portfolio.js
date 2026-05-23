const express = require('express');
const { randomUUID } = require('crypto');
const { readJSON, writeJSON } = require('../config/storage');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/portfolio — public
router.get('/', (req, res) => {
  try {
    const portfolio = readJSON('portfolio.json');
    res.json(portfolio);
  } catch (err) {
    console.error('Get portfolio error:', err);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// POST /api/portfolio — admin only
router.post('/', requireAuth, (req, res) => {
  try {
    const { name, client, category, tags, url, description, color } = req.body;

    if (!name || !client) {
      return res.status(400).json({ error: 'Name and client are required' });
    }

    const portfolio = readJSON('portfolio.json');
    const maxOrder = portfolio.reduce((max, p) => Math.max(max, p.order || 0), 0);

    const project = {
      id: randomUUID(),
      name: name.trim(),
      client: client.trim(),
      category: Array.isArray(category) ? category : [],
      tags: Array.isArray(tags) ? tags : [],
      url: url?.trim() || '',
      description: description?.trim() || '',
      color: color || 'from-cyan-600 to-blue-500',
      order: maxOrder + 1,
      createdAt: new Date().toISOString(),
    };

    portfolio.push(project);
    writeJSON('portfolio.json', portfolio);

    res.status(201).json({ success: true, id: project.id });
  } catch (err) {
    console.error('Create portfolio error:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT /api/portfolio/:id — admin only
router.put('/:id', requireAuth, (req, res) => {
  try {
    const { name, client, category, tags, url, description, color } = req.body;
    const portfolio = readJSON('portfolio.json');
    const idx = portfolio.findIndex((p) => p.id === req.params.id);

    if (idx === -1) return res.status(404).json({ error: 'Project not found' });

    portfolio[idx] = {
      ...portfolio[idx],
      name,
      client,
      category: Array.isArray(category) ? category : [],
      tags: Array.isArray(tags) ? tags : [],
      url: url || '',
      description: description || '',
      color: color || 'from-cyan-600 to-blue-500',
      updatedAt: new Date().toISOString(),
    };

    writeJSON('portfolio.json', portfolio);
    res.json({ success: true });
  } catch (err) {
    console.error('Update portfolio error:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/portfolio/:id — admin only
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const portfolio = readJSON('portfolio.json');
    const filtered = portfolio.filter((p) => p.id !== req.params.id);

    if (filtered.length === portfolio.length) {
      return res.status(404).json({ error: 'Project not found' });
    }

    writeJSON('portfolio.json', filtered);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete portfolio error:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
