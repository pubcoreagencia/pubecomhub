import { createClient } from '@supabase/supabase-js';

async function testDirect() {
  const supabaseUrl = 'https://vtcnundfslqqlxdyrogv.supabase.co';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
  
  const client = createClient(supabaseUrl, supabaseAnonKey);
  
  console.log('--- TESTE DIRETO VIA CLIENTE (SERVER-SIDE) ---');
  
  const { data, error } = await client.auth.signInWithPassword({
    email: 'contato.pubcore@gmail.com',
    password: 'MasterPubEcom2026Final'
  });
  
  if (error) {
    console.log('DIRECT_ERROR:' + error.message);
    console.log('ERROR_CODE:' + error.status);
  } else {
    console.log('DIRECT_SUCCESS');
    console.log('USER_ID:' + data.user?.id);
  }
}
testDirect();
