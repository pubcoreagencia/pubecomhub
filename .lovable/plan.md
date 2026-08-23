# Plano de Reset de Senha MASTER

O usuário confirmou o uso do e-mail `contato.pubcore@gmail.com` e solicitou a definição de uma nova senha temporária após falhas no login.

## Ações Propostas

### 1. Reset da Senha via Script Admin
Executarei um script no ambiente de desenvolvimento que utiliza o `supabaseAdmin` (Service Role) para atualizar a senha do usuário `contato.pubcore@gmail.com`.
- A senha será definida para um valor seguro e temporário.
- A atualização será feita diretamente no provedor de autenticação (Supabase Auth).

### 2. Validação Forense de Login
Após o reset, utilizarei o Playwright para:
- Tentar realizar o login com a nova senha.
- Confirmar que o redirecionamento para o dashboard ocorre com sucesso.
- Verificar se a role `MASTER` é identificada corretamente pela aplicação.

### 3. Entrega das Credenciais
Informarei ao usuário que a senha foi resetada e que ele deve tentar o login novamente (recomendo o uso de aba anônima para evitar cache de sessões inválidas).

## Verificação Técnica
- Verificação do status do usuário no Supabase Auth após o comando.
- Teste de sanidade na rota `/dashboard`.
