const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

// GET /api/comments/:postId - Listar comentários de um post
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    
    const result = await pool.query(
      `SELECT id, post_id, user_id, user_name, content, likes_count, created_at
       FROM comments 
       WHERE post_id = $1 
       ORDER BY created_at ASC`,
      [postId]
    );
    
    const comments = result.rows.map(c => ({
      id: c.id.toString(),
      post_id: c.post_id.toString(),
      user_id: c.user_id,
      user_name: c.user_name,
      content: c.content,
      likes_count: c.likes_count || 0,
      created_at: c.created_at,
    }));
    
    res.json({ comments });
  } catch (error) {
    console.error('Erro ao listar comentários:', error);
    res.status(500).json({ error: 'Erro ao listar comentários' });
  }
});

// POST /api/comments/:postId - Criar comentário
router.post('/:postId', auth.optionalAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Conteúdo é obrigatório' });
    }
    
    const userId = req.user?.id || req.body.user_id || 'anonymous';
    const userName = req.user?.name || req.body.user_name || 'Anônimo';
    
    const result = await pool.query(
      `INSERT INTO comments (post_id, user_id, user_name, content, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [postId, userId, userName, content]
    );
    
    // Atualizar contador de comentários no post
    await pool.query(
      'UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1',
      [postId]
    );
    
    res.status(201).json({ comment: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar comentário:', error);
    res.status(500).json({ error: 'Erro ao criar comentário' });
  }
});

// DELETE /api/comments/:id - Deletar comentário
router.delete('/:id', auth.optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar comentário para obter post_id
    const comment = await pool.query('SELECT post_id FROM comments WHERE id = $1', [id]);
    
    if (comment.rows.length === 0) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    
    const postId = comment.rows[0].post_id;
    
    await pool.query('DELETE FROM comments WHERE id = $1', [id]);
    
    // Atualizar contador
    await pool.query(
      'UPDATE posts SET comments_count = comments_count - 1 WHERE id = $1 AND comments_count > 0',
      [postId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar comentário:', error);
    res.status(500).json({ error: 'Erro ao deletar comentário' });
  }
});

module.exports = router;
