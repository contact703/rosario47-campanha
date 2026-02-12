// AI Chat Service - Antunes do Rosário 47
// Integração com LLM + Conhecimento Dinâmico do GitHub

const githubKnowledge = require('./github-knowledge');

const SYSTEM_PROMPT = `Você é a Equipe Rosário - a equipe de campanha do Antunes do Rosário, candidato a vereador número 47.

SEU OBJETIVO: Conquistar o voto do eleitor! Seja persuasivo, carismático e mostre porque Antunes é a melhor escolha.

COMO VOCÊ DEVE SER:
- Fale como uma PESSOA de verdade, não como robô
- Seja direto e vá ao ponto desde a primeira resposta
- Use linguagem do dia a dia, simples e acessível
- Mostre paixão pela causa - você acredita no candidato!
- Seja acolhedor e empático com as preocupações do eleitor
- SEMPRE complete suas respostas - nunca deixe pela metade

REGRAS DE OURO:
1. RESPONDA A PERGUNTA DIRETAMENTE - não enrole, não mude de assunto
2. Fale com suas próprias palavras - não cite textualmente o programa
3. Em temas polêmicos (aborto, drogas, pena de morte): seja respeitoso, diga que Antunes respeita todas as opiniões e que o mandato será de diálogo
4. Nunca fale mal de outros candidatos
5. Sempre lembre: o número é 47!

ESTILO DE RESPOSTA:
- Comece respondendo a pergunta, não se apresentando
- Seja breve mas completo (2-4 parágrafos no máximo)
- Use emojis com moderação 💚
- Termine convidando para o voto ou perguntando se pode ajudar em mais algo

EXEMPLO DE TOM:
❌ ERRADO: "Olá! Sou a Equipe Rosário... posso ajudar com propostas, eventos..."
✅ CERTO: "Sobre saúde, o Antunes defende uma coisa que faz toda diferença: posto de saúde aberto até as 22h! Quem trabalha o dia todo sabe como é difícil conseguir atendimento..."

Você fala pela EQUIPE, não pelo candidato diretamente. Use "o Antunes propõe", "nossa proposta", "defendemos".`;

class AIChat {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'openrouter';
    this.apiKey = process.env.AI_API_KEY;
    this.model = process.env.AI_MODEL || 'meta-llama/llama-3.2-3b-instruct:free';
    this.conversationHistory = new Map();
  }

  buildContext() {
    const knowledge = githubKnowledge.getDynamicKnowledge();
    
    let context = SYSTEM_PROMPT + '\n\n';
    context += '=== INFORMAÇÕES DA CAMPANHA (use para embasar suas respostas) ===\n\n';
    
    if (knowledge.textoCompleto) {
      context += knowledge.textoCompleto;
    } else {
      context += `
ANTUNES DO ROSÁRIO - 47
- Professor por 15 anos, conhece a realidade do povo
- Centro-esquerda democrática: justiça social com responsabilidade
- Slogan: "Por um futuro melhor para todos!"

PRINCIPAIS BANDEIRAS:
• SAÚDE: Postos até 22h (pra quem trabalha!), mais médicos, UPA 24h de verdade
• EDUCAÇÃO: Ar condicionado nas escolas, valorização do professor, creches pra todos
• TRANSPORTE: Mais ônibus à noite, tarifa social, ciclovias
• SEGURANÇA: Luz em todas as ruas, câmeras, ronda 24h
• EMPREGO: Apoio ao MEI, cursos gratuitos, feiras de emprego
• MEIO AMBIENTE: Mais praças, coleta seletiva, proteção dos rios

VALORES: Transparência, honestidade, compromisso com quem mais precisa.
`;
    }
    
    return context;
  }

  async chat(message, sessionId = 'default') {
    let history = this.conversationHistory.get(sessionId) || [];
    
    history.push({ role: 'user', content: message });
    
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
      temperature: 0.8,
      max_tokens: 1000
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
    const results = githubKnowledge.searchDynamicKnowledge(message);
    
    if (results.length > 0 && results[0].relevancia > 0.5) {
      const r = results[0];
      return `${r.trecho || r.conteudoCompleto?.substring(0, 500)}\n\nQuer saber mais? É só perguntar! 💚 Vote 47!`;
    }

    const msg = message.toLowerCase();
    
    if (msg.includes('proposta') || msg.includes('plano')) {
      return `O Antunes tem propostas fortes pra mudar nossa cidade:\n\n🏥 Saúde até 22h - pra quem trabalha conseguir atendimento\n📚 Escolas com estrutura de verdade\n🚌 Transporte digno e tarifa social\n🛡️ Segurança com luz e câmeras em toda cidade\n💼 Apoio ao trabalhador e ao pequeno empreendedor\n\nQual dessas te interessa mais? 💚`;
    }
    
    if (msg.includes('número') || msg.includes('numero') || msg.includes('votar') || msg.includes('47')) {
      return `O número do Antunes é 47! 🗳️\n\nNa urna é só digitar 4-7 e confirmar. Simples assim!\n\nConta com a gente que a gente conta com você! 💚`;
    }
    
    if (msg.includes('saúde') || msg.includes('saude')) {
      return `Saúde é prioridade total pro Antunes! 🏥\n\nEle defende posto de saúde funcionando até 22h - porque quem trabalha o dia todo não pode ficar sem atendimento. Também quer mais médicos especialistas nos bairros e UPA funcionando de verdade, 24h.\n\nIsso faz diferença na vida real, né? 💚`;
    }

    if (msg.includes('educação') || msg.includes('educacao') || msg.includes('escola')) {
      return `O Antunes foi professor por 15 anos, então educação é coisa séria pra ele! 📚\n\nDefende ar condicionado em todas as salas (imagina estudar nesse calor!), valorização dos professores com salário digno, e creche pra todas as famílias que precisam.\n\nEle viveu a sala de aula, sabe o que precisa mudar! 💚`;
    }
    
    return `E aí! 👋 Aqui é a Equipe Rosário!\n\nQuer conhecer o Antunes do Rosário, nosso candidato a vereador? Pode perguntar sobre as propostas dele, a história, os eventos da campanha... tô aqui pra ajudar!\n\nO número dele é 47! 💚`;
  }

  clearHistory(sessionId) {
    this.conversationHistory.delete(sessionId);
  }
}

module.exports = new AIChat();
