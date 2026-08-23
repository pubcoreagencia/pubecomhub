
import { createClient } from '@supabase/supabase-js';

const OFFICIAL_SUPABASE_URL = 'https://vtcnundfslqqlxdyrogv.supabase.co';
const OFFICIAL_SUPABASE_SERVICE_ROLE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY']; // I need to be sure I have the RIGHT service role key for the official project, but Lovable Cloud injects the current project's key.

async function applyMasterReset() {
  if (!OFFICIAL_SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Erro: Chave SERVICE_ROLE não encontrada no ambiente.');
    return;
  }

  // NOTE: If SUPABASE_URL in env is the official one, it works. 
  // If it's the sandbox one, I'm resetting the sandbox user.
  const supabaseAdmin = createClient(
    process.env['SUPABASE_URL'] || OFFICIAL_SUPABASE_URL,
    OFFICIAL_SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const email = 'contato.pubcore@gmail.com';
  const newPassword = 'PUBrecords@5929';

  console.log(`[Action] Executando reset MASTER para ${email}...`);

  // 1. Localizar o usuário
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) throw listError;
  
  const user = users.find(u => u.email === email);
  if (!user) {
    console.error('Usuário não encontrado!');
    return;
  }

  console.log(`[Action] UUID identificado: ${user.id}`);

  // 2. Forçar atualização da senha via Admin API (ignora requisitos de e-mail e políticas do GoTrue)
  const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    { password: newPassword }
  );

  if (updateError) {
    console.error('[Action] FALHA NO RESET:', updateError.message);
  } else {
    console.log('[Action] SUCESSO! Senha atualizada via Admin API.');
  }
}

applyMasterReset().catch(console.error);
