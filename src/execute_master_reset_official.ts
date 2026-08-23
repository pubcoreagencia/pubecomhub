import { supabaseAdmin } from "./integrations/supabase/client.server";

async function performReset() {
  const email = "contato.pubcore@gmail.com";
  const newPassword = "PUBrecords@5929";
  
  console.log("Checking user on official project vtcnundfslqqlxdyrogv...");
  
  // Confirme o UUID antes da alteração.
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.error("PASSWORD_UPDATE = FAIL (List Error)");
    return;
  }
  
  const user = users.find(u => u.email === email);
  if (!user) {
    console.error("PASSWORD_UPDATE = FAIL (User not found)");
    return;
  }
  
  console.log(`UUID_CONFIRMED: ${user.id}`);
  
  // Confirme que o usuário continua com perfil MASTER.
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (profileError || profile?.role !== 'MASTER') {
    console.error(`MASTER_RBAC = FAIL (Role: ${profile?.role || 'null'})`);
    return;
  }
  console.log("MASTER_RBAC = PASS");

  // Atualize a senha do usuário para a senha definitiva
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    { password: newPassword }
  );

  if (updateError) {
    console.error(`PASSWORD_UPDATE = FAIL (${updateError.message})`);
    return;
  }
  console.log("PASSWORD_UPDATE = PASS");

  // Teste de autenticação
  try {
    const { error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password: newPassword,
    });
    console.log(`LOGIN_WITH_NEW_PASSWORD = ${!authError ? 'PASS' : 'FAIL'}`);
  } catch (e) {
    console.log("LOGIN_WITH_NEW_PASSWORD = FAIL");
  }
}

performReset().catch(console.error);
