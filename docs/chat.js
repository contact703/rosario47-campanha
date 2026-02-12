// CHAT BOT - ANTUNES DO ROSÁRIO 47
// Versão com integração ao backend inteligente

const API_URL = 'https://rosario-production-9c5e.up.railway.app';
let sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
let isSpeaking = false, isRecording = false, recognition = null;
let useBackend = true; // Tenta usar backend primeiro

// Fallback local caso API falhe
const FALLBACK_RESPONSES = {
  saudacao: [
    `Olá! 👋 Aqui é a **Equipe Rosário**, a equipe de campanha do candidato a vereador **Antunes do Rosário - 47**!\n\nPode perguntar sobre propostas, a história do candidato, ou qualquer coisa sobre a campanha!`,
    `E aí! 👋 Aqui é a **Equipe 47**!\n\nEstamos aqui pra ajudar. O que quer saber sobre o nosso candidato?`
  ],
  numero: [
    `🗳️ **Vote 47!**\n\nNa urna: 4️⃣7️⃣ ✅\n\n**Antunes do Rosário - 47**\n\nConte com a gente! 💚`
  ],
  propostas: [
    `As principais bandeiras do candidato: 📋\n\n🏥 **Saúde** - Postos até 22h\n📚 **Educação** - Escolas com estrutura\n🚌 **Transporte** - Tarifa social\n🛡️ **Segurança** - Luz e câmeras\n💼 **Emprego** - Apoio ao MEI\n\nSobre qual quer saber mais? 💚`
  ],
  padrao: [
    `Podemos te ajudar com:\n• **Propostas** do candidato\n• **História** do Antunes\n• Como **votar** no 47\n• **Eventos** da campanha\n\nPergunta o que quiser! 💚`
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
  return escolher(FALLBACK_RESPONSES[intent] || FALLBACK_RESPONSES.padrao);
}

async function sendToBackend(message) {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId })
    });
    
    if (!response.ok) throw new Error('API error');
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Backend error:', error);
    useBackend = false; // Desabilita backend após falha
    return null;
  }
}

function addMessage(text, isUser = false) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  
  const div = document.createElement('div');
  div.className = `message ${isUser ? 'user' : ''}`;
  
  // Processar markdown básico
  const processedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
  
  div.innerHTML = `
    <div class="message-avatar">${isUser ? 'V' : 'EQ'}</div>
    <div class="message-content">
      <p>${processedText}</p>
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

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  
  addMessage(text, true);
  input.value = '';
  addTyping();
  
  let response;
  
  // Tenta backend primeiro
  if (useBackend) {
    response = await sendToBackend(text);
  }
  
  // Se backend falhou, usa fallback local
  if (!response) {
    await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
    response = getLocalResponse(text);
  }
  
  removeTyping();
  addMessage(response);
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

// Mensagens de boas-vindas
const BOAS_VINDAS = [
  `Olá! 👋 Bem-vindo ao chat da **Equipe Rosário**!\n\nSomos a equipe de campanha do candidato a vereador **Antunes do Rosário - 47**.\n\nPode perguntar o que quiser sobre propostas, a história do candidato, ou a campanha.\n\nUse o microfone 🎤 ou digite sua pergunta! 💚`,
  `E aí! 👋 Aqui é a **Equipe 47**!\n\nEstamos aqui pra te ajudar a conhecer o candidato **Antunes do Rosário**.\n\nPergunta o que quiser! 💚`
];

document.addEventListener('DOMContentLoaded', () => {
  // Verifica se backend está disponível
  fetch(`${API_URL}/api/chat/status`)
    .then(r => r.json())
    .then(data => {
      console.log('Backend status:', data);
      useBackend = true;
    })
    .catch(() => {
      console.log('Backend offline, using local fallback');
      useBackend = false;
    });
  
  setTimeout(() => addMessage(escolher(BOAS_VINDAS)), 500);
});
