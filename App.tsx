import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

// ============================================
// CONFIGURAÇÃO DO CANDIDATO - ANTUNES DO ROSÁRIO (TITANIO)
// ============================================
const POLITICO = {
  nome: 'Antunes do Rosário',
  apelido: 'Titanio',
  numero: '47',
  nomeCompleto: 'Antunes do Rosário dos Santos',
  cargo: 'Candidato a Governador',
  partido: 'Centro-Esquerda Progressista',
  slogan: 'Juntos por um Brasil que cuida',
  idade: '47 anos',
  naturalidade: 'Belo Horizonte, MG',
  profissao: 'Economista e Professor Universitário',
  formacao: 'Doutorado em Desenvolvimento Sustentável (UnB)',
  corPrimaria: '#2d5016', // Verde institucional
  corSecundaria: '#f5a623', // Amarelo/dourado
  corFundo: '#f8faf5',
};

// ============================================
// RESPOSTAS DO CANDIDATO
// ============================================
const RESPOSTAS: { [key: string]: string } = {
  // Saudações
  'oi': `Olá! Sou ${POLITICO.nome}, o ${POLITICO.apelido}! Candidato a governador pelo ${POLITICO.numero}. ${POLITICO.slogan}! Como posso ajudar você hoje?`,
  'olá': `Olá! Sou ${POLITICO.nome}, o ${POLITICO.apelido}! Candidato a governador pelo ${POLITICO.numero}. ${POLITICO.slogan}! Como posso ajudar você hoje?`,
  'bom dia': `Bom dia! Aqui é o ${POLITICO.apelido}. Vamos conversar sobre o futuro do nosso estado?`,
  'boa tarde': `Boa tarde! Aqui é o ${POLITICO.apelido}. Vamos conversar sobre o futuro do nosso estado?`,
  'boa noite': `Boa noite! Aqui é o ${POLITICO.apelido}. Vamos conversar sobre o futuro do nosso estado?`,
  
  // Quem é
  'quem é você': `Sou ${POLITICO.nomeCompleto}, tenho ${POLITICO.idade}, nasci em ${POLITICO.naturalidade}. Sou ${POLITICO.profissao} com ${POLITICO.formacao}. Fui vereador de BH com mais de 45 mil votos e deputado estadual. Minha vida é dedicada a políticas públicas e justiça social. Política se faz com as pessoas, não para as pessoas!`,
  'sua história': `Nasci numa família humilde no bairro Lagoinha, em BH. Filho de professora e metalúrgico. Estudei em escola pública a vida toda e aos 17 anos consegui bolsa integral na UFMG. Fui professor, secretário de desenvolvimento social, vereador mais votado da história do partido e deputado estadual. Sempre lutei por educação, transparência e desenvolvimento sustentável.`,
  'titanio': `Me chamam de Titanio porque, assim como o metal, sou resistente e não enferruja! Tenho ficha limpa, 100% de presença nas sessões da Câmara e nunca me envolvi em nenhum escândalo. Transparência e honestidade são meus pilares.`,
  
  // EDUCAÇÃO
  'educação': `Educação é minha prioridade número 1! Minhas propostas: Escola em Tempo Integral para 100% da rede pública. Piso de 8.500 reais para professores. Zero analfabetismo com programas intensivos. 500 mil novas vagas em federais. Um tablet por aluno e programação no currículo. Creche garantida de 0 a 3 anos!`,
  'escola': `Vamos transformar nossas escolas! Tempo integral para todos, professor valorizado com piso de 8.500 reais, tecnologia nas salas de aula. Minha meta: Brasil entre os 30 melhores em educação até 2030!`,
  'professor': `Professor tem que ser valorizado! Proponho piso de 8.500 reais com plano de carreira atrativo. Formação continuada e infraestrutura de qualidade. Sem professor valorizado, não há educação de qualidade.`,
  
  // SAÚDE
  'saúde': `Saúde de verdade é SUS forte! Minhas propostas: UBS funcionando 24 horas. Um médico para cada mil habitantes. Fila zero - exames e cirurgias em até 30 dias. CAPS em todos os municípios para saúde mental. Farmácia Popular ampliada. Telemedicina para áreas remotas. Vamos investir 8% do PIB em saúde pública!`,
  'sus': `O SUS é patrimônio do povo brasileiro e precisa ser fortalecido! Mais médicos, mais estrutura, mais humanização. Vamos acabar com as filas e garantir atendimento digno para todos.`,
  'hospital': `Vamos melhorar nossos hospitais! Mais leitos, mais profissionais, equipamentos modernos. E principalmente: UBS 24 horas para desafogar as emergências. Saúde não pode ser só quando adoece, tem que ser prevenção!`,
  
  // EMPREGO E RENDA
  'emprego': `Emprego é dignidade! Minhas propostas: Primeiro Emprego com incentivo fiscal para contratar jovens. MEI sem burocracia. 2 milhões de empregos na economia verde. Salário mínimo com reajuste real. Cursos técnicos gratuitos. Apoio a cooperativas e agricultura familiar. Minha meta é o menor desemprego da história!`,
  'trabalho': `Trabalho digno para todos! Vamos criar milhões de empregos na indústria verde, tecnologia e serviços. Empreender vai ser fácil, sem burocracia. E vamos qualificar nossos trabalhadores para os empregos do futuro.`,
  'salário': `Salário mínimo tem que garantir vida digna! Proponho reajuste real acima da inflação, sempre. E mais: crédito acessível para o pequeno empreendedor, apoio a cooperativas. O dinheiro tem que circular na mão do povo!`,
  
  // MEIO AMBIENTE
  'meio ambiente': `Sou doutor em Desenvolvimento Sustentável! Propostas: Desmatamento zero com fiscalização por satélite. 100% de energia renovável até 2035. Ônibus elétricos e ciclovias. Reciclagem em todos os municípios. Saneamento básico universal. Amazônia protegida. Minha meta: Brasil carbono neutro até 2040!`,
  'sustentabilidade': `Desenvolvimento sustentável é o caminho! Podemos crescer respeitando o meio ambiente. A economia verde vai gerar milhões de empregos. Energia limpa, mobilidade verde, reciclagem total. É possível e necessário!`,
  'clima': `A crise climática é real e urgente! Precisamos agir agora. Brasil carbono neutro até 2040. Energia 100% renovável. Proteção da Amazônia. Transição energética justa. Não é escolha, é sobrevivência!`,
  
  // SEGURANÇA
  'segurança': `Segurança cidadã, não violência! Propostas: Polícia comunitária com policial de referência em cada bairro. Câmeras inteligentes e integração de dados. Recuperar jovens, não só punir. Tolerância zero com milícias. Política restritiva de armas. Fim da violência policial. Meta: reduzir violência em 50%!`,
  'violência': `A violência tem raízes sociais! Precisamos atacar as causas: pobreza, falta de educação, desemprego. E ao mesmo tempo: polícia inteligente, comunitária, respeitando direitos. Combater o crime organizado com rigor.`,
  'polícia': `Polícia tem que ser respeitada e respeitar! Policial bem pago, bem treinado, bem equipado. Mas também: fim dos abusos, câmeras corporais, accountability. Segurança pública não é guerra, é paz!`,
  
  // MORADIA
  'moradia': `Moradia é direito! Propostas: 2 milhões de casas populares em 4 anos. Aluguel social para famílias vulneráveis. Urbanização de favelas com saneamento. Crédito a juros baixos. Prédios públicos ociosos viram moradia. Meta: déficit habitacional zero!`,
  'casa': `Todo brasileiro merece um lar! Vamos construir 2 milhões de moradias populares, com crédito acessível e aluguel social para quem precisa. E urbanizar nossas favelas com dignidade.`,
  
  // TRANSPARÊNCIA
  'corrupção': `Tolerância zero com corrupção! Sempre tive ficha limpa. Proponho: dados abertos em tempo real, orçamento participativo, inteligência artificial para detectar fraudes. O dinheiro público é sagrado!`,
  'transparência': `Governo transparente é compromisso! Todos os gastos em tempo real na internet. Orçamento participativo para o povo decidir. Serviços públicos 100% digitais. Fim do fura-fila. É assim que se governa: às claras!`,
  
  // CULTURA E ESPORTE
  'cultura': `Cultura é direito, não luxo! Propostas: Vale Cultura de 100 reais por mês para trabalhadores. 10 mil novos Pontos de Cultura. Apoio a artistas locais. A cultura transforma vidas e comunidades!`,
  'esporte': `Esporte para todos! Praças da Juventude com equipamentos em cada bairro. Bolsa Atleta ampliada para esportes amadores. Esporte é saúde, é cidadania, é oportunidade!`,
  
  // ECONOMIA
  'economia': `Sou economista e sei que o Brasil pode mais! Desenvolvimento com justiça social. Reforma tributária progressiva - rico paga mais. Combate à sonegação que perde 600 bilhões por ano. Eficiência no gasto público. Não prometo milagres, prometo trabalho!`,
  'impostos': `Não vou aumentar impostos para a classe média! O que proponho é justiça: reforma tributária progressiva, quem ganha mais paga mais. E combater a sonegação. Assim tem dinheiro para educação, saúde e segurança.`,
  
  // COMPROMISSOS
  'promessas': `Não prometo milagres, prometo trabalho! Meus compromissos: não aumentar impostos para classe média, manter responsabilidade fiscal, respeitar a Constituição, governar para todos sem distinção, prestar contas mensalmente. Política se faz com as pessoas!`,
  
  // DESPEDIDAS
  'obrigado': `Eu que agradeço! Conte comigo. Juntos vamos construir um Brasil que cuida de verdade. Um abraço!`,
  'tchau': `Até mais! Não esquece: ${POLITICO.apelido} ${POLITICO.numero}! Juntos por um Brasil que cuida. Um abraço!`,
  'valeu': `Valeu! Qualquer dúvida, estou aqui. ${POLITICO.apelido} ${POLITICO.numero}!`,
  
  // Número
  '47': `Isso! ${POLITICO.apelido} ${POLITICO.numero}! Juntos por um Brasil que cuida. Conto com seu voto!`,
  'número': `Meu número é ${POLITICO.numero}! ${POLITICO.apelido} ${POLITICO.numero}. Fácil de lembrar!`,
};

