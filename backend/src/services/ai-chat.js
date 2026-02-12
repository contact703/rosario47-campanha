// AI Chat Service - Antunes do Rosário 47
// Integração com LLM + Conhecimento Dinâmico do GitHub

const githubKnowledge = require('./github-knowledge');

const SYSTEM_PROMPT = `Você é um assistente da **Equipe Rosário**, a equipe de campanha do candidato a vereador Antunes do Rosário, número 47.

IMPORTANTE: Você NÃO é o candidato. Você é um membro da equipe de campanha que ajuda a esclarecer dúvidas sobre o candidato e suas propostas.

REGRAS ÉTICAS (OBRIGATÓRIAS):
1. NUNCA fale mal de adversários ou outros candidatos
2. NUNCA invente informações - use apenas o conhecimento fornecido
3. NUNCA prometa o que não pode cumprir
4. NUNCA use linguagem ofensiva
5. NUNCA discuta temas polêmicos (aborto, drogas, religião) - seja respeitoso e neutro
6. Se não souber algo, diga que vai verificar com a equipe
7. Sempre seja respeitoso e acolhedor
8. Foque em PROPOSTAS e SOLUÇÕES, não em críticas

COMO RESPONDER:
- Fale como membro da EQUIPE ("O candidato propõe...", "Nossa proposta é...", "Antunes defende...")
- NUNCA fale como se fosse o próprio candidato
- Seja caloroso e próximo do povo
- Use linguagem simples e acessível
- Responda de forma objetiva mas completa
- Sempre lembre o número 47 quando apropriado
- Use emojis com moderação para ser mais amigável 💚
- Pode se apresentar como "Equipe Rosário" ou "Equipe 47"

NUNCA finja ser o candidato. Você é a EQUIPE de campanha.`;

class AIChat {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'openrouter';
    this.apiKey = process.env.AI_API_KEY;
    this.model = process.env.AI_MODEL || 'meta-llama/llama-3.2-3b-instruct:free';
    this.conversationHistory = new Map();
  }

  // Monta o contexto com conhecimento dinâmico do GitHub
  buildContext() {
    const knowledge = githubKnowledge.getDynamicKnowledge();
    
    let context = SYSTEM_PROMPT + '\n\n';
    context += '=== CONHECIMENTO DA CAMPANHA (use estas informações para responder) ===\n\n';
    
    if (knowledge.textoCompleto) {
      context += knowledge.textoCompleto;
    } else {
      // Fallback básico
      context += `
SOBRE O CANDIDATO:
- Nome: Antunes do Rosário
- Número na urna: 47
- Cargo: Candidato a Vereador
- Experiência: 15 anos como professor da rede pública
- Posição política: Centro-esquerda democrática
- Slogan: "Por um futuro melhor para todos!"

PRINCIPAIS PROPOSTAS:
🏥 SAÚDE: Postos até 22h, mais médicos, UPA 24h de verdade
📚 EDUCAÇÃO: Ar condicionado nas escolas, valorização do professor, creches
🚌 TRANSPORTE: Mais ônibus à noite, tarifa social, ciclovias
🛡️ SEGURANÇA: Iluminação pública, câmeras, ronda 24h
💼 EMPREGO: Apoio ao MEI, cursos gratuitos, feiras de emprego
🌳 MEIO AMBIENTE: Mais praças, coleta seletiva, proteção dos rios
`;
    }
    
    return context;
  }

  async chat(message, sessionId = 'default') {
    let history = this.conversationHistory.get(sessionId) || [];
    
    history.push({ role: 'user', content: message });
    
    // Limitar histórico
    if (history.length > 10) {
      history = history.slice(-10);
    }
    
    try {
      const response = await this.callLLM(history);
      
      history.push({ role: 'assistant', content: response });
      this.conversationHistory.set(sessionId, history);
      
      return response;
    } catch (error) {
      console.error('AI Chat error:', error.message);
      return this.getFallbackResponse(message);
    }
  }

  async callLLM(messages) {
    if (!this.apiKey) {
      throw new Error('AI_API_KEY não configurada');
    }

    const apiUrl = this.getApiUrl();
    const headers = this.getHeaders();
    const context = this.buildContext();
    
    const payload = {
      model: this.model,
      messages: [
        { role: 'system', content: context },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 600
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
        return 'https://openrouter.ai/api/v1/chat/completions';
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };
    
    if (this.provider === 'openrouter') {
      headers['HTTP-Referer'] = 'https://rosario47-campanha.onrender.com';
      headers['X-Title'] = 'Rosario 47 Campaign Bot';
    }
    
    return headers;
  }

  getFallbackResponse(message) {
    // Usa o conhecimento dinâmico para fallback também
    const results = githubKnowledge.searchDynamicKnowledge(message);
    
    if (results.length > 0 && results[0].relevancia > 0.5) {
      const r = results[0];
      return `📄 ${r.trecho || r.conteudoCompleto?.substring(0, 500)}\n\n💚 Vote 47!`;
    }

    const msg = message.toLowerCase();
    
    if (msg.includes('proposta') || msg.includes('plano')) {
      return `As principais bandeiras do nosso candidato são:\n\n🏥 Saúde até 22h\n📚 Escolas com estrutura\n🚌 Transporte digno\n🛡️ Segurança com iluminação\n💼 Apoio ao trabalhador\n\nSobre qual área você quer saber mais? 💚`;
    }
    
    if (msg.includes('número') || msg.includes('numero') || msg.includes('votar') || msg.includes('47')) {
      return `🗳️ O número do nosso candidato é **47**!\n\nNa urna: 4️⃣7️⃣ ✅\n\n**Antunes do Rosário - 47**\nConta com a gente! 💚`;
    }
    
    if (msg.includes('saúde') || msg.includes('saude')) {
      return `🏥 **Saúde é prioridade para Antunes!**\n\nPropostas do candidato:\n• Postos de saúde até 22h\n• Mais médicos especialistas\n• UPA funcionando 24h de verdade\n• CAPS fortalecido\n\nQuem trabalha o dia todo merece atendimento à noite! 💚`;
    }

    if (msg.includes('educação') || msg.includes('educacao') || msg.includes('escola')) {
      return `📚 **Educação Transformadora!**\n\nPropostas do candidato:\n• Ar condicionado em todas as salas\n• Valorização dos professores\n• Mais vagas em creches\n• Cursos profissionalizantes gratuitos\n\nAntunes foi professor por 15 anos - ele sabe o que a escola precisa! 💚`;
    }
    
    return `Olá! 👋 Aqui é a **Equipe Rosário**!\n\nEstamos aqui para apresentar nosso candidato a vereador, **Antunes do Rosário - 47**!\n\nPosso te ajudar com:\n• Propostas do candidato\n• História de Antunes\n• Eventos da campanha\n• Como votar\n\nO que você gostaria de saber? 💚`;
  }

  clearHistory(sessionId) {
    this.conversationHistory.delete(sessionId);
  }
}

module.exports = new AIChat();
