// CHAT BOT - ANTUNES DO ROSÁRIO 47 (Versão Melhorada)

const PROPOSTAS = {
  saude: ['Postos de saúde até 22h', 'Mais médicos especialistas', 'UPA 24h funcionando de verdade', 'Farmácia popular ampliada', 'CAPS fortalecido para saúde mental', 'Telemedicina nos bairros distantes'],
  educacao: ['Ar condicionado em todas as escolas', 'Valorização do professor', 'Creches para todos os bairros', 'Cursos profissionalizantes gratuitos', 'Escola integral opcional', 'Internet nas escolas públicas'],
  transporte: ['Mais linhas de ônibus à noite e fim de semana', 'Tarifa social para desempregados', 'Ciclovias conectando a cidade', 'Abrigos de ônibus com cobertura e banco', 'Integração temporal de 3 horas'],
  seguranca: ['Iluminação pública LED', 'Câmeras de segurança nos pontos críticos', 'Ronda 24h da Guarda Municipal', 'Botão de pânico nos pontos de ônibus'],
  trabalho: ['Apoio ao MEI - menos burocracia', 'Cursos de capacitação gratuitos', 'Feiras de emprego mensais', 'Crédito popular para pequenos negócios', 'Incubadora de startups locais'],
  meioAmbiente: ['Mais praças e áreas verdes', 'Coleta seletiva em todos os bairros', 'Proteção dos rios e nascentes', 'Hortas comunitárias', 'Arborização urbana']
};

