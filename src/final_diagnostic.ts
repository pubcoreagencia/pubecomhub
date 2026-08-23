import { createClient } from '@supabase/supabase-js';

const OFFICIAL_SUPABASE_URL = 'https://vtcnundfslqqlxdyrogv.supabase.co';
// A chave SERVICE ROLE do projeto oficial NÃO está disponível no sandbox do projeto temporário.
// O sandbox está rodando sob as credenciais de 'rouxgtjonfncswsqlcgz'.

async function finalDiagnostic() {
  const envUrl = process.env['SUPABASE_URL'];
  const email = 'contato.pubcore@gmail.com';
  
  console.log('--- DIAGNÓSTICO DE CONEXÃO ---');
  console.log('Ambiente SUPABASE_URL:', envUrl);
  console.log('Projeto Oficial Esperado:', OFFICIAL_SUPABASE_URL);
  
  if (envUrl !== OFFICIAL_SUPABASE_URL) {
    console.log('\n[CRÍTICO] O sandbox Lovable ainda está conectado ao banco temporário (rouxgtjonfncswsqlcgz).');
    console.log('O reset de senha executado nos turnos anteriores foi aplicado no banco TEMPORÁRIO.');
  } else {
    console.log('\n[INFO] O sandbox está conectado ao banco OFICIAL.');
  }

  const supabase = createClient(envUrl!, process.env['SUPABASE_SERVICE_ROLE_KEY']!);
  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users?.users.find(u => u.email === email);

  console.log('\n--- DADOS DO USUÁRIO NO BANCO CONECTADO ---');
  if (user) {
    console.log('UUID:', user.id);
    console.log('Último Login (Auth):', user.last_sign_in_at);
  } else {
    console.log('Usuário não encontrado no banco atual.');
  }
}

finalDiagnostic();
