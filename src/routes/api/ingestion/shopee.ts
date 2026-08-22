import { createFileRoute } from '@tanstack/react-router';
import { handleCatalogProxy } from '@/server/catalogProxy';
import { supabaseAdmin } from '@/integrations/supabase/client.server';

export const Route = createFileRoute('/api/ingestion/shopee')({
  server: {
    handlers: {
      POST: async ({ request }): Promise<Response> => {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return new Response(JSON.stringify({ error: 'Unauthorized: No token provided' }), { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
          return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), { status: 401 });
        }

        const { data: roleData, error: roleError } = await supabaseAdmin
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (roleError || !roleData) {
          return new Response(JSON.stringify({ error: 'Forbidden: Profile not found' }), { status: 403 });
        }

        if (roleData.role !== 'MASTER') {
          return new Response(JSON.stringify({ error: 'Forbidden: Only MASTER can ingest into catalog' }), { status: 403 });
        }

        return await handleCatalogProxy(request);
      }
    }
  }
});
