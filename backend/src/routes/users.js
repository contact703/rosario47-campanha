const express = require('express');
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - List users
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT u.id, u.name, u.avatar_url, u.role, u.created_at,
              p.city, p.points
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       ORDER BY p.points DESC NULLS LAST
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM users');

    res.json({
      users: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count)
      }
    });
  } catch (err) {
    console.error('Users list error:', err);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

// GET /api/users/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.avatar_url, u.role, u.created_at,
              p.bio, p.city, p.points, p.badges
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Get user stats
    const postsCount = await query('SELECT COUNT(*) FROM forum_posts WHERE user_id = $1', [req.params.id]);
    const commentsCount = await query('SELECT COUNT(*) FROM forum_comments WHERE user_id = $1', [req.params.id]);

    res.json({
      user: {
        ...result.rows[0],
        stats: {
          posts: parseInt(postsCount.rows[0].count),
          comments: parseInt(commentsCount.rows[0].count)
        }
      }
    });
  } catch (err) {
    console.error('User get error:', err);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// PUT /api/users/profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, bio, city, avatar_url } = req.body;

    // Update user
    if (name) {
      await query('UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2', [name, req.user.id]);
    }
    if (avatar_url) {
      await query('UPDATE users SET avatar_url = $1, updated_at = NOW() WHERE id = $2', [avatar_url, req.user.id]);
    }

    // Update profile
    await query(
      `UPDATE profiles SET bio = COALESCE($1, bio), city = COALESCE($2, city), updated_at = NOW()
       WHERE user_id = $3`,
      [bio, city, req.user.id]
    );

    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

// GET /api/users/ranking
router.get('/ranking/top', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.avatar_url, p.points, p.badges
       FROM users u
       JOIN profiles p ON p.user_id = u.id
       ORDER BY p.points DESC
       LIMIT 10`
    );

    res.json({ ranking: result.rows });
  } catch (err) {
    console.error('Ranking error:', err);
    res.status(500).json({ error: 'Erro ao buscar ranking' });
  }
});

module.exports = router;
