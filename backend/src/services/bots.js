/**
 * SISTEMA DE BOTS - Rosário 47
 * Usuários simulados que interagem automaticamente
 */

const { pool } = require('../config/database');

// ============================================
// CONFIGURAÇÃO DOS BOTS
// ============================================

const BOTS = {
  antunes: {
    id: 'bot-antunes',
    name: 'Antunes do Rosário',
    email: 'antunes@rosario47.com.br',
    avatar: '🎯',
    bio: 'Candidato a Vereador | Juntos por uma cidade que cuida | Vote 47',
    isCandidate: true,
  },
  maria: {
    id: 'bot-maria',
    name: 'Maria Silva',
    email: 'maria@militante.com',
    avatar: '👩',
    bio: 'Professora | Militante há 10 anos',
  },
  joao: {
    id: 'bot-joao',
    name: 'João Santos',
    email: 'joao@militante.com',
    avatar: '👨',
    bio: 'Comerciante | Zona Norte',
  },
  pedro: {
    id: 'bot-pedro',
    name: 'Pedro Costa',
    email: 'pedro@militante.com',
    avatar: '🧔',
    bio: 'Motorista de ônibus | Luta por transporte digno',
  },
  ana: {
    id: 'bot-ana',
    name: 'Ana Paula',
    email: 'ana@militante.com',
    avatar: '👩‍⚕️',
    bio: 'Enfermeira | Saúde é prioridade!',
  },
  carlos: {
    id: 'bot-carlos',
    name: 'Carlos Lima',
    email: 'carlos@militante.com',
    avatar: '👷',
    bio: 'Pedreiro | Trabalhador',
  },
};

// ============================================
// PROPOSTAS DO ANTUNES (Centro-Esquerda)
// ============================================

const PROPOSTAS_ANTUNES = [
  {
    title: '🏥 SAÚDE PARA TODOS - Nossa Prioridade!',
    content: `Caros companheiros e companheiras da militância!

A saúde é um direito FUNDAMENTAL de todo cidadão brasileiro, garantido pela Constituição. Por isso, minhas propostas para a saúde são:

✅ **Postos de Saúde Funcionando até 22h**
O trabalhador que sai às 18h não pode esperar até segunda-feira!

✅ **Mais Médicos Especialistas nos Bairros**
Cardiologista, pediatra, ginecologista PERTO de você!

✅ **Mutirões de Exames Todo Mês**
Chega de filas de meses para um simples exame!

✅ **Farmácia Popular Ampliada**
Remédios gratuitos para quem mais precisa!

✅ **UPA 24h com Equipamentos Funcionando**
Não é aceitável falta de médico ou equipamento quebrado!

A saúde pública de qualidade é possível. É uma questão de PRIORIDADE!

Juntos, vamos fazer acontecer! 💚
Vote 47 - Antunes do Rosário`,
    category: 'comunicados',
  },
  {
    title: '📚 EDUCAÇÃO: O Caminho para o Futuro',
    content: `Companheiras e companheiros!

Educação não é gasto, é INVESTIMENTO! Vamos transformar nossas escolas:

✅ **Ar Condicionado em TODAS as Escolas**
Nossos filhos merecem estudar com conforto!

✅ **Quadras Cobertas e Iluminadas**
Esporte e lazer para a juventude!

✅ **Mais Vagas em Creches**
Mãe trabalhadora precisa de creche!

✅ **Cursos Profissionalizantes Gratuitos**
Preparar nossos jovens para o mercado de trabalho!

✅ **Valorização dos Professores**
Salário digno e formação continuada!

✅ **Escolas de Tempo Integral**
Educação de qualidade e proteção para nossas crianças!

A educação transforma vidas e constrói futuro!

Vote 47 - Juntos por uma cidade que cuida! 💚`,
    category: 'comunicados',
  },
  {
    title: '🚌 TRANSPORTE DIGNO É DIREITO!',
    content: `Militância querida!

O transporte público de qualidade é essencial para a vida do trabalhador:

✅ **Mais Linhas de Ônibus nos Bairros**
Chega de esperar 1 hora no ponto!

✅ **Tarifa Social para Desempregados**
Quem está procurando emprego não pode pagar passagem cara!

✅ **Integração Temporal**
Pagar uma vez e usar várias linhas em 2 horas!

✅ **Ônibus com Ar Condicionado**
Dignidade no transporte!

✅ **Ciclovias Seguras e Conectadas**
Mobilidade sustentável!

✅ **Abrigos nos Pontos com Cobertura**
Proteção contra sol e chuva!

O trabalhador não pode gastar 4 horas por dia no trânsito!

Mobilidade é qualidade de vida! Vote 47! 💚`,
    category: 'comunicados',
  },
  {
    title: '🛡️ SEGURANÇA: Prevenção e Presença',
    content: `Amigos e amigas!

Segurança se faz com políticas públicas inteligentes:

✅ **Iluminação Pública em TODOS os Bairros**
Rua iluminada é rua segura!

✅ **Ronda 24h nos Bairros**
Guarda Municipal presente!

✅ **Câmeras nas Praças e Áreas Críticas**
Monitoramento inteligente!

✅ **Programas para Jovens**
Esporte, cultura e emprego para afastar da criminalidade!

✅ **Valorização dos Agentes de Segurança**
Equipamentos e capacitação!

✅ **Defensoria Pública Fortalecida**
Acesso à justiça para todos!

Segurança se faz com prevenção, presença e políticas sociais!

Vote 47 - Antunes do Rosário! 💚`,
    category: 'comunicados',
  },
  {
    title: '💼 EMPREGO E RENDA: Desenvolvimento para Todos',
    content: `Companheiras e companheiros trabalhadores!

Emprego e renda são fundamentais para a dignidade:

✅ **Banco de Empregos Municipal Ativo**
Conexão entre trabalhador e empresas!

✅ **Apoio a Micro e Pequenas Empresas**
Menos burocracia, mais facilidade!

✅ **Feiras de Economia Solidária**
Espaço para o pequeno empreendedor!

✅ **Cursos de Qualificação Gratuitos**
Preparar para as novas profissões!

✅ **Incentivo ao Comércio Local**
Compre do seu vizinho!

✅ **Crédito Popular**
Microcrédito para quem quer começar!

Desenvolvimento econômico com inclusão social!

Juntos somos mais fortes! Vote 47! 💚`,
    category: 'comunicados',
  },
];