const RESPOSTAS = {
  saudacao: [
    `Olá! 👋 Sou Antunes do Rosário, candidato a vereador pelo **47**!\n\nTô aqui pra conversar, tirar dúvidas e ouvir você. O que quer saber?`,
    `E aí! 👋 Aqui é Antunes, candidato **47**!\n\nPode perguntar à vontade - sobre propostas, minha história, qualquer coisa!`,
    `Oi! 👋 Antunes do Rosário aqui, candidato pelo **47**!\n\nBom te ver por aqui! No que posso ajudar?`
  ],
  numero: [
    `🗳️ **Vote 47!**\n\nNa urna: digita 4️⃣7️⃣ e confirma! ✅\n\nSou **Antunes do Rosário**, número **47**.\n\nConta comigo que eu conto com você! 💚`,
    `O número é **47**! 🗳️\n\n4️⃣7️⃣ na urna, confirma, e tá feito!\n\nAntunes do Rosário - o candidato que veio do povo! 💚`,
    `**QUARENTA E SETE!** 4️⃣7️⃣ 🗳️\n\nAntunes do Rosário - 47\n\nGuarda esse número que a gente vai mudar essa cidade juntos! 💚`
  ],
  candidato: [
    `Sou **Antunes do Rosário**, candidato a vereador pelo **47**! 👨‍🏫\n\n• 15 anos como professor de escola pública\n• 20 anos de serviço público\n• Nasci e cresci aqui, conheço a realidade\n\nSou de centro-esquerda: acredito em justiça social com responsabilidade. Nada de promessa maluca - só o que dá pra cumprir! 💚`,
    `Prazer! Sou Antunes do Rosário, candidato **47**! 📖\n\nFui professor por 15 anos - dei aula pra muita gente que hoje tá formada, trabalhando, criando família.\n\nSei o que é chegar cedo na escola, lidar com falta de estrutura, ver aluno com fome...\n\nPor isso entrei na política: pra mudar isso de dentro! 💚`,
    `Me chamo Antunes do Rosário, número **47**! 🙋‍♂️\n\n20 anos de serviço público, 15 como professor.\n\nNão sou de extremos - sou do lado do trabalhador que acorda cedo, pega busão lotado, e merece serviço público de qualidade!\n\nVem comigo? 💚`
  ],
  propostas: [
    `Minhas principais bandeiras: 📋\n\n🏥 **SAÚDE** - Posto aberto até 22h, UPA funcionando\n📚 **EDUCAÇÃO** - Ar condicionado nas escolas, valorizar professor\n🚌 **TRANSPORTE** - Mais ônibus à noite, tarifa social\n🛡️ **SEGURANÇA** - Luz nos bairros, câmeras, ronda\n💼 **EMPREGO** - Apoio ao MEI, cursos gratuitos\n\nQual área te interessa mais? Posso detalhar! 💚`,
    `Tenho propostas concretas pra: 📋\n\n• Saúde que funciona de noite\n• Escola com estrutura\n• Transporte digno\n• Segurança de verdade\n• Emprego e renda\n• Meio ambiente\n\nPergunta sobre qualquer uma delas! 💚`,
    `Meu plano tem 6 eixos: 📋\n\n1️⃣ Saúde - posto até 22h\n2️⃣ Educação - escola de qualidade\n3️⃣ Transporte - tarifa justa\n4️⃣ Segurança - luz e câmera\n5️⃣ Trabalho - apoio ao pequeno\n6️⃣ Meio ambiente - cidade verde\n\nQuer saber mais de algum? 💚`
  ],
  saude: [
    `Saúde é minha prioridade! 🏥\n\n✅ Postos de saúde abertos até 22h\n✅ Mais médicos especialistas\n✅ UPA funcionando de verdade (não só triagem!)\n✅ Farmácia popular ampliada\n✅ Saúde mental: CAPS fortalecido\n\nQuem trabalha o dia todo merece atendimento à noite! 💚`,
    `Deixa eu te contar minha revolta: 🏥\n\nO cara trabalha o dia todo, passa mal, e o posto fecha 17h. Aí vai pra UPA e fica 6 horas esperando!\n\nMinha proposta:\n• Posto até 22h\n• UPA com médico de verdade\n• Especialista sem fila de 6 meses\n\nIsso não é luxo, é o mínimo! 💚`,
    `Na saúde, meu compromisso: 🏥\n\n1. Posto noturno - o trabalhador merece\n2. UPA que funciona - não só mede pressão\n3. Especialista acessível - sem esperar 1 ano\n4. Remédio disponível - farmácia popular real\n\nSaúde não é gasto, é investimento! 💚`
  ],
  educacao: [
    `Fui professor 15 anos, sei o que a escola precisa! 📚\n\n✅ Ar condicionado - criança não aprende passando calor\n✅ Valorização do professor - salário digno\n✅ Creche pra todo mundo - mãe precisa trabalhar\n✅ Cursos profissionalizantes - prepara pro emprego\n✅ Internet de qualidade nas escolas\n\nEducação transforma vidas! 💚`,
    `Como professor, vi de tudo: 📚\n\n• Sala sem ventilador\n• Aluno com fome\n• Professor desmotivado\n• Pai que não consegue creche\n\nMinha proposta ataca todos esses problemas!\n\nAr condicionado, merenda de qualidade, salário digno pro professor, creche em todo bairro.\n\nNão é sonho - é prioridade! 💚`,
    `Educação é minha causa! 📚\n\nDei aula 15 anos, formei muita gente.\n\nPropostas:\n• Escola climatizada\n• Professor respeitado\n• Creche universal\n• Curso técnico gratuito\n\n"Escola pública de qualidade é a maior riqueza de uma cidade!" 💚`
  ],
  transporte: [
    `Transporte é direito, não privilégio! 🚌\n\n✅ Mais linhas à noite e fim de semana\n✅ Tarifa social pro desempregado\n✅ Integração de 3 horas\n✅ Abrigo com cobertura e banco\n✅ Ciclovias conectando a cidade\n\nNinguém pode gastar 4 horas por dia no busão! 💚`,
    `Sabe o que me irrita? 🚌\n\nO cara mora na periferia, trabalha no centro, gasta 4 horas por dia em ônibus lotado.\n\nMinha proposta:\n• Mais ônibus nos horários de pico\n• Linhas noturnas\n• Tarifa justa\n• Integração que funciona\n\nTransporte digno já! 💚`,
    `Sobre transporte: 🚌\n\n1️⃣ Mais linhas (principalmente à noite)\n2️⃣ Tarifa social pro desempregado\n3️⃣ Integração temporal - 3h com uma passagem\n4️⃣ Abrigos decentes nos pontos\n5️⃣ Ciclovias de verdade\n\nO povo trabalhador merece! 💚`
  ],
  seguranca: [
    `Segurança começa com prevenção! 🛡️\n\n✅ Iluminação LED em todos os bairros\n✅ Câmeras nos pontos críticos\n✅ Ronda 24h da Guarda Municipal\n✅ Botão de pânico nos pontos de ônibus\n\nRua iluminada é rua segura! 💚`,
    `Ninguém pode viver com medo! 🛡️\n\nMinha abordagem:\n• Luz - bairro escuro é convite pro crime\n• Câmera - nos pontos estratégicos\n• Presença - Guarda circulando 24h\n\nSegurança não é só polícia - é infraestrutura! 💚`,
    `Na segurança, meu foco: 🛡️\n\n1. Iluminação - luz LED em tudo\n2. Monitoramento - câmeras conectadas\n3. Presença - ronda constante\n4. Acolhimento - Guarda preparada\n\nCidade segura é cidade bem cuidada! 💚`
  ],
  trabalho: [
    `Emprego e renda são essenciais! 💼\n\n✅ Apoio ao MEI - menos burocracia\n✅ Cursos profissionalizantes gratuitos\n✅ Feiras de emprego mensais\n✅ Crédito popular pro pequeno negócio\n✅ Incubadora de startups locais\n\nMeu compromisso é com quem acorda cedo pra trabalhar! 💚`,
    `Sobre trabalho: 💼\n\nO pequeno empreendedor é herói! Abre loja, cria emprego, faz a economia girar.\n\nVou lutar por:\n• Menos burocracia pro MEI\n• Crédito acessível\n• Cursos de capacitação\n• Feiras de emprego todo mês\n\nQuem trabalha merece apoio! 💚`,
    `Emprego é dignidade! 💼\n\nPropostas:\n1️⃣ Desburocratizar MEI\n2️⃣ Cursos técnicos gratuitos\n3️⃣ Feiras de emprego regulares\n4️⃣ Microcrédito acessível\n5️⃣ Apoio ao empreendedor local\n\nVamos fazer a economia local crescer! 💚`
  ],
  meioAmbiente: [
    `Cidade verde é cidade saudável! 🌳\n\n✅ Mais praças e áreas verdes\n✅ Coleta seletiva em todos os bairros\n✅ Proteção dos rios e nascentes\n✅ Hortas comunitárias\n✅ Arborização urbana\n\nDesenvolvimento sustentável é possível! 💚`,
    `Meio ambiente é qualidade de vida! 🌳\n\nMeu plano:\n• Cada bairro com sua praça\n• Reciclagem funcionando\n• Rios limpos (não esgoto a céu aberto!)\n• Árvores nas ruas\n\nNão é só ecologia - é saúde pública! 💚`,
    `Sobre meio ambiente: 🌳\n\n1️⃣ Praças em cada bairro\n2️⃣ Coleta seletiva real\n3️⃣ Proteção das nascentes\n4️⃣ Hortas comunitárias\n5️⃣ Mais árvores!\n\nCidade limpa e verde é possível! 💚`
  ],
  politica: [
    `Sou de **centro-esquerda democrática**. 🤔\n\nO que isso significa?\n\n✅ Justiça social - os mais pobres precisam de mais apoio\n✅ Serviços públicos de qualidade\n✅ Apoio ao pequeno empreendedor\n✅ Respeito total à democracia\n✅ Sem radicalismo de nenhum lado\n\nNão sou de extremos - sou do lado do povo trabalhador! 💚`,
    `Me perguntam se sou de esquerda ou direita... 🤔\n\nSou de centro-esquerda:\n• Acredito no Estado presente (saúde, educação)\n• Mas também no empreendedor local\n• Defendo justiça social\n• E respeito total à democracia\n\nNada de radicalismos! 💚`,
    `Minha posição política: 🤔\n\nCentro-esquerda democrática.\n\n• Serviço público de qualidade ✓\n• Apoio ao trabalhador ✓\n• Respeito ao pequeno comerciante ✓\n• Democracia sempre ✓\n\nSou moderado, mas não sou omisso! 💚`
  ],
  corrupcao: [
    `O povo tá cansado de político corrupto. Eu também! 😤\n\nMeu compromisso:\n\n✅ Transparência total - tudo no site\n✅ Gabinete aberto - pode me cobrar\n✅ Prestação de contas mensal\n✅ Não vou me esconder atrás de assessor\n\n"Não prometo o que não posso cumprir, mas cumpro tudo que prometo!" 💚`,
    `Corrupção? Tolerância zero! 😤\n\nSou professor - vivo de salário. Não entrei na política pra ficar rico.\n\nMinha política:\n• Gabinete de portas abertas\n• Prestação de contas pública\n• Sem mordomia desnecessária\n• Dinheiro público é sagrado!\n\nPolítico honesto existe - e eu sou um deles! 💚`,
    `Sobre honestidade: 😤\n\nVou ser claro: político corrupto tinha que ir preso mesmo.\n\nMeu compromisso é ser diferente:\n• Transparência total\n• Gastos públicos\n• Cobrança permitida\n• Portas abertas\n\nPode me cobrar! 💚`
  ],
  agradecimento: [
    `Eu que agradeço a conversa! 😊\n\nLembra: dia da eleição é **47** na urna!\n\nConta comigo que eu conto com você! 💚`,
    `Valeu demais! 😊\n\nQualquer dúvida, volta aqui.\n\nE não esquece: **47** - Antunes do Rosário! 💚`,
    `Obrigado você por perguntar! 😊\n\nFica à vontade pra voltar quando quiser.\n\n**47** - juntos vamos mudar! 💚`
  ],
  ajuda: [
    `Posso te ajudar com várias coisas! 🤖\n\nPergunta sobre:\n• Minhas **propostas** (saúde, educação, etc)\n• Quem eu sou (**candidato**)\n• Meu **número** na urna\n• Minha posição **política**\n\nOu só bate um papo mesmo! Tô aqui pra isso. 💚`,
    `Como posso ajudar? 🤖\n\nTemas que domino:\n• Propostas de campanha\n• Minha história\n• Número da urna (47!)\n• Posicionamento político\n\nPergunta o que quiser! 💚`
  ],
  despedida: [
    `Valeu pela conversa! 👋\n\nFoi bom falar contigo.\n\nLembra: **47** na urna!\n\nAté mais! 💚`,
    `Tchau! 👋 Foi ótimo conversar.\n\nVolte sempre!\n\n**Antunes do Rosário - 47** 💚`,
    `Até a próxima! 👋\n\nNão esquece de mim na urna: **47**!\n\nCuida-se! 💚`
  ]
};

