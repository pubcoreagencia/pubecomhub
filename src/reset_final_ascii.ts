import { supabaseAdmin } from './integrations/supabase/client.server';

async function finalReset() {
  const email = 'contato.pubcore@gmail.com';
  // Senha com complexidade padrão mas sem caracteres de escape problemáticos
  const pass = 'PubEcomMaster_2026'; 
  
  try {
    const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
    const user = userData?.users.find(u => u.email === email);
    
    if (user) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { password: pass, email_confirm: true }
      );
      
      if (!error) {
        console.log('RESET_SUCCESS_ASCII');
        console.log('NEW_PASS:' + pass);
        
        // Testar login imediato no servidor com esta mesma string
        const { error: loginError } = await supabaseAdmin.auth.signInWithPassword({
          email,
          password: pass
        });
        
        if (loginError) {
          console.log('SERVER_LOGIN_FAILED_IMMEDIATELY:' + loginError.message);
        } else {
          console.log('SERVER_LOGIN_PASSED');
        }
      } else {
        console.log('RESET_ERROR:' + error.message);
      }
    }
  } catch (e: any) {
    console.log('FATAL:' + e.message);
  }
}
finalReset();
