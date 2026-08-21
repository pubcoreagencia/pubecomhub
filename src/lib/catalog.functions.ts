import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { catalogIngestionService } from "./ingestion/CatalogIngestionService";

export const analyzeCatalogFn = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ url: z.string().url() }).parse(data))
  .handler(async ({ data }) => {
    try {
      return await catalogIngestionService.analyzeSource(data.url);
    } catch (error: any) {
      throw new Error(error.message || "Erro ao analisar catálogo");
    }
  });

export const importProductsFn = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    items: z.array(z.any()),
    supplierId: z.string()
  }).parse(data))
  .handler(async ({ data }) => {
    return await catalogIngestionService.confirmImport(data.items, data.supplierId);
  });