// ============================================
// POSTAGENS DOS MILITANTES
// ============================================

const POSTAGENS_MILITANTES = [
  { bot: 'maria', title: 'Carreata foi um sucesso! 🚗', content: 'Que energia incrível na carreata de sábado! O povo quer mudança e está junto com o 47! Vamos até a vitória!', category: 'eventos' },
  { bot: 'joao', title: 'Reunião no bairro confirmada!', content: 'Pessoal da Zona Norte, reunião com o Antunes TERÇA às 19h no salão da igreja. Tragam vizinhos!', category: 'eventos' },
  { bot: 'pedro', title: 'Ideia: Panfletagem na feira', content: 'Galera, e se fizéssemos panfletagem na feira do Centro nas quartas? Muita gente passa por lá!', category: 'ideias' },
  { bot: 'ana', title: 'Obrigada pelo apoio na UPA!', content: 'Trabalho na UPA e sei que precisamos de mais investimento. Antunes conhece nossa realidade! Obrigada pelo apoio!', category: 'geral' },
  { bot: 'carlos', title: 'O 47 conhece a periferia!', content: 'Diferente de outros candidatos, Antunes JÁ VEIO no nosso bairro várias vezes. Conhece nossos problemas de verdade!', category: 'geral' },
  { bot: 'maria', title: 'Material de campanha disponível', content: 'Quem precisar de santinhos e adesivos, o comitê tem! Passem lá de segunda a sábado das 9h às 18h.', category: 'comunicados' },
  { bot: 'joao', title: 'Debate na Câmara - Vamos assistir!', content: 'Quinta tem debate na Câmara Municipal às 20h! Vamos fazer presença e apoiar nosso candidato!', category: 'eventos' },
  { bot: 'pedro', title: 'Proposta de transporte é excelente!', content: 'Li as propostas de transporte do Antunes e cara, é exatamente o que a gente precisa! Integração temporal vai mudar a vida de muita gente!', category: 'ideias' },
  { bot: 'ana', title: 'Mutirão de saúde', content: 'Vamos propor um mutirão de saúde após as eleições! Antunes já se comprometeu a implementar!', category: 'ideias' },
  { bot: 'carlos', title: 'História de superação', content: 'Meu pai era pedreiro como eu. Nunca tivemos um candidato que realmente entendesse a vida do trabalhador. Até agora! Vote 47!', category: 'geral' },
];

