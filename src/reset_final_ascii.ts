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
      
      // 2. Testar login IMEDIATAMENTE após reset com o MESMO objeto de admin
      const { error: adminAuthError } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password: pass
      });
      console.log('ADMIN_AUTH_TEST:' + (adminAuthError ? adminAuthError.message : 'SUCCESS'));

      // 3. Testar com um NOVO cliente anon
      const { createClient } = await import('@supabase/supabase-js');
      const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y251bmRmc2xxcWx4ZHlyb2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1MDgwODUsImV4cCI6MjEwMzA4NDA4NX0.aPEa_lbTAoyBaXQooZ1mUMJuMhsurJMm_Ni7sS1TurU';
      const anonClient = createClient('https://vtcnundfslqqlxdyrogv.supabase.co', anonKey);
      
      const { error: anonAuthError } = await anonClient.auth.signInWithPassword({
        email,
        password: pass
      });
      console.log('ANON_AUTH_TEST:' + (anonAuthError ? anonAuthError.message : 'SUCCESS'));

    }
  } catch (e: any) {
    console.log('FATAL:' + e.message);
  }
}
finalReset();
