# 🗳️ App Antunes do Rosário 47

App de campanha com chat do candidato e rede social de militantes.

## 📱 Funcionalidades

### Chat do Candidato
- Converse com o Antunes (IA com respostas sobre propostas)
- Text-to-Speech (o candidato "fala" as respostas)
- Gravação de áudio (Speech-to-Text)
- **Base de conhecimento atualizável pelo cliente** (via GitHub)

### Rede Social de Militância
- Fórum com categorias (Ideias, Organização, Eventos, etc.)
- Perfis de militantes
- Mensagens diretas
- Notificações
- Eventos da campanha
- Galeria de fotos

## 🛠️ Stack

- **Frontend:** React Native + Expo SDK 54
- **Backend:** Supabase (Auth, Database, Realtime, Storage)
- **Build:** EAS Build (Android/iOS)

## 🚀 Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie uma conta em https://supabase.com
2. Crie um novo projeto
3. Copie a URL e anon key
4. Edite `src/services/supabase.ts`:

```typescript
const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'sua_anon_key_aqui';
```

5. Execute o SQL das tabelas (ver `docs/schema.sql`)

### 3. Rodar o app

```bash
# Desenvolvimento
npx expo start

# Android
npx expo run:android

# iOS
npx expo run:ios
```

## 📂 Estrutura

```
politico-chat-app/
├── App.tsx                 # App principal (chat legado)
├── conhecimento/           # Base de conhecimento do chatbot
│   ├── respostas.json     # Respostas editáveis pelo cliente
│   └── README.md          # Instruções para o cliente
├── src/
│   ├── config/            # Configurações
│   ├── services/          # Supabase, Conhecimento
│   ├── screens/           # Telas
│   ├── components/        # Componentes reutilizáveis
│   ├── hooks/             # Custom hooks
│   └── types/             # TypeScript types
├── assets/                # Imagens, ícones
└── docs/                  # Documentação
```

## 🔄 Atualizar Respostas do Chat

O cliente (equipe de campanha) pode atualizar as respostas do chatbot editando `conhecimento/respostas.json`.

Ver instruções em `conhecimento/README.md`.

## 📦 Build

```bash
# Build APK (preview)
eas build --platform android --profile preview

# Build AAB (produção)
eas build --platform android --profile production
```

## 🎨 Cores da Campanha

- **Verde PAC:** #10B981
- **Laranja PAC:** #F59E0B
- **Azul Escuro:** #1E3A5F

---

🗳️ **Antunes do Rosário 47 - Juntos por um Brasil que cuida**
