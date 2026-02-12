import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Keyboard,
  Alert,
  Image,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { 
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { CANDIDATO, FOTOS } from '../config/candidato';
import API from '../config/api';

const COLORS = {
  primary: '#10B981',
  secondary: '#F59E0B',
  dark: '#059669',
  white: '#FFFFFF',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
};

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// ============================================
// BASE DE CONHECIMENTO LOCAL - FUNCIONA OFFLINE
// ============================================
const CONHECIMENTO = {
  saudacao: {
    palavras: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'e aí', 'eai', 'salve'],
    resposta: `Olá! 👋 Aqui é a **Equipe Rosário**, a equipe de campanha do candidato a vereador **${CANDIDATO.nome} - ${CANDIDATO.numero}**!

Podemos te ajudar com:
• 📋 Propostas do candidato
• 📅 Eventos da campanha  
• 📞 Informações de contato
• 👤 Quem é ${CANDIDATO.nome}

Sobre o que gostaria de saber? 💚`
  },
  
  quem: {
    palavras: ['quem', 'sobre', 'candidato', 'história', 'biografia', 'apresenta', 'conhecer'],
    resposta: `👤 **${CANDIDATO.nomeCompleto}**

${CANDIDATO.nome} tem mais de 20 anos de experiência no serviço público. Nascido e criado em nossa cidade, conhece de perto as necessidades da população.

📋 **Informações:**
• Profissão: ${CANDIDATO.profissao}
• Formação: ${CANDIDATO.formacao}
• Partido: ${CANDIDATO.partido}
• Número: ${CANDIDATO.numero}

🗣️ "${CANDIDATO.slogan}"

Quer saber mais sobre as propostas dele?`
  },
  
  propostas: {
    palavras: ['proposta', 'propostas', 'projeto', 'plano', 'programa', 'vai fazer', 'promete', 'promessa'],
    resposta: `📋 **Principais Propostas do ${CANDIDATO.nome} ${CANDIDATO.numero}:**

🏥 **SAÚDE**
• Postos de saúde funcionando até 22h
• Mais médicos especialistas
• UPA 24h funcionando de verdade
• Mutirões de exames mensais

📚 **EDUCAÇÃO**  
• Ar condicionado em todas as escolas
• Quadras poliesportivas cobertas
• Mais vagas em creches
• Cursos profissionalizantes gratuitos

🚌 **TRANSPORTE**
• Mais linhas de ônibus nos bairros
• Tarifa social para desempregados
• Ciclovias seguras
• Abrigos com cobertura

🛡️ **SEGURANÇA**
• Iluminação pública em todos os bairros
• Ronda 24h nos bairros
• Câmeras nas praças
• Guarda municipal reforçada

Quer detalhes sobre alguma área específica?`
  },
  
  saude: {
    palavras: ['saúde', 'saude', 'hospital', 'posto', 'médico', 'medico', 'upa', 'remédio', 'remedio', 'doença', 'doente'],
    resposta: `🏥 **Propostas para SAÚDE:**

${CANDIDATO.nome} acredita que saúde é prioridade!

✅ **O que vamos fazer:**

1️⃣ **Postos de Saúde até 22h**
   Horário estendido para quem trabalha

2️⃣ **Mais Especialistas**
   Cardiologista, ortopedista, pediatra nos bairros

3️⃣ **UPA 24h Funcionando**
   Equipamentos e profissionais adequados

4️⃣ **Mutirões Mensais**
   Exames, consultas e cirurgias

5️⃣ **Farmácia Popular**
   Remédios gratuitos para quem precisa

A saúde do povo é nossa prioridade! 💚`
  },
  
  educacao: {
    palavras: ['educação', 'educacao', 'escola', 'creche', 'professor', 'ensino', 'estudar', 'aluno'],
    resposta: `📚 **Propostas para EDUCAÇÃO:**

Educação transforma vidas!

✅ **O que vamos fazer:**

1️⃣ **Ar Condicionado nas Escolas**
   Ambiente adequado para aprender

2️⃣ **Quadras Cobertas**
   Esporte e lazer para os jovens

3️⃣ **Mais Vagas em Creches**
   Fim das filas de espera

4️⃣ **Valorização dos Professores**
   Salários dignos e formação continuada

5️⃣ **Cursos Profissionalizantes**
   Preparando jovens para o mercado

Educação é o caminho para o futuro! 📖`
  },
  
  eventos: {
    palavras: ['evento', 'eventos', 'carreata', 'comício', 'comicio', 'reunião', 'reuniao', 'encontro', 'agenda', 'quando', 'onde'],
    resposta: `📅 **Próximos Eventos da Campanha:**

🚗 **CARREATA**
📆 Sábado, 14h
📍 Saída: Praça Central
🎉 Traga sua família!

👥 **REUNIÃO COM MORADORES**
📆 Terça-feira, 19h
📍 Comitê de Campanha
🗣️ Venha dar sua opinião!

📢 **PANFLETAGEM**
📆 Quarta-feira, 8h
📍 Feira do Centro
📋 Ajude a divulgar!

🎤 **DEBATE**
📆 Quinta-feira, 20h
📍 Câmara Municipal
📺 Ao vivo nas redes!

Quer participar? Entre em contato! 💚`
  },
  
  contato: {
    palavras: ['contato', 'telefone', 'whatsapp', 'zap', 'ligar', 'email', 'endereço', 'endereco', 'comitê', 'comite', 'falar', 'conversar'],
    resposta: `📞 **Contatos da Campanha:**

📱 **WhatsApp:**
(31) 99999-9999
Clique para falar conosco!

📧 **Email:**
contato@rosario47.com.br

📍 **Comitê de Campanha:**
Rua das Flores, 123 - Centro
Aberto: Seg-Sáb, 9h às 18h

📲 **Redes Sociais:**
• Instagram: @rosario47
• Facebook: /rosario47
• Twitter: @rosario47

Estamos esperando você! 💚`
  },
  
  votar: {
    palavras: ['votar', 'voto', 'urna', 'eleição', 'eleicao', 'número', 'numero', 'digitar'],
    resposta: `🗳️ **Como Votar no ${CANDIDATO.nome}:**

Na urna, digite:

╔═══════════════╗
║     4️⃣ 7️⃣      ║
║               ║
║   CONFIRMA    ║
╚═══════════════╝

${CANDIDATO.numero} - ${CANDIDATO.nome}
${CANDIDATO.partido}

Lembre-se: vote consciente!
Dia da eleição: 6 de outubro

Seu voto faz a diferença! 💚`
  },
  
  ajuda: {
    palavras: ['ajuda', 'help', 'menu', 'opções', 'opcoes', 'comandos', 'o que', 'como'],
    resposta: `🤖 **Como posso ajudar:**

Digite sobre o que quer saber:

📋 **"propostas"** - Conheça nosso programa
🏥 **"saúde"** - Propostas para saúde
📚 **"educação"** - Propostas para educação
📅 **"eventos"** - Agenda da campanha
📞 **"contato"** - Fale conosco
👤 **"quem é"** - Sobre o candidato
🗳️ **"votar"** - Como votar

Ou faça uma pergunta livre!
Estou aqui para ajudar 💚`
  },
  
  agradecimento: {
    palavras: ['obrigado', 'obrigada', 'valeu', 'thanks', 'agradeço', 'agradeco', 'show', 'top', 'massa'],
    resposta: `😊 Por nada! Fico feliz em ajudar!

Lembre-se:
🗳️ Vote ${CANDIDATO.numero} - ${CANDIDATO.nome}
"${CANDIDATO.slogan}"

Podemos ajudar com mais alguma coisa? 💚`
  }
};

