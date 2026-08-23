# Plan - Alteração de Senha Master

O objetivo é permitir que o usuário MASTER altere sua senha temporária para uma definitiva diretamente pela interface, garantindo segurança e autonomia.

## User Review Required

> [!IMPORTANT]
> A alteração de senha é uma operação crítica. Uma vez alterada, a senha anterior (`PubEcomMaster_2026`) deixará de funcionar imediatamente. Certifique-se de anotar a nova senha.

## Proposed Changes

### Backend (Server Functions)
- Criar `src/lib/api/auth-admin.functions.ts` para hospedar a função de servidor `updateMasterPassword`.
- A função utilizará o `supabaseAdmin` para realizar o reset, contornando limitações do SDK cliente em alguns ambientes.
- Implementar verificação rigorosa de middleware para garantir que apenas o usuário com role `MASTER` execute a ação.

### Frontend (Configurações)
- Refatorar `src/pages/dashboard/SettingsPage.tsx` para incluir uma nova seção de "Segurança da Conta".
- Adicionar um formulário de alteração de senha com validação de força.
- Integrar a chamada à `updateMasterPassword` com feedback visual (Success/Error).

### Memória e Segurança
- Documentar a estratégia de recuperação e a função em `mem://features/password-recovery.md`.
- Atualizar o `PROJECT_CONTEXT.md` com as novas capacidades administrativas.

## Technical Details

- **Tooling:** TanStack Start `createServerFn`.
- **Security:** `supabaseAdmin.auth.admin.updateUserById` via server-side execution.
- **Validation:** Zod para garantir que a nova senha atenda aos requisitos mínimos.
