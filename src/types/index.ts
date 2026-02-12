// Tipos da Rede Social de Militância

// Perfil de Militante
export interface Profile {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  
  // Localização
  city?: string;
  neighborhood?: string;
  state?: string;
  
  // Dados da Campanha
  role: 'voluntario' | 'coordenador' | 'cabo_eleitoral' | 'lideranca';
  zone?: string;
  section?: string;
  skills?: string[];
  availability?: string[];
  
  // Métricas
  points: number;
  missions_completed: number;
  
  // Status
  is_verified: boolean;
  is_active: boolean;
  
  created_at: string;
  updated_at: string;
}

// Categoria do Fórum
export interface ForumCategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  sort_order: number;
  post_count: number;
  is_active: boolean;
}

// Post do Fórum
export interface ForumPost {
  id: string;
  author_id: string;
  category_id: string;
  
  title: string;
  content: string;
  
  image_url?: string;
  attachment_url?: string;
  attachment_name?: string;
  
  like_count: number;
  comment_count: number;
  view_count: number;
  
  is_pinned: boolean;
  is_official: boolean;
  is_hidden: boolean;
  
  created_at: string;
  updated_at: string;
  
  // Relacionamentos (joins)
  author?: Profile;
  category?: ForumCategory;
  comments?: ForumComment[];
  user_has_liked?: boolean;
}

// Comentário
export interface ForumComment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id?: string;
  
  content: string;
  
  like_count: number;
  is_hidden: boolean;
  
  created_at: string;
  
  // Relacionamentos
  author?: Profile;
}

// Conversa de Mensagem Direta
export interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  last_message_at: string;
  created_at: string;
  
  // Relacionamentos
  other_user?: Profile;
  last_message?: DirectMessage;
  unread_count?: number;
}

// Mensagem Direta
export interface DirectMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  
  content: string;
  
  is_read: boolean;
  read_at?: string;
  
  created_at: string;
  
  // Relacionamentos
  sender?: Profile;
}

// Notificação
export interface Notification {
  id: string;
  user_id: string;
  
  type: 'new_message' | 'post_reply' | 'post_like' | 'event_reminder' | 'announcement';
  title: string;
  body?: string;
  
  data?: {
    post_id?: string;
    conversation_id?: string;
    sender_id?: string;
    event_id?: string;
  };
  
  is_read: boolean;
  read_at?: string;
  
  created_at: string;
}

// Evento
export interface Event {
  id: string;
  created_by: string;
  
  title: string;
  description?: string;
  
  event_type: 'comicio' | 'carreata' | 'reuniao' | 'panfletagem' | 'debate';
  
  location?: string;
  address?: string;
  city?: string;
  
  start_date: string;
  end_date?: string;
  
  image_url?: string;
  
  max_participants?: number;
  participant_count: number;
  
  is_public: boolean;
  is_cancelled: boolean;
  
  created_at: string;
  
  // Relacionamentos
  creator?: Profile;
  user_status?: 'confirmed' | 'maybe' | 'declined';
}

// Foto da Galeria
export interface GalleryPhoto {
  id: string;
  uploaded_by: string;
  
  title?: string;
  description?: string;
  image_url: string;
  
  category: 'candidato' | 'campanha' | 'eventos' | 'materiais';
  
  like_count: number;
  
  is_approved: boolean;
  is_featured: boolean;
  
  created_at: string;
  
  // Relacionamentos
  uploader?: Profile;
}

// Estado de autenticação
export interface AuthState {
  user: Profile | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}

// Mensagem do Chat (legado)
export interface ChatMessage {
  id: number;
  texto: string;
  remetente: 'usuario' | 'politico';
  timestamp: Date;
}
