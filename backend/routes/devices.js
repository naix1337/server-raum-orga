const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/devices?search=lab
router.get('/', (req, res) => {
  const { search } = req.query;
  let rows;
  if (search) {
    const term = `%${search.toLowerCase()}%`;
    rows = db.prepare(
      `SELECT * FROM devices WHERE lower(id) LIKE ? OR lower(name) LIKE ? ORDER BY id`
    ).all(term, term);
  } else {
    rows = db.prepare(`SELECT * FROM devices ORDER BY id`).all();
  }
  res.json(rows);
});

// GET /api/devices/:id
router.get('/:id', (req, res) => {
  const device = db.prepare(`SELECT * FROM devices WHERE lower(id) = lower(?)`).get(req.params.id);
  if (!device) return res.status(404).json({ error: 'Gerät nicht gefunden' });
  res.json(device);
});

// POST /api/devices
router.post('/', (req, res) => {
  const { id, name, hardware, software, location, status, notes } = req.body;
  if (!id || !id.trim()) return res.status(400).json({ error: 'ID ist erforderlich' });
  const normalizedId = id.trim().toLowerCase();
  if (/\s/.test(normalizedId)) return res.status(400).json({ error: 'ID darf keine Leerzeichen enthalten' });

  const existing = db.prepare(`SELECT id FROM devices WHERE lower(id) = ?`).get(normalizedId);
  if (existing) return res.status(409).json({ error: 'ID bereits vergeben' });

  const validStatus = ['produktiv', 'kundensystem', 'nicht_produktiv', 'veraltet', 'eingelagert'];
  const safeStatus = validStatus.includes(status) ? status : 'nicht_produktiv';

  db.prepare(`
    INSERT INTO devices (id, name, hardware, software, location, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(normalizedId, name || '', hardware || '', software || '', location || '', safeStatus, notes || '');

  const device = db.prepare(`SELECT * FROM devices WHERE id = ?`).get(normalizedId);
  res.status(201).json(device);
});

// PUT /api/devices/:id
router.put('/:id', (req, res) => {
  const device = db.prepare(`SELECT * FROM devices WHERE lower(id) = lower(?)`).get(req.params.id);
  if (!device) return res.status(404).json({ error: 'Gerät nicht gefunden' });

  const { name, hardware, software, location, status, notes } = req.body;
  const validStatus = ['produktiv', 'kundensystem', 'nicht_produktiv', 'veraltet', 'eingelagert'];
  const safeStatus = validStatus.includes(status) ? status : device.status;

  db.prepare(`
    UPDATE devices SET name=?, hardware=?, software=?, location=?, status=?, notes=?
    WHERE lower(id) = lower(?)
  `).run(
    name ?? device.name,
    hardware ?? device.hardware,
    software ?? device.software,
    location ?? device.location,
    safeStatus,
    notes ?? device.notes,
    req.params.id
  );

  const updated = db.prepare(`SELECT * FROM devices WHERE lower(id) = lower(?)`).get(req.params.id);
  res.json(updated);
});

// PATCH /api/devices/:id/status
router.patch('/:id/status', (req, res) => {
  const device = db.prepare(`SELECT * FROM devices WHERE lower(id) = lower(?)`).get(req.params.id);
  if (!device) return res.status(404).json({ error: 'Gerät nicht gefunden' });

  const { status } = req.body;
  const validStatus = ['produktiv', 'kundensystem', 'nicht_produktiv', 'veraltet', 'eingelagert'];
  if (!validStatus.includes(status)) return res.status(400).json({ error: 'Ungültiger Status' });

  db.prepare(`UPDATE devices SET status=? WHERE lower(id) = lower(?)`).run(status, req.params.id);
  const updated = db.prepare(`SELECT * FROM devices WHERE lower(id) = lower(?)`).get(req.params.id);
  res.json(updated);
});

// DELETE /api/devices/:id
router.delete('/:id', (req, res) => {
  const device = db.prepare(`SELECT id FROM devices WHERE lower(id) = lower(?)`).get(req.params.id);
  if (!device) return res.status(404).json({ error: 'Gerät nicht gefunden' });
  db.prepare(`DELETE FROM devices WHERE lower(id) = lower(?)`).run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
