/**
 * Centralized Server-Side Environment & Secrets Resolver
 * Safely accesses Cloudflare Workers bindings (env) and process.env
 */

let globalServerEnv: Record<string, any> = {};

export function setServerEnv(env: unknown) {
  if (env && typeof env === 'object') {
    globalServerEnv = { ...globalServerEnv, ...(env as Record<string, any>) };
    try {
      if (typeof process !== 'undefined' && process.env) {
        Object.assign(process.env, env);
      }
    } catch {
      // ignore if process.env is read-only
    }
  }
}

export function getServerEnv(): Record<string, any> {
  const procEnv = (typeof process !== 'undefined' && process.env) ? process.env : {};
  return {
    ...procEnv,
    ...globalServerEnv,
  };
}

export function getCatalogWorkerToken(): string {
  const env = getServerEnv();
  return (
    env['CATALOG_WORKER_TOKEN'] ||
    env['VITE_CATALOG_API_TOKEN'] ||
    ''
  ).trim();
}

export function getCatalogWorkerUrl(): string {
  const env = getServerEnv();
  return (
    env['CATALOG_WORKER_URL'] ||
    env['VITE_CATALOG_API_URL'] ||
    'https://pub-ecom-catalog-worker.contato-pubcore.workers.dev'
  ).replace(/\/+$/, '');
}

export function getSupabaseCredentials(): { url: string; key: string } {
  const env = getServerEnv();
  const url = env['SUPABASE_URL'] || env['VITE_SUPABASE_URL'] || '';
  const key = (
    env['SUPABASE_SERVICE_ROLE_KEY'] ||
    env['SUPABASE_PUBLISHABLE_KEY'] ||
    env['VITE_SUPABASE_PUBLISHABLE_KEY'] ||
    ''
  );
  return { url, key };
}
