# Plano: Recuperação de Acesso Administrativo

O objetivo deste plano é restaurar o acesso do usuário master (`admin@pubcore.com`) que foi perdido após a implementação do sistema de autenticação, conforme solicitado.

## Etapas de Execução

1. **Verificação e Preparação**:
   - Confirmar a existência do usuário `admin@pubcore.com` no banco de dados.
   - Verificar a role associada no perfil (`profiles`).

2. **Redefinição de Senha Administrativa**:
   - Utilizar um script temporário no servidor (via `code--exec`) que utilize o `supabaseAdmin` para atualizar a senha do usuário sem expor segredos nos logs ou no código fonte permanente.
   - O comando será executado de forma privada no ambiente de sandbox.

3. **Validação**:
   - Confirmar via log administrativo (sem exibir a senha) que o `password_hash` foi atualizado.
   - Testar o redirecionamento da página de login.

## Detalhes Técnicos

- **Ferramenta**: `supabaseAdmin` (Service Role) para bypassar RLS e restrições de e-mail.
- **Segurança**: Nenhuma senha será escrita em arquivos `.ts`, `.tsx`, `.sql` ou no histórico do Git. A operação será realizada via execução direta de script Node.js descartável.
- **Conta Alvo**: `admin@pubcore.com`.
- **Role Alvo**: `MASTER`.

---
*Nota: Após a aprovação, executarei o comando de atualização e fornecerei a confirmação visual de que o acesso foi restaurado.*
