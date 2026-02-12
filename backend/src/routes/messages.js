const express = require('express');
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/messages/conversations - List conversations
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT DISTINCT ON (other_user_id) 
        CASE 
          WHEN dm.sender_id = $1 THEN dm.receiver_id 
          ELSE dm.sender_id 
        END as other_user_id,
        dm.id as last_message_id,
        dm.content as last_message,
        dm.created_at as last_message_at,
        dm.read,
        u.name as other_user_name,
        u.avatar_url as other_user_avatar
       FROM direct_messages dm
       JOIN users u ON u.id = CASE 
          WHEN dm.sender_id = $1 THEN dm.receiver_id 
          ELSE dm.sender_id 
        END
       WHERE dm.sender_id = $1 OR dm.receiver_id = $1
       ORDER BY other_user_id, dm.created_at DESC`,
      [req.user.id]
    );

    // Get unread counts
    for (let conv of result.rows) {
      const unread = await query(
        'SELECT COUNT(*) FROM direct_messages WHERE sender_id = $1 AND receiver_id = $2 AND read = false',
        [conv.other_user_id, req.user.id]
      );
      conv.unread_count = parseInt(unread.rows[0].count);
    }

    // Sort by last message
    result.rows.sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at));

    res.json({ conversations: result.rows });
  } catch (err) {
    console.error('Conversations list error:', err);
    res.status(500).json({ error: 'Erro ao listar conversas' });
  }
});

// GET /api/messages/:userId - Get messages with user
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    const otherUserId = req.params.userId;

    const result = await query(
      `SELECT dm.id, dm.sender_id, dm.receiver_id, dm.content, dm.read, dm.created_at,
              s.name as sender_name, s.avatar_url as sender_avatar
       FROM direct_messages dm
       JOIN users s ON s.id = dm.sender_id
       WHERE (dm.sender_id = $1 AND dm.receiver_id = $2)
          OR (dm.sender_id = $2 AND dm.receiver_id = $1)
       ORDER BY dm.created_at DESC
       LIMIT $3 OFFSET $4`,
      [req.user.id, otherUserId, limit, offset]
    );

    // Mark messages as read
    await query(
      'UPDATE direct_messages SET read = true WHERE sender_id = $1 AND receiver_id = $2 AND read = false',
      [otherUserId, req.user.id]
    );

    // Get other user info
    const otherUser = await query(
      'SELECT id, name, avatar_url FROM users WHERE id = $1',
      [otherUserId]
    );

    res.json({
      messages: result.rows.reverse(), // Return in chronological order
      otherUser: otherUser.rows[0] || null
    });
  } catch (err) {
    console.error('Messages list error:', err);
    res.status(500).json({ error: 'Erro ao listar mensagens' });
  }
});

// POST /api/messages/:userId - Send message
router.post('/:userId', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const receiverId = req.params.userId;

    if (!content) {
      return res.status(400).json({ error: 'Conteúdo é obrigatório' });
    }

    // Check if receiver exists
    const receiver = await query('SELECT id, name FROM users WHERE id = $1', [receiverId]);
    if (receiver.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const result = await query(
      `INSERT INTO direct_messages (sender_id, receiver_id, content, read, created_at)
       VALUES ($1, $2, $3, false, NOW())
       RETURNING id, sender_id, receiver_id, content, read, created_at`,
      [req.user.id, receiverId, content]
    );

    // Create notification
    await query(
      `INSERT INTO notifications (user_id, type, title, body, data, read, created_at)
       VALUES ($1, 'message', 'Nova mensagem', $2, $3, false, NOW())`,
      [
        receiverId,
        `${req.user.name} enviou uma mensagem`,
        JSON.stringify({ senderId: req.user.id, messageId: result.rows[0].id })
      ]
    );

    res.status(201).json({
      message: 'Mensagem enviada com sucesso',
      data: {
        ...result.rows[0],
        sender_name: req.user.name,
        sender_avatar: req.user.avatar_url
      }
    });
  } catch (err) {
    console.error('Message send error:', err);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

// DELETE /api/messages/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const message = await query(
      'SELECT sender_id FROM direct_messages WHERE id = $1',
      [req.params.id]
    );

    if (message.rows.length === 0) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }
    if (message.rows[0].sender_id !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão para deletar esta mensagem' });
    }

    await query('DELETE FROM direct_messages WHERE id = $1', [req.params.id]);

    res.json({ message: 'Mensagem deletada com sucesso' });
  } catch (err) {
    console.error('Message delete error:', err);
    res.status(500).json({ error: 'Erro ao deletar mensagem' });
  }
});

// GET /api/messages/unread/count
router.get('/unread/count', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT COUNT(*) FROM direct_messages WHERE receiver_id = $1 AND read = false',
      [req.user.id]
    );

    res.json({ unread: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error('Unread count error:', err);
    res.status(500).json({ error: 'Erro ao contar mensagens não lidas' });
  }
});

module.exports = router;
