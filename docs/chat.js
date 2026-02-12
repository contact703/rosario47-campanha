// CHAT BOT - ANTUNES DO ROSÁRIO 47
const PROPOSTAS = {
  saude: ['Postos de saúde até 22h', 'Mais médicos especialistas', 'UPA 24h de verdade', 'Farmácia popular', 'CAPS fortalecido'],
  educacao: ['Ar condicionado nas escolas', 'Valorização do professor', 'Creches para todos', 'Cursos profissionalizantes', 'Escola integral'],
  transporte: ['Mais linhas de ônibus', 'Tarifa social', 'Ciclovias', 'Abrigos de ônibus'],
  seguranca: ['Iluminação pública', 'Câmeras de segurança', 'Ronda 24h', 'Guarda municipal'],
  trabalho: ['Apoio ao MEI', 'Cursos de capacitação', 'Feiras de emprego', 'Crédito popular'],
  meioAmbiente: ['Mais áreas verdes', 'Coleta seletiva', 'Proteção dos rios']
};

const FRASES = [
  'Saúde e educação não são gastos, são investimentos!',
  'Quem trabalha o dia todo merece posto de saúde à noite!',
  'Escola pública de qualidade é a maior riqueza',
  'Meu compromisso é com quem acorda cedo pra trabalhar',
  'Transparência não é favor, é obrigação',
  'Juntos somos mais fortes!'
];

function detectIntent(text) {
  const t = text.toLowerCase();
  if (/saúde|saude|médico|hospital|posto|upa|remédio/.test(t)) return 'saude';
  if (/educação|educacao|escola|professor|creche|ensino/.test(t)) return 'educacao';
  if (/transporte|ônibus|onibus|tarifa|passagem/.test(t)) return 'transporte';
  if (/segurança|seguranca|polícia|assalto|violência/.test(t)) return 'seguranca';
  if (/emprego|trabalho|desemprego|mei|salário/.test(t)) return 'trabalho';
  if (/ambiente|árvore|verde|lixo|reciclagem/.test(t)) return 'meioAmbiente';
  if (/proposta|plano|vai fazer|pretende/.test(t)) return 'propostas';
  if (/quem|candidato|antunes|rosário/.test(t)) return 'candidato';
  if (/número|numero|votar|voto|47|urna/.test(t)) return 'numero';
  if (/oi|olá|ola|bom dia|boa tarde|boa noite/.test(t)) return 'saudacao';
  if (/obrigado|valeu|brigado/.test(t)) return 'agradecimento';
  if (/esquerda|direita|centro|político|partido/.test(t)) return 'politica';
  if (/corrupção|honesto|ladrão/.test(t)) return 'corrupcao';
  return 'geral';
}

