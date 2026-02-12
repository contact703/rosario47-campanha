/**
 * Serviço de Conhecimento do Chatbot
 * 
 * Busca informações de múltiplas fontes:
 * - Arquivos locais (conhecimento/*.txt, conhecimento/*.json)
 * - GitHub (para atualizações remotas)
 * 
 * O cliente pode adicionar arquivos .txt no GitHub e o chat automaticamente usa.
 */

// URL base do repositório GitHub (raw content)
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/contact703/rosario/main/conhecimento';

// Lista de arquivos de conhecimento a carregar
const CONHECIMENTO_FILES = [
  'respostas.json',
  'propostas-saude.txt',
  'propostas-educacao.txt',
  'propostas-seguranca.txt',
  'propostas-transporte.txt',
  'sobre-candidato.txt',
  'agenda.txt',
];

interface RespostaJSON {
  categorias: {
    nome: string;
    perguntas: {
      pergunta: string;
      resposta: string;
      palavras_chave: string[];
    }[];
  }[];
}

interface ConhecimentoItem {
  tipo: 'json' | 'texto';
  fonte: string;
  conteudo: string | RespostaJSON;
}

class ConhecimentoService {
  private cache: Map<string, ConhecimentoItem> = new Map();
  private lastUpdate: number = 0;
  private updateInterval = 5 * 60 * 1000; // 5 minutos

  /**
   * Busca todo o conhecimento disponível
   */
  async carregarConhecimento(): Promise<void> {
    const now = Date.now();
    if (now - this.lastUpdate < this.updateInterval && this.cache.size > 0) {
      return; // Usar cache
    }

    for (const arquivo of CONHECIMENTO_FILES) {
      try {
        const url = `${GITHUB_RAW_BASE}/${arquivo}`;
        const response = await fetch(url, {
          headers: { 'Cache-Control': 'no-cache' }
        });

        if (response.ok) {
          const conteudo = await response.text();
          const tipo = arquivo.endsWith('.json') ? 'json' : 'texto';
          
          this.cache.set(arquivo, {
            tipo,
            fonte: arquivo,
            conteudo: tipo === 'json' ? JSON.parse(conteudo) : conteudo,
          });
        }
      } catch (error) {
        console.log(`Arquivo não encontrado: ${arquivo}`);
      }
    }

    this.lastUpdate = now;
  }

  /**
   * Busca resposta para uma pergunta
   */
  async buscarResposta(pergunta: string): Promise<string | null> {
    await this.carregarConhecimento();
    
    const perguntaLower = pergunta.toLowerCase();
    const palavras = perguntaLower.split(/\s+/);

    // 1. Primeiro, busca no JSON estruturado
    const respostasJSON = this.cache.get('respostas.json');
    if (respostasJSON && respostasJSON.tipo === 'json') {
      const data = respostasJSON.conteudo as RespostaJSON;
      
      for (const categoria of data.categorias) {
        for (const item of categoria.perguntas) {
          const match = item.palavras_chave.some(kw => 
            perguntaLower.includes(kw.toLowerCase())
          );
          if (match) {
            return item.resposta;
          }
        }
      }
    }

    // 2. Busca nos arquivos de texto por palavras-chave
    const palavrasChave = this.extrairPalavrasChave(pergunta);
    let melhorMatch = '';
    let melhorScore = 0;

    for (const [arquivo, item] of this.cache) {
      if (item.tipo === 'texto') {
        const texto = item.conteudo as string;
        const score = this.calcularRelevancia(palavrasChave, texto);
        
        if (score > melhorScore) {
          melhorScore = score;
          melhorMatch = this.extrairTrechoRelevante(texto, palavrasChave);
        }
      }
    }

    if (melhorScore > 0.3) {
      return melhorMatch;
    }

    return null;
  }

  /**
   * Extrai palavras-chave relevantes da pergunta
   */
  private extrairPalavrasChave(texto: string): string[] {
    const stopWords = ['o', 'a', 'os', 'as', 'um', 'uma', 'de', 'da', 'do', 'em', 'no', 'na', 
                       'que', 'qual', 'como', 'quando', 'onde', 'por', 'para', 'com', 'sem',
                       'sobre', 'é', 'são', 'foi', 'ser', 'estar', 'você', 'voce', 'me', 'meu'];
    
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/\s+/)
      .filter(p => p.length > 2 && !stopWords.includes(p));
  }

  /**
   * Calcula relevância de um texto para as palavras-chave
   */
  private calcularRelevancia(palavrasChave: string[], texto: string): number {
    const textoLower = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let matches = 0;
    
    for (const palavra of palavrasChave) {
      if (textoLower.includes(palavra)) {
        matches++;
      }
    }
    
    return palavrasChave.length > 0 ? matches / palavrasChave.length : 0;
  }

  /**
   * Extrai trecho relevante do texto
   */
  private extrairTrechoRelevante(texto: string, palavrasChave: string[]): string {
    const linhas = texto.split('\n').filter(l => l.trim());
    const linhasRelevantes: string[] = [];
    
    for (const linha of linhas) {
      const linhaLower = linha.toLowerCase();
      const isRelevante = palavrasChave.some(p => linhaLower.includes(p));
      
      if (isRelevante && !linha.startsWith('#')) {
        linhasRelevantes.push(linha.trim());
      }
    }
    
    // Retorna até 5 linhas relevantes
    return linhasRelevantes.slice(0, 5).join('\n');
  }

  /**
   * Retorna todo o conhecimento carregado (para debug)
   */
  getConhecimentoCarregado(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Singleton
export const conhecimentoService = new ConhecimentoService();
