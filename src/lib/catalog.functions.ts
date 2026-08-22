import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { catalogIngestionService } from "./ingestion/CatalogIngestionService";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const analyzeCatalogFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ url: z.string().url() }).parse(data))
  .handler(async ({ data, context }) => {
    // Apenas MASTER pode analisar catálogos para o Master Catalog
    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', context.userId).single();
    if (profile?.role !== 'MASTER') {
      throw new Error("Forbidden: Only MASTER can analyze catalogs");
    }

    try {
      return await catalogIngestionService.analyzeSource(data.url);
    } catch (error: any) {
      throw new Error(error.message || "Erro ao analisar catálogo");
    }
  });

export const importProductsFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({
    items: z.array(z.any()),
    supplierId: z.string()
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', context.userId).single();
    if (profile?.role !== 'MASTER') {
      throw new Error("Forbidden");
    }

    return await catalogIngestionService.confirmImport(data.items, data.supplierId);
  });
