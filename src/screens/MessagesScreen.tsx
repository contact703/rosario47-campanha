import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiService from '../services/api';

const COLORS = {
  primary: '#10B981',
  secondary: '#F59E0B',
  dark: '#059669',
  white: '#FFFFFF',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
};

interface Conversation {
  other_user_id: string;
  other_user_name: string;
  other_user_avatar: string | null;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender_name: string;
}

interface Props {
  user: any;
}

export default function MessagesScreen({ user }: Props) {
  const insets = useSafeAreaInsets();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await apiService.getConversations();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      // Mock data for demo
      setConversations([
        {
          other_user_id: '1',
          other_user_name: 'Coordenação Campanha',
          other_user_avatar: null,
          last_message: 'Pessoal, reunião amanhã às 19h!',
          last_message_at: new Date().toISOString(),
          unread_count: 3,
        },
        {
          other_user_id: '2',
          other_user_name: 'Maria Silva',
          other_user_avatar: null,
          last_message: 'Ok, vou levar as bandeiras',
          last_message_at: new Date(Date.now() - 3600000).toISOString(),
          unread_count: 0,
        },
        {
          other_user_id: '3',
          other_user_name: 'João Santos',
          other_user_avatar: null,
          last_message: 'Conseguiu os santinhos?',
          last_message_at: new Date(Date.now() - 7200000).toISOString(),
          unread_count: 1,
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMessages = async (userId: string) => {
    setLoadingMessages(true);
    try {
      const data = await apiService.getMessages(userId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      // Mock messages
      setMessages([
        { id: '1', sender_id: userId, content: 'Olá, tudo bem?', created_at: new Date(Date.now() - 7200000).toISOString(), sender_name: 'Outro' },
        { id: '2', sender_id: user.id, content: 'Tudo ótimo! E você?', created_at: new Date(Date.now() - 3600000).toISOString(), sender_name: user.name },
        { id: '3', sender_id: userId, content: 'Vamos na carreata sábado?', created_at: new Date(Date.now() - 1800000).toISOString(), sender_name: 'Outro' },
      ]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const openConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.other_user_id);
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    setSendingMessage(true);
    const content = messageText.trim();
    setMessageText('');

    try {
      await apiService.sendMessage(selectedConversation.other_user_id, content);
      
      // Add message locally
      const newMessage: Message = {
        id: Date.now().toString(),
        sender_id: user.id,
        content,
        created_at: new Date().toISOString(),
        sender_name: user.name,
      };
      setMessages(prev => [...prev, newMessage]);
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // Add locally anyway for demo
      const newMessage: Message = {
        id: Date.now().toString(),
        sender_id: user.id,
        content,
        created_at: new Date().toISOString(),
        sender_name: user.name,
      };
      setMessages(prev => [...prev, newMessage]);
    } finally {
      setSendingMessage(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 1) return 'Agora';
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => openConversation(item)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.other_user_name.charAt(0).toUpperCase()}
        </Text>
        {item.unread_count > 0 && (
          <View style={styles.onlineDot} />
        )}
      </View>
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName} numberOfLines={1}>
            {item.other_user_name}
          </Text>
          <Text style={styles.conversationTime}>{formatTime(item.last_message_at)}</Text>
        </View>
        <View style={styles.conversationPreview}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.last_message}
          </Text>
          {item.unread_count > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread_count}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender_id === user.id;
    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.otherMessage]}>
        <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.otherBubble]}>
          <Text style={[styles.messageText, isMe && styles.myMessageText]}>
            {item.content}
          </Text>
          <Text style={[styles.messageTime, isMe && styles.myMessageTime]}>
            {new Date(item.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 80 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mensagens</Text>
        <TouchableOpacity style={styles.newMessageBtn}>
          <Ionicons name="create-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar conversa..."
          placeholderTextColor={COLORS.gray}
        />
      </View>

      {/* Conversations List */}
      <FlatList
        data={conversations}
        keyExtractor={item => item.other_user_id}
        renderItem={renderConversation}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadConversations} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={60} color={COLORS.gray} />
            <Text style={styles.emptyText}>Nenhuma conversa ainda</Text>
          </View>
        }
      />

      {/* Chat Modal */}
      <Modal
        visible={selectedConversation !== null}
        animationType="slide"
        onRequestClose={() => setSelectedConversation(null)}
      >
        <KeyboardAvoidingView 
          style={styles.chatModal}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelectedConversation(null)}>
              <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
            </TouchableOpacity>
            <View style={styles.chatHeaderInfo}>
              <View style={styles.smallAvatar}>
                <Text style={styles.smallAvatarText}>
                  {selectedConversation?.other_user_name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.chatHeaderName}>{selectedConversation?.other_user_name}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={24} color={COLORS.dark} />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          {loadingMessages ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id}
              renderItem={renderMessage}
              contentContainerStyle={styles.messagesList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            />
          )}

          {/* Input */}
          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatInput}
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Digite sua mensagem..."
              placeholderTextColor={COLORS.gray}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!messageText.trim() || sendingMessage}
            >
              {sendingMessage ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Ionicons name="send" size={20} color={messageText.trim() ? COLORS.white : COLORS.gray} />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  newMessageBtn: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    flex: 1,
  },
  conversationTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
  conversationPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.gray,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
  chatModal: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  smallAvatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
  },
  myBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: COLORS.lightGray,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: COLORS.dark,
  },
  myMessageText: {
    color: COLORS.white,
  },
  messageTime: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
  },
  chatInput: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 24,
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
