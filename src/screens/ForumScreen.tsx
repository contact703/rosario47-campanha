import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  Modal,
  ActivityIndicator,
  ScrollView,
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
  red: '#EF4444',
};

interface Post {
  id: string;
  title: string;
  content: string;
  user_name: string;
  user_avatar?: string;
  category: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  is_pinned: boolean;
  created_at: string;
}

interface Comment {
  id: string;
  content: string;
  user_name: string;
  user_avatar?: string;
  created_at: string;
}

const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: '📋', color: COLORS.gray },
  { id: 'comunicados', name: 'Comunicados', icon: '📢', color: '#EF4444' },
  { id: 'ideias', name: 'Ideias', icon: '💡', color: '#F59E0B' },
  { id: 'eventos', name: 'Eventos', icon: '📅', color: '#10B981' },
  { id: 'duvidas', name: 'Dúvidas', icon: '❓', color: '#8B5CF6' },
];

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Bem-vindos à Rede Social Rosário 47!',
    content: 'Esta é a rede social oficial da campanha de Antunes do Rosário 47. Aqui você pode acompanhar eventos, participar de discussões e se conectar com outros militantes!',
    user_name: 'Coordenação',
    category: 'comunicados',
    likes_count: 47,
    comments_count: 12,
    is_liked: false,
    is_pinned: true,
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '2',
    title: 'Carreata neste sábado!',
    content: 'Pessoal, confirmem presença na carreata deste sábado! Saída às 14h da Praça Central. Tragam bandeiras e adesivos! 🚗',
    user_name: 'Maria Silva',
    category: 'eventos',
    likes_count: 32,
    comments_count: 8,
    is_liked: true,
    is_pinned: false,
    created_at: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: '3',
    title: 'Ideias para panfletagem',
    content: 'Galera, vamos pensar em novos locais para panfletagem? Sugiro a feira do Centro às quartas-feiras.',
    user_name: 'João Santos',
    category: 'ideias',
    likes_count: 15,
    comments_count: 6,
    is_liked: false,
    is_pinned: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

interface Props {
  user: any;
}