// ============================================
// COMENTÁRIOS PADRÃO
// ============================================

const COMENTARIOS = {
  antunes: [
    'Obrigado pelo apoio! Juntos vamos transformar nossa cidade! 💚',
    'Excelente ponto! Vou incluir isso nas discussões com a equipe.',
    'É isso mesmo! A mudança começa com cada um de nós!',
    'Conto com vocês nessa caminhada! Vote 47!',
    'Muito importante essa discussão. Obrigado por levantar esse tema!',
    'Nosso compromisso é com o povo. Vamos fazer acontecer!',
    'A força da militância é o que nos move! Continuem assim!',
    'Vocês são a razão da nossa luta! Obrigado pela confiança!',
  ],
  militantes: [
    'Concordo totalmente! 💚',
    'É isso aí! Vote 47!',
    'Excelente ponto!',
    'Precisamos de mais gente assim!',
    'Vamos juntos!',
    'A mudança vem! 🗳️',
    'Tô junto! 47!',
    'Isso mesmo!',
    'Show de bola!',
    'Apoiado! 👏',
  ],
};

// ============================================
// FUNÇÕES DO SISTEMA DE BOTS
// ============================================

/**
 * Inicializa os bots no banco de dados
 */
async function initBots() {
  console.log('🤖 Inicializando bots...');
  
  for (const [key, bot] of Object.entries(BOTS)) {
    try {
      // Verificar se bot já existe
      const existing = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [bot.email]
      );
      
      if (existing.rows.length === 0) {
        // Criar bot
        await pool.query(
          `INSERT INTO users (id, name, email, password_hash, avatar_url, bio, is_bot, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, true, NOW())`,
          [bot.id, bot.name, bot.email, 'bot-no-login', bot.avatar, bot.bio]
        );
        console.log(`✅ Bot criado: ${bot.name}`);
      } else {
        console.log(`ℹ️ Bot já existe: ${bot.name}`);
      }
    } catch (error) {
      // Se tabela não tem coluna is_bot, ignorar
      console.log(`⚠️ Erro ao criar bot ${bot.name}:`, error.message);
    }
  }
}

/**
 * Cria uma postagem de um bot
 */
async function createBotPost(botKey, title, content, category) {
  const bot = BOTS[botKey];
  if (!bot) return null;
  
  try {
    const result = await pool.query(
      `INSERT INTO posts (title, content, category, user_id, user_name, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id`,
      [title, content, category, bot.id, bot.name]
    );
    
    console.log(`📝 Post criado por ${bot.name}: ${title.substring(0, 30)}...`);
    return result.rows[0].id;
  } catch (error) {
    console.log(`⚠️ Erro ao criar post:`, error.message);
    return null;
  }
}

/**
 * Cria um comentário de um bot
 */
async function createBotComment(botKey, postId, content) {
  const bot = BOTS[botKey];
  if (!bot) return null;
  
  try {
    const result = await pool.query(
      `INSERT INTO comments (post_id, user_id, user_name, content, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id`,
      [postId, bot.id, bot.name, content]
    );
    
    console.log(`💬 Comentário de ${bot.name} no post ${postId}`);
    return result.rows[0].id;
  } catch (error) {
    console.log(`⚠️ Erro ao criar comentário:`, error.message);
    return null;
  }
}

/**
 * Antunes comenta em todos os posts
 */
async function antunesComentaTodos() {
  try {
    // Buscar todos os posts sem comentário do Antunes
    const posts = await pool.query(
      `SELECT p.id FROM posts p
       WHERE NOT EXISTS (
         SELECT 1 FROM comments c 
         WHERE c.post_id = p.id AND c.user_id = $1
       )`,
      [BOTS.antunes.id]
    );
    
    for (const post of posts.rows) {
      const comentario = COMENTARIOS.antunes[Math.floor(Math.random() * COMENTARIOS.antunes.length)];
      await createBotComment('antunes', post.id, comentario);
      
      // Delay para não parecer spam
      await new Promise(r => setTimeout(r, 500));
    }
    
    console.log(`🎯 Antunes comentou em ${posts.rows.length} posts`);
  } catch (error) {
    console.log('⚠️ Erro ao Antunes comentar:', error.message);
  }
}

