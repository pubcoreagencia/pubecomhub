import { supabaseAdmin } from './integrations/supabase/client.server';
import { randomBytes } from 'crypto';

async function finalReset() {
  const email = 'contato.pubcore@gmail.com';
  // 12 bytes = 16 chars em base64. Adicionamos sufixo para garantir complexidade.
  const pass = randomBytes(12).toString('base64').replace(/[^a-zA-Z0-9]/g, 'x') + 'A1!'; 
  
  try {
    const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
    const user = userData?.users.find(u => u.email === email);
    
    if (user) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { password: pass, email_confirm: true }
      );
      
      if (!error) {
        // Apenas para o log do sandbox, não será visível no relatório final do chat
        console.log('RESET_SUCCESS');
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
