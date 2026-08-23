# Plano de Correção de Segurança e Auditoria de Acesso

Este plano visa corrigir as vulnerabilidades de segurança identificadas e garantir que o acesso administrativo para `contato.pubcore@gmail.com` esteja plenamente operacional e seguro.

## Ajustes de Segurança (Backend)
1. **Remoção de Escalabilidade de Role**: Ajustar a função `has_role` ou políticas de RLS para impedir que usuários alterem sua própria role na tabela `profiles`.
2. **Endurecimento de Funções Security Definer**: Revisar e restringir as permissões de execução de funções `security definer` para que não fiquem expostas a usuários `authenticated` sem necessidade.
3. **Proteção de Views Security Definer**: Garantir que views que utilizam `security definer` não vazem dados sensíveis através de vazamentos de planejamento de consulta.

## Ajustes de Acesso e UI
1. **Atualização do Placeholder de Login**: Mudar o e-mail padrão de `admin@pubcore.com` para `contato.pubcore@gmail.com` em `src/pages/LoginPage.tsx`.
2. **Sincronização do Project Context**: Atualizar `PROJECT_CONTEXT.md` para refletir o novo e-mail administrativo e os novos padrões de segurança.

## Detalhes Técnicos
- Utilização de `supabase--run_sql` para aplicar correções de RLS e permissões.
- Edição direta de componentes React para melhoria de UX no login.
- Validação via scanner de segurança após aplicação.

