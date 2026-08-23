import { supabaseAdmin } from './integrations/supabase/client.server';
import { randomBytes } from 'crypto';
import * as fs from 'fs';

async function executeReset() {
  const email = 'contato.pubcore@gmail.com';
  // Gere uma senha temporária forte e aleatória
  const tempPassword = randomBytes(12).toString('base64').substring(0, 16) + 'A1!'; 

  console.log('--- EXECUÇÃO DE RESET MASTER ---');
  
  try {
    const { data: userData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;
    
    const user = userData.users.find(u => u.email === email);
    if (!user) {
      console.log('RESET = FAIL (Usuário não encontrado)');
      return;
    }
    
    console.log('UUID_CONFIRMADO:', user.id);

    const { data: profile, error: profError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (profError || profile.role !== 'MASTER') {
      console.log('MASTER_RBAC = FAIL (Role inconsistent)');
      return;
    }
    console.log('MASTER_RBAC = PASS');

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: tempPassword }
    );

    if (updateError) {
      console.log('RESET = FAIL (' + updateError.message + ')');
    } else {
      console.log('RESET = PASS');
      fs.writeFileSync('/tmp/temp_master_pass.txt', tempPassword);
    }
    
  } catch (e: any) {
    console.error('CRITICAL_EXEC_FAIL:', e.message);
  }
}
executeReset();
