import { createFileRoute } from '@tanstack/react-router';
import { handleCatalogProxy } from '@/server/catalogProxy';
import { supabaseAdmin } from '@/integrations/supabase/client.server';

export const Route = createFileRoute('/api/ingestion/shopee')({
  server: {
    handlers: {
      POST: async ({ request }): Promise<Response> => {
        // 1. O proxy exige uma sessão autenticada válida
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return new Response(JSON.stringify({ error: 'Unauthorized: No token provided' }), { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        
        // 2. Validar a identidade real da sessão usando Supabase Admin (Server-side)
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
          return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), { status: 401 });
        }

        // 3. Buscar a role do usuário via helper has_role ou query direta segura
        const { data: roleData, error: roleError } = await supabaseAdmin
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (roleError || !roleData) {
          return new Response(JSON.stringify({ error: 'Forbidden: Profile not found' }), { status: 403 });
        }

        const userRole = roleData.role;

        // 4. Regra de autorização real: Ingestão Shopee (Master Catalog)
        // Somente MASTER pode realizar ingestão global no Master Catalog
        if (userRole !== 'MASTER') {
          return new Response(JSON.stringify({ error: 'Forbidden: Only MASTER can ingest into catalog' }), { status: 403 });
        }

        // 5. O proxy só deve chamar o catalog-worker DEPOIS da autorização
        // Passamos o request original para o proxy que injetará o token server-side
        return await handleCatalogProxy(request);
      }
    }
  }
});
