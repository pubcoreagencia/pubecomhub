import { supabaseAdmin } from './integrations/supabase/client.server';

async function verify() {
  const email = 'contato.pubcore@gmail.com';
  
  try {
    const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
    const user = userData?.users.find(u => u.email === email);
    
    if (user) {
      console.log('USER_ID:' + user.id);
      console.log('CONFIRMED:' + user.email_confirmed_at);
      console.log('BANNED:' + (user.banned_until ? 'YES' : 'NO'));
      
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      console.log('PROFILE_ROLE:' + profile?.role);
      
      // Tentar um login direto via service_role (não via admin, mas via auth comum se possível, 
      // embora service_role ignore senha, podemos testar a saúde do GoTrue)
      const { data: signIn, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password: 'u4ON0chhCXbEqmxDA1!'
      });
      
      if (signInError) {
        console.log('SIGNIN_ERROR:' + signInError.message);
      } else {
        console.log('SIGNIN_SUCCESS');
      }
    } else {
      console.log('USER_NOT_FOUND');
    }
  } catch (e: any) {
    console.log('FATAL:' + e.message);
  }
}
verify();
