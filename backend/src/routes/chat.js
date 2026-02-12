const express = require('express');
const router = express.Router();
const githubKnowledge = require('../services/github-knowledge');

// Tenta carregar AI Chat se disponível
let aiChat = null;
try {
  aiChat = require('../services/ai-chat');
} catch (e) {
  console.log('AI Chat service not loaded');
}

// Base de conhecimento completa do candidato
const CONHECIMENTO = {
  candidato: {
    nome: 'Antunes do Rosário',
    numero: '47',
    cargo: 'Vereador',
    partido: 'Partido da causa popular',
    slogan: 'Por um futuro melhor para todos!',
    historia: `Antunes do Rosário é um líder comunitário nascido e criado em nossa cidade. 
    Com mais de 15 anos de experiência como professor da rede pública, ele conhece de perto 
    os desafios enfrentados pela população. Sua trajetória é marcada pela luta por direitos 
    e pela defesa incansável das causas populares.`,
    experiencia: [
      'Professor da rede pública por 15 anos',
      'Presidente da Associação de Moradores do Bairro Centro',
      'Conselheiro Municipal de Educação',
      'Coordenador de projetos sociais na comunidade'
    ],
    valores: [
      'Transparência e honestidade',
      'Compromisso com a comunidade',
      'Defesa da educação pública',
      'Inclusão social',
      'Desenvolvimento sustentável'
    ]
  },
  propostas: {
    saude: {
      titulo: 'Saúde de Qualidade para Todos',
      resumo: 'Ampliar o acesso à saúde com mais profissionais e melhor infraestrutura.',
      itens: [
        'Postos de saúde até 22h',
        'Mais médicos especialistas',
        'UPA 24h funcionando de verdade',
        'CAPS fortalecido para saúde mental',
        'Farmácia Popular ampliada'
      ]
    },
    educacao: {
      titulo: 'Educação Transformadora',
      resumo: 'Investir na educação como ferramenta de transformação social.',
      itens: [
        'Ar condicionado em todas as salas de aula',
        'Valorização do professor com plano de carreira',
        'Creches para todos os bairros',
        'Cursos profissionalizantes gratuitos',
        'Internet de qualidade nas escolas'
      ]
    },
    transporte: {
      titulo: 'Mobilidade para Todos',
      resumo: 'Melhorar o transporte público para facilitar a vida da população.',
      itens: [
        'Mais linhas de ônibus à noite e fim de semana',
        'Tarifa social para desempregados',
        'Integração temporal de 3 horas',
        'Ciclovias conectando a cidade',
        'Abrigos de ônibus com cobertura'
      ]
    },
    seguranca: {
      titulo: 'Segurança e Proteção',
      resumo: 'Atuar na prevenção e proteção da comunidade.',
      itens: [
        'Iluminação pública LED em todas as ruas',
        'Câmeras de segurança nos pontos críticos',
        'Ronda 24h da Guarda Municipal',
        'Botão de pânico nos pontos de ônibus'
      ]
    },
    emprego: {
      titulo: 'Trabalho e Renda',
      resumo: 'Fomentar a economia local e criar oportunidades.',
      itens: [
        'Apoio ao MEI - menos burocracia',
        'Cursos de capacitação gratuitos',
        'Feiras de emprego mensais',
        'Microcrédito para pequenos negócios'
      ]
    },
    meioAmbiente: {
      titulo: 'Cidade Verde',
      resumo: 'Desenvolvimento sustentável e qualidade de vida.',
      itens: [
        'Mais praças e áreas verdes',
        'Coleta seletiva em todos os bairros',
        'Proteção dos rios e nascentes',
        'Hortas comunitárias'
      ]
    }
  },
  eventos: [
    { nome: 'Grande Carreata', data: 'Sábado, 14h', local: 'Saída da Praça Central' },
    { nome: 'Reunião com Moradores', data: 'Terça-feira, 19h', local: 'Comitê de Campanha' },
    { nome: 'Debate entre Candidatos', data: 'Quinta-feira, 20h', local: 'Câmara Municipal' }
  ],
  contato: {
    whatsapp: '(31) 99999-9999',
    email: 'contato@rosario47.com.br',
    endereco: 'Rua Principal, 123 - Centro',
    instagram: '@rosario47'
  }
};

