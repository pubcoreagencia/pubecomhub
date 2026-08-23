# Plano: Conexão do Backend Oficial e Reset Master

O objetivo é conectar o projeto Supabase oficial (`vtcnundfslqqlxdyrogv`) e garantir que a conta MASTER (`contato.pubcore@gmail.com`) esteja com a senha definitiva configurada corretamente.

## Passos para o Usuário

1. No painel lateral do Lovable (à esquerda), clique no ícone do **Supabase** (ou no botão **"View Backend"** no topo).
2. Conecte o projeto oficial: `vtcnundfslqqlxdyrogv`.
3. Assim que as variáveis de ambiente forem atualizadas, o sistema reconhecerá o novo banco de dados.

## Passos Técnicos (Lovable)

1. **Verificação de Ambiente**: Validar se `VITE_SUPABASE_URL` agora aponta para `vtcnundfslqqlxdyrogv`.
2. **Reset Master Definitivo**: Executar o script de reset de senha para `contato.pubcore@gmail.com` no banco oficial.
3. **Teste Forense**: Validar login e acesso ao dashboard com a nova credencial.

## Detalhes Técnicos
- O reset será feito via `supabaseAdmin` para evitar latências do GoTrue.
- A senha definitiva já foi fornecida anteriormente (`PUBrecords@5929`).
