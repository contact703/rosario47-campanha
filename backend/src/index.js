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

// Initialize bots on startup
setTimeout(async () => {
  try {
    await botsService.initBots();
    console.log('🤖 Bots inicializados!');
    
    // Configurar cron jobs para atividade automática
    setupCronJobs();
  } catch (error) {
    console.log('⚠️ Erro ao inicializar bots:', error.message);
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
