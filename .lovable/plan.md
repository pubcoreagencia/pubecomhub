# Plano de Migração: Supabase Oficial (PUB CORE)

Este plano descreve a migração do projeto PUB ECOM HUB do Supabase temporário (`rouxgtjonfncswsqlcgz.supabase.co`) para o Supabase oficial fornecido pelo usuário, preservando toda a arquitetura de segurança, RLS e isolamento multi-tenant.

## 1. Auditoria e Mapeamento (Fase Atual)

Identificamos a infraestrutura atual que deve ser preservada:

- **Auth**: Roles `MASTER` e `LOJISTA` gerenciadas via tabela `profiles`.
- **Schema**: 11 tabelas principais (profiles, stores, suppliers, products, orders, etc.).
- **Segurança**:
    - Função `is_master()` com `SECURITY DEFINER`.
    - Triggers `prevent_role_escalation` e `enforce_profile_insert_role`.
    - Views com `security_invoker = false` (sanitização de custos) e `GRANT` explícito para `authenticated`.
    - RLS ativo em todas as tabelas de negócio.
- **Integração Backend**:
    - `catalogProxy.ts`: Validação de JWT Supabase + Role `MASTER` antes de disparar o `CATALOG_WORKER_TOKEN`.
    - Rota `/api/ingestion/shopee`: Proteção SSRF + Proxy.

## 2. Preparação do Novo Supabase

O usuário deve conectar o projeto oficial via Lovable Cloud. A migração seguirá estes passos técnicos:

1. **Schema & Migrations**:
    - Aplicar todas as migrations existentes (localizadas em `supabase/migrations/`) no novo banco de dados.
    - Isso garantirá a criação de tabelas, triggers, views e funções de segurança.
2. **Conta MASTER**:
    - Garantir que `contato.pubcore@gmail.com` exista no Auth.
    - Garantir que no `profiles`, o ID deste usuário tenha `role = 'MASTER'`.

## 3. Reconfiguração de Variáveis de Ambiente

O projeto será atualizado para separar segredos:

- **Client**: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (usados pelo `@/integrations/supabase/client`).
- **Server**: `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (injetados no runtime Cloudflare e usados pelo proxy).

## 4. Validação e Teste Forense

Após a troca das chaves, realizaremos:

1. **Teste de Login**: Acessar com a conta Master oficial.
2. **Auditoria de Permissões**: Verificar se o `DashboardGuard` bloqueia acessos não-Master.
3. **Teste de Ingestão E2E**:
    - URL: `https://shopee.com.br/shop/1729928484`
    - Limite: `3`
    - Validar fluxo: Hub -> Catalog Worker -> Shopee -> D1.

## Detalhes Técnicos

- **Isolamento de Segredos**: O `SUPABASE_SERVICE_ROLE_KEY` será mantido estritamente no backend (`src/integrations/supabase/client.server.ts` e `src/server/catalogProxy.ts`).
- **Cloudflare Workers**: A configuração de produção herdará as novas chaves via Bindings, sem expor o `CATALOG_WORKER_TOKEN`.

---
**Nenhuma alteração foi realizada ainda.** Aguardando a conexão do Supabase oficial para prosseguir com a aplicação das migrações e chaves.
