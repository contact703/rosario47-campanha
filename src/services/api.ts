import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../config/api';

const TOKEN_KEY = '@rosario47:token';
const USER_KEY = '@rosario47:user';

class ApiService {
  private token: string | null = null;

  async init() {
    this.token = await AsyncStorage.getItem(TOKEN_KEY);
  }

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  }

  async getUser() {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  async setUser(user: any) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getHeaders() {
    const headers: any = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na requisição');
      }

      return data;
    } catch (error: any) {
      console.error('API Error:', error.message);
      throw error;
    }
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request(API.login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    await this.setToken(data.token);
    await this.setUser(data.user);
    return data;
  }

  async register(email: string, password: string, name: string) {
    const data = await this.request(API.register, {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    await this.setToken(data.token);
    await this.setUser(data.user);
    return data;
  }

  async getMe() {
    return this.request(API.me);
  }

  async logout() {
    await this.clearToken();
  }

  // Posts
  async getPosts(page = 1, category?: string) {
    const params = new URLSearchParams({ page: String(page) });
    if (category) params.append('category', category);
    return this.request(`${API.posts}?${params}`);
  }

  async getPost(id: string) {
    return this.request(API.postById(id));
  }

  async createPost(title: string, content: string, category: string) {
    return this.request(API.posts, {
      method: 'POST',
      body: JSON.stringify({ title, content, category }),
    });
  }

  async likePost(id: string) {
    return this.request(API.postLike(id), { method: 'POST' });
  }

  async deletePost(id: string) {
    return this.request(API.postById(id), { method: 'DELETE' });
  }

  // Comments
  async getComments(postId: string) {
    return this.request(API.comments(postId));
  }

  async createComment(postId: string, content: string) {
    return this.request(API.comments(postId), {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async deleteComment(id: string) {
    return this.request(API.commentById(id), { method: 'DELETE' });
  }

  // Messages
  async getConversations() {
    return this.request(API.conversations);
  }

  async getMessages(userId: string) {
    return this.request(API.messages(userId));
  }

  async sendMessage(userId: string, content: string) {
    return this.request(API.messages(userId), {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async getUnreadCount() {
    return this.request(API.unreadCount);
  }

  // Events
  async getEvents() {
    return this.request(API.events);
  }

  async getEvent(id: string) {
    return this.request(API.eventById(id));
  }

  async participateEvent(id: string) {
    return this.request(API.eventParticipate(id), { method: 'POST' });
  }

  // Users
  async getUsers(page = 1) {
    return this.request(`${API.users}?page=${page}`);
  }

  async getUser(id: string) {
    return this.request(API.userById(id));
  }

  async updateProfile(data: { name?: string; bio?: string; city?: string }) {
    return this.request(API.profile, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getRanking() {
    return this.request(API.ranking);
  }

  // Chat
  async sendChatMessage(message: string) {
    return this.request(API.chat, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async getConhecimento() {
    return this.request(API.conhecimento);
  }
}

export const apiService = new ApiService();
export default apiService;