const RESPOSTA_PADRAO = `Desculpe, não entendemos bem sua pergunta. 🤔

A Equipe Rosário pode te ajudar com:
• Propostas (saúde, educação, transporte, segurança)
• Eventos da campanha
• Contato
• Informações sobre o candidato

Digite "ajuda" para ver todas as opções!`;

// Função para encontrar resposta
function encontrarResposta(texto: string): string {
  const textoLower = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  for (const [, categoria] of Object.entries(CONHECIMENTO)) {
    for (const palavra of categoria.palavras) {
      const palavraNorm = palavra.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (textoLower.includes(palavraNorm)) {
        return categoria.resposta;
      }
    }
  }
  
  return RESPOSTA_PADRAO;
}

const MENSAGEM_INICIAL: Message = {
  id: '0',
  text: `Olá! 👋 Aqui é a **Equipe Rosário**, a equipe de campanha do candidato a vereador **${CANDIDATO.nome} - ${CANDIDATO.numero}**!

Podemos te ajudar com:
• 📋 Propostas do candidato
• 📅 Eventos da campanha
• 📞 Informações de contato

Sobre o que gostaria de saber? 💚`,
  isUser: false,
  timestamp: new Date(),
};

interface Props {
  user: any;
}

export default function ChatScreen({ user }: Props) {
  const [messages, setMessages] = useState<Message[]>([MENSAGEM_INICIAL]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const sendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Adiciona mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Chama o backend com IA
      const response = await fetch(API.chat, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });
      
      const data = await response.json();
      const resposta = data.response || encontrarResposta(messageText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: resposta,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Fallback local se o backend falhar
      const resposta = encontrarResposta(messageText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: resposta,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleSpeak = async (text: string) => {
    if (isSpeaking) {
      await Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    
    // Limpa formatação markdown e emojis para TTS
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/[📋📅📞👤🏥📚🚌🛡️💚🗳️🤖😊👋✅1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣🎉🗣️📢📱📧📍📲🎤🚗👥╔═╗║╚]/g, '')
      .replace(/\n+/g, '. ');

    Speech.speak(cleanText, {
      language: 'pt-BR',
      pitch: 1.0,
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  // Speech Recognition Events
  useSpeechRecognitionEvent("result", (event) => {
    const transcript = event.results[0]?.transcript;
    if (transcript) {
      setInputText(transcript);
      // Se for resultado final, envia automaticamente
      if (event.isFinal) {
        sendMessage(transcript);
        setIsListening(false);
      }
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    console.log("Speech error:", event.error);
    setIsListening(false);
    if (event.error === "no-speech") {
      Alert.alert("Não ouvi nada", "Tente falar mais perto do microfone.");
    }
  });

  useSpeechRecognitionEvent("end", () => {
    setIsListening(false);
  });

  const toggleVoiceInput = async () => {
    if (isListening) {
      // Parar de ouvir
      ExpoSpeechRecognitionModule.stop();
      setIsListening(false);
    } else {
      // Verificar permissão
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        Alert.alert(
          "Permissão necessária",
          "Permita o acesso ao microfone para usar a transcrição de voz.",
          [{ text: "OK" }]
        );
        return;
      }

      // Iniciar reconhecimento de voz
      setIsListening(true);
      ExpoSpeechRecognitionModule.start({
        lang: "pt-BR",
        interimResults: true,
        maxAlternatives: 1,
        continuous: false,
      });
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.botMessage
    ]}>
      {!item.isUser && (
        <Image 
          source={FOTOS.retrato} 
          style={styles.botAvatarImage}
        />
      )}
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.botBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userText : styles.botText
        ]}>
          {item.text}
        </Text>
        {!item.isUser && (
          <TouchableOpacity 
            style={styles.speakButton}
            onPress={() => handleSpeak(item.text)}
          >
            <Ionicons 
              name={isSpeaking ? "stop-circle" : "volume-high"} 
              size={18} 
              color={isSpeaking ? COLORS.secondary : COLORS.primary} 
            />
            <Text style={styles.speakButtonText}>
              {isSpeaking ? 'Parar' : 'Ouvir'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const SUGESTOES = ['Propostas', 'Saúde', 'Educação', 'Eventos', 'Contato', 'Quem é Antunes?'];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Image 
            source={FOTOS.retrato} 
            style={styles.headerAvatarImage}
          />
          <View>
            <Text style={styles.headerTitle}>{CANDIDATO.nome}</Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.headerSubtitle}>Online agora</Text>
            </View>
          </View>
        </View>
        <View style={styles.numeroBadge}>
          <Text style={styles.numeroText}>{CANDIDATO.numero}</Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          isTyping ? (
            <View style={styles.typingContainer}>
              <Image source={FOTOS.retrato} style={styles.botAvatarImage} />
              <View style={styles.typingBubble}>
                <Text style={styles.typingText}>Digitando</Text>
                <ActivityIndicator size="small" color={COLORS.primary} style={{ marginLeft: 8 }} />
              </View>
            </View>
          ) : null
        }
      />

      {/* Sugestões */}
      <View style={styles.suggestionsContainer}>
        {SUGESTOES.map((sugestao) => (
          <TouchableOpacity
            key={sugestao}
            style={styles.suggestionChip}
            onPress={() => sendMessage(sugestao)}
          >
            <Text style={styles.suggestionText}>{sugestao}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input */}
      <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity 
          style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
          onPress={toggleVoiceInput}
        >
          <Ionicons 
            name={isListening ? "mic" : "mic-outline"} 
            size={24} 
            color={isListening ? COLORS.white : COLORS.primary} 
          />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Digite sua mensagem..."
          placeholderTextColor={COLORS.gray}
          multiline
          maxLength={500}
          onSubmitEditing={() => sendMessage()}
        />
        
        <TouchableOpacity 
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={() => sendMessage()}
          disabled={!inputText.trim()}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={inputText.trim() ? COLORS.white : COLORS.gray} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    backgroundColor: COLORS.dark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 6,
  },
  headerSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  numeroBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  numeroText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  botAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 14,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: COLORS.white,
  },
  botText: {
    color: COLORS.dark,
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
    padding: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
  },
  speakButtonText: {
    marginLeft: 6,
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '500',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  typingText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    paddingTop: 8,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  suggestionText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  voiceButtonActive: {
    backgroundColor: COLORS.primary,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
});
