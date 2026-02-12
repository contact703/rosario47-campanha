// ============================================
// CONFIGURAÇÃO DO CANDIDATO - ANTUNES DO ROSÁRIO
// ============================================

// Imagens devem ser importadas estaticamente
export const FOTOS = {
  retrato: require('../assets/images/candidato-retrato.jpg'),
  comicio: require('../assets/images/comicio.jpg'),
  celebracao: require('../assets/images/celebracao.jpg'),
  naRua: require('../assets/images/na-rua.jpg'),
  plenario: require('../assets/images/plenario.jpg'),
};

export const CANDIDATO = {
  nome: 'Antunes do Rosário',
  apelido: 'Rosário',
  numero: '47',
  nomeCompleto: 'Antunes do Rosário dos Santos',
  cargo: 'Candidato a Vereador',
  partido: 'PAC - Partido Aliança Cidadã',
  slogan: 'Juntos por uma cidade que cuida',
  idade: '54 anos',
  naturalidade: 'Belo Horizonte, MG',
  profissao: 'Advogado e Professor',
  formacao: 'Direito (UFMG) e Mestrado em Políticas Públicas',
  
  // Cores da campanha
  cores: {
    verde: '#10B981',
    verdeHover: '#059669',
    verdeLight: '#D1FAE5',
    laranja: '#F59E0B',
    laranjaHover: '#D97706',
    laranjaLight: '#FEF3C7',
    azulEscuro: '#1E3A5F',
    azulEscuroLight: '#2D4A6F',
  },
  
  // URLs e Contato
  site: 'https://rosario47-campanha.netlify.app',
  instagram: '@titaniofilms',
  instagramUrl: 'https://instagram.com/titaniofilms',
  email: 'contact@titaniofilms.com',
  telefone: '(31) 9999-9999',
  
  // Fotos (referência)
  fotos: FOTOS,
};

export const CORES = CANDIDATO.cores;
