/**
 * CRON JOBS - Atividade automática dos bots
 * Executa 3x por dia: 9h, 14h, 19h
 */

const cron = require('node-cron');
const botsService = require('./services/bots');

// Configuração dos horários (America/Sao_Paulo)
const SCHEDULE_MORNING = '0 9 * * *';   // 9h
const SCHEDULE_AFTERNOON = '0 14 * * *'; // 14h  
const SCHEDULE_EVENING = '0 19 * * *';   // 19h

function setupCronJobs() {
  console.log('⏰ Configurando cron jobs dos bots...');

  // Manhã - 9h
  cron.schedule(SCHEDULE_MORNING, async () => {
    console.log('\n🌅 [CRON 9h] Executando atividade matinal dos bots...');
    try {
      await botsService.dailyBotActivity();
      console.log('✅ [CRON 9h] Atividade matinal concluída\n');
    } catch (error) {
      console.error('❌ [CRON 9h] Erro:', error.message);
    }
  }, {
    timezone: 'America/Sao_Paulo'
  });

  // Tarde - 14h
  cron.schedule(SCHEDULE_AFTERNOON, async () => {
    console.log('\n☀️ [CRON 14h] Executando atividade da tarde dos bots...');
    try {
      await botsService.dailyBotActivity();
      console.log('✅ [CRON 14h] Atividade da tarde concluída\n');
    } catch (error) {
      console.error('❌ [CRON 14h] Erro:', error.message);
    }
  }, {
    timezone: 'America/Sao_Paulo'
  });

  // Noite - 19h
  cron.schedule(SCHEDULE_EVENING, async () => {
    console.log('\n🌙 [CRON 19h] Executando atividade noturna dos bots...');
    try {
      await botsService.dailyBotActivity();
      console.log('✅ [CRON 19h] Atividade noturna concluída\n');
    } catch (error) {
      console.error('❌ [CRON 19h] Erro:', error.message);
    }
  }, {
    timezone: 'America/Sao_Paulo'
  });

  console.log('✅ Cron jobs configurados: 9h, 14h, 19h (Brasília)');
}

module.exports = { setupCronJobs };
