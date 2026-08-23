import { createFileRoute } from '@tanstack/react-router';
import { handleCatalogProxy } from '@/server/catalogProxy';

export const Route = createFileRoute('/api/catalog/stats')({
  server: {
    handlers: {
      GET: async ({ request }): Promise<Response> => {
        const response = await handleCatalogProxy(request);
        return response || new Response(JSON.stringify({ error: 'Endpoint não encontrado' }), { status: 404 });
      },
    },
  },
});
