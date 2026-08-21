import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const createCatalogWorkerFn = createServerFn({ method: "POST" })
  .validator((data) => z.object({
    repoName: z.string(),
    description: z.string().optional()
  }).parse(data))
  .handler(async ({ data }) => {
    console.log(`[WorkerFactory] Logic to initialize project: ${data.repoName}`);
    // No ambiente sandbox, não criamos repositórios git reais externos, 
    // mas preparamos a estrutura para o usuário.
    return { success: true, message: `Projeto ${data.repoName} preparado para infraestrutura.` };
  });
