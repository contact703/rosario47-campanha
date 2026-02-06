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
  Image,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

// Configuração do político
const POLITICO = {
  nome: 'Fabiano Horta',
  cargo: 'Prefeito de Maricá',
  partido: 'PT',
  avatar: require('./assets/icon.png'), // Substitua pela foto real
  corPrimaria: '#1a365d',
  corSecundaria: '#c53030',
};

// Respostas pré-definidas do político (baseadas no chat anterior)
const RESPOSTAS: { [key: string]: string } = {
  'quem é você': `Sou ${POLITICO.nome}, ${POLITICO.cargo} pelo ${POLITICO.partido}. Estou aqui para conversar com você sobre Maricá e ouvir suas demandas.`,
  'oi': `Olá! Sou ${POLITICO.nome}, ${POLITICO.cargo}. Como posso ajudar você hoje?`,
  'olá': `Olá! Sou ${POLITICO.nome}, ${POLITICO.cargo}. Como posso ajudar você hoje?`,
  'saúde': 'A saúde é prioridade em nossa gestão. Investimos em UPAs, clínicas da família e contratação de profissionais. O que você gostaria de saber especificamente?',
  'educação': 'Maricá tem um dos maiores investimentos per capita em educação do Brasil. Temos escolas em tempo integral, tablets para alunos e professores bem remunerados.',
  'renda básica': 'O programa Renda Básica de Cidadania de Maricá é pioneiro no Brasil. Todos os moradores cadastrados recebem mensalmente em Mumbuca, nossa moeda social.',
  'mumbuca': 'A Mumbuca é nossa moeda social digital. Ela circula na economia local, fortalecendo o comércio de Maricá e garantindo que a renda fique na cidade.',
  'transporte': 'Maricá tem o Vermelhinho, nosso sistema de transporte público gratuito. São ônibus modernos que atendem toda a cidade sem custo para o cidadão.',
  'vermelhinho': 'O Vermelhinho é nosso orgulho! Transporte público gratuito e de qualidade para todos os maricaenses. Temos a maior frota de ônibus elétricos da América Latina.',
  'emprego': 'Estamos trabalhando para gerar mais empregos em Maricá. Com a Film Commission, o turismo e os novos investimentos, a cidade está crescendo de forma sustentável.',
  'turismo': 'Maricá tem praias lindas, lagoas, montanhas e uma rica cultura. Estamos investindo em infraestrutura turística para atrair visitantes de todo o Brasil.',
  'obrigado': 'Eu que agradeço sua participação! Juntos construímos uma Maricá melhor para todos.',
  'tchau': 'Até mais! Conte sempre comigo. Juntos por Maricá!',
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
  return `Obrigado pela sua mensagem. Como ${POLITICO.cargo}, estou sempre à disposição para ouvir a população. Pode me perguntar sobre saúde, educação, renda básica, transporte ou outros temas da nossa gestão.`;
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
      texto: `Olá! Sou ${POLITICO.nome}, ${POLITICO.cargo}. Estou aqui para conversar com você sobre nossa cidade. O que gostaria de saber?`,
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
        rate: 0.9,
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
    }, 1000);
  };

  // Iniciar gravação de áudio
  const iniciarGravacao = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        alert('Permissão de microfone necessária');
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

      // TODO: Enviar áudio para API de transcrição (Whisper)
      // Por enquanto, simular com texto
      setInputText('Olá, como você está?');
    } catch (error) {
      console.error('Erro ao parar gravação:', error);
      setIsRecording(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{POLITICO.nome[0]}</Text>
            </View>
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerNome}>{POLITICO.nome}</Text>
            <Text style={styles.headerCargo}>{POLITICO.cargo}</Text>
          </View>
        </View>
      </View>

      {/* Chat Messages */}
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
            <Text style={styles.timestamp}>
              {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {msg.remetente === 'politico' && (
              <TouchableOpacity
                style={styles.speakButton}
                onPress={() => (isSpeaking ? pararFala() : falarMensagem(msg.texto))}
              >
                <Text style={styles.speakButtonText}>{isSpeaking ? '🔇' : '🔊'}</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        {isLoading && (
          <View style={[styles.mensagemContainer, styles.mensagemPolitico]}>
            <ActivityIndicator size="small" color={POLITICO.corPrimaria} />
            <Text style={styles.digitando}>Digitando...</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: POLITICO.corPrimaria,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: POLITICO.corPrimaria,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4ade80',
    borderWidth: 2,
    borderColor: POLITICO.corPrimaria,
  },
  headerInfo: {
    marginLeft: 15,
  },
  headerNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerCargo: {
    fontSize: 14,
    color: '#ddd',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 15,
  },
  mensagemContainer: {
    maxWidth: '80%',
    marginBottom: 10,
    padding: 12,
    borderRadius: 18,
    position: 'relative',
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
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mensagemTexto: {
    fontSize: 16,
    lineHeight: 22,
  },
  textoUsuario: {
    color: '#fff',
  },
  textoPolitico: {
    color: '#333',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',
  },
  speakButton: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    padding: 5,
  },
  speakButtonText: {
    fontSize: 16,
  },
  digitando: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: POLITICO.corPrimaria,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    fontSize: 20,
    color: '#fff',
  },
});
