require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const messagesRoutes = require('./routes/messages');
const eventsRoutes = require('./routes/events');
const chatRoutes = require('./routes/chat');
const botsService = require('./services/bots');
const { setupCronJobs } = require('./cron');
const githubKnowledge = require('./services/github-knowledge');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Muitas requisições, tente novamente mais tarde' }
});
app.use('/api/', limiter);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    app: 'Rosário 47 API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/chat', chatRoutes);

// Admin routes for bots
app.post('/api/admin/bots/init', async (req, res) => {
  try {
    await botsService.initBots();
    res.json({ success: true, message: 'Bots inicializados' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Migrar nome do bot para "Equipe Rosário"
app.post('/api/admin/bots/migrate-name', async (req, res) => {
  try {
    const { pool } = require('./config/database');
    // Atualizar usuário
    await pool.query(`UPDATE users SET name = 'Equipe Rosário', avatar_url = '💚' WHERE id = 'bot-antunes'`);
    // Atualizar posts
    await pool.query(`UPDATE posts SET user_name = 'Equipe Rosário' WHERE user_id = 'bot-antunes'`);
    // Atualizar comentários  
    await pool.query(`UPDATE comments SET user_name = 'Equipe Rosário' WHERE user_id = 'bot-antunes'`);
    res.json({ success: true, message: 'Nome migrado para Equipe Rosário em users, posts e comments' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/bots/seed', async (req, res) => {
  try {
    await botsService.seedInitialContent();
    res.json({ success: true, message: 'Conteúdo inicial criado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/bots/daily', async (req, res) => {
  try {
    await botsService.dailyBotActivity();
    res.json({ success: true, message: 'Atividade diária executada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/bots/antunes-comment', async (req, res) => {
  try {
    await botsService.antunesComentaTodos();
    res.json({ success: true, message: 'Antunes comentou em todos os posts' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// GitHub Knowledge Webhook & Admin Routes
// ========================================

// Webhook do GitHub - recebe notificações de push
app.post('/api/webhook/github', (req, res) => {
  console.log('📨 Webhook recebido do GitHub');
  const result = githubKnowledge.handleWebhook(req.body);
  res.json(result);
});

// Força sincronização manual
app.post('/api/admin/knowledge/sync', async (req, res) => {
  try {
    await githubKnowledge.syncKnowledge();
    res.json({ 
      success: true, 
      message: 'Conhecimento sincronizado!',
      data: githubKnowledge.getDynamicKnowledge()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retorna conhecimento atual
app.get('/api/admin/knowledge', (req, res) => {
  res.json({
    knowledge: githubKnowledge.getDynamicKnowledge(),
    keywords: githubKnowledge.getDynamicKeywords(),
    config: githubKnowledge.GITHUB_CONFIG
  });
});

// Busca no conhecimento dinâmico
app.get('/api/admin/knowledge/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }
  const results = githubKnowledge.searchDynamicKnowledge(q);
  res.json({ query: q, results });
});

// Initialize bots and knowledge on startup
setTimeout(async () => {
  try {
    await botsService.initBots();
    console.log('🤖 Bots inicializados!');
    
    // Configurar cron jobs para atividade automática
    setupCronJobs();
    
    // Iniciar sync de conhecimento do GitHub
    githubKnowledge.startPolling();
    console.log('📚 GitHub Knowledge Sync iniciado!');
  } catch (error) {
    console.log('⚠️ Erro ao inicializar:', error.message);
  }
}, 3000);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Rosário 47 API rodando na porta ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
