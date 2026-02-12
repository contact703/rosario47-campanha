const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const auth = require('../middleware/auth');
const botsService = require('../services/bots');

// GET /api/posts - Listar posts
router.get('/', async (req, res) => {
  console.log('[POSTS] GET /api/posts chamado');
  try {
    const { page = 1, category } = req.query;
    console.log('[POSTS] page:', page, 'category:', category);
    const limit = 20;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        p.id, p.title, p.content, p.category, 
        p.user_id, p.user_name, p.likes_count, p.comments_count,
        p.is_pinned, p.created_at
      FROM posts p
    `;
    
    const params = [];
    if (category && category !== 'all') {
      query += ' WHERE p.category = $1';
      params.push(category);
    }
    
    query += ' ORDER BY p.is_pinned DESC, p.created_at DESC';
    query += ` LIMIT ${limit} OFFSET ${offset}`;
    
    const result = await pool.query(query, params);
    
    // Formatar para o app
    const posts = result.rows.map(p => ({
      id: p.id.toString(),
      title: p.title,
      content: p.content,
      category: p.category,
      user_name: p.user_name,
      user_id: p.user_id,
      likes_count: p.likes_count || 0,
      comments_count: p.comments_count || 0,
      is_liked: false, // TODO: verificar se user curtiu
      is_pinned: p.is_pinned,
      created_at: p.created_at,
    }));
    
    res.json({ posts, page: parseInt(page) });
  } catch (error) {
    console.error('[POSTS] Erro ao listar posts:', error.message);
    console.error('[POSTS] Stack:', error.stack);
    res.status(500).json({ error: 'Erro ao listar posts', details: error.message });
  }
});

// GET /api/posts/:id - Buscar post por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    
    res.json({ post: result.rows[0] });
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    res.status(500).json({ error: 'Erro ao buscar post' });
  }
});

// POST /api/posts - Criar novo post
router.post('/', auth.optionalAuth, async (req, res) => {
  try {
    const { title, content, category = 'geral' } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
    }
    
    // Se usuário autenticado, usar seus dados; senão, usar dados do body
    const userId = req.user?.id || req.body.user_id || 'anonymous';
    const userName = req.user?.name || req.body.user_name || 'Anônimo';
    
    const result = await pool.query(
      `INSERT INTO posts (title, content, category, user_id, user_name, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [title, content, category, userId, userName]
    );
    
    const post = result.rows[0];
    
    // Antunes comenta automaticamente após alguns segundos
    setTimeout(async () => {
      try {
        await botsService.antunesComentaTodos();
      } catch (e) {
        console.log('Erro ao Antunes comentar:', e.message);
      }
    }, 5000);
    
    res.status(201).json({ post });
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
});

// POST /api/posts/:id/like - Curtir post
router.post('/:id/like', auth.optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.body.user_id || 'anonymous';
    
    // Verificar se já curtiu
    const existing = await pool.query(
      'SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (existing.rows.length > 0) {
      // Remover like
      await pool.query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [id, userId]);
      await pool.query('UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1', [id]);
      res.json({ liked: false });
    } else {
      // Adicionar like
      await pool.query(
        'INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)',
        [id, userId]
      );
      await pool.query('UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1', [id]);
      res.json({ liked: true });
    }
  } catch (error) {
    console.error('Erro ao curtir post:', error);
    res.status(500).json({ error: 'Erro ao curtir post' });
  }
});

// GET /api/posts/meta/categories - Listar categorias
router.get('/meta/categories', (req, res) => {
  res.json({
    categories: [
      { id: 'comunicados', name: 'Comunicados', icon: '📢', color: '#EF4444' },
      { id: 'ideias', name: 'Ideias', icon: '💡', color: '#F59E0B' },
      { id: 'eventos', name: 'Eventos', icon: '📅', color: '#10B981' },
      { id: 'duvidas', name: 'Dúvidas', icon: '❓', color: '#8B5CF6' },
      { id: 'geral', name: 'Geral', icon: '💬', color: '#6B7280' },
    ]
  });
});

module.exports = router;
