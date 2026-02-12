// API Configuration - Produção Railway
const API_BASE_URL = 'https://rosario-production-9c5e.up.railway.app/api';

export const API = {
  baseUrl: API_BASE_URL,
  
  // Auth
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  me: `${API_BASE_URL}/auth/me`,
  
  // Posts
  posts: `${API_BASE_URL}/posts`,
  postById: (id: string) => `${API_BASE_URL}/posts/${id}`,
  postLike: (id: string) => `${API_BASE_URL}/posts/${id}/like`,
  categories: `${API_BASE_URL}/posts/meta/categories`,
  
  // Comments
  comments: (postId: string) => `${API_BASE_URL}/comments/${postId}`,
  commentById: (id: string) => `${API_BASE_URL}/comments/${id}`,
  
  // Messages
  conversations: `${API_BASE_URL}/messages/conversations`,
  messages: (userId: string) => `${API_BASE_URL}/messages/${userId}`,
  unreadCount: `${API_BASE_URL}/messages/unread/count`,
  
  // Events
  events: `${API_BASE_URL}/events`,
  eventById: (id: string) => `${API_BASE_URL}/events/${id}`,
  eventParticipate: (id: string) => `${API_BASE_URL}/events/${id}/participate`,
  
  // Users
  users: `${API_BASE_URL}/users`,
  userById: (id: string) => `${API_BASE_URL}/users/${id}`,
  profile: `${API_BASE_URL}/users/profile`,
  ranking: `${API_BASE_URL}/users/ranking/top`,
  
  // Chat
  chat: `${API_BASE_URL}/chat`,
  conhecimento: `${API_BASE_URL}/chat/conhecimento`,
};

export default API;
