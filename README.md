# Chat Político - App Android

App de chat com político usando React Native/Expo com suporte a voz (TTS e gravação de áudio).

## 🚀 Funcionalidades

- ✅ Chat interativo com o político
- ✅ Text-to-Speech (o político fala as respostas)
- ✅ Gravação de áudio (entrada por voz)
- ✅ Design responsivo e moderno
- ✅ CI/CD automático com GitHub Actions
- ✅ Build automático para Android (APK e AAB)
- ✅ Deploy automático para Play Store

## 📱 Tecnologias

- **React Native** com **Expo SDK 54**
- **TypeScript**
- **expo-speech** (Text-to-Speech)
- **expo-av** (Gravação de áudio)
- **EAS Build** (Build na nuvem)
- **EAS Submit** (Publicação na Play Store)
- **GitHub Actions** (CI/CD)

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar no Android
npm run android

# Rodar no iOS
npm run ios

# Rodar na web
npm run web
```

## 📦 Build

### Build local (APK para testes)
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Build APK de preview
eas build --platform android --profile preview
```

### Build de produção (AAB para Play Store)
```bash
eas build --platform android --profile production
```

## 🚀 Deploy Automático

O deploy é automático via GitHub Actions:

1. **Push para `main`** → Build de produção + Submit para Play Store
2. **Pull Request** → Build de preview (APK)

### Configuração necessária:

1. **EXPO_TOKEN**: Token de acesso do Expo
   - Gerar em: https://expo.dev/settings/access-tokens
   - Adicionar como secret no GitHub

2. **Google Service Account**:
   - Criar no Google Cloud Console
   - Dar permissões na Play Console
   - Salvar JSON como `google-service-account.json`
   - Fazer upload no EAS: `eas credentials`

## 📝 Personalização

### Alterar político
Edite as constantes no `App.tsx`:

```typescript
const POLITICO = {
  nome: 'Nome do Político',
  cargo: 'Cargo',
  partido: 'Partido',
  corPrimaria: '#1a365d',
  corSecundaria: '#c53030',
};
```

### Adicionar respostas
Adicione no objeto `RESPOSTAS`:

```typescript
const RESPOSTAS = {
  'palavra-chave': 'Resposta do político',
  // ...
};
```

## 📄 Licença

MIT - Livre para uso comercial.

---

Desenvolvido com ❤️ por Titanio Films
