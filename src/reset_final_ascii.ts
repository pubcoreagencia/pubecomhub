import { supabaseAdmin } from './integrations/supabase/client.server';

async function finalReset() {
  const email = 'contato.pubcore@gmail.com';
  const pass = 'PubEcomMaster_2026'; 
  
  try {
    const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
    const user = userData?.users.find(u => u.email === email);
    
    if (user) {
      await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { password: pass, email_confirm: true }
      );
      
      const { data } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password: pass
      });
      
      if (data.session) {
          console.log('RESET_PASS');
          const fs = await import('fs');
          fs.writeFileSync('/tmp/master_session.json', JSON.stringify(data.session));
      }
    }
  } catch (e: any) {
    console.log('FATAL:' + e.message);
  }
}
finalReset();
