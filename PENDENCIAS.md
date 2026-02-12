# Lista de Pendências - App/Site Político Rosário 47

## ✅ FEITO

### App
- [x] Nome: "Antunes do Rosário 47"
- [x] Senha com asteriscos
- [x] Tab bar com espaçamento
- [x] SafeAreaProvider
- [x] TTS (text-to-speech) com expo-speech
- [x] Gravação de voz com expo-av
- [x] Base de conhecimento offline (palavras-chave)
- [x] 5 fotos do candidato no app
- [x] Instagram: @titaniofilms
- [x] Email: contact@titaniofilms.com
- [x] Responsividade Android (paddingBottom para nav buttons)
- [x] Transcrição de voz com expo-speech-recognition (gratuito, API nativa Android)

### Backend
- [x] PostgreSQL no Railway
- [x] Rotas: auth, users, posts, comments, messages, events, chat
- [x] 6 bots ativos (Antunes + 5 militantes)
- [x] Cron jobs: posts 3x dia (9h, 14h, 19h)
- [x] 15 posts iniciais + 57 comentários
- [x] Antunes auto-comenta em todos posts

### Site
- [x] Deployed: https://rosario47-campanha.netlify.app
- [x] Chat com assistente virtual
- [x] Galeria de fotos
- [x] Seções: propostas, eventos, contato
- [x] Ano: 2026
- [x] Instagram: @titaniofilms
- [x] Email: contact@titaniofilms.com

### Chatbot Atualizável
- [x] Pasta `conhecimento/` criada
- [x] README com instruções para adicionar .txt
- [x] Arquivos exemplo: propostas-saude.txt, propostas-educacao.txt

---

## ⏳ PENDENTE

### Deploy Backend Permanente
- [ ] Deploy no Railway (localtunnel URL muda a cada restart)
- **Status:** Precisa de login interativo no Railway CLI

### Grupo WhatsApp
- [x] Grupo "Gospia" configurado
- [x] JID: 120363405462114071@g.us
- [x] Número +553198777889 na allowlist
- [x] Tita respondendo no grupo ✅

### Chatbot GitHub
- [ ] Criar repo GitHub para conhecimento
- [ ] Webhook para auto-atualizar quando push
- **Requisito:** Cliente adiciona .txt → chatbot aprende

### Rede Social Completa
- [ ] Perfis de militantes (cidade, bairro, função)
- [ ] Chat 1:1 (DMs funcionando no backend, falta UI melhorada)
- [ ] Notificações push
- [ ] Galeria de fotos (upload de usuários)
- [ ] Categorias no fórum (Ideias, Organização, Eventos, Dúvidas, Materiais)

### Site - Páginas Completas
- [ ] Rede Social como página (não modal)
- [ ] Login/cadastro integrado
- [ ] Fórum navegável

---

## 🔥 PRIORIDADE AGORA

1. **Backend permanente** - Deploy Railway
2. **GitHub conhecimento** - Repo + webhook
3. **UI rede social** - Melhorar telas do app
