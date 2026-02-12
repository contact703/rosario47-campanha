// Social Network - Rosário 47
const API_URL = 'https://rosario-production-9c5e.up.railway.app/api';
let currentUser = null, currentPostId = null, posts = [], postComments = {};

// Init
document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('rosario47_user');
  if (user) {
    currentUser = JSON.parse(user);
    updateUserUI();
    loadContent();
  } else {
    document.getElementById('loginModal').classList.add('show');
  }
});

function updateUserUI() {
  const i = currentUser.name.charAt(0).toUpperCase();
  document.getElementById('userInitial').textContent = i;
  document.getElementById('userName').textContent = currentUser.name;
  document.getElementById('userEmail').textContent = currentUser.email;
  if (document.getElementById('profileInitial')) document.getElementById('profileInitial').textContent = i;
  if (document.getElementById('profileName')) document.getElementById('profileName').textContent = currentUser.name;
}

function toggleUserDropdown() { document.getElementById('userDropdown').classList.toggle('show'); }

function logout() {
  localStorage.removeItem('rosario47_user');
  localStorage.removeItem('rosario47_token');
  window.location.reload();
}

function showLoginForm() {
  document.getElementById('loginFormContainer').style.display = 'block';
  document.getElementById('registerFormContainer').style.display = 'none';
}

function showRegisterForm() {
  document.getElementById('loginFormContainer').style.display = 'none';
  document.getElementById('registerFormContainer').style.display = 'block';
}

async function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  if (!email || !password) { alert('Preencha todos os campos!'); return; }
  try {
    const r = await fetch(`${API_URL}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const d = await r.json();
    if (r.ok && d.token) {
      localStorage.setItem('rosario47_token', d.token);
      localStorage.setItem('rosario47_user', JSON.stringify(d.user));
      currentUser = d.user;
      document.getElementById('loginModal').classList.remove('show');
      updateUserUI();
      loadContent();
    } else demoLogin(email);
  } catch(e) { demoLogin(email); }
}

async function handleRegister() {
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  if (!name || !email || !password) { alert('Preencha todos os campos!'); return; }
  try {
    const r = await fetch(`${API_URL}/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const d = await r.json();
    if (r.ok && d.token) {
      localStorage.setItem('rosario47_token', d.token);
      localStorage.setItem('rosario47_user', JSON.stringify(d.user));
      currentUser = d.user;
      document.getElementById('loginModal').classList.remove('show');
      updateUserUI();
      loadContent();
    } else demoLogin(email, name);
  } catch(e) { demoLogin(email, name); }
}

function demoLogin(email, name = null) {
  currentUser = { id: 'demo-' + Date.now(), name: name || email.split('@')[0], email };
  localStorage.setItem('rosario47_token', 'demo');
  localStorage.setItem('rosario47_user', JSON.stringify(currentUser));
  document.getElementById('loginModal').classList.remove('show');
  updateUserUI();
  loadContent();
}

function showSection(section) {
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(section + 'Section').classList.add('active');
  document.querySelectorAll(`[onclick="showSection('${section}')"]`).forEach(b => b.classList.add('active'));
}

function loadContent() { loadPosts(); loadEvents(); loadConversations(); loadRanking(); }

// Posts
async function loadPosts() {
  try {
    const r = await fetch(`${API_URL}/posts`);
    const d = await r.json();
    if (d.posts && d.posts.length > 0) posts = d.posts;
    else posts = getMockPosts();
  } catch(e) { posts = getMockPosts(); }
  renderPosts();
}

function getMockPosts() {
  return [
    { id: '1', title: 'Bem-vindos à Rede Social Rosário 47!', content: 'Esta é a rede social oficial da campanha. Participem!', user_name: 'Coordenação', category: 'comunicados', likes_count: 47, comments_count: 12, is_liked: false, created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: '2', title: 'Carreata neste sábado!', content: 'Confirmem presença! Saída às 14h da Praça Central. 🚗', user_name: 'Maria Silva', category: 'eventos', likes_count: 32, comments_count: 8, is_liked: true, created_at: new Date(Date.now() - 18000000).toISOString() },
    { id: '3', title: 'Ideias para panfletagem', content: 'Sugiro a feira do Centro às quartas.', user_name: 'João Santos', category: 'ideias', likes_count: 15, comments_count: 6, is_liked: false, created_at: new Date(Date.now() - 86400000).toISOString() }
  ];
}

