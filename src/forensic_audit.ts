import { createClient } from '@supabase/supabase-js';

async function forensicAudit() {
  const envUrl = process.env['SUPABASE_URL'];
  const envKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];
  
  const OFFICIAL_URL = 'https://vtcnundfslqqlxdyrogv.supabase.co';
  
  console.log('--- AMBIENTE ---');
  console.log('SUPABASE_URL em ENV:', envUrl);
  console.log('Match com Oficial:', envUrl === OFFICIAL_URL);
  
  const supabase = createClient(envUrl!, envKey!);
  
  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users?.users.find(u => u.email === 'contato.pubcore@gmail.com');
  
  console.log('\n--- USUÁRIO AUTH ---');
  if (user) {
    console.log('ID:', user.id);
    console.log('Instância:', user.aud);
    console.log('Confirmado:', !!user.email_confirmed_at);
  } else {
    console.log('Usuário não encontrado nesta instância.');
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('email', 'contato.pubcore@gmail.com').single();
  console.log('\n--- PROFILE PUBLIC ---');
  console.log('Role:', profile?.role);
}

forensicAudit();