const FRASES_MOTIVACIONAIS = [
  'Saúde e educação não são gastos, são investimentos!',
  'Quem trabalha o dia todo merece posto de saúde à noite!',
  'Escola pública de qualidade é a maior riqueza',
  'Meu compromisso é com quem acorda cedo pra trabalhar',
  'Transparência não é favor, é obrigação',
  'Juntos somos mais fortes!',
  'Política se faz com os pés no chão',
  'Não prometo o que não posso cumprir',
  'O povo merece respeito',
  'A mudança começa agora'
];

function detectIntent(text) {
  const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Despedida
  if (/tchau|ate mais|ate logo|falou|valeu|fui|xau|bye/.test(t)) return 'despedida';
  
  // Ajuda
  if (/ajuda|help|o que voce (faz|sabe)|como funciona/.test(t)) return 'ajuda';
  
  // Saúde
  if (/saude|medico|hospital|posto|upa|remedio|doenca|doente|consulta|especialista|farmacia|caps/.test(t)) return 'saude';
  
  // Educação
  if (/educacao|escola|professor|creche|ensino|aula|aluno|estudante|faculdade|curso/.test(t)) return 'educacao';
  
  // Transporte
  if (/transporte|onibus|bus|tarifa|passagem|metro|ciclovia|bicicleta|ponto de onibus|buzao/.test(t)) return 'transporte';
  
  // Segurança
  if (/seguranca|policia|assalto|violencia|roubo|crime|medo|guarda|iluminacao|camera/.test(t)) return 'seguranca';
  
  // Trabalho/Emprego
  if (/emprego|trabalho|desemprego|mei|salario|desempregado|curriculo|vaga|contratando/.test(t)) return 'trabalho';
  
  // Meio ambiente
  if (/ambiente|arvore|verde|lixo|reciclagem|poluicao|rio|natureza|sustentavel|praca|parque/.test(t)) return 'meioAmbiente';
  
  // Propostas gerais
  if (/proposta|plano|vai fazer|pretende|promessa|programa|projeto|ideia/.test(t)) return 'propostas';
  
  // Candidato
  if (/quem e voce|quem (e|eh) o|candidato|antunes|rosario|historia|trajetoria|biografia|sobre voce|conta sobre|me fala de voce/.test(t)) return 'candidato';
  
  // Número
  if (/numero|numero|votar|voto|47|urna|qual (e|eh) (o|seu)/.test(t)) return 'numero';
  
  // Política/ideologia
  if (/esquerda|direita|centro|politico|partido|ideologia|comunista|socialista|liberal|conservador/.test(t)) return 'politica';
  
  // Corrupção/honestidade
  if (/corrupcao|corrupção|honesto|ladrao|roubar|desvio|propina/.test(t)) return 'corrupcao';
  
  // Saudação
  if (/^(oi|ola|bom dia|boa tarde|boa noite|eai|e ai|salve|fala|hey|opa)/.test(t)) return 'saudacao';
  
  // Agradecimento
  if (/obrigad|valeu|brigado|agradeco|thanks|grato/.test(t)) return 'agradecimento';
  
  return 'geral';
}

