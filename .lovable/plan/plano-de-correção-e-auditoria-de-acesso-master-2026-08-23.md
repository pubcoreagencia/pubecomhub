# Plano de Correção e Auditoria de Acesso Master

O usuário relatou impossibilidade de realizar login no painel operacional. Este plano visa auditar o fluxo de autenticação, corrigir inconsistências visuais e garantir o acesso da conta MASTER.

## Alterações Propostas

### 1. Ajuste na Interface de Login
- Atualizar o e-mail de placeholder em `src/pages/LoginPage.tsx` de `admin@pubecom.com` para `admin@pubcore.com` (o e-mail real da conta Master).
- Garantir que todas as referências visuais sigam o novo tema **Black & Red**.

### 2. Modernização da Página de Recuperação
- Atualizar `src/pages/ResetPasswordPage.tsx` para o tema **Black & Red**, removendo resquícios do tema Emerald antigo.
- Melhorar o feedback de erro e sucesso no processo de redefinição.

### 3. Limpeza de Metadados em Rotas
- Remover o bloco de comentário administrativo em `src/routes/index.tsx` conforme solicitado pelo comando visual `/clear` implícito no edit visual.

### 4. Documentação de Recuperação
- Atualizar o `PROJECT_CONTEXT.md` com a seção "Recuperação de Acesso Master" para referência futura do usuário.

## Detalhes Técnicos

- **Login**: O e-mail `admin@pubcore.com` já está confirmado no Supabase Auth com a role `MASTER`.
- **Tema**: Migração de variáveis `emerald` para `red` nos componentes de autenticação.
- **Persistência**: Manutenção do `brokeredPreviewStorage` para compatibilidade com o preview do Lovable.

---
*Nota: Se o usuário ainda não conseguir logar após estas mudanças, será necessário realizar uma nova redefinição de senha via operação administrativa no Supabase.*
