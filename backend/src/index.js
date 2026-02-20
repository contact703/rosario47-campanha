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
    // Atualizar usuário por email ou nome antigo
    const userResult = await pool.query(`UPDATE users SET name = 'Equipe Rosário' WHERE name LIKE '%Antunes%' OR email LIKE '%antunes%' RETURNING id`);
    const updatedIds = userResult.rows.map(r => r.id);
    
    // Atualizar posts pelo nome antigo
    await pool.query(`UPDATE posts SET user_name = 'Equipe Rosário' WHERE user_name LIKE '%Antunes%'`);
    // Atualizar comentários pelo nome antigo
    await pool.query(`UPDATE comments SET user_name = 'Equipe Rosário' WHERE user_name LIKE '%Antunes%'`);
    
    res.json({ success: true, message: 'Nome migrado para Equipe Rosário', updatedUserIds: updatedIds });
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

// Seed de eventos de campanha
app.post('/api/admin/events/seed', async (req, res) => {
  try {
    const { pool } = require('./config/database');
    
    // Garantir que a tabela events existe com as colunas corretas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        location TEXT,
        event_date TIMESTAMPTZ NOT NULL,
        image_url TEXT,
        created_by TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_participants (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL,
        status TEXT DEFAULT 'confirmed',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(event_id, user_id)
      )
    `);
    
    // Eventos de campanha
    const eventos = [
      {
        title: '🚗 Grande Carreata - Zona Norte',
        description: 'Carreata saindo da Praça Central às 14h. Tragam bandeiras, adesivos e muita energia! Vamos mostrar a força do 47!',
        location: 'Praça Central - Zona Norte',
        event_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias
      },
      {
        title: '🎤 Comício no Centro',
        description: 'Grande comício com Antunes e lideranças! Música, discursos e apresentação das propostas. Família convidada!',
        location: 'Praça da República',
        event_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias
      },
      {
        title: '🏥 Debate sobre Saúde Pública',
        description: 'Roda de conversa sobre as propostas de saúde do Antunes. Profissionais da saúde e comunidade são bem-vindos!',
        location: 'Salão Paroquial - Bairro Esperança',
        event_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias
      },
      {
        title: '📚 Encontro com Professores',
        description: 'Bate-papo sobre educação e valorização dos professores. Antunes apresenta seu plano para as escolas municipais.',
        location: 'Escola Municipal José de Alencar',
        event_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 dias
      },
      {
        title: '🏠 Caminhada no Bairro São José',
        description: 'Antunes vai caminhar pelas ruas do São José, conversando com moradores. Venham participar!',
        location: 'Rua Principal - Bairro São José',
        event_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // amanhã
      },
      {
        title: '💼 Reunião com Comerciantes',
        description: 'Encontro para discutir apoio ao comércio local, menos burocracia e incentivos fiscais.',
        location: 'Associação Comercial',
        event_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 dias
      },
      {
        title: '🎉 Festa da Vitória (após eleição)',
        description: 'Celebração da nossa vitória! Música ao vivo, comidas típicas e muita alegria. O povo unido jamais será vencido!',
        location: 'Praça Central',
        event_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 dias
      },
    ];
    
    let created = 0;
    for (const evento of eventos) {
      try {
        await pool.query(
          `INSERT INTO events (title, description, location, event_date, created_by, created_at, updated_at)
           VALUES ($1, $2, $3, $4, 'bot-antunes', NOW(), NOW())
           ON CONFLICT DO NOTHING`,
          [evento.title, evento.description, evento.location, evento.event_date]
        );
        created++;
      } catch (e) {
        console.log('Evento já existe ou erro:', e.message);
      }
    }
    
    // Bots confirmam presença nos eventos
    const allEvents = await pool.query('SELECT id FROM events');
    const bots = ['bot-maria', 'bot-joao', 'bot-pedro', 'bot-ana', 'bot-carlos'];
    
    for (const event of allEvents.rows) {
      // 3-5 bots participam de cada evento
      const numParticipants = Math.floor(Math.random() * 3) + 3;
      const shuffledBots = bots.sort(() => Math.random() - 0.5).slice(0, numParticipants);
      
      for (const botId of shuffledBots) {
        try {
          await pool.query(
            `INSERT INTO event_participants (event_id, user_id, status, created_at)
             VALUES ($1, $2, 'confirmed', NOW())
             ON CONFLICT DO NOTHING`,
            [event.id, botId]
          );
        } catch (e) {}
      }
    }
    
    res.json({ success: true, message: `${created} eventos criados, participantes adicionados!` });
  } catch (error) {
    console.error('Seed events error:', error);
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
