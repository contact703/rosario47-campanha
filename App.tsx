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
// CONFIGURAÇÃO DO POLÍTICO - FABIANO HORTA
// ============================================
const POLITICO = {
  nome: 'Fabiano Horta',
  nomeCompleto: 'Fabiano Taques Horta',
  cargo: 'Ex-Prefeito de Maricá (2017-2024)',
  partido: 'PT - Partido dos Trabalhadores',
  nascimento: '25 de agosto de 1974',
  naturalidade: 'Niterói, RJ',
  profissao: 'Médico Veterinário',
  formacao: 'Veterinária pela UFF',
  corPrimaria: '#cc0000', // Vermelho PT
  corSecundaria: '#ffffff',
  corFundo: '#1a1a2e',
};

// ============================================
// RESPOSTAS DO POLÍTICO
// ============================================
const RESPOSTAS: { [key: string]: string } = {
  // Saudações
  'oi': `Olá, companheiro! Sou ${POLITICO.nome}, ex-prefeito de Maricá pelo PT. Fico feliz em conversar com você. O que gostaria de saber sobre nossa gestão?`,
  'olá': `Olá, companheiro! Sou ${POLITICO.nome}, ex-prefeito de Maricá pelo PT. Fico feliz em conversar com você. O que gostaria de saber sobre nossa gestão?`,
  'bom dia': `Bom dia, companheiro! ${POLITICO.nome} aqui. Como posso ajudar você hoje?`,
  'boa tarde': `Boa tarde, companheiro! ${POLITICO.nome} aqui. Como posso ajudar você hoje?`,
  'boa noite': `Boa noite, companheiro! ${POLITICO.nome} aqui. Como posso ajudar você hoje?`,
  
  // Quem é
  'quem é você': `Sou ${POLITICO.nomeCompleto}, nascido em ${POLITICO.naturalidade}. Sou ${POLITICO.profissao} formado pela UFF e militante do PT desde 1999. Fui vereador de Maricá por dois mandatos, deputado federal e prefeito de Maricá de 2017 a 2024. Junto com o companheiro Quaquá, transformamos Maricá em referência nacional de políticas públicas.`,
  'sua história': `Comecei minha militância política ainda adolescente no PT. Fui eleito vereador em 2008 e reeleito em 2012, chegando a ser presidente da Câmara Municipal. Em 2014, fui eleito deputado federal com quase 38 mil votos. Em 2016, fui eleito prefeito de Maricá com 96% dos votos, sendo reeleito em 2020. Nossa gestão transformou Maricá em um laboratório de políticas públicas inovadoras.`,
  
  // Políticas principais
  'vermelhinho': `O Vermelhinho é nosso orgulho! Criamos a Empresa Pública de Transporte de Maricá com transporte 100% gratuito para a população. Temos a maior frota de ônibus elétricos da América Latina! O passe-livre beneficia milhares de maricaenses diariamente, garantindo o direito de ir e vir sem custo.`,
  'transporte': `O transporte público gratuito de Maricá é referência mundial! Os Vermelhinhos atendem toda a cidade sem cobrar passagem. Implantamos também ônibus elétricos, mostrando que é possível ter transporte público de qualidade, gratuito e sustentável.`,
  
  'mumbuca': `A Mumbuca é nossa moeda social digital, pioneira no Brasil! Ela garante a circulação da renda dentro de Maricá, fortalecendo o comércio local. Com a Mumbuca, implementamos a Renda Básica de Cidadania, beneficiando milhares de famílias maricaenses.`,
  'renda básica': `O Programa Renda Básica de Cidadania de Maricá é o maior programa de renda básica municipal do Brasil! Todos os moradores cadastrados recebem mensalmente em Mumbuca, nossa moeda social. Isso garante dignidade às famílias e movimenta a economia local.`,
  'moeda social': `A Mumbuca é nossa moeda social digital que circula apenas em Maricá. Ela é usada para pagar a Renda Básica de Cidadania e pode ser usada no comércio local. Isso mantém a riqueza circulando na cidade e fortalece nossos comerciantes.`,
  
  'saúde': `Na saúde, investimos pesado! Construímos UPAs, ampliamos as clínicas da família e contratamos mais profissionais. Maricá tem um dos maiores investimentos per capita em saúde do estado. Nosso compromisso é garantir atendimento de qualidade para todos.`,
  
  'educação': `A educação é prioridade absoluta! Maricá tem um dos maiores investimentos per capita em educação do Brasil. Temos escolas em tempo integral, tablets para alunos, professores bem remunerados e merenda escolar de qualidade. Educação transforma vidas!`,
  
  'emprego': `Geramos milhares de empregos em Maricá! Com os royalties do petróleo bem aplicados, investimos em infraestrutura, turismo e novas empresas. A Film Commission atrai produções audiovisuais, o turismo cresce e a economia local se fortalece.`,
  
  'turismo': `Maricá tem um potencial turístico imenso! Praias paradisíacas, lagoas, serras e rica cultura. Investimos em infraestrutura turística e criamos a Film Commission para atrair produções de cinema e TV. Turismo gera emprego e renda para nossa gente.`,
  
  'royalties': `Os royalties do petróleo são aplicados com responsabilidade em Maricá. Em vez de gastar tudo de uma vez, investimos em políticas públicas que transformam a vida das pessoas: Renda Básica, Vermelhinho, saúde, educação. O dinheiro do povo voltando para o povo!`,
  
  'pt': `Sou militante do PT desde 1999. O Partido dos Trabalhadores representa a luta dos trabalhadores brasileiros por dignidade, emprego e justiça social. Em Maricá, mostramos que é possível governar para o povo, com políticas públicas que transformam vidas.`,
  'partido': `O PT é minha casa desde 1999. Nossa gestão em Maricá provou que os ideais do partido funcionam na prática: renda básica, transporte gratuito, investimento em saúde e educação. Governar para o povo, não para os ricos!`,
  
  'quaquá': `Washington Quaquá é meu companheiro de luta! Juntos construímos a Maricá que é hoje referência nacional. Ele foi prefeito antes de mim e voltou em 2025. Nossa parceria mostra a força da política feita com seriedade e compromisso com o povo.`,
  
  // Despedidas
  'obrigado': `Eu que agradeço, companheiro! A luta continua. Juntos somos mais fortes! Um abraço!`,
  'tchau': `Até mais, companheiro! Conte sempre comigo. A luta por uma Maricá melhor continua! Um abraço!`,
  'valeu': `Valeu, companheiro! Qualquer dúvida, estou à disposição. A luta continua!`,
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
  return `Obrigado pela sua mensagem, companheiro! Como ex-prefeito de Maricá, trabalhei muito por nossa cidade. Pode me perguntar sobre o Vermelhinho (transporte gratuito), a Mumbuca (moeda social), Renda Básica, saúde, educação, ou qualquer política da nossa gestão. Estou aqui para conversar!`;
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
      texto: `Olá, companheiro! Sou ${POLITICO.nome}, ex-prefeito de Maricá pelo PT. Durante minha gestão, implementamos políticas como o Vermelhinho (transporte gratuito), a Mumbuca (moeda social) e a Renda Básica de Cidadania. O que gostaria de saber?`,
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
        pitch: 0.95,
        rate: 0.85,
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

      // Por enquanto, usar placeholder
      // TODO: Integrar com API de transcrição (Whisper)
      setInputText('Olá, Fabiano!');
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
              <Text style={styles.avatarText}>FH</Text>
            </View>
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerNome}>{POLITICO.nome}</Text>
            <Text style={styles.headerCargo}>{POLITICO.cargo}</Text>
            <Text style={styles.headerPartido}>{POLITICO.partido}</Text>
          </View>
        </View>
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
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#999"
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
    backgroundColor: '#f0f2f5',
  },
  header: {
    backgroundColor: POLITICO.corPrimaria,
    paddingTop: Platform.OS === 'ios' ? 50 : 35,
    paddingBottom: 15,
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
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: 22,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerCargo: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  headerPartido: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 1,
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
    backgroundColor: POLITICO.corPrimaria,
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
