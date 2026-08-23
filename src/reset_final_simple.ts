import { supabaseAdmin } from './integrations/supabase/client.server';

async function finalReset() {
  const email = 'contato.pubcore@gmail.com';
  // Senha alfanumérica simples, sem caracteres especiais que possam causar problemas de encoding no browser
  const pass = 'MasterPubEcom2026Final'; 
  
  try {
    const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
    const user = userData?.users.find(u => u.email === email);
    
    if (user) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { password: pass, email_confirm: true }
      );
      
      if (!error) {
        console.log('RESET_SUCCESS_SIMPLE');
        console.log('NEW_PASS:' + pass);
      } else {
        console.log('RESET_ERROR:' + error.message);
      }
    }
  } catch (e: any) {
    console.log('FATAL:' + e.message);
  }
}
finalReset();
