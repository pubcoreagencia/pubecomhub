# Plano de Auditoria e Correção de Segurança - PUB ECOM HUB

O objetivo é resolver vulnerabilidades de segurança identificadas e garantir a estabilidade da aplicação TanStack Start com backend real.

## Categoria B — Pedido de Alteração em Linguagem Natural
O usuário solicitou: "Load the security issues from the scan results and fix the selected issues."
Com base no histórico e nas instruções em `user-uploads://instrucoes-36.md`, focaremos na auditoria final e fechamento de brechas em RLS, Authorização e Proteção de Rotas.

## Detalhes Técnicos

### 1. Auditoria e Reforço de RLS (PostgreSQL)
- **Profiles Self-Escalation**: Validar que a política RLS e o trigger `prevent_role_escalation` impedem efetivamente que um usuário altere sua própria `role` na tabela `public.profiles`.
- **Security Definer Function Hardening**: Garantir que as funções `is_master()`, `has_role()` e `prevent_role_escalation()` tenham permissões de execução revogadas para `PUBLIC` e `authenticated`, sendo restritas ao `service_role`.
- **Views Sensíveis**: Confirmar que as views `available_master_products`, `public_store_products` e `public_suppliers` estão configuradas com `security_invoker = true` para respeitar o RLS das tabelas base.

### 2. Proteção de Rotas e Middleware (TanStack Start)
- **Dashboard Access**: Validar que a rota `/dashboard` e suas sub-rotas estão protegidas pelo `DashboardGuard` e que este verifica a role `MASTER` via Supabase.
- **Server Functions Auth**: Verificar se todas as `createServerFn` sensíveis (ex: `analyzeCatalogFn`, `createOrderFn`) utilizam o middleware `requireSupabaseAuth` e realizam verificações de role/propriedade internamente.
- **API Proxy Security**: Garantir que `handleCatalogProxy` valide o token do chamador e aplique restrições de role (`MASTER` para operações globais, `LOJISTA` apenas para suas lojas).

### 3. Mitigação de SSRF
- **URL Validation**: Revisar o `urlValidator.ts` para garantir que a allow-list de domínios (Shopee, PubCore) e o bloqueio de IPs privados/locais estejam ativos em todas as rotas de ingestão.

### 4. Correções de UI de Login
- **E-mail Padrão**: Garantir que os placeholders e labels de login reflitam o usuário master oficial: `contato.pubcore@gmail.com`.

## Ações e Arquivos

### Backend (SQL via `supabase--run_sql`)
- Reforçar revogação de `EXECUTE` em funções `SECURITY DEFINER`.
- Validar `security_invoker` em views.
- Corrigir política de `UPDATE` em `profiles` caso haja brecha residual.

### Frontend (React/TanStack)
- `src/pages/LoginPage.tsx`: Atualizar placeholders.
- `src/components/auth/DashboardGuard.tsx`: Reforçar lógica de autorização.
- `src/server/catalogProxy.ts`: Validar verificações de role.

### Documentação
- Atualizar `CHANGELOG.md` e `PROJECT_CONTEXT.md` com o status final do hardening.
