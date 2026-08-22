import { createFileRoute } from '@tanstack/react-router';
import { handleCatalogProxy } from '@/server/catalogProxy';
import { supabaseAdmin } from '@/integrations/supabase/client.server';

export const Route = createFileRoute('/api/catalog/stores/$storeId/refresh')({
  server: {
    handlers: {
      POST: async ({ request, params }): Promise<Response> => {
        const { storeId } = params;

        // 1. Exige sessão autenticada
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        // 2. Buscar role
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        const userRole = profile?.role;

        // 3. Regra de autorização para Refresh:
        // MASTER: autorizado globalmente.
        // LOJISTA: somente lojas cujo stores.owner_id = auth.uid().
        if (userRole === 'MASTER') {
          // OK
        } else if (userRole === 'LOJISTA') {
          const { data: store } = await supabaseAdmin
            .from('stores')
            .select('owner_id')
            .eq('id', storeId)
            .single();

          if (!store || store.owner_id !== user.id) {
            return new Response(JSON.stringify({ error: 'Forbidden: You do not own this store' }), { status: 403 });
          }
        } else {
          return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
        }

        // 4. Chamar proxy
        return await handleCatalogProxy(request);
      }
    }
  }
});
