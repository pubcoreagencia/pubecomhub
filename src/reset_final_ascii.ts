import { supabaseAdmin } from './integrations/supabase/client.server';

async function finalReset() {
  const email = 'contato.pubcore@gmail.com';
  const pass = 'PubEcomMaster_2026'; 
  
  try {
    const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
    const user = userData?.users.find(u => u.email === email);
    
    if (user) {
      // Garantir que não há flags de segurança bloqueando
      await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { 
          password: pass, 
          email_confirm: true,
          user_metadata: { role: 'MASTER' }, // Reforçar metadados se existirem
          app_metadata: { role: 'MASTER' }
        }
      );
      
      console.log('RESET_COMPLETE_WITH_METADATA');
      
      const { createClient } = await import('@supabase/supabase-js');
      const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y251bmRmc2xxcWx4ZHlyb2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1MDgwODUsImV4cCI6MjEwMzA4NDA4NX0.aPEa_lbTAoyBaXQooZ1mUMJuMhsurJMm_Ni7sS1TurU';
      const anonClient = createClient('https://vtcnundfslqqlxdyrogv.supabase.co', anonKey);
      
      // Tentar login com o anonClient
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