function renderPosts(category = 'all') {
  const filtered = category === 'all' ? posts : posts.filter(p => p.category === category);
  const container = document.getElementById('postsList');
  if (!container) return;
  container.innerHTML = filtered.map(post => `
    <div class="post-card">
      <div class="post-header">
        <div class="post-avatar">${post.user_name.charAt(0).toUpperCase()}</div>
        <div class="post-author-info">
          <div class="post-author">${post.user_name}</div>
          <div class="post-time">${formatTime(post.created_at)}</div>
        </div>
        <span class="post-category" style="background: ${getCatColor(post.category)}20; color: ${getCatColor(post.category)}">${getCatIcon(post.category)} ${getCatName(post.category)}</span>
      </div>
      <h3 class="post-title">${post.title}</h3>
      <p class="post-content">${post.content}</p>
      <div class="post-actions">
        <button class="post-action ${post.is_liked ? 'liked' : ''}" onclick="likePost('${post.id}')"><i class="fas fa-heart"></i> ${post.likes_count || 0}</button>
        <button class="post-action" onclick="openComments('${post.id}')"><i class="fas fa-comment"></i> ${post.comments_count || 0}</button>
        <button class="post-action"><i class="fas fa-share"></i></button>
      </div>
    </div>
  `).join('');
}

function filterCategory(cat) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderPosts(cat);
}

function getCatColor(c) { return { comunicados: '#EF4444', ideias: '#F59E0B', eventos: '#10B981', duvidas: '#8B5CF6', geral: '#6B7280' }[c] || '#6B7280'; }
function getCatIcon(c) { return { comunicados: '📢', ideias: '💡', eventos: '📅', duvidas: '❓', geral: '💬' }[c] || '💬'; }
function getCatName(c) { return { comunicados: 'Comunicados', ideias: 'Ideias', eventos: 'Eventos', duvidas: 'Dúvidas', geral: 'Geral' }[c] || 'Geral'; }
function formatTime(d) { const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000); return h < 1 ? 'Agora' : h < 24 ? h + 'h' : Math.floor(h/24) + 'd'; }

async function likePost(id) {
  const post = posts.find(p => p.id == id);
  if (post) { post.is_liked = !post.is_liked; post.likes_count = (post.likes_count || 0) + (post.is_liked ? 1 : -1); renderPosts(); }
}

function openNewPostModal() { document.getElementById('newPostModal').classList.add('show'); }
function closeNewPostModal() { document.getElementById('newPostModal').classList.remove('show'); }

async function submitPost() {
  const title = document.getElementById('postTitle').value;
  const content = document.getElementById('postContent').value;
  const category = document.getElementById('postCategory').value;
  if (!title || !content) { alert('Preencha título e conteúdo!'); return; }
  const newPost = { id: Date.now().toString(), title, content, category, user_name: currentUser.name, likes_count: 0, comments_count: 0, is_liked: false, created_at: new Date().toISOString() };
  posts.unshift(newPost);
  renderPosts();
  closeNewPostModal();
  document.getElementById('postTitle').value = '';
  document.getElementById('postContent').value = '';
  showNotification('Post publicado! ✅');
  setTimeout(() => botResponderPost(newPost), 3000);
}

function botResponderPost(post) {
  const c = (post.title + ' ' + post.content).toLowerCase();
  let r = '';
  if (/saúde|saude|médico|hospital/.test(c)) r = `${post.user_name}, saúde é minha prioridade! 🏥 Vou lutar por postos até 22h!\n\n"Quem trabalha merece atendimento à noite!"\n\nVote 47! 💚`;
  else if (/educação|escola|professor/.test(c)) r = `${post.user_name}, como ex-professor, educação é especial pra mim! 📚\n\n"Escola pública de qualidade é a maior riqueza!"\n\nVote 47! 💚`;
  else if (/transporte|ônibus/.test(c)) r = `${post.user_name}, transporte digno é direito! 🚌 Mais linhas, tarifa justa!\n\nVote 47! 💚`;
  else if (/segurança|violência/.test(c)) r = `${post.user_name}, ninguém pode viver com medo! 🛡️ Iluminação + câmeras + ronda!\n\nVote 47! 💚`;
  else r = [`${post.user_name}, muito obrigado! 💚 É gente como você que faz a diferença. Vote 47!`, `Valeu, ${post.user_name}! 🙌 Juntos vamos transformar nossa cidade. Vote 47! 💚`][Math.floor(Math.random()*2)];
  if (!postComments[post.id]) postComments[post.id] = [];
  postComments[post.id].push({ id: Date.now().toString(), content: r, user_name: 'Antunes do Rosário', is_candidate: true, created_at: new Date().toISOString() });
  const p = posts.find(x => x.id === post.id);
  if (p) p.comments_count++;
  renderPosts();
  showNotification('Antunes do Rosário comentou no seu post! 💚');
}

// Comments
let currentComments = [];
async function openComments(id) {
  currentPostId = id;
  const post = posts.find(p => p.id == id);
  document.getElementById('postPreview').innerHTML = `<h4>${post.title}</h4><p>por ${post.user_name}</p>`;
  currentComments = postComments[id] || [];
  renderComments();
  document.getElementById('commentsModal').classList.add('show');
}

