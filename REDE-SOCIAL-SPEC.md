# Especificação: Rede Social de Militância

Documento recebido em: 2026-02-11
Fonte: Eduardo via WhatsApp

## Resumo do Projeto

Criar rede social interna para militantes da campanha do Antunes do Rosário (PAC 47):
- Fórum (categorias: Ideias, Organização, Eventos, Dúvidas, Materiais)
- Perfis de militantes (cidade, bairro, função na campanha)
- Mensagens Diretas (chat 1:1)
- Notificações
- Galeria de fotos
- Eventos da campanha

## Stack
- Backend: Supabase (auth, database, realtime, storage)
- Frontend: Integrar ao app React Native existente
- Site: https://sweet-pixie-91f18b.netlify.app

## Funcionalidade Extra Solicitada
O cliente (equipe de campanha) deve poder atualizar a base de conhecimento do chatbot:
- Opção 1: Pasta no Google Drive
- Opção 2: Repositório Git
- O chat assimila automaticamente os novos textos

## Cores da Campanha
- Verde PAC: #10B981
- Laranja PAC: #F59E0B
- Azul Escuro: #1E3A5F

## Tabelas Supabase (principais)
- profiles
- forum_categories
- forum_posts
- forum_comments
- forum_likes
- conversations
- direct_messages
- notifications
- events
- gallery

Ver documento completo em: /Volumes/TITA_039/MAC_MINI_03/.openclaw/media/inbound/d17cc3c2-0ec8-455e-8e93-9771acef6ee9.md
