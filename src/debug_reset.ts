import { supabaseAdmin } from './integrations/supabase/client.server';
import * as fs from 'fs';

async function verifyAndReset() {
  const email = 'contato.pubcore@gmail.com';
  // Senha fixa para este teste de depuração (NÃO SERÁ EXPOSTA NO LOG)
  const debugPass = 'PubEcomMaster2026!Test'; 

  console.log('--- AUDITORIA DE INFRAESTRUTURA AUTH ---');
  
  try {
    // 1. Listar usuários para ver se o UUID coincide com o que vimos antes
    const { data: userData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;
    
    const user = userData.users.find(u => u.email === email);
    if (!user) {
      console.log('USUARIO_ENCONTRADO: FALSE');
      return;
    }
    
    console.log('USUARIO_UUID:', user.id);
    console.log('EMAIL_CONFIRMADO:', user.email_confirmed_at);
    console.log('LAST_SIGN_IN:', user.last_sign_in_at);

    // 2. Tentar resetar novamente com uma senha que conhecemos exatamente
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: debugPass }
    );

    if (updateError) {
      console.log('RESET_REPETIDO: FAIL (' + updateError.message + ')');
    } else {
      console.log('RESET_REPETIDO: PASS');
      fs.writeFileSync('/tmp/temp_master_pass.txt', debugPass);
    }
    
  } catch (e: any) {
    console.error('CRITICAL_DEBUG_FAIL:', e.message);
  }
}
verifyAndReset();
