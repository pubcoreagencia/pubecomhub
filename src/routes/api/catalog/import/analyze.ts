import { createFileRoute } from "@tanstack/react-router";
import { handleCatalogProxy, handleCorsPreflight } from "@/server/catalogProxy";

export const Route = createFileRoute("/api/catalog/import/analyze")({
  server: {
    handlers: {
      OPTIONS: async ({ request }): Promise<Response> => {
        const preflight = handleCorsPreflight(request);
        return preflight || new Response(null, { status: 204 });
      },
      POST: async ({ request }): Promise<Response> => {
        console.log("[DEBUG] /api/catalog/import/analyze invoked", {
          method: request.method,
          pathname: new URL(request.url).pathname,
        });
        const response = await handleCatalogProxy(request);
        console.log("[DEBUG] Proxy response", {
          status: response?.status,
          ok: response?.ok,
        });
        return (
          response ||
          new Response(JSON.stringify({ error: "Endpoint proxy não encontrado" }), { status: 404 })
        );
      },
    },
  },
});
