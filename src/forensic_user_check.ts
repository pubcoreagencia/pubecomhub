import { createClient } from '@supabase/supabase-js';

async function verifyUserStatus() {
  const SUPABASE_URL = process.env['SUPABASE_URL'];
  const SUPABASE_SERVICE_ROLE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing env vars');
    return;
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const email = 'contato.pubcore@gmail.com';
  console.log(`[Forensic] Verificando status de ${email} no projeto ${SUPABASE_URL}...`);

  const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (userError) {
    console.error('Error listing users:', userError);
    return;
  }

  const user = users.users.find(u => u.email === email);
  
  if (!user) {
    console.error('USUÁRIO NÃO ENCONTRADO NO AUTH.USERS');
    return;
  }

  console.log('[Forensic] Usuário encontrado:', {
    id: user.id,
    email: user.email,
    email_confirmed: !!user.email_confirmed_at,
    last_sign_in: user.last_sign_in_at,
    banned_until: user.banned_until,
    is_sso: user.app_metadata?.provider === 'sso'
  });

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (profileError) {
    console.error('Erro ao buscar profile:', profileError);
  } else {
    console.log('[Forensic] Profile encontrado:', profile);
  }
}

verifyUserStatus().catch(console.error);
