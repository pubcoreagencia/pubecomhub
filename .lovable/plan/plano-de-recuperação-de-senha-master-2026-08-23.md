# Plano de Recuperação de Senha Master

O objetivo é identificar por que a atualização de senha para `contato.pubcore@gmail.com` não foi persistida ou reconhecida pelo sistema e garantir que o acesso MASTER seja restaurado no projeto oficial.

## Etapas de Diagnóstico e Correção

1. **Auditoria de Projeto**: Verificar se a atualização anterior foi aplicada no projeto oficial (`vtcnundfslqqlxdyrogv`) ou se houve um erro de redirecionamento para o projeto temporário do Lovable (`rouxgtjonfncswsqlcgz`).
2. **Teste de Conexão SDK**: Executar um script isolado no sandbox que tenta autenticar com a nova credencial fornecida (`PUBrecords@5929`) diretamente contra o endpoint oficial para confirmar a validade no backend.
3. **Verificação de Sincronização GoTrue**: Verificar se o usuário está com o status `confirmed` e se não há bloqueios de segurança por múltiplas tentativas falhas.
4. **Sincronização de Ambiente**: Garantir que o ambiente de produção (Cloudflare) está usando as mesmas credenciais que foram resetadas.

## Detalhes Técnicos
- Uso de `supabaseAdmin` para bypassar RLS e ler metadados do `auth.users`.
- Validação de `VITE_SUPABASE_URL` no bundle de produção.
- Limpeza de `localStorage` para evitar conflitos de sessão de projetos anteriores.

## Pergunta de Clarificação
- Você está recebendo o erro de "credenciais inválidas" no domínio oficial (`pubecomhub.lovable.app`) ou no preview do Lovable?
