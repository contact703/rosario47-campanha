/**
 * Fix schema - adiciona colunas faltando
 */

require('dotenv').config();
const pool = require('./config/database');

async function fixSchema() {
  console.log('🔧 Corrigindo schema...\n');

  try {
    // Adicionar colunas faltando na tabela users
    const alterations = [
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_bot BOOLEAN DEFAULT false",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0",
    ];
    
    for (const sql of alterations) {
      try {
        await pool.query(sql);
        console.log('✅', sql.substring(0, 50) + '...');
      } catch (e) {
        console.log('⚠️', e.message);
      }
    }
    
    // Atualizar usuários existentes que não tem name
    await pool.query(`
      UPDATE users 
      SET name = COALESCE(
        (SELECT full_name FROM profiles WHERE user_id = users.id LIMIT 1),
        split_part(email, '@', 1)
      )
      WHERE name IS NULL
    `);
    console.log('✅ Nomes atualizados');

    console.log('\n✅ Schema corrigido!\n');

    // Agora criar os bots
    const bots = require('./services/bots');
    await bots.initBots();
    
    // Verificar posts
    const postsCount = await pool.query('SELECT COUNT(*) FROM posts');
    console.log(`📝 Posts existentes: ${postsCount.rows[0].count}`);
    
    if (parseInt(postsCount.rows[0].count) === 0) {
      console.log('\n🌱 Criando conteúdo inicial...\n');
      await bots.seedInitialContent();
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

fixSchema();