function escolher(arr) { 
  return arr[Math.floor(Math.random() * arr.length)]; 
}

function gerarResposta(intent) {
  if (RESPOSTAS[intent]) {
    return escolher(RESPOSTAS[intent]);
  }
  
  // Resposta geral melhorada
  const frase = escolher(FRASES_MOTIVACIONAIS);
  const gerais = [
    `Hmm, não entendi bem... 🤔\n\nMas posso te ajudar com:\n• Minhas propostas (saúde, educação, transporte...)\n• Quem sou eu\n• Como votar em mim\n\nO que você quer saber? 💚`,
    `Boa pergunta! 🤔\n\nDeixa eu te contar o que posso ajudar:\n• Propostas de campanha\n• Minha trajetória\n• Número pra votar: 47!\n\n"${frase}"\n\nPergunta de novo de outro jeito? 💚`,
    `Não tenho certeza se entendi... 🤔\n\nQue tal perguntar sobre:\n• Saúde, educação, transporte\n• Quem é Antunes do Rosário\n• Por que votar 47\n\n"${frase}" 💚`,
    `Olha, posso falar muito sobre minhas propostas! 📋\n\nTenta perguntar sobre:\n• Um tema específico (saúde, educação...)\n• Minha história\n• Meu número\n\n"${frase}" 💚`
  ];
  return escolher(gerais);
}