export default function ForumScreen({ user }: Props) {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  
  // New post form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('geral');
  const [posting, setPosting] = useState(false);
  
  // New comment
  const [newComment, setNewComment] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPosts(1, selectedCategory !== 'all' ? selectedCategory : undefined);
      if (data.posts && data.posts.length > 0) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.log('Usando posts mock');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await apiService.likePost(postId);
    } catch (error) {
      console.log('Erro ao curtir');
    }
    
    // Update locally
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          is_liked: !post.is_liked,
          likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1,
        };
      }
      return post;
    }));
  };

  const openComments = async (post: Post) => {
    setSelectedPost(post);
    setShowComments(true);
    setLoadingComments(true);
    
    try {
      const data = await apiService.getComments(post.id);
      setComments(data.comments || []);
    } catch (error) {
      // Mock comments
      setComments([
        { id: '1', content: 'Ótimo post!', user_name: 'João', created_at: new Date().toISOString() },
        { id: '2', content: 'Vou participar com certeza!', user_name: 'Maria', created_at: new Date().toISOString() },
      ]);
    } finally {
      setLoadingComments(false);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim() || !selectedPost) return;
    
    setSendingComment(true);
    try {
      await apiService.createComment(selectedPost.id, newComment.trim());
    } catch (error) {
      console.log('Erro ao comentar');
    }
    
    // Add locally
    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment.trim(),
      user_name: user.name,
      created_at: new Date().toISOString(),
    };
    setComments([...comments, comment]);
    setNewComment('');
    
    // Update post comments count
    setPosts(posts.map(post => {
      if (post.id === selectedPost.id) {
        return { ...post, comments_count: post.comments_count + 1 };
      }
      return post;
    }));
    
    setSendingComment(false);
  };

  const submitPost = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    
    setPosting(true);
    try {
      await apiService.createPost(newTitle.trim(), newContent.trim(), newCategory);
    } catch (error) {
      console.log('Erro ao criar post');
    }
    
    // Add locally
    const post: Post = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      content: newContent.trim(),
      user_name: user.name,
      category: newCategory,
      likes_count: 0,
      comments_count: 0,
      is_liked: false,
      is_pinned: false,
      created_at: new Date().toISOString(),
    };
    setPosts([post, ...posts]);
    
    setNewTitle('');
    setNewContent('');
    setNewCategory('geral');
    setShowNewPost(false);
    setPosting(false);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 1) return 'Agora';
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  };

  const renderPost = ({ item }: { item: Post }) => {
    const category = getCategoryInfo(item.category);
    
    return (
      <View style={styles.postCard}>
        {item.is_pinned && (
          <View style={styles.pinnedBadge}>
            <Ionicons name="pin" size={12} color={COLORS.secondary} />
            <Text style={styles.pinnedText}>Fixado</Text>
          </View>
        )}
        
        <View style={styles.postHeader}>
          <View style={styles.authorAvatar}>
            <Text style={styles.avatarText}>{item.user_name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{item.user_name}</Text>
            <Text style={styles.postTime}>{formatTime(item.created_at)}</Text>
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: `${category.color}20` }]}>
            <Text style={[styles.categoryText, { color: category.color }]}>
              {category.name}
            </Text>
          </View>
        </View>
        
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postContent} numberOfLines={3}>{item.content}</Text>
        
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}
          >
            <Ionicons 
              name={item.is_liked ? "heart" : "heart-outline"} 
              size={20} 
              color={item.is_liked ? COLORS.red : COLORS.gray} 
            />
            <Text style={[styles.actionText, item.is_liked && { color: COLORS.red }]}>
              {item.likes_count}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => openComments(item)}
          >
            <Ionicons name="chatbubble-outline" size={20} color={COLORS.gray} />
            <Text style={styles.actionText}>{item.comments_count}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentAvatar}>
        <Text style={styles.commentAvatarText}>{item.user_name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>{item.user_name}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
        <Text style={styles.commentTime}>{formatTime(item.created_at)}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 80 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fórum</Text>
        <TouchableOpacity style={styles.newPostBtn} onPress={() => setShowNewPost(true)}>
          <Ionicons name="add-circle" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Posts */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={renderPost}
          contentContainerStyle={styles.postsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadPosts} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="newspaper-outline" size={60} color={COLORS.gray} />
              <Text style={styles.emptyText}>Nenhum post nesta categoria</Text>
            </View>
          }
        />
      )}

      {/* New Post Modal */}
      <Modal visible={showNewPost} animationType="slide">
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowNewPost(false)}>
              <Ionicons name="close" size={28} color={COLORS.dark} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Novo Post</Text>
            <TouchableOpacity 
              onPress={submitPost}
              disabled={!newTitle.trim() || !newContent.trim() || posting}
            >
              {posting ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={[
                  styles.postButton,
                  (!newTitle.trim() || !newContent.trim()) && styles.postButtonDisabled
                ]}>
                  Publicar
                </Text>
              )}
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <TextInput
              style={styles.titleInput}
              placeholder="Título do post"
              value={newTitle}
              onChangeText={setNewTitle}
              placeholderTextColor={COLORS.gray}
            />
            
            <TextInput
              style={styles.contentInput}
              placeholder="O que você quer compartilhar?"
              value={newContent}
              onChangeText={setNewContent}
              multiline
              placeholderTextColor={COLORS.gray}
            />
            
            <Text style={styles.categoryLabel}>Categoria:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CATEGORIES.filter(c => c.id !== 'all').map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    newCategory === category.id && { backgroundColor: `${category.color}30` }
                  ]}
                  onPress={() => setNewCategory(category.id)}
                >
                  <Text>{category.icon} {category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* Comments Modal */}
      <Modal visible={showComments} animationType="slide">
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowComments(false)}>
              <Ionicons name="arrow-back" size={28} color={COLORS.dark} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Comentários</Text>
            <View style={{ width: 28 }} />
          </View>
          
          {selectedPost && (
            <View style={styles.selectedPostPreview}>
              <Text style={styles.selectedPostTitle}>{selectedPost.title}</Text>
              <Text style={styles.selectedPostAuthor}>por {selectedPost.user_name}</Text>
            </View>
          )}
          
          {loadingComments ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={item => item.id}
              renderItem={renderComment}
              contentContainerStyle={styles.commentsList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Seja o primeiro a comentar!</Text>
                </View>
              }
            />
          )}
          
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Escreva um comentário..."
              value={newComment}
              onChangeText={setNewComment}
              placeholderTextColor={COLORS.gray}
            />
            <TouchableOpacity
              style={[styles.sendCommentBtn, !newComment.trim() && styles.sendCommentBtnDisabled]}
              onPress={submitComment}
              disabled={!newComment.trim() || sendingComment}
            >
              {sendingComment ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Ionicons name="send" size={20} color={newComment.trim() ? COLORS.white : COLORS.gray} />
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
    backgroundColor: COLORS.lightGray,
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
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  newPostBtn: {
    padding: 4,
  },
  categoriesContainer: {
    backgroundColor: COLORS.white,
    minHeight: 56,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
    alignItems: 'center',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryChipText: {
    color: COLORS.gray,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: COLORS.white,
  },
  postsList: {
    padding: 16,
  },
  postCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pinnedText: {
    marginLeft: 4,
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.dark,
  },
  postTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  postTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 6,
    color: COLORS.gray,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
  },
  postButton: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  postButtonDisabled: {
    color: COLORS.gray,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 16,
    padding: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
  },
  contentInput: {
    fontSize: 16,
    color: COLORS.dark,
    minHeight: 120,
    textAlignVertical: 'top',
    padding: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 12,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginRight: 10,
  },
  selectedPostPreview: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  selectedPostTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
  selectedPostAuthor: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 4,
  },
  commentsList: {
    padding: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentContent: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 12,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: COLORS.dark,
  },
  commentTime: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 6,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 8,
  },
  sendCommentBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendCommentBtnDisabled: {
    backgroundColor: COLORS.lightGray,
  },
});
