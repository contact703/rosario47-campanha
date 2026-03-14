// CHAT BOT - ANTUNES DO ROSÁRIO 47
// Versão com integração ao backend inteligente - ATUALIZADO

const API_URL = 'https://affectionate-energy-production-fda3.up.railway.app';
let sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
let isSpeaking = false, isRecording = false, recognition = null;
let useBackend = true;

console.log('Chatbot v2.0 - Conectando ao backend:', API_URL);

// Fallback local caso API falhe
const FALLBACK_RESPONSES = {
  saudacao: [
    "Olá! 👋 Aqui é a **Equipe Rosário**, a equipe de campanha do candidato a vereador **Antunes do Rosário - 47**!\n\nPode perguntar sobre propostas, a história do candidato, ou qualquer coisa sobre a campanha!",
    "E aí! 👋 Aqui é a **Equipe 47**!\n\nEstamos aqui pra ajudar. O que quer saber sobre o nosso candidato?"
  ],
  numero: [
    "🗳️ **Vote 47!**\n\nNa urna: 4️⃣7️⃣ ✅\n\n**Antunes do Rosário - 47**\n\nConte com a gente! 💚"
  ],
  propostas: [
    "As principais bandeiras do candidato: 📋\n\n🏥 **Saúde** - Postos até 22h\n📚 **Educação** - Escolas com estrutura\n🚌 **Transporte** - Tarifa social\n🛡️ **Segurança** - Luz e câmeras\n💼 **Emprego** - Apoio ao MEI\n\nSobre qual quer saber mais? 💚"
  ],
  padrao: [
    "Podemos te ajudar com:\n• **Propostas** do candidato\n• **História** do Antunes\n• Como **votar** no 47\n• **Eventos** da campanha\n\nPergunta o que quiser! 💚"
  ]
};

function escolher(arr) { 
  return arr[Math.floor(Math.random() * arr.length)]; 
}

function detectLocalIntent(text) {
  const t = text.toLowerCase();
  if (/^(oi|olá|ola|bom dia|boa tarde|boa noite|eai|e ai)/.test(t)) return 'saudacao';
  if (/número|numero|votar|voto|47|urna/.test(t)) return 'numero';
  if (/proposta|plano|vai fazer|pretende/.test(t)) return 'propostas';
  return 'padrao';
}

function getLocalResponse(text) {
  const intent = detectLocalIntent(text);
  console.log('Usando resposta local (fallback):', intent);
  return escolher(FALLBACK_RESPONSES[intent] || FALLBACK_RESPONSES.padrao);
}

async function sendToBackend(message) {
  console.log('Enviando para backend:', message);
  try {
    const response = await fetch(API_URL + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId })
    });
    
    console.log('Resposta do backend:', response.status);
    
    if (!response.ok) {
      console.error('Erro na resposta:', response.status);
      throw new Error('API error: ' + response.status);
    }
    
    const data = await response.json();
    console.log('Dados recebidos:', data);
    
    if (data.reply) {
      console.log('Resposta IA:', data.reply.substring(0, 50) + '...');
      return data.reply;
    }
    
    throw new Error('Sem reply nos dados');
  } catch (error) {
    console.error('Backend error:', error);
    return null;
  }
}

function addMessage(text, isUser) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  
  const div = document.createElement('div');
  div.className = 'message ' + (isUser ? 'user' : '');
  
  const processedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
  
  div.innerHTML = '<div class="message-avatar">' + (isUser ? 'V' : 'EQ') + '</div>' +
    '<div class="message-content"><p>' + processedText + '</p>' +
    (!isUser ? '<button class="message-speak" onclick="speakText(this.parentElement.querySelector(\'p\').textContent)"><i class="fas fa-volume-up"></i> Ouvir</button>' : '') +
    '</div>';
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

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  
  addMessage(text, true);
  input.value = '';
  addTyping();
  
  console.log('Enviando mensagem:', text);
  
  let response = await sendToBackend(text);
  
  if (!response) {
    console.log('Usando fallback local');
    response = getLocalResponse(text);
  }
  
  removeTyping();
  addMessage(response);
}

// Inicializar
console.log('Chatbot inicializado!');

// ── ÁUDIO & MICROFONE — Fix 2026-03-14 (Debug Hunter + Code Ninja) ──

// Carregar vozes TTS com retry (Chrome async fix)
let ttsVoices = [];
function loadTTSVoices() {
  ttsVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
}
if (window.speechSynthesis) {
  loadTTSVoices();
  window.speechSynthesis.onvoiceschanged = loadTTSVoices;
  setTimeout(loadTTSVoices, 500);
  setTimeout(loadTTSVoices, 1500);
}

// speakText — chamado pelo botão "Ouvir" em cada mensagem do bot
function speakText(text) {
  if (!window.speechSynthesis) return;

  // Cancelar áudio anterior + delay para evitar race condition (bug Chrome)
  window.speechSynthesis.cancel();
  setTimeout(() => {
    const cleanText = text
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}]/gu, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText || cleanText.length < 3) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Usar voz PT-BR se disponível
    if (ttsVoices.length > 0) {
      const ptBR = ttsVoices.find(v => v.lang === 'pt-BR');
      const pt   = ttsVoices.find(v => v.lang.startsWith('pt'));
      if (ptBR) utterance.voice = ptBR;
      else if (pt) utterance.voice = pt;
    }

    utterance.onerror = (e) => console.warn('TTS error:', e.error);

    // Workaround Chrome: synthesis trava após ~15s
    const resumeInterval = setInterval(() => {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      if (!window.speechSynthesis.speaking) clearInterval(resumeInterval);
    }, 5000);

    window.speechSynthesis.speak(utterance);
  }, 100);
}

// toggleVoice — chamado pelo botão de microfone
function toggleVoice() {
  const btn = document.getElementById('voiceBtn');
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert('Reconhecimento de voz não suportado neste navegador. Use Chrome ou Edge.');
    return;
  }

  if (isRecording) {
    // Parar gravação
    if (recognition) recognition.stop();
    isRecording = false;
    if (btn) { btn.classList.remove('recording'); btn.title = 'Falar'; }
    return;
  }

  // Iniciar gravação
  recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isRecording = true;
    if (btn) { btn.classList.add('recording'); btn.title = 'Parar gravação'; }
    console.log('🎤 Ouvindo...');
  };

  recognition.onresult = (event) => {
    const results = event.results;
    const last = results[results.length - 1];
    const transcript = last[0].transcript;
    const input = document.getElementById('chatInput');
    if (input) input.value = transcript;
    if (last.isFinal) {
      sendMessage();
    }
  };

  recognition.onerror = (event) => {
    isRecording = false;
    if (btn) { btn.classList.remove('recording'); btn.title = 'Falar'; }
    const erros = {
      'not-allowed': '⛔ Permita o microfone no navegador (🔒 na barra de endereços)',
      'no-speech': '🤐 Não ouvi nada. Tente falar mais perto.',
      'network': '🌐 Erro de conexão. Verifique sua internet.',
      'audio-capture': '🎙️ Microfone não encontrado.',
    };
    const msg = erros[event.error] || 'Erro no microfone: ' + event.error;
    console.error('Speech error:', event.error);
    alert(msg);
  };

  recognition.onend = () => {
    isRecording = false;
    if (btn) { btn.classList.remove('recording'); btn.title = 'Falar'; }
  };

  recognition.start();
}
