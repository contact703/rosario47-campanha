const express = require('express');
const { query } = require('../config/database');
const { authenticate, optionalAuth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/events - List events
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, upcoming = 'true' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = upcoming === 'true' ? 'WHERE e.event_date >= NOW()' : '';

    const result = await query(
      `SELECT e.id, e.title, e.description, e.location, e.event_date, e.image_url, e.created_at,
              (SELECT COUNT(*) FROM event_participants WHERE event_id = e.id) as participants_count
              ${req.user ? `, (SELECT COUNT(*) > 0 FROM event_participants WHERE event_id = e.id AND user_id = ${req.user.id}) as is_participating` : ''}
       FROM events e
       ${whereClause}
       ORDER BY e.event_date ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await query(`SELECT COUNT(*) FROM events ${whereClause}`);

    res.json({
      events: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count)
      }
    });
  } catch (err) {
    console.error('Events list error:', err);
    res.status(500).json({ error: 'Erro ao listar eventos' });
  }
});

// GET /api/events/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT e.id, e.title, e.description, e.location, e.event_date, e.image_url, e.created_at,
              (SELECT COUNT(*) FROM event_participants WHERE event_id = e.id) as participants_count
              ${req.user ? `, (SELECT COUNT(*) > 0 FROM event_participants WHERE event_id = e.id AND user_id = ${req.user.id}) as is_participating` : ''}
       FROM events e
       WHERE e.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    // Get participants
    const participants = await query(
      `SELECT u.id, u.name, u.avatar_url
       FROM event_participants ep
       JOIN users u ON u.id = ep.user_id
       WHERE ep.event_id = $1
       ORDER BY ep.created_at ASC
       LIMIT 20`,
      [req.params.id]
    );

    res.json({
      event: {
        ...result.rows[0],
        participants: participants.rows
      }
    });
  } catch (err) {
    console.error('Event get error:', err);
    res.status(500).json({ error: 'Erro ao buscar evento' });
  }
});

// POST /api/events - Create event (admin only)
router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const { title, description, location, event_date, image_url } = req.body;

    if (!title || !event_date) {
      return res.status(400).json({ error: 'Título e data são obrigatórios' });
    }

    const result = await query(
      `INSERT INTO events (title, description, location, event_date, image_url, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, title, description, location, event_date, image_url, created_at`,
      [title, description || '', location || '', event_date, image_url || null]
    );

    res.status(201).json({
      message: 'Evento criado com sucesso',
      event: result.rows[0]
    });
  } catch (err) {
    console.error('Event create error:', err);
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
});

// PUT /api/events/:id
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { title, description, location, event_date, image_url } = req.body;

    await query(
      `UPDATE events SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        location = COALESCE($3, location),
        event_date = COALESCE($4, event_date),
        image_url = COALESCE($5, image_url),
        updated_at = NOW()
       WHERE id = $6`,
      [title, description, location, event_date, image_url, req.params.id]
    );

    res.json({ message: 'Evento atualizado com sucesso' });
  } catch (err) {
    console.error('Event update error:', err);
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
});

// DELETE /api/events/:id
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await query('DELETE FROM event_participants WHERE event_id = $1', [req.params.id]);
    await query('DELETE FROM events WHERE id = $1', [req.params.id]);

    res.json({ message: 'Evento deletado com sucesso' });
  } catch (err) {
    console.error('Event delete error:', err);
    res.status(500).json({ error: 'Erro ao deletar evento' });
  }
});

// POST /api/events/:id/participate
router.post('/:id/participate', authenticate, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    // Check if event exists
    const event = await query('SELECT id FROM events WHERE id = $1', [eventId]);
    if (event.rows.length === 0) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    // Check if already participating
    const existing = await query(
      'SELECT id FROM event_participants WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );

    if (existing.rows.length > 0) {
      // Cancel participation
      await query('DELETE FROM event_participants WHERE event_id = $1 AND user_id = $2', [eventId, userId]);
      res.json({ participating: false, message: 'Participação cancelada' });
    } else {
      // Confirm participation
      await query(
        'INSERT INTO event_participants (event_id, user_id, status, created_at) VALUES ($1, $2, $3, NOW())',
        [eventId, userId, 'confirmed']
      );
      // Add points
      await query('UPDATE profiles SET points = points + 5 WHERE user_id = $1', [userId]);
      res.json({ participating: true, message: 'Participação confirmada' });
    }
  } catch (err) {
    console.error('Participate error:', err);
    res.status(500).json({ error: 'Erro ao confirmar participação' });
  }
});

module.exports = router;
