import { createClient } from '@supabase/supabase-js';

const OFFICIAL_SUPABASE_URL = 'https://vtcnundfslqqlxdyrogv.supabase.co';
const OFFICIAL_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y251bmRmc2xxcWx4ZHlyb2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1MDgwODUsImV4cCI6MjEwMzA4NDA4NX0.aPEa_lbTAoyBaXQooZ1mUMJuMhsurJMm_Ni7sS1TurU';

async function testLogin() {
  const email = 'contato.pubcore@gmail.com';
  const password = 'PUBrecords@5929';
  
  const supabase = createClient(OFFICIAL_SUPABASE_URL, OFFICIAL_SUPABASE_ANON_KEY);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  console.log(JSON.stringify({ 
    url: OFFICIAL_SUPABASE_URL,
    success: !error, 
    error: error?.message,
    userId: data.user?.id 
  }));
}

testLogin().catch(err => console.error(JSON.stringify(err)));
