/**
 * GitHub Knowledge Sync Service
 * 
 * Sincroniza conhecimento do bot a partir de arquivos .txt no GitHub
 * Suporta: Webhook (instantâneo) + Polling (backup)
 * 
 * Licença: MIT (uso comercial liberado)
 */

const https = require('https');

// Configuração do repositório
const GITHUB_CONFIG = {
  owner: 'contact703',
  repo: 'rosario47-campanha',
  branch: 'main',
  path: 'conhecimento',
  // Polling a cada 5 minutos (300000ms)
  pollingInterval: 5 * 60 * 1000
};

// Cache do conhecimento dinâmico
let dynamicKnowledge = {
  arquivos: {},
  ultimaAtualizacao: null,
  textoCompleto: ''
};

// Palavras-chave dinâmicas aprendidas dos arquivos
let dynamicKeywords = {};

/**
 * Faz requisição HTTP GET para a API do GitHub
 */
function githubRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Rosario47-Bot',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Busca conteúdo de um arquivo do GitHub (Base64 decode)
 */
async function fetchFileContent(filePath) {
  try {
    const path = `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}?ref=${GITHUB_CONFIG.branch}`;
    const response = await githubRequest(path);
    
    if (response.content) {
      // Decodifica Base64
      const content = Buffer.from(response.content, 'base64').toString('utf-8');
      return content;
    }
    return null;
  } catch (error) {
    console.error(`Erro ao buscar ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Lista arquivos .txt na pasta de conhecimento
 */
async function listKnowledgeFiles() {
  try {
    const path = `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}?ref=${GITHUB_CONFIG.branch}`;
    const response = await githubRequest(path);
    
    if (Array.isArray(response)) {
      return response.filter(file => file.name.endsWith('.txt'));
    }
    return [];
  } catch (error) {
    console.error('Erro ao listar arquivos:', error.message);
    return [];
  }
}

/**
 * Extrai palavras-chave de um texto
 */
function extractKeywords(texto, categoria) {
  const palavras = texto.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(p => p.length > 3);
  
  // Palavras únicas
  const unicas = [...new Set(palavras)];
  
  // Remove palavras muito comuns
  const stopWords = ['para', 'como', 'mais', 'isso', 'esse', 'esta', 'esta', 'sobre', 'todos', 'todas', 'cada', 'nossa', 'nosso', 'voce', 'sera', 'sido', 'sendo', 'fazer', 'pode', 'deve'];
  return unicas.filter(p => !stopWords.includes(p)).slice(0, 20);
}

/**
 * Sincroniza conhecimento do GitHub
 */
async function syncKnowledge() {
  console.log('🔄 Sincronizando conhecimento do GitHub...');
  
  try {
    const files = await listKnowledgeFiles();
    console.log(`📁 Encontrados ${files.length} arquivos de conhecimento`);
    
    const novosArquivos = {};
    let textoCompleto = '';
    const novasKeywords = {};
    
    for (const file of files) {
      const content = await fetchFileContent(`${GITHUB_CONFIG.path}/${file.name}`);
      if (content) {
        // Nome sem extensão como categoria
        const categoria = file.name.replace('.txt', '').replace(/-/g, '_');
        
        novosArquivos[categoria] = {
          nome: file.name,
          conteudo: content,
          atualizadoEm: new Date().toISOString()
        };
        
        textoCompleto += `\n\n=== ${categoria.toUpperCase()} ===\n${content}`;
        
        // Extrai keywords
        novasKeywords[categoria] = extractKeywords(content, categoria);
        
        console.log(`  ✅ ${file.name} (${content.length} chars)`);
      }
    }
    
    dynamicKnowledge = {
      arquivos: novosArquivos,
      ultimaAtualizacao: new Date().toISOString(),
      textoCompleto: textoCompleto
    };
    
    dynamicKeywords = novasKeywords;
    
    console.log(`✅ Conhecimento atualizado! ${Object.keys(novosArquivos).length} arquivos carregados`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao sincronizar:', error.message);
    return false;
  }
}

/**
 * Busca resposta no conhecimento dinâmico
 */
function searchDynamicKnowledge(query) {
  const queryLower = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const results = [];
  
  // Busca em cada arquivo
  for (const [categoria, dados] of Object.entries(dynamicKnowledge.arquivos)) {
    const conteudo = dados.conteudo.toLowerCase();
    
    // Verifica se a query está no conteúdo
    if (conteudo.includes(queryLower)) {
      // Extrai trecho relevante
      const index = conteudo.indexOf(queryLower);
      const inicio = Math.max(0, index - 100);
      const fim = Math.min(conteudo.length, index + 200);
      const trecho = dados.conteudo.substring(inicio, fim);
      
      results.push({
        categoria: categoria,
        trecho: '...' + trecho.trim() + '...',
        relevancia: 1
      });
    }
    
    // Verifica keywords
    const keywords = dynamicKeywords[categoria] || [];
    for (const kw of keywords) {
      if (queryLower.includes(kw)) {
        results.push({
          categoria: categoria,
          conteudoCompleto: dados.conteudo,
          relevancia: 0.5
        });
        break;
      }
    }
  }
  
  // Ordena por relevância
  results.sort((a, b) => b.relevancia - a.relevancia);
  
  return results.slice(0, 3);
}

/**
 * Retorna todo o conhecimento dinâmico formatado
 */
function getDynamicKnowledge() {
  return dynamicKnowledge;
}

/**
 * Retorna keywords dinâmicas
 */
function getDynamicKeywords() {
  return dynamicKeywords;
}

/**
 * Inicia polling periódico
 */
function startPolling() {
  // Sync inicial
  syncKnowledge();
  
  // Polling periódico
  setInterval(() => {
    syncKnowledge();
  }, GITHUB_CONFIG.pollingInterval);
  
  console.log(`⏰ Polling configurado: a cada ${GITHUB_CONFIG.pollingInterval / 60000} minutos`);
}

/**
 * Handler para webhook do GitHub
 */
function handleWebhook(payload) {
  // Verifica se é push no branch correto
  if (payload.ref === `refs/heads/${GITHUB_CONFIG.branch}`) {
    // Verifica se afetou a pasta de conhecimento
    const commits = payload.commits || [];
    const affectsKnowledge = commits.some(commit => {
      const files = [
        ...(commit.added || []),
        ...(commit.modified || []),
        ...(commit.removed || [])
      ];
      return files.some(f => f.startsWith(GITHUB_CONFIG.path));
    });
    
    if (affectsKnowledge) {
      console.log('🔔 Webhook: Mudança detectada na pasta conhecimento!');
      syncKnowledge();
      return { synced: true, message: 'Conhecimento atualizado' };
    }
  }
  
  return { synced: false, message: 'Nenhuma mudança relevante' };
}

module.exports = {
  syncKnowledge,
  searchDynamicKnowledge,
  getDynamicKnowledge,
  getDynamicKeywords,
  startPolling,
  handleWebhook,
  GITHUB_CONFIG
};