let isSpeaking = false, isRecording = false, recognition = null;

function addMessage(text, isUser = false) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const div = document.createElement('div');
  div.className = `message ${isUser ? 'user' : ''}`;
  div.innerHTML = `
    <div class="message-avatar">${isUser ? 'V' : '47'}</div>
    <div class="message-content">
      <p>${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</p>
      ${!isUser ? '<button class="message-speak" onclick="speakText(this.parentElement.querySelector(\'p\').textContent)"><i class="fas fa-volume-up"></i> Ouvir</button>' : ''}
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function addTyping() {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'message';
  div.id = 'typing';
  div.innerHTML = '<div class="message-avatar">47</div><div class="typing-indicator"><span></span><span></span><span></span></div>';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, true);
  input.value = '';
  addTyping();
  
  // Delay variável para parecer mais natural
  const delay = 800 + Math.random() * 1200;
  setTimeout(() => {
    removeTyping();
    const intent = detectIntent(text);
    addMessage(gerarResposta(intent));
  }, delay);
}

function quickMessage(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}

function handleKeyPress(e) { 
  if (e.key === 'Enter') sendMessage(); 
}

function speakText(text) {
  if (isSpeaking) { 
    speechSynthesis.cancel(); 
    isSpeaking = false; 
    return; 
  }
  const clean = text.replace(/[📋🏥📚🚌🛡️💼🌳😊💚🗳️👋✅✓🤔😤🤖👨‍🏫📖🙋‍♂️1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣]/g, '').replace(/\*\*/g, '');
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = 'pt-BR';
  u.rate = 0.95;
  u.onend = () => { isSpeaking = false; };
  isSpeaking = true;
  speechSynthesis.speak(u);
}

function toggleVoice() {
  const btn = document.getElementById('voiceBtn');
  const input = document.getElementById('chatInput');
  if (isRecording) { 
    if (recognition) recognition.stop(); 
    btn.classList.remove('recording'); 
    isRecording = false; 
    return; 
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { 
    addMessage('Seu navegador não suporta voz. Use Chrome ou Edge! 🎤'); 
    return; 
  }
  btn.classList.add('recording');
  isRecording = true;
  input.placeholder = '🎤 Fale agora...';
  recognition = new SR();
  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.onresult = (e) => {
    let t = '';
    for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
    input.value = t;
    if (e.results[e.results.length-1].isFinal) {
      setTimeout(() => { 
        if (input.value.trim()) sendMessage(); 
      }, 300);
    }
  };
  recognition.onerror = recognition.onend = () => {
    btn.classList.remove('recording');
    isRecording = false;
    input.placeholder = 'Digite sua mensagem...';
  };
  try { 
    recognition.start(); 
  } catch(e) { 
    btn.classList.remove('recording'); 
    isRecording = false; 
  }
}

// Mensagens de boas-vindas variadas
const BOAS_VINDAS = [
  `Olá! 👋 Sou **Antunes do Rosário**, candidato a vereador pelo **47**!\n\nPode me perguntar sobre propostas, usar o microfone 🎤, ou só bater um papo.\n\nNo que posso ajudar?`,
  `E aí! 👋 Aqui é **Antunes do Rosário**, número **47**!\n\nTô aqui pra conversar sobre educação, saúde, transporte...\n\nManda sua pergunta! 💚`,
  `Bem-vindo! 👋 Sou **Antunes do Rosário** - **47**!\n\nPode usar os botões rápidos ou digitar sua dúvida.\n\nBora conversar? 💚`
];

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => addMessage(escolher(BOAS_VINDAS)), 500);
});
