import { ExecutionProvider, ExecutionResult } from "./ExecutionProvider";
// @ts-ignore - Importing from .server file which might not be resolved correctly by build tools but is handled by the worker environment
import { runShopeeWorker } from "../workers/ShopeeWorker.server";

export class ShopeeExecutionProvider implements ExecutionProvider<any> {
  async execute(params: Record<string, any>): Promise<ExecutionResult<any>> {
    const { url, limit = 50, shopId } = params;
    
    console.log(`[ShopeeExecutionProvider] Orchestrating worker for shop: ${shopId || url}`);

    try {
      // Execute the server-side worker
      // This function will run on the server and use Playwright to fetch the data
      const result = await runShopeeWorker({
        url,
        shopId,
        limit,
        pageSize: 30
      });

      return {
        data: result.items,
        totalFound: result.items.length,
        errors: result.errors,
        metadata: {
          shopId: result.shopId,
          source: 'shopee_worker',
          executionTime: result.executionTime
        }
      };
    } catch (error: any) {
      console.error(`[ShopeeExecutionProvider] Worker execution failed:`, error);
      return {
        data: [],
        totalFound: 0,
        errors: [error.message || 'Erro desconhecido na execução do worker'],
        metadata: { error: true }
      };
    }
  }
}
