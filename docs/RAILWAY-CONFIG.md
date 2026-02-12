# Configuração Railway - Projeto Rosário

**Projeto:** secure-commitment / rosario
**URL:** https://railway.com/project/2324c016-9b60-448d-b066-60bbd8e11b48

## PostgreSQL Criado ✅

**Variáveis de ambiente:**
- `DATABASE_URL` - Connection string completa (interna)
- `DATABASE_PUBLIC_URL` - Connection string para acesso externo
- `POSTGRES_DB` = "railway"
- `POSTGRES_USER` = "postgres"
- `PGPORT` = "5432"

## GitHub Conectado

**Repositório:** https://github.com/contact703/rosario

## Próximos Passos

1. [ ] Executar SQL schema no banco
2. [ ] Configurar serviço "rosario" com código da rede social
3. [ ] Conectar DATABASE_URL ao serviço
4. [ ] Testar conexão

## Como usar no app

```typescript
// Para Railway, use variáveis de ambiente:
const DATABASE_URL = process.env.DATABASE_URL;

// Ou para desenvolvimento local:
const DATABASE_URL = 'postgresql://postgres:SENHA@HOST:5432/railway';
```

## Executar SQL

Para executar o schema do banco:
1. Vá para Railway > Postgres > Database
2. Clique em "Connect"
3. Use o psql ou Data tab para executar `docs/schema.sql`

---
Criado: 2026-02-11
