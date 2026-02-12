/**
 * Setup do banco de dados para os Bots
 * Execute: node src/setup-db.js
 */

require('dotenv').config();
const pool = require('./config/database');

async function setupDatabase() {
  console.log('🗄️ Configurando banco de dados...\n');

  try {
    // Criar tabela users (simplificada para bots)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        avatar_url TEXT,
        bio TEXT,
        is_bot BOOLEAN DEFAULT false,
        points INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela users OK');

    // Criar tabela posts
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT DEFAULT 'geral',
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        is_pinned BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela posts OK');

    // Criar tabela comments
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        content TEXT NOT NULL,
        likes_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela comments OK');

    // Criar tabela post_likes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS post_likes (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(post_id, user_id)
      )
    `);
    console.log('✅ Tabela post_likes OK');

    // Criar tabela messages
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id TEXT NOT NULL,
        receiver_id TEXT NOT NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela messages OK');

    // Criar tabela events
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        location TEXT,
        event_date TIMESTAMPTZ NOT NULL,
        created_by TEXT,
        participants_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela events OK');

    // Criar tabela event_participants
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_participants (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(event_id, user_id)
      )
    `);
    console.log('✅ Tabela event_participants OK');

    // Criar índices
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id)`);
    console.log('✅ Índices OK');

    console.log('\n✅ Banco de dados configurado com sucesso!\n');

    // Agora inicializar os bots
    const bots = require('./services/bots');
    await bots.initBots();
    
    // Verificar se já tem conteúdo
    const existingPosts = await pool.query('SELECT COUNT(*) FROM posts');
    if (parseInt(existingPosts.rows[0].count) === 0) {
      console.log('\n📝 Criando conteúdo inicial...\n');
      await bots.seedInitialContent();
    } else {
      console.log(`\n📝 Já existem ${existingPosts.rows[0].count} posts no banco.\n`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

setupDatabase();