function renderComments() {
  const container = document.getElementById('commentsList');
  if (currentComments.length === 0) { container.innerHTML = '<p style="text-align:center;color:#888;padding:20px;">Nenhum comentário ainda.</p>'; return; }
  container.innerHTML = currentComments.map(c => {
    const isC = c.is_candidate || c.user_name === 'Antunes do Rosário';
    return `<div class="comment-item"><div class="comment-avatar" style="${isC ? 'background:linear-gradient(135deg,#10B981,#F59E0B)' : ''}">${isC ? '47' : c.user_name.charAt(0)}</div><div class="comment-content" style="${isC ? 'background:linear-gradient(135deg,#10B98115,#F59E0B10);border:1px solid #10B981' : ''}"><div class="comment-author" style="${isC ? 'color:#10B981;font-weight:700' : ''}">${c.user_name} ${isC ? '✓' : ''}</div><div class="comment-text">${c.content}</div><div class="comment-time">${formatTime(c.created_at)}</div></div></div>`;
  }).join('');
}

function closeCommentsModal() { document.getElementById('commentsModal').classList.remove('show'); }

function submitComment() {
  const content = document.getElementById('newComment').value;
  if (!content) return;
  currentComments.push({ id: Date.now().toString(), content, user_name: currentUser.name, created_at: new Date().toISOString() });
  postComments[currentPostId] = currentComments;
  const post = posts.find(p => p.id == currentPostId);
  if (post) post.comments_count = (post.comments_count || 0) + 1;
  renderComments();
  renderPosts();
  document.getElementById('newComment').value = '';
}

// Events
function loadEvents() {
  const container = document.getElementById('eventsList');
  if (!container) return;
  const events = [
    { id: '1', title: 'Carreata', date: 'Sábado', time: '14h', location: 'Praça Central' },
    { id: '2', title: 'Reunião com Moradores', date: 'Terça', time: '19h', location: 'Comitê' },
    { id: '3', title: 'Panfletagem', date: 'Quarta', time: '8h', location: 'Feira do Centro' },
    { id: '4', title: 'Debate', date: 'Quinta', time: '20h', location: 'Câmara Municipal' }
  ];
  container.innerHTML = events.map(e => `
    <div class="event-card">
      <div class="event-date"><span class="event-day">${e.date}</span><span class="event-time">${e.time}</span></div>
      <div class="event-info"><h4>${e.title}</h4><p><i class="fas fa-map-marker-alt"></i> ${e.location}</p></div>
      <button class="event-action" onclick="this.classList.toggle('participating');this.textContent=this.classList.contains('participating')?'✓ Confirmado':'Participar'">Participar</button>
    </div>
  `).join('');
}

// Conversations
function loadConversations() {
  const container = document.getElementById('conversationsList');
  if (!container) return;
  const convs = [
    { name: 'Coordenação', lastMessage: 'Pessoal, reunião amanhã!', time: '10min', unread: 3 },
    { name: 'Maria Silva', lastMessage: 'Ok, vou levar as bandeiras', time: '1h', unread: 0 }
  ];
  container.innerHTML = convs.map(c => `
    <div class="conversation-item">
      <div class="conversation-avatar">${c.name.charAt(0)}</div>
      <div class="conversation-info"><div class="conversation-name">${c.name}</div><div class="conversation-preview">${c.lastMessage}</div></div>
      <div class="conversation-meta"><div class="conversation-time">${c.time}</div>${c.unread ? `<span class="conversation-badge">${c.unread}</span>` : ''}</div>
    </div>
  `).join('');
}

// Ranking
function loadRanking() {
  const container = document.getElementById('rankingList');
  if (!container) return;
  const ranking = [{ name: 'Maria Silva', points: 450 }, { name: 'João Santos', points: 380 }, { name: 'Ana Paula', points: 320 }, { name: 'Carlos Lima', points: 290 }, { name: currentUser?.name || 'Você', points: 150 }];
  container.innerHTML = ranking.map((u, i) => `
    <div class="ranking-item"><span class="ranking-position">${i+1}</span><div class="ranking-avatar">${u.name.charAt(0)}</div><span class="ranking-name">${u.name}</span><span class="ranking-points">${u.points} pts</span></div>
  `).join('');
}

// Notification
function showNotification(msg) {
  const n = document.createElement('div');
  n.innerHTML = `<i class="fas fa-bell"></i> <span>${msg}</span>`;
  n.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#10B981,#059669);color:white;padding:14px 24px;border-radius:12px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 20px rgba(0,0,0,0.3);z-index:3000;font-weight:500;';
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 3000);
}
