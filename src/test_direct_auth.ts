import { createClient } from '@supabase/supabase-js';

async function testDirect() {
  const supabaseUrl = 'https://vtcnundfslqqlxdyrogv.supabase.co';
  // Usando a chave hardcoded do client.ts para garantir que é a mesma usada no browser
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y251bmRmc2xxcWx4ZHlyb2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1MDgwODUsImV4cCI6MjEwMzA4NDA4NX0.aPEa_lbTAoyBaXQooZ1mUMJuMhsurJMm_Ni7sS1TurU';
  
  const client = createClient(supabaseUrl, supabaseAnonKey);
  
  console.log('--- TESTE DIRETO VIA SDK (PROJETO OFICIAL) ---');
  
  const { data, error } = await client.auth.signInWithPassword({
    email: 'contato.pubcore@gmail.com',
    password: 'MasterPubEcom2026Final'
  });
  
  if (error) {
    console.log('DIRECT_ERROR:' + error.message);
  } else {
    console.log('DIRECT_SUCCESS');
    console.log('USER_ID:' + data.user?.id);
  }
}
testDirect();
