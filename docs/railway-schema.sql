-- ============================================
-- SCHEMA PARA RAILWAY POSTGRESQL
-- Rede Social Militância - Antunes do Rosário 47
-- ============================================

-- Extension para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABELA: users (Usuários)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: profiles (Perfis dos Militantes)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  
  city TEXT,
  neighborhood TEXT,
  state TEXT DEFAULT 'MG',
  
  role TEXT DEFAULT 'voluntario',
  zone TEXT,
  section TEXT,
  
  points INTEGER DEFAULT 0,
  missions_completed INTEGER DEFAULT 0,
  
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_user ON profiles(user_id);
CREATE INDEX idx_profiles_city ON profiles(city);

-- ============================================
-- TABELA: forum_categories
-- ============================================
CREATE TABLE forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO forum_categories (name, description, icon, color, sort_order) VALUES
  ('📢 Comunicados', 'Avisos oficiais da coordenação', '📢', '#EF4444', 0),
  ('💡 Ideias', 'Sugestões para a campanha', '💡', '#F59E0B', 1),
  ('📋 Organização', 'Coordenação de atividades', '📋', '#3B82F6', 2),
  ('📅 Eventos', 'Comícios, carreatas, encontros', '📅', '#10B981', 3),
  ('❓ Dúvidas', 'Perguntas sobre a campanha', '❓', '#8B5CF6', 4),
  ('📦 Materiais', 'Santinhos, adesivos, bandeiras', '📦', '#EC4899', 5),
  ('🎉 Vitórias', 'Conquistas e celebrações', '🎉', '#F97316', 6);

-- ============================================
-- TABELA: forum_posts
-- ============================================
CREATE TABLE forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES forum_categories(id),
  
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  is_pinned BOOLEAN DEFAULT false,
  is_official BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_category ON forum_posts(category_id);
CREATE INDEX idx_posts_author ON forum_posts(author_id);
CREATE INDEX idx_posts_created ON forum_posts(created_at DESC);

-- ============================================
-- TABELA: forum_comments
-- ============================================
CREATE TABLE forum_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES forum_comments(id),
  
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  is_hidden BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON forum_comments(post_id);

-- ============================================
-- TABELA: forum_likes
-- ============================================
CREATE TABLE forum_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, post_id)
);

-- ============================================
-- TABELA: conversations
-- ============================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(participant_1, participant_2)
);

-- ============================================
-- TABELA: direct_messages
-- ============================================
CREATE TABLE direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON direct_messages(conversation_id, created_at DESC);

-- ============================================
-- TABELA: notifications
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,
  
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);

-- ============================================
-- TABELA: events
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES profiles(id),
  
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT,
  
  location TEXT,
  address TEXT,
  city TEXT,
  
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  
  image_url TEXT,
  max_participants INTEGER,
  participant_count INTEGER DEFAULT 0,
  
  is_public BOOLEAN DEFAULT true,
  is_cancelled BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELA: event_participants
-- ============================================
CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(event_id, user_id)
);

-- ============================================
-- TABELA: gallery
-- ============================================
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by UUID REFERENCES profiles(id),
  
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  
  like_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON forum_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- DADOS DE TESTE
-- ============================================

-- Usuário de teste
INSERT INTO users (id, email, password_hash) VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'teste@rosario47.com', 'hash_placeholder');

-- Perfil de teste
INSERT INTO profiles (id, user_id, full_name, city, neighborhood, role) VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
   'Voluntário Teste', 'Maricá', 'Centro', 'voluntario');

-- Post de teste
INSERT INTO forum_posts (author_id, category_id, title, content, is_official, is_pinned) 
SELECT 
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  id,
  'Bem-vindos à Rede Social Rosário 47!',
  'Esta é a rede social oficial da campanha de Antunes do Rosário 47. Aqui você pode acompanhar eventos, participar de discussões e se conectar com outros militantes. Vamos juntos! 💚🧡',
  true,
  true
FROM forum_categories WHERE name LIKE '%Comunicados%';

-- ============================================
-- FIM DO SCHEMA
-- ============================================
