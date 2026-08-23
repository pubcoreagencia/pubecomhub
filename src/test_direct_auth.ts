import { createClient } from '@supabase/supabase-js';

async function testDirect() {
  const supabaseUrl = 'https://vtcnundfslqqlxdyrogv.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y251bmRmc2xxcWx4ZHlyb2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1MDgwODUsImV4cCI6MjEwMzA4NDA4NX0.aPEa_lbTAoyBaXQooZ1mUMJuMhsurJMm_Ni7sS1TurU';
  
  const client = createClient(supabaseUrl, supabaseAnonKey);
  
  console.log('--- TESTE SDK (REPETIÇÃO) ---');
  
  const { data, error } = await client.auth.signInWithPassword({
    email: 'contato.pubcore@gmail.com',
    password: 'PubEcomMaster_2026'
  });
  
  if (error) {
    console.log('DIRECT_ERROR:' + error.message);
  } else {
    console.log('DIRECT_SUCCESS');
  }
}
testDirect();