/**
 * Executa atividade diária dos bots
 */
async function dailyBotActivity() {
  console.log('\n🤖 ====== ATIVIDADE DIÁRIA DOS BOTS ======\n');
  
  // 1. Verificar se Antunes já postou proposta hoje
  const hoje = new Date().toISOString().split('T')[0];
  
  try {
    const postHoje = await pool.query(
      `SELECT id FROM posts 
       WHERE user_id = $1 AND DATE(created_at) = $2`,
      [BOTS.antunes.id, hoje]
    );
    
    if (postHoje.rows.length === 0) {
      // Antunes posta uma proposta
      const proposta = PROPOSTAS_ANTUNES[Math.floor(Math.random() * PROPOSTAS_ANTUNES.length)];
      await createBotPost('antunes', proposta.title, proposta.content, proposta.category);
    }
    
    // 2. Militantes postam aleatoriamente (1-3 posts)
    const numPosts = Math.floor(Math.random() * 3) + 1;
    const postagens = [...POSTAGENS_MILITANTES].sort(() => Math.random() - 0.5).slice(0, numPosts);
    
    for (const p of postagens) {
      await createBotPost(p.bot, p.title, p.content, p.category);
      await new Promise(r => setTimeout(r, 1000));
    }
    
    // 3. Antunes comenta em todos os posts novos
    await antunesComentaTodos();
    
    // 4. Militantes comentam aleatoriamente
    const allPosts = await pool.query('SELECT id FROM posts ORDER BY created_at DESC LIMIT 20');
    
    for (const post of allPosts.rows.slice(0, 5)) {
      const botKeys = Object.keys(BOTS).filter(k => k !== 'antunes');
      const randomBot = botKeys[Math.floor(Math.random() * botKeys.length)];
      const comentario = COMENTARIOS.militantes[Math.floor(Math.random() * COMENTARIOS.militantes.length)];
      
      await createBotComment(randomBot, post.id, comentario);
      await new Promise(r => setTimeout(r, 500));
    }
    
    console.log('\n✅ Atividade diária dos bots concluída!\n');
  } catch (error) {
    console.log('⚠️ Erro na atividade diária:', error.message);
  }
}

/**
 * Popula o banco com conteúdo inicial
 */
async function seedInitialContent() {
  console.log('\n🌱 ====== POPULANDO CONTEÚDO INICIAL ======\n');
  
  // Criar todas as propostas do Antunes
  for (const proposta of PROPOSTAS_ANTUNES) {
    await createBotPost('antunes', proposta.title, proposta.content, proposta.category);
    await new Promise(r => setTimeout(r, 500));
  }
  
  // Criar postagens dos militantes
  for (const p of POSTAGENS_MILITANTES) {
    await createBotPost(p.bot, p.title, p.content, p.category);
    await new Promise(r => setTimeout(r, 500));
  }
  
  // Antunes comenta em tudo
  await antunesComentaTodos();
  
  // Militantes comentam
  const allPosts = await pool.query('SELECT id FROM posts');
  for (const post of allPosts.rows) {
    // 2-4 comentários por post
    const numComments = Math.floor(Math.random() * 3) + 2;
    const botKeys = Object.keys(BOTS).filter(k => k !== 'antunes');
    
    for (let i = 0; i < numComments; i++) {
      const randomBot = botKeys[Math.floor(Math.random() * botKeys.length)];
      const comentario = COMENTARIOS.militantes[Math.floor(Math.random() * COMENTARIOS.militantes.length)];
      await createBotComment(randomBot, post.id, comentario);
    }
  }
  
  console.log('\n✅ Conteúdo inicial populado!\n');
}

module.exports = {
  BOTS,
  initBots,
  createBotPost,
  createBotComment,
  antunesComentaTodos,
  dailyBotActivity,
  seedInitialContent,
};
