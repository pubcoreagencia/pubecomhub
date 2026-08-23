import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env['SUPABASE_URL'] || process.env['VITE_SUPABASE_URL'];
const SUPABASE_SERVICE_ROLE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY'];

async function resetMaster() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("ERRO: Credenciais admin não encontradas.");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const email = 'contato.pubcore@gmail.com';
  const newPassword = 'PUBrecords@5929';

  console.log(`Conectado ao projeto: ${SUPABASE_URL}`);
  
  // 1. Localizar usuário
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Erro ao listar usuários:", listError);
    process.exit(1);
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    console.error(`Usuário ${email} não encontrado no banco atual.`);
    process.exit(1);
  }

  console.log(`Usuário encontrado: ${user.id}`);

  // 2. Atualizar senha
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password: newPassword
  });

  if (updateError) {
    console.error("Erro ao atualizar senha:", updateError);
    process.exit(1);
  }

  console.log("Senha Master atualizada com sucesso no backend conectado.");

  // 3. Testar login (via SDK)
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password: newPassword
  });

  if (loginError) {
    console.error("Falha na validação do login após reset:", loginError);
  } else {
    console.log("Validação de LOGIN: PASS");
  }
}

resetMaster();
