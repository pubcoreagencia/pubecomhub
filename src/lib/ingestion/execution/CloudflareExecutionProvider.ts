import { ExecutionProvider, ExecutionResult } from "./ExecutionProvider";

export class CloudflareExecutionProvider implements ExecutionProvider<any> {
  async execute(params: Record<string, any>): Promise<ExecutionResult<any>> {
    const { url, limit = 50, shopId } = params;
    
    // In a real TanStack Start server environment, these would be in process.env
    // Read inside the method to ensure they are available at execution time
    const workerUrl = process.env.CATALOG_WORKER_URL;
    const workerToken = process.env.CATALOG_WORKER_TOKEN;

    if (!workerUrl) {
      throw new Error("Configuração ausente: CATALOG_WORKER_URL não definido.");
    }

    console.log(`[CloudflareExecutionProvider] Routing request to external worker: ${workerUrl}`);

    try {
      const response = await fetch(`${workerUrl}/ingestion/shopee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': workerToken ? `Bearer ${workerToken}` : '',
        },
        body: JSON.stringify({
          url,
          limit,
          shopId,
          pageSize: 30
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Worker Externo erro (${response.status}): ${errorText}`);
      }

      const result = await response.json();

      return {
        data: result.items || [],
        totalFound: (result.items || []).length,
        errors: result.errors || [],
        metadata: {
          shopId: result.shopId,
          source: 'cloudflare_browser_run',
          executionTime: result.metadata?.executionTime || 0,
          external: true
        }
      };
    } catch (error: any) {
      console.error(`[CloudflareExecutionProvider] External execution failed:`, error);
      throw error;
    }
  }
}