// Palavras-chave para fallback
const KEYWORDS = {
  candidato: ['antunes', 'rosário', 'rosario', 'candidato', 'quem é', 'quem e', 'história', 'historia'],
  numero: ['número', 'numero', 'votar', 'voto', '47', 'urna'],
  saude: ['saúde', 'saude', 'médico', 'medico', 'hospital', 'posto', 'upa'],
  educacao: ['educação', 'educacao', 'escola', 'professor', 'creche'],
  transporte: ['transporte', 'ônibus', 'onibus', 'tarifa', 'passagem'],
  seguranca: ['segurança', 'seguranca', 'policia', 'polícia', 'iluminação'],
  emprego: ['emprego', 'trabalho', 'desemprego', 'mei'],
  propostas: ['proposta', 'plano', 'projeto', 'vai fazer'],
  eventos: ['evento', 'carreata', 'reunião', 'debate', 'agenda'],
  contato: ['contato', 'telefone', 'whatsapp', 'comitê'],
  saudacao: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite'],
  agradecimento: ['obrigado', 'obrigada', 'valeu']
};

function detectarIntencoes(texto) {
  const textoLower = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const intencoes = [];
  
  for (const [intencao, palavras] of Object.entries(KEYWORDS)) {
    for (const palavra of palavras) {
      const palavraNorm = palavra.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (textoLower.includes(palavraNorm)) {
        if (!intencoes.includes(intencao)) {
          intencoes.push(intencao);
        }
      }
    }
  }
  
  return intencoes.length > 0 ? intencoes : ['geral'];
}

