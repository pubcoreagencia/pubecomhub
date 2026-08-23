import { supabaseAdmin } from './integrations/supabase/client.server';

async function finalReset() {
  const email = 'contato.pubcore@gmail.com';
  const pass = 'PubEcomMaster_2026'; 
  
  try {
    const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
    const user = userData?.users.find(u => u.email === email);
    
    if (user) {
      // 1. Resetar
      await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { password: pass, email_confirm: true }
      );
      
      console.log('RESET_DONE');

      // 2. Testar com o service_role mas SEM as permissões de admin injetadas no cliente (puro SDK)
      const { createClient } = await import('@supabase/supabase-js');
      // Usar a service role key do ambiente (SECRETA) para testar se é algo na anon key
      // Mas a service role key não está disponível para leitura direta aqui,
      // então usamos o client configurado supabaseAdmin que já a tem.
      
      // Testar login via supabaseAdmin (service_role)
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password: pass
      });
      
      if (data.session) {
          console.log('SERVICE_ROLE_AUTH: SUCCESS');
          console.log('TOKEN_TYPE: ' + data.session.token_type);
          // O token retornado aqui deve funcionar no browser se setado manualmente
      } else {
          console.log('SERVICE_ROLE_AUTH: FAILED - ' + error?.message);
      }
    }
  } catch (e: any) {
    console.log('FATAL:' + e.message);
  }
}
finalReset();
