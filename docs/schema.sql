-- ============================================
-- SCHEMA DO BANCO DE DADOS - REDE SOCIAL MILITÂNCIA
-- Antunes do Rosário 47
-- ============================================

-- Executar no SQL Editor do Supabase

-- ============================================
-- TABELA: profiles (Perfis dos Militantes)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  
  -- Localização
  city TEXT,
  neighborhood TEXT,
  state TEXT DEFAULT 'MG',
  
  -- Dados da Campanha
  role TEXT DEFAULT 'voluntario', -- voluntario, coordenador, cabo_eleitoral, lideranca
  zone TEXT,
  section TEXT,
  skills TEXT[],
  availability TEXT[],
  
  -- Métricas
  points INTEGER DEFAULT 0,
  missions_completed INTEGER DEFAULT 0,
  
  -- Status
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================
-- TABELA: forum_categories (Categorias do Fórum)
-- ============================================
CREATE TABLE forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir categorias padrão
INSERT INTO forum_categories (name, description, icon, color, sort_order) VALUES
  ('📢 Comunicados', 'Avisos oficiais da coordenação', '📢', '#EF4444', 0),
  ('💡 Ideias', 'Sugestões para a campanha', '💡', '#F59E0B', 1),
  ('📋 Organização', 'Coordenação de atividades', '📋', '#3B82F6', 2),
  ('📅 Eventos', 'Comícios, carreatas, encontros', '📅', '#10B981', 3),
  ('❓ Dúvidas', 'Perguntas sobre a campanha', '❓', '#8B5CF6', 4),
  ('📦 Materiais', 'Santinhos, adesivos, bandeiras', '📦', '#EC4899', 5),
  ('🎉 Vitórias', 'Conquistas e celebrações', '🎉', '#F97316', 6);

-- ============================================
-- TABELA: forum_posts (Posts do Fórum)
-- ============================================
CREATE TABLE forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES forum_categories(id),
  
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  
  image_url TEXT,
  attachment_url TEXT,
  attachment_name TEXT,
  
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  is_pinned BOOLEAN DEFAULT false,
  is_official BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_forum_posts_category ON forum_posts(category_id);
CREATE INDEX idx_forum_posts_author ON forum_posts(author_id);
CREATE INDEX idx_forum_posts_created ON forum_posts(created_at DESC);

-- ============================================
-- TABELA: forum_comments (Comentários)
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

CREATE INDEX idx_forum_comments_post ON forum_comments(post_id);

-- ============================================
-- TABELA: forum_likes (Curtidas)
-- ============================================
CREATE TABLE forum_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, post_id)
);

-- ============================================
-- TABELA: conversations (Conversas)
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
-- TABELA: direct_messages (Mensagens Diretas)
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
-- TABELA: notifications (Notificações)
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
-- TABELA: events (Eventos)
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

CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(event_id, user_id)
);

-- ============================================
-- TABELA: gallery (Galeria)
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
-- FUNÇÕES RPC
-- ============================================

-- Incrementar likes
CREATE OR REPLACE FUNCTION increment_post_likes(p_post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE forum_posts SET like_count = like_count + 1 WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrementar likes
CREATE OR REPLACE FUNCTION decrement_post_likes(p_post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE forum_posts SET like_count = GREATEST(0, like_count - 1) WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Incrementar comentários
CREATE OR REPLACE FUNCTION increment_post_comments(p_post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE forum_posts SET comment_count = comment_count + 1 WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Buscar ou criar conversa
CREATE OR REPLACE FUNCTION get_or_create_conversation(p_user1 UUID, p_user2 UUID)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
BEGIN
  IF p_user1 > p_user2 THEN
    SELECT id INTO v_conversation_id FROM conversations WHERE participant_1 = p_user2 AND participant_2 = p_user1;
  ELSE
    SELECT id INTO v_conversation_id FROM conversations WHERE participant_1 = p_user1 AND participant_2 = p_user2;
  END IF;
  
  IF v_conversation_id IS NULL THEN
    IF p_user1 > p_user2 THEN
      INSERT INTO conversations (participant_1, participant_2) VALUES (p_user2, p_user1) RETURNING id INTO v_conversation_id;
    ELSE
      INSERT INTO conversations (participant_1, participant_2) VALUES (p_user1, p_user2) RETURNING id INTO v_conversation_id;
    END IF;
  END IF;
  
  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Contar mensagens não lidas
CREATE OR REPLACE FUNCTION count_unread_messages(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM direct_messages dm
  JOIN conversations c ON dm.conversation_id = c.id
  WHERE (c.participant_1 = p_user_id OR c.participant_2 = p_user_id)
    AND dm.sender_id != p_user_id
    AND dm.is_read = false;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

-- Criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Atualizar updated_at
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
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Profiles são visíveis para todos" ON profiles FOR SELECT USING (true);
CREATE POLICY "Usuários podem atualizar próprio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Usuários podem inserir próprio perfil" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts
CREATE POLICY "Posts visíveis para autenticados" ON forum_posts FOR SELECT TO authenticated USING (is_hidden = false);
CREATE POLICY "Autenticados podem criar posts" ON forum_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Autores podem atualizar próprios posts" ON forum_posts FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Autores podem deletar próprios posts" ON forum_posts FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Comments
CREATE POLICY "Comentários visíveis para autenticados" ON forum_comments FOR SELECT TO authenticated USING (is_hidden = false);
CREATE POLICY "Autenticados podem comentar" ON forum_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Autores podem deletar próprios comentários" ON forum_comments FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Likes
CREATE POLICY "Likes visíveis" ON forum_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Autenticados podem curtir" ON forum_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem remover próprios likes" ON forum_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Conversations
CREATE POLICY "Usuários veem próprias conversas" ON conversations FOR SELECT TO authenticated USING (auth.uid() = participant_1 OR auth.uid() = participant_2);
CREATE POLICY "Autenticados podem criar conversas" ON conversations FOR INSERT TO authenticated WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- Messages
CREATE POLICY "Usuários veem mensagens das próprias conversas" ON direct_messages FOR SELECT TO authenticated
  USING (conversation_id IN (SELECT id FROM conversations WHERE participant_1 = auth.uid() OR participant_2 = auth.uid()));
CREATE POLICY "Usuários podem enviar mensagens" ON direct_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- Notifications
CREATE POLICY "Usuários veem próprias notificações" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Sistema pode criar notificações" ON notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Usuários podem atualizar próprias notificações" ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- ============================================
-- FIM DO SCHEMA
-- ============================================