function gerarRespostaFallback(intencoes, texto) {
  const respostas = [];
  
  for (const intencao of intencoes.slice(0, 2)) {
    switch (intencao) {
      case 'saudacao':
        respostas.push(`Olá! 👋 Sou Antunes do Rosário, candidato a vereador pelo **47**!\n\nEstou aqui para conversar sobre minhas propostas e ouvir você.\n\nSobre o que gostaria de saber?`);
        break;
        
      case 'candidato':
        respostas.push(`Sou **Antunes do Rosário**, candidato pelo **47**! 👨‍🏫\n\n${CONHECIMENTO.candidato.historia}\n\n**Minha experiência:**\n${CONHECIMENTO.candidato.experiencia.map(e => `• ${e}`).join('\n')}\n\n💚 Vote 47!`);
        break;
        
      case 'numero':
        respostas.push(`🗳️ **Meu número é 47!**\n\nNa urna: 4️⃣7️⃣ ✅\n\n**Antunes do Rosário - 47**\n\nConta comigo que eu conto com você! 💚`);
        break;
        
      case 'saude':
        const s = CONHECIMENTO.propostas.saude;
        respostas.push(`🏥 **${s.titulo}**\n\n${s.resumo}\n\n**Minhas propostas:**\n${s.itens.map(i => `✅ ${i}`).join('\n')}\n\nQuem trabalha o dia todo merece atendimento à noite! 💚`);
        break;
        
      case 'educacao':
        const e = CONHECIMENTO.propostas.educacao;
        respostas.push(`📚 **${e.titulo}**\n\nFui professor por 15 anos, sei o que a escola precisa!\n\n**Minhas propostas:**\n${e.itens.map(i => `✅ ${i}`).join('\n')}\n\n💚`);
        break;
        
      case 'transporte':
        const t = CONHECIMENTO.propostas.transporte;
        respostas.push(`🚌 **${t.titulo}**\n\n${t.resumo}\n\n**Minhas propostas:**\n${t.itens.map(i => `✅ ${i}`).join('\n')}\n\n💚`);
        break;
        
      case 'seguranca':
        const seg = CONHECIMENTO.propostas.seguranca;
        respostas.push(`🛡️ **${seg.titulo}**\n\n${seg.resumo}\n\n**Minhas propostas:**\n${seg.itens.map(i => `✅ ${i}`).join('\n')}\n\n💚`);
        break;
        
      case 'emprego':
        const emp = CONHECIMENTO.propostas.emprego;
        respostas.push(`💼 **${emp.titulo}**\n\n${emp.resumo}\n\n**Minhas propostas:**\n${emp.itens.map(i => `✅ ${i}`).join('\n')}\n\n💚`);
        break;
        
      case 'propostas':
        respostas.push(`📋 **Minhas principais bandeiras:**\n\n🏥 **Saúde** - Postos até 22h, UPA 24h\n📚 **Educação** - Escolas com estrutura\n🚌 **Transporte** - Mais ônibus, tarifa social\n🛡️ **Segurança** - Luz e câmeras\n💼 **Emprego** - Apoio ao trabalhador\n🌳 **Meio ambiente** - Cidade verde\n\nPergunta sobre qualquer uma! 💚`);
        break;
        
      case 'eventos':
        const eventosTexto = CONHECIMENTO.eventos.map(ev => 
          `📅 **${ev.nome}** - ${ev.data}\n   📍 ${ev.local}`
        ).join('\n\n');
        respostas.push(`🗓️ **Agenda da Campanha**\n\n${eventosTexto}\n\nVenha participar! 💚`);
        break;
        
      case 'contato':
        respostas.push(`📞 **Fale Comigo!**\n\n📱 WhatsApp: ${CONHECIMENTO.contato.whatsapp}\n📍 Comitê: ${CONHECIMENTO.contato.endereco}\n📸 Instagram: ${CONHECIMENTO.contato.instagram}\n\nEstou sempre pronto para ouvir você! 💚`);
        break;
        
      case 'agradecimento':
        respostas.push(`😊 Eu que agradeço!\n\nLembra: meu número é **47**!\n\nTem mais alguma dúvida? 💚`);
        break;
        
      default:
        // Busca no conhecimento dinâmico
        const dynamicResults = githubKnowledge.searchDynamicKnowledge(texto);
        if (dynamicResults.length > 0 && dynamicResults[0].relevancia > 0.5) {
          const result = dynamicResults[0];
          respostas.push(`📄 ${result.trecho || result.conteudoCompleto?.substring(0, 500)}`);
        } else {
          respostas.push(`Posso te ajudar com:\n\n• **Propostas** - saúde, educação, transporte...\n• **Quem sou eu** - minha história\n• **Como votar** - número 47\n• **Eventos** - agenda da campanha\n\nÉ só perguntar! 💚`);
        }
        break;
    }
  }
  
  return respostas.join('\n\n---\n\n');
}

// POST /api/chat - Processo de chat
router.post('/', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }
    
    // Se AI está configurado e disponível, usa ele
    if (aiChat && process.env.AI_API_KEY) {
      try {
        const resposta = await aiChat.chat(message, sessionId || 'default');
        return res.json({
          response: resposta,
          mode: 'ai'
        });
      } catch (aiError) {
        console.error('AI error, falling back:', aiError.message);
        // Fallback para modo tradicional
      }
    }
    
    // Fallback: modo tradicional com keywords
    const intencoes = detectarIntencoes(message);
    const resposta = gerarRespostaFallback(intencoes, message);
    
    res.json({
      response: resposta,
      intencoes: intencoes,
      mode: 'fallback'
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Erro ao processar mensagem' });
  }
});

// GET /api/chat/conhecimento - Retorna base de conhecimento
router.get('/conhecimento', (req, res) => {
  res.json(CONHECIMENTO);
});

// GET /api/chat/status - Status do chat (AI ou fallback)
router.get('/status', (req, res) => {
  res.json({
    aiEnabled: !!(aiChat && process.env.AI_API_KEY),
    provider: process.env.AI_PROVIDER || 'none',
    model: process.env.AI_MODEL || 'none'
  });
});

module.exports = router;
