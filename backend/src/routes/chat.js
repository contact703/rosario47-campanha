const express = require('express');
const router = express.Router();
const githubKnowledge = require('../services/github-knowledge');

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
    e pela defesa incansável das causas populares. Agora, candidato a vereador pelo número 47, 
    Antunes quer levar essa experiência e dedicação para a Câmara Municipal, trabalhando 
    por políticas públicas que realmente transformem a vida das pessoas.`,
    experiencia: [
      'Professor da rede pública por 15 anos',
      'Presidente da Associação de Moradores do Bairro Centro',
      'Conselheiro Municipal de Educação',
      'Coordenador de projetos sociais na comunidade',
      'Fundador do projeto "Educação para Todos"'
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
      resumo: 'Ampliar o acesso à saúde com mais profissionais, melhor infraestrutura e atendimento humanizado.',
      itens: [
        'Ampliar o horário de funcionamento dos postos de saúde até 22h',
        'Contratar mais médicos especialistas: cardiologia, ortopedia, pediatria e ginecologia',
        'Garantir funcionamento 24h das UPAs com equipe completa',
        'Realizar mutirões mensais de exames preventivos',
        'Fortalecer o CAPS para atendimento em saúde mental',
        'Ampliar o programa Farmácia Popular com mais medicamentos',
        'Implementar programa de saúde da família em todos os bairros',
        'Criar central de marcação de consultas online'
      ]
    },
    educacao: {
      titulo: 'Educação Transformadora',
      resumo: 'Investir na educação como ferramenta de transformação social e desenvolvimento.',
      itens: [
        'Instalar ar condicionado em todas as salas de aula',
        'Construir quadras esportivas cobertas nas escolas',
        'Valorizar os professores com plano de carreira justo',
        'Ampliar vagas em creches públicas',
        'Oferecer cursos profissionalizantes gratuitos para jovens',
        'Distribuir tablets para alunos da rede municipal',
        'Implementar programa de reforço escolar no contraturno',
        'Criar bibliotecas comunitárias nos bairros'
      ]
    },
    transporte: {
      titulo: 'Mobilidade para Todos',
      resumo: 'Melhorar o transporte público para facilitar a vida da população.',
      itens: [
        'Criar mais linhas de ônibus para os bairros periféricos',
        'Implementar tarifa social para desempregados e estudantes',
        'Construir abrigos de ônibus com banco e cobertura em todas as paradas',
        'Expandir a rede de ciclovias conectando os bairros',
        'Garantir transporte escolar gratuito para todos os estudantes',
        'Melhorar a iluminação nos pontos de ônibus',
        'Fiscalizar a qualidade dos veículos do transporte público'
      ]
    },
    seguranca: {
      titulo: 'Segurança e Proteção',
      resumo: 'Atuar na prevenção e proteção da comunidade em parceria com as forças de segurança.',
      itens: [
        'Garantir iluminação pública em todas as ruas da cidade',
        'Implementar ronda municipal em todos os bairros',
        'Instalar câmeras de segurança nas praças e áreas públicas',
        'Fortalecer a Guarda Municipal com funcionamento 24h',
        'Criar parceria com a polícia para patrulhamento ostensivo',
        'Implementar programa Vizinhança Solidária',
        'Revitalizar praças e áreas abandonadas'
      ]
    },
    emprego: {
      titulo: 'Trabalho e Renda',
      resumo: 'Fomentar a economia local e criar oportunidades de trabalho.',
      itens: [
        'Incentivar pequenos negócios e empreendedores locais',
        'Realizar Feira do Empreendedor mensalmente',
        'Oferecer cursos de capacitação profissional gratuitos',
        'Criar Banco de Empregos Municipal online',
        'Facilitar microcrédito para MEIs',
        'Apoiar cooperativas e economia solidária',
        'Promover parcerias com empresas para primeiro emprego'
      ]
    },
    cultura: {
      titulo: 'Cultura Viva',
      resumo: 'Valorizar a cultura local e ampliar o acesso às atividades culturais.',
      itens: [
        'Criar centros culturais em cada região da cidade',
        'Apoiar artistas locais com editais e incentivos',
        'Realizar Festival Cultural anual',
        'Manter bibliotecas públicas funcionando aos sábados',
        'Criar espaços para shows e eventos gratuitos',
        'Implementar programa de oficinas culturais nas escolas',
        'Preservar o patrimônio histórico da cidade'
      ]
    }
  },
  eventos: [
    { nome: 'Grande Carreata', data: 'Sábado, 14h', local: 'Saída da Praça Central', descricao: 'Carreata com trio elétrico percorrendo todos os bairros!' },
    { nome: 'Reunião com Moradores', data: 'Terça-feira, 19h', local: 'Comitê de Campanha', descricao: 'Venha conversar diretamente com Antunes sobre suas demandas.' },
    { nome: 'Panfletagem', data: 'Quarta-feira, 8h', local: 'Feira do Centro', descricao: 'Distribuição de material e conversa com a população.' },
    { nome: 'Debate entre Candidatos', data: 'Quinta-feira, 20h', local: 'Câmara Municipal', descricao: 'Acompanhe o debate e conheça as propostas de cada candidato.' },
    { nome: 'Comício Final', data: 'Sexta-feira, 18h', local: 'Praça da Matriz', descricao: 'Grande comício de encerramento da campanha!' }
  ],
  contato: {
    whatsapp: '(31) 99999-9999',
    email: 'contato@rosario47.com.br',
    endereco: 'Rua Principal, 123 - Centro',
    instagram: '@rosario47',
    facebook: '/rosario47',
    site: 'www.rosario47.com.br'
  },
  faq: [
    { pergunta: 'Qual o número do Antunes?', resposta: 'O número do Antunes do Rosário na urna é 47!' },
    { pergunta: 'Como posso ajudar na campanha?', resposta: 'Você pode ajudar de várias formas: participando dos eventos, divulgando nas redes sociais, conversando com amigos e familiares, ou se voluntariando no comitê!' },
    { pergunta: 'Onde fica o comitê?', resposta: 'Nosso comitê fica na Rua Principal, 123 - Centro. Estamos abertos todos os dias das 8h às 20h!' },
    { pergunta: 'Como entrar em contato?', resposta: 'Você pode nos contatar pelo WhatsApp (31) 99999-9999, email contato@rosario47.com.br ou visitar nosso comitê!' }
  ]
};

// Palavras-chave expandidas
const KEYWORDS = {
  candidato: ['antunes', 'rosário', 'rosario', 'candidato', 'quem é', 'quem e', 'história', 'historia', 'biografia', 'experiência', 'experiencia', 'trajetória', 'trajetoria', 'sobre ele', 'conheça', 'conheca'],
  numero: ['número', 'numero', 'votar', 'voto', '47', 'eleição', 'eleicao', 'urna', 'digitar', 'apertar'],
  saude: ['saúde', 'saude', 'médico', 'medico', 'hospital', 'posto', 'upa', 'doença', 'doente', 'remédio', 'remedio', 'farmácia', 'farmacia', 'caps', 'mental', 'consulta', 'exame', 'vacina'],
  educacao: ['educação', 'educacao', 'escola', 'professor', 'professora', 'aluno', 'aluna', 'creche', 'estudar', 'ensino', 'aula', 'tablet', 'quadra', 'merenda', 'biblioteca'],
  transporte: ['transporte', 'ônibus', 'onibus', 'tarifa', 'passagem', 'ciclovia', 'bicicleta', 'trânsito', 'transito', 'mobilidade', 'ponto de ônibus'],
  seguranca: ['segurança', 'seguranca', 'policia', 'polícia', 'roubo', 'assalto', 'iluminação', 'iluminacao', 'câmera', 'camera', 'guarda', 'violência', 'violencia', 'crime', 'medo'],
  emprego: ['emprego', 'trabalho', 'desemprego', 'negócio', 'negocio', 'empreendedor', 'mei', 'microcrédito', 'renda', 'salário', 'vaga', 'contratação'],
  cultura: ['cultura', 'cultural', 'arte', 'artista', 'show', 'música', 'musica', 'biblioteca', 'festival', 'teatro', 'cinema', 'evento cultural'],
  propostas: ['proposta', 'plano', 'projeto', 'vai fazer', 'pretende', 'promessa', 'ideia', 'ideias', 'plataforma', 'programa'],
  eventos: ['evento', 'carreata', 'reunião', 'reuniao', 'panfletagem', 'debate', 'encontro', 'quando', 'onde', 'comício', 'comicio', 'agenda'],
  contato: ['contato', 'telefone', 'whatsapp', 'zap', 'email', 'endereço', 'endereco', 'instagram', 'rede social', 'falar com', 'comitê', 'comite', 'localização'],
  ajuda: ['ajuda', 'ajudar', 'voluntário', 'voluntario', 'contribuir', 'participar', 'campanha', 'apoiar', 'como posso'],
  saudacao: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'eae', 'eai', 'opa', 'hey', 'ei', 'oie', 'hello'],
  agradecimento: ['obrigado', 'obrigada', 'valeu', 'thanks', 'brigado', 'vlw', 'agradeço']
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

function gerarResposta(intencoes, texto) {
  const respostas = [];
  const textoLower = texto.toLowerCase();
  
  for (const intencao of intencoes.slice(0, 2)) { // Max 2 intenções
    switch (intencao) {
      case 'saudacao':
        respostas.push(`Olá! 👋 Bem-vindo ao canal oficial do ${CONHECIMENTO.candidato.nome} ${CONHECIMENTO.candidato.numero}!\n\nEstou aqui para te ajudar a conhecer melhor nosso candidato e suas propostas.\n\nSobre o que você gostaria de saber?\n• Propostas\n• Eventos\n• Como ajudar\n• Contato`);
        break;
        
      case 'candidato':
        respostas.push(`📋 **${CONHECIMENTO.candidato.nome}** - Candidato a ${CONHECIMENTO.candidato.cargo}\n\n${CONHECIMENTO.candidato.historia}\n\n**Experiência:**\n${CONHECIMENTO.candidato.experiencia.map(e => `• ${e}`).join('\n')}\n\n🗳️ Vote ${CONHECIMENTO.candidato.numero}!`);
        break;
        
      case 'numero':
        respostas.push(`🗳️ **VOTE ${CONHECIMENTO.candidato.numero}!**\n\nO número do ${CONHECIMENTO.candidato.nome} na urna é **${CONHECIMENTO.candidato.numero}**.\n\nNo dia da eleição:\n1. Digite ${CONHECIMENTO.candidato.numero}\n2. Confira a foto\n3. Aperte CONFIRMA\n\n💚 Juntos por um futuro melhor!`);
        break;
        
      case 'saude':
        const s = CONHECIMENTO.propostas.saude;
        respostas.push(`🏥 **${s.titulo}**\n\n${s.resumo}\n\n**Propostas:**\n${s.itens.map(i => `• ${i}`).join('\n')}\n\n${CONHECIMENTO.candidato.nome} sabe que saúde é prioridade absoluta!`);
        break;
        
      case 'educacao':
        const e = CONHECIMENTO.propostas.educacao;
        respostas.push(`📚 **${e.titulo}**\n\n${e.resumo}\n\n**Propostas:**\n${e.itens.map(i => `• ${i}`).join('\n')}\n\nComo ex-professor, ${CONHECIMENTO.candidato.nome} conhece de perto os desafios da educação!`);
        break;
        
      case 'transporte':
        const t = CONHECIMENTO.propostas.transporte;
        respostas.push(`🚌 **${t.titulo}**\n\n${t.resumo}\n\n**Propostas:**\n${t.itens.map(i => `• ${i}`).join('\n')}`);
        break;
        
      case 'seguranca':
        const seg = CONHECIMENTO.propostas.seguranca;
        respostas.push(`🛡️ **${seg.titulo}**\n\n${seg.resumo}\n\n**Propostas:**\n${seg.itens.map(i => `• ${i}`).join('\n')}`);
        break;
        
      case 'emprego':
        const emp = CONHECIMENTO.propostas.emprego;
        respostas.push(`💼 **${emp.titulo}**\n\n${emp.resumo}\n\n**Propostas:**\n${emp.itens.map(i => `• ${i}`).join('\n')}`);
        break;
        
      case 'cultura':
        const c = CONHECIMENTO.propostas.cultura;
        respostas.push(`🎭 **${c.titulo}**\n\n${c.resumo}\n\n**Propostas:**\n${c.itens.map(i => `• ${i}`).join('\n')}`);
        break;
        
      case 'propostas':
        respostas.push(`📋 **Áreas de Atuação de ${CONHECIMENTO.candidato.nome}:**\n\n🏥 **Saúde** - ${CONHECIMENTO.propostas.saude.resumo}\n\n📚 **Educação** - ${CONHECIMENTO.propostas.educacao.resumo}\n\n🚌 **Transporte** - ${CONHECIMENTO.propostas.transporte.resumo}\n\n🛡️ **Segurança** - ${CONHECIMENTO.propostas.seguranca.resumo}\n\n💼 **Emprego** - ${CONHECIMENTO.propostas.emprego.resumo}\n\n🎭 **Cultura** - ${CONHECIMENTO.propostas.cultura.resumo}\n\nDigite o nome da área para saber mais detalhes!`);
        break;
        
      case 'eventos':
        const eventosTexto = CONHECIMENTO.eventos.map(ev => 
          `📅 **${ev.nome}**\n   📍 ${ev.local}\n   🕐 ${ev.data}\n   ${ev.descricao}`
        ).join('\n\n');
        respostas.push(`🗓️ **Agenda da Campanha**\n\n${eventosTexto}\n\nVenha participar e conhecer ${CONHECIMENTO.candidato.nome} pessoalmente!`);
        break;
        
      case 'contato':
        respostas.push(`📞 **Fale Conosco!**\n\n📱 WhatsApp: ${CONHECIMENTO.contato.whatsapp}\n📧 Email: ${CONHECIMENTO.contato.email}\n📍 Comitê: ${CONHECIMENTO.contato.endereco}\n📸 Instagram: ${CONHECIMENTO.contato.instagram}\n📘 Facebook: ${CONHECIMENTO.contato.facebook}\n\nEstamos sempre prontos para ouvir você!`);
        break;
        
      case 'ajuda':
        respostas.push(`🤝 **Como você pode ajudar a campanha:**\n\n✅ **Participe dos eventos** - Carreatas, reuniões, comícios\n✅ **Divulgue nas redes sociais** - Compartilhe nossos conteúdos\n✅ **Converse com amigos e família** - Fale sobre as propostas\n✅ **Seja voluntário** - Venha ao comitê e se cadastre\n✅ **Use os materiais** - Adesivos, santinhos, bandeiras\n\nCada ajuda faz a diferença! 💚\n\nComitê: ${CONHECIMENTO.contato.endereco}`);
        break;
        
      case 'agradecimento':
        respostas.push(`😊 Disponha! Estamos aqui para ajudar.\n\nLembre-se: ${CONHECIMENTO.candidato.nome} é **${CONHECIMENTO.candidato.numero}**!\n\n"${CONHECIMENTO.candidato.slogan}"\n\nTem mais alguma dúvida?`);
        break;
        
      default:
        // Tenta encontrar resposta no FAQ
        const faqMatch = CONHECIMENTO.faq.find(f => 
          textoLower.includes(f.pergunta.toLowerCase().substring(0, 10))
        );
        if (faqMatch) {
          respostas.push(faqMatch.resposta);
        } else {
          // Busca no conhecimento dinâmico do GitHub
          const dynamicResults = githubKnowledge.searchDynamicKnowledge(texto);
          if (dynamicResults.length > 0 && dynamicResults[0].relevancia > 0.5) {
            const result = dynamicResults[0];
            if (result.conteudoCompleto) {
              respostas.push(`📄 **Informação sobre ${result.categoria.replace(/_/g, ' ')}:**\n\n${result.conteudoCompleto.substring(0, 800)}${result.conteudoCompleto.length > 800 ? '...' : ''}`);
            } else if (result.trecho) {
              respostas.push(`📄 **Encontrei isso sobre sua pergunta:**\n\n${result.trecho}`);
            }
          } else {
            respostas.push(`Posso te ajudar com informações sobre:\n\n• **Propostas** - Saúde, educação, transporte, segurança...\n• **Sobre o candidato** - História e experiência\n• **Eventos** - Agenda da campanha\n• **Contato** - Como falar conosco\n• **Como ajudar** - Formas de participar\n• **Número** - Como votar\n\nÉ só perguntar! 😊`);
          }
        }
        break;
    }
  }
  
  return respostas.join('\n\n---\n\n');
}

// POST /api/chat - Processo de chat
router.post('/', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }
    
    const intencoes = detectarIntencoes(message);
    const resposta = gerarResposta(intencoes, message);
    
    res.json({
      response: resposta,
      intencoes: intencoes
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

module.exports = router;
