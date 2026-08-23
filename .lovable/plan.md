# Plano de Recuperação de Acesso MASTER - contato.pubcore@gmail.com

O usuário reportou erro de "senha incorreta" ao tentar acessar a conta MASTER `contato.pubcore@gmail.com`. A auditoria confirmou que o usuário e o perfil MASTER existem no banco de dados. O problema é estritamente de credenciais (senha).

## Ações Propostas

### 1. Reset de Senha via Admin (Execução Imediata)
Como a conta MASTER é crítica para a operação e o usuário reportou falha, realizarei o reset da senha diretamente via Supabase Admin para garantir o acesso imediato.
- Nova senha temporária será definida (a ser comunicada ao usuário).
- Forçar a atualização da senha no primeiro login se possível, ou orientar o reset manual posterior.

### 2. Validação de Acesso (Teste Forense)
Após o reset, realizarei um teste de login automatizado com Playwright para confirmar que:
- As novas credenciais funcionam.
- O `DashboardGuard` reconhece corretamente a role `MASTER`.
- O redirecionamento para `/dashboard` ocorre sem erros.

### 3. Limpeza de Cache de Sessão
Garantir que não existam sessões antigas ou tokens expirados no navegador do usuário que possam estar causando conflito.
- Instruir o usuário a limpar o cache ou usar uma aba anônima para o primeiro teste.

## Detalhes Técnicos
- O reset será feito usando a API de Admin do Supabase (bypassing e-mail de confirmação para agilidade no suporte).
- A role `MASTER` já está vinculada ao ID `9307fa99-8c1c-452d-ad55-3fdc8d96f580`.

## Verificação de Sucesso
- Login E2E PASS.
- Acesso ao catálogo PASS.
