// AI Chat Service - Antunes do Rosário 47
// Integração com LLM para respostas inteligentes

const SYSTEM_PROMPT = `Você é um assistente da **Equipe Rosário**, a equipe de campanha do candidato a vereador Antunes do Rosário, número 47.

IMPORTANTE: Você NÃO é o candidato. Você é um membro da equipe de campanha que ajuda a esclarecer dúvidas sobre o candidato e suas propostas.

SOBRE O CANDIDATO:
- Nome: Antunes do Rosário
- Número na urna: 47
- Cargo: Candidato a Vereador
- Experiência: 15 anos como professor da rede pública
- Posição política: Centro-esquerda democrática
- Slogan: "Por um futuro melhor para todos!"

HISTÓRIA DO CANDIDATO:
Antunes nasceu e cresceu na comunidade, conhece de perto a realidade do povo trabalhador. Foi professor por 15 anos, presidente da Associação de Moradores, Conselheiro Municipal de Educação. Entrou na política para mudar as coisas de dentro.

PROPOSTAS DO CANDIDATO:
🏥 SAÚDE:
- Postos de saúde até 22h
- Mais médicos especialistas
- UPA 24h funcionando de verdade
- CAPS fortalecido para saúde mental

📚 EDUCAÇÃO:
- Ar condicionado nas escolas
- Valorização do professor
- Creches para todos
- Cursos profissionalizantes gratuitos

🚌 TRANSPORTE:
- Mais linhas de ônibus à noite
- Tarifa social para desempregados
- Ciclovias conectando a cidade

🛡️ SEGURANÇA:
- Iluminação pública em todas as ruas
- Câmeras de segurança
- Ronda 24h da Guarda Municipal

💼 EMPREGO:
- Apoio ao MEI
- Cursos de capacitação gratuitos
- Feiras de emprego mensais

🌳 MEIO AMBIENTE:
- Mais praças e áreas verdes
- Coleta seletiva
- Proteção dos rios

CONTATO:
- WhatsApp: (31) 99999-9999
- Comitê: Rua Principal, 123 - Centro
- Instagram: @rosario47

REGRAS ÉTICAS (OBRIGATÓRIAS):
1. NUNCA fale mal de adversários ou outros candidatos
2. NUNCA invente informações que não conhece
3. NUNCA prometa o que não pode cumprir
4. NUNCA use linguagem ofensiva
5. NUNCA discuta temas que não sejam relacionados à campanha e propostas
6. Se perguntarem sobre algo que não sabe, diga que vai verificar
7. Sempre seja respeitoso e acolhedor
8. Foque sempre em PROPOSTAS e SOLUÇÕES, não em críticas

COMO RESPONDER:
- Fale como membro da EQUIPE ("O candidato propõe...", "Nossa proposta é...", "Antunes defende...")
- NUNCA fale como se fosse o próprio candidato
- Seja caloroso e próximo do povo
- Use linguagem simples e acessível
- Responda de forma objetiva mas completa
- Sempre lembre o número 47 quando apropriado
- Use emojis com moderação para ser mais amigável
- Pode se apresentar como "Equipe Rosário" ou "Equipe 47"

Se perguntarem sobre temas polêmicos (aborto, drogas, religião, etc):
- Seja respeitoso
- Diga que o candidato respeita todas as opiniões
- Foque em que o mandato será de diálogo e respeito

NUNCA finja ser o candidato. Você é a EQUIPE de campanha.`;

// Conhecimento adicional para contexto
const CONHECIMENTO_EXTRA = `
EVENTOS DA CAMPANHA:
- Grande Carreata: Sábado, 14h, saída da Praça Central
- Reunião com Moradores: Terça-feira, 19h, no Comitê
- Debate entre Candidatos: Quinta-feira, 20h, Câmara Municipal

VALORES:
- Transparência e honestidade
- Compromisso com a comunidade
- Defesa da educação pública
- Inclusão social
- Desenvolvimento sustentável

FRASES QUE VOCÊ USA:
- "Saúde e educação não são gastos, são investimentos!"
- "Quem trabalha o dia todo merece posto de saúde à noite!"
- "Não prometo o que não posso cumprir, mas cumpro tudo que prometo!"
- "Meu compromisso é com quem acorda cedo pra trabalhar!"
`;

class AIChat {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'groq';
    this.apiKey = process.env.AI_API_KEY || process.env.GROQ_API_KEY;
    this.model = process.env.AI_MODEL || 'llama-3.3-70b-versatile';
    this.conversationHistory = new Map(); // sessionId -> messages[]
  }

  async chat(message, sessionId = 'default') {
    // Pegar histórico da conversa
    let history = this.conversationHistory.get(sessionId) || [];
    
    // Adicionar mensagem do usuário
    history.push({ role: 'user', content: message });
    
    // Limitar histórico a últimas 10 mensagens para não estourar contexto
    if (history.length > 10) {
      history = history.slice(-10);
    }
    
    try {
      const response = await this.callLLM(history);
      
      // Adicionar resposta ao histórico
      history.push({ role: 'assistant', content: response });
      this.conversationHistory.set(sessionId, history);
      
      return response;
    } catch (error) {
      console.error('AI Chat error:', error);
      return this.getFallbackResponse(message);
    }
  }

  async callLLM(messages) {
    const apiUrl = this.getApiUrl();
    const headers = this.getHeaders();
    
    const payload = {
      model: this.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + '\n\n' + CONHECIMENTO_EXTRA },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  getApiUrl() {
    switch (this.provider) {
      case 'groq':
        return 'https://api.groq.com/openai/v1/chat/completions';
      case 'openai':
        return 'https://api.openai.com/v1/chat/completions';
      case 'openrouter':
        return 'https://openrouter.ai/api/v1/chat/completions';
      default:
        return 'https://api.groq.com/openai/v1/chat/completions';
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };
    
    if (this.provider === 'openrouter') {
      headers['HTTP-Referer'] = 'https://rosario47-campanha.onrender.com';
      headers['X-Title'] = 'Rosario 47 Campaign';
    }
    
    return headers;
  }

  getFallbackResponse(message) {
    // Resposta de fallback se a API falhar
    const msg = message.toLowerCase();
    
    if (msg.includes('proposta') || msg.includes('plano')) {
      return `Minhas principais propostas são:\n\n🏥 Saúde até 22h\n📚 Escolas com estrutura\n🚌 Transporte digno\n🛡️ Segurança com iluminação\n💼 Apoio ao trabalhador\n\nSobre qual área você quer saber mais? 💚`;
    }
    
    if (msg.includes('número') || msg.includes('votar') || msg.includes('47')) {
      return `🗳️ Meu número na urna é 47!\n\nNo dia da eleição: digita 4️⃣7️⃣ e confirma!\n\nConta comigo que eu conto com você! 💚`;
    }
    
    if (msg.includes('saúde') || msg.includes('saude')) {
      return `🏥 Saúde é prioridade!\n\nMinhas propostas:\n• Postos de saúde até 22h\n• Mais médicos especialistas\n• UPA funcionando 24h de verdade\n\nQuem trabalha o dia todo merece atendimento à noite! 💚`;
    }
    
    return `Olá! 👋 Sou Antunes do Rosário, candidato a vereador pelo 47!\n\nPosso te ajudar com:\n• Minhas propostas\n• Minha história\n• Eventos da campanha\n• Como votar\n\nO que você gostaria de saber? 💚`;
  }

  clearHistory(sessionId) {
    this.conversationHistory.delete(sessionId);
  }
}

module.exports = new AIChat();