// Função para encontrar resposta
function encontrarResposta(mensagem: string): string {
  const msgLower = mensagem.toLowerCase().trim();
  
  // Busca por palavras-chave
  for (const [chave, resposta] of Object.entries(RESPOSTAS)) {
    if (msgLower.includes(chave)) {
      return resposta;
    }
  }
  
  // Resposta padrão
  return `Obrigado pela sua mensagem! Sou ${POLITICO.nome}, o ${POLITICO.apelido} ${POLITICO.numero}. ${POLITICO.slogan}! Pode me perguntar sobre educação, saúde, emprego, meio ambiente, segurança, moradia, ou qualquer proposta do meu programa. Estou aqui para conversar com você!`;
}

interface Mensagem {
  id: number;
  texto: string;
  remetente: 'usuario' | 'politico';
  timestamp: Date;
}

export default function App() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: 0,
      texto: `Olá! Sou ${POLITICO.nome}, o ${POLITICO.apelido}! Candidato a governador pelo ${POLITICO.numero}. Meu lema é: "${POLITICO.slogan}". Quer saber sobre minhas propostas para educação, saúde, emprego ou meio ambiente? É só perguntar!`,
      remetente: 'politico',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  // Falar a mensagem de boas-vindas
  useEffect(() => {
    const timer = setTimeout(() => {
      falarMensagem(mensagens[0].texto);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Função para falar (TTS)
  const falarMensagem = async (texto: string) => {
    setIsSpeaking(true);
    try {
      await Speech.speak(texto, {
        language: 'pt-BR',
        pitch: 1.0,
        rate: 0.88,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('Erro ao falar:', error);
      setIsSpeaking(false);
    }
  };

  // Parar fala
  const pararFala = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  // Enviar mensagem
  const enviarMensagem = async () => {
    if (!inputText.trim()) return;

    const novaMensagemUsuario: Mensagem = {
      id: mensagens.length,
      texto: inputText.trim(),
      remetente: 'usuario',
      timestamp: new Date(),
    };

    setMensagens((prev) => [...prev, novaMensagemUsuario]);
    setInputText('');
    setIsLoading(true);

    // Simular delay de resposta
    setTimeout(() => {
      const resposta = encontrarResposta(novaMensagemUsuario.texto);
      const novaMensagemPolitico: Mensagem = {
        id: mensagens.length + 1,
        texto: resposta,
        remetente: 'politico',
        timestamp: new Date(),
      };

      setMensagens((prev) => [...prev, novaMensagemPolitico]);
      setIsLoading(false);
      
      // Falar a resposta
      falarMensagem(resposta);
    }, 1200);
  };

  // Iniciar gravação de áudio
  const iniciarGravacao = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        alert('Permissão de microfone necessária para gravar áudio');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
    }
  };

  // Parar gravação
  const pararGravacao = async () => {
    if (!recordingRef.current) return;

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setIsRecording(false);

      // Placeholder - integrar com Whisper API no futuro
      setInputText('Olá, Titanio!');
    } catch (error) {
      console.error('Erro ao parar gravação:', error);
      setIsRecording(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={POLITICO.corPrimaria} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>47</Text>
            </View>
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerNome}>{POLITICO.apelido}</Text>
            <Text style={styles.headerCargo}>{POLITICO.nome}</Text>
            <Text style={styles.headerPartido}>{POLITICO.cargo} • {POLITICO.numero}</Text>
          </View>
        </View>
        <Text style={styles.slogan}>"{POLITICO.slogan}"</Text>
      </View>

      {/* Chat Messages */}
      <KeyboardAvoidingView
        style={styles.chatWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {mensagens.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.mensagemContainer,
                msg.remetente === 'usuario' ? styles.mensagemUsuario : styles.mensagemPolitico,
              ]}
            >
              <Text
                style={[
                  styles.mensagemTexto,
                  msg.remetente === 'usuario' ? styles.textoUsuario : styles.textoPolitico,
                ]}
              >
                {msg.texto}
              </Text>
              <View style={styles.mensagemFooter}>
                <Text style={[styles.timestamp, msg.remetente === 'usuario' && styles.timestampUsuario]}>
                  {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {msg.remetente === 'politico' && (
                  <TouchableOpacity
                    style={styles.speakButton}
                    onPress={() => (isSpeaking ? pararFala() : falarMensagem(msg.texto))}
                  >
                    <Text style={styles.speakButtonText}>{isSpeaking ? '⏹️' : '🔊'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          {isLoading && (
            <View style={[styles.mensagemContainer, styles.mensagemPolitico]}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={POLITICO.corPrimaria} />
                <Text style={styles.digitando}>Digitando...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={[styles.micButton, isRecording && styles.micButtonActive]}
            onPress={isRecording ? pararGravacao : iniciarGravacao}
          >
            <Text style={styles.micButtonText}>{isRecording ? '⏹️' : '🎤'}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Pergunte sobre as propostas..."
            placeholderTextColor="#888"
            multiline
            returnKeyType="send"
            onSubmitEditing={enviarMensagem}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={enviarMensagem}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: POLITICO.corFundo,
  },
  header: {
    backgroundColor: POLITICO.corPrimaria,
    paddingTop: Platform.OS === 'ios' ? 50 : 35,
    paddingBottom: 12,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: POLITICO.corSecundaria,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: POLITICO.corPrimaria,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4ade80',
    borderWidth: 2,
    borderColor: POLITICO.corPrimaria,
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  headerNome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerCargo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    marginTop: 1,
  },
  headerPartido: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 1,
  },
  slogan: {
    fontSize: 12,
    fontStyle: 'italic',
    color: POLITICO.corSecundaria,
    marginTop: 8,
    textAlign: 'center',
  },
  chatWrapper: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 12,
    paddingBottom: 20,
  },
  mensagemContainer: {
    maxWidth: '85%',
    marginBottom: 8,
    padding: 12,
    borderRadius: 18,
  },
  mensagemUsuario: {
    alignSelf: 'flex-end',
    backgroundColor: POLITICO.corPrimaria,
    borderBottomRightRadius: 4,
  },
  mensagemPolitico: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  mensagemTexto: {
    fontSize: 15,
    lineHeight: 21,
  },
  textoUsuario: {
    color: '#fff',
  },
  textoPolitico: {
    color: '#1a1a1a',
  },
  mensagemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
  timestampUsuario: {
    color: 'rgba(255,255,255,0.7)',
  },
  speakButton: {
    padding: 4,
  },
  speakButtonText: {
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  digitando: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  micButtonActive: {
    backgroundColor: POLITICO.corSecundaria,
  },
  micButtonText: {
    fontSize: 20,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1a1a1a',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: POLITICO.corPrimaria,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    fontSize: 20,
    color: '#fff',
  },
});