function escolher(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function gerarResposta(intent) {
  const frase = escolher(FRASES);
  switch(intent) {
    case 'saudacao':
      return `Olá! 👋 Sou Antunes do Rosário, candidato a vereador pelo **47**!\n\nPode me perguntar sobre saúde, educação, transporte, segurança... O que você gostaria de saber?`;
    case 'numero':
      return `🗳️ **Vote 47!**\n\nNa urna: 4️⃣7️⃣ ✅\n\n**ANTUNES DO ROSÁRIO - 47**\n\nConta comigo que eu conto com você! 💚`;
    case 'candidato':
      return `Sou **Antunes do Rosário**, candidato a vereador pelo **47**!\n\n📖 Ex-professor por 15 anos, 20 anos de serviço público. Nasci e cresci aqui, conheço a realidade do povo.\n\n💚 Centro-esquerda democrática: justiça social com responsabilidade!\n\n"${frase}"`;
    case 'propostas':
      return `Minhas principais bandeiras: 📋\n\n🏥 **SAÚDE** - ${PROPOSTAS.saude.slice(0,2).join(', ')}\n📚 **EDUCAÇÃO** - ${PROPOSTAS.educacao.slice(0,2).join(', ')}\n🚌 **TRANSPORTE** - ${PROPOSTAS.transporte.slice(0,2).join(', ')}\n🛡️ **SEGURANÇA** - ${PROPOSTAS.seguranca.slice(0,2).join(', ')}\n\nQual área te interessa mais? 💚`;
    case 'saude':
      return `Saúde é prioridade! 🏥\n\n✓ ${PROPOSTAS.saude.join('\n✓ ')}\n\n"Quem trabalha o dia todo merece posto de saúde à noite!"\n\nQuer saber mais? 💚`;
    case 'educacao':
      return `Educação transforma vidas! 📚 Fui professor por 15 anos.\n\n✓ ${PROPOSTAS.educacao.join('\n✓ ')}\n\n"Escola pública de qualidade é a maior riqueza!"\n\nPosso detalhar alguma proposta? 💚`;
    case 'transporte':
      return `Transporte digno é direito! 🚌\n\n✓ ${PROPOSTAS.transporte.join('\n✓ ')}\n\nO povo da periferia não pode gastar 4 horas por dia no busão! 💚`;
    case 'seguranca':
      return `Ninguém pode viver com medo! 🛡️\n\n✓ ${PROPOSTAS.seguranca.join('\n✓ ')}\n\nSegurança começa com luz na rua! 💚`;
    case 'trabalho':
      return `Emprego e renda são essenciais! 💼\n\n✓ ${PROPOSTAS.trabalho.join('\n✓ ')}\n\n"Meu compromisso é com quem acorda cedo pra trabalhar!" 💚`;
    case 'meioAmbiente':
      return `Meio ambiente saudável é qualidade de vida! 🌳\n\n✓ ${PROPOSTAS.meioAmbiente.join('\n✓ ')}\n\nDesenvolvimento sustentável é possível! 💚`;
    case 'politica':
      return `Sou de **centro-esquerda democrática**. 🤔\n\n✓ Justiça social\n✓ Serviços públicos de qualidade\n✓ Apoio às pequenas empresas\n✓ Respeito à democracia\n\nNão sou de extremos - sou do lado do povo trabalhador! 💚`;
    case 'corrupcao':
      return `O povo tá cansado de político corrupto. Eu também! 😤\n\nMeu compromisso:\n✓ Transparência total\n✓ Gabinete aberto\n✓ Prestação de contas mensal\n\n"Não prometo o que não posso cumprir, mas cumpro tudo que prometo" 💚`;
    case 'agradecimento':
      return `Eu que agradeço! 😊\n\nLembra: Antunes do Rosário é **47**!\n\nConte comigo! 💚`;
    default:
      return `Posso te ajudar com informações sobre:\n• Propostas (saúde, educação, transporte...)\n• Quem sou eu\n• Como votar\n\n"${frase}"\n\nO que você gostaria de saber? 💚`;
  }
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
  setTimeout(() => {
    removeTyping();
    const intent = detectIntent(text);
    addMessage(gerarResposta(intent));
  }, 800 + Math.random() * 800);
}

function quickMessage(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}

function handleKeyPress(e) { if (e.key === 'Enter') sendMessage(); }

function speakText(text) {
  if (isSpeaking) { speechSynthesis.cancel(); isSpeaking = false; return; }
  const clean = text.replace(/[📋🏥📚🚌🛡️💼🌳😊💚🗳️👋✓🤔😤1️⃣2️⃣3️⃣4️⃣7️⃣✅]/g, '').replace(/\*\*/g, '');
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = 'pt-BR';
  u.onend = () => { isSpeaking = false; };
  isSpeaking = true;
  speechSynthesis.speak(u);
}

function toggleVoice() {
  const btn = document.getElementById('voiceBtn');
  const input = document.getElementById('chatInput');
  if (isRecording) { if (recognition) recognition.stop(); btn.classList.remove('recording'); isRecording = false; return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { addMessage('Seu navegador não suporta voz. Use Chrome! 🎤'); return; }
  btn.classList.add('recording');
  isRecording = true;
  input.placeholder = '🎤 Fale agora...';
  recognition = new SR();
  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.onresult = (e) => {
    let t = '';
    for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
    input.value = t;
    if (e.results[e.results.length-1].isFinal) setTimeout(() => { if (input.value.trim()) sendMessage(); }, 300);
  };
  recognition.onerror = recognition.onend = () => {
    btn.classList.remove('recording');
    isRecording = false;
    input.placeholder = 'Digite sua mensagem...';
  };
  try { recognition.start(); } catch(e) { btn.classList.remove('recording'); isRecording = false; }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => addMessage(`Olá! 👋 Sou Antunes do Rosário, candidato pelo **47**!\n\nPode me perguntar sobre propostas, ou use o microfone pra falar! 🎤\n\nNo que posso ajudar?`), 500);
});
