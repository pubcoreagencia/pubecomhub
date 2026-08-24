import { createClient } from '@supabase/supabase-js';
import { setServerEnv, getServerEnv, getCatalogWorkerToken, getCatalogWorkerUrl, getSupabaseCredentials } from './env';

export interface ProxyAuthResult {
  authenticated: boolean;
  userId?: string;
  role?: string;
  error?: string;
  statusCode?: number;
}

/**
 * Validates the caller's Supabase Bearer JWT token and retrieves their role from profiles
 */
export async function validateSupabaseCaller(request: Request, envObj?: Record<string, any>): Promise<ProxyAuthResult> {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      authenticated: false,
      error: 'Unauthorized: Cabeçalho Authorization com token Bearer ausente.',
      statusCode: 401,
    };
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return {
      authenticated: false,
      error: 'Unauthorized: Token Bearer vazio.',
      statusCode: 401,
    };
  }

  const creds = getSupabaseCredentials(request);
  const supabaseUrl = envObj?.['SUPABASE_URL'] || creds.url;
  const supabaseKey = envObj?.['SUPABASE_SERVICE_ROLE_KEY'] || envObj?.['SUPABASE_PUBLISHABLE_KEY'] || creds.key;

  if (!supabaseUrl || !supabaseKey) {
    return {
      authenticated: false,
      error: 'Configuração do Supabase incompleta no servidor.',
      statusCode: 500,
    };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      console.error('[validateSupabaseCaller] Supabase getUser error:', userError?.message || userError);
      return {
        authenticated: false,
        error: `Unauthorized: Token de autenticação inválido ou expirado. (${userError?.message || 'Sessão não encontrada'})`,
        statusCode: 401,
      };
    }

    const userId = userData.user.id;

    // Fetch user profile role
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    const role = profileData?.role || 'LOJISTA';

    return {
      authenticated: true,
      userId,
      role,
    };
  } catch (err: any) {
    return {
      authenticated: false,
      error: `Falha na verificação de autenticação: ${err?.message || String(err)}`,
      statusCode: 401,
    };
  }
}

/**
 * Checks whether an origin is allowed by the dynamic allowlist
 */
export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    const host = url.hostname;
    // Allow local development (localhost, 127.0.0.1)
    if (host === 'localhost' || host === '127.0.0.1') {
      return true;
    }
    // Allow Cloudflare Workers & Pages domains
    if (host.endsWith('.workers.dev') || host.endsWith('.pages.dev')) {
      return true;
    }
    // Allow official production domains
    if (
      host === 'pubecomhub.com' ||
      host.endsWith('.pubecomhub.com') ||
      host === 'pubecom.com.br' ||
      host.endsWith('.pubecom.com.br') ||
      host === 'pubcore.com.br' ||
      host.endsWith('.pubcore.com.br')
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Generates CORS headers tailored to the request origin
 */
export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin') || request.headers.get('Origin');
  if (origin && isAllowedOrigin(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept, Origin, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    };
  }
  return {};
}

/**
 * Handles CORS Preflight OPTIONS requests
 */
export function handleCorsPreflight(request: Request): Response | null {
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin') || request.headers.get('Origin');
    const cors = getCorsHeaders(request);
    if (origin && isAllowedOrigin(origin)) {
      return new Response(null, {
        status: 204,
        headers: {
          ...cors,
          'Content-Length': '0',
        },
      });
    }
    return new Response(null, { status: 204 });
  }
  return null;
}

export async function handleCatalogProxy(request: Request, env?: unknown): Promise<Response | null> {
  if (request.method === 'OPTIONS') {
    const preflight = handleCorsPreflight(request);
    if (preflight) return preflight;
  }

  const cors = getCorsHeaders(request);
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (env) {
    setServerEnv(env);
  }

  // Safe diagnostic endpoint for verifying runtime bindings (never leaks secret value)
  if (pathname === '/api/catalog/health') {
    const token = getCatalogWorkerToken(request);
    const creds = getSupabaseCredentials(request);
    const workerUrl = getCatalogWorkerUrl(request);
    return new Response(
      JSON.stringify({
        status: 'ok',
        CATALOG_WORKER_TOKEN_PRESENT: Boolean(token && token.length > 0),
        CATALOG_WORKER_URL_PRESENT: Boolean(workerUrl && workerUrl.length > 0),
        SUPABASE_URL_PRESENT: Boolean(creds.url && creds.url.length > 0),
        SUPABASE_KEY_PRESENT: Boolean(creds.key && creds.key.length > 0),
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json; charset=utf-8', ...cors },
      }
    );
  }

  let targetPath: string | null = null;

  if (pathname.startsWith('/api/catalog/')) {
    targetPath = '/v1/catalog/' + pathname.slice('/api/catalog/'.length);
  } else if (pathname.startsWith('/api/ingestion/')) {
    targetPath = '/ingestion/' + pathname.slice('/api/ingestion/'.length);
  } else if (pathname.startsWith('/v1/catalog/')) {
    targetPath = pathname;
  } else if (pathname === '/ingestion/shopee' || pathname.startsWith('/ingestion/')) {
    targetPath = pathname;
  }

  if (!targetPath) {
    return null;
  }

  const envObj = getServerEnv(request);

  // 1. Authenticate caller with Supabase
  const auth = await validateSupabaseCaller(request, envObj);
  if (!auth.authenticated) {
    return new Response(
      JSON.stringify({
        success: false,
        error: auth.error || 'Unauthorized',
        isAuthError: true,
      }),
      {
        status: auth.statusCode || 401,
        headers: { 'content-type': 'application/json; charset=utf-8', ...cors },
      }
    );
  }

  // 2. Authorize based on route sensitivity
  // Global Scraping / Ingestion: Strictly MASTER
  if (targetPath.startsWith('/ingestion')) {
    if (auth.role !== 'MASTER') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Forbidden: Apenas administradores MASTER podem disparar operações globais de scraping e ingestão.',
          requiredRole: 'MASTER',
          currentRole: auth.role,
        }),
        {
          status: 403,
          headers: { 'content-type': 'application/json; charset=utf-8', ...cors },
        }
      );
    }
  }

  // Store Refresh: MASTER allowed globally; LOJISTA allowed ONLY if owner of the store
  if (targetPath.includes('/refresh')) {
    const storeMatch = targetPath.match(/\/stores\/([^/]+)\/refresh/);
    const targetStoreId = storeMatch ? storeMatch[1] : null;

    if (auth.role === 'MASTER') {
      // MASTER is globally allowed
    } else if (auth.role === 'LOJISTA') {
      if (!targetStoreId) {
        return new Response(
          JSON.stringify({ success: false, error: 'Bad Request: ID da loja ausente.' }),
          { status: 400, headers: { 'content-type': 'application/json; charset=utf-8', ...cors } }
        );
      }

      const creds = getSupabaseCredentials(request);
      const supabaseUrl = envObj['SUPABASE_URL'] || creds.url;
      const supabaseKey = envObj['SUPABASE_SERVICE_ROLE_KEY'] || envObj['SUPABASE_PUBLISHABLE_KEY'] || creds.key;

      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('owner_id')
        .eq('id', targetStoreId)
        .maybeSingle();

      if (storeError || !store || store.owner_id !== auth.userId) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Forbidden: Usuário não é o proprietário desta loja para disparar sincronização.',
          }),
          {
            status: 403,
            headers: { 'content-type': 'application/json; charset=utf-8', ...cors },
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Forbidden: Apenas MASTER ou o LOJISTA proprietário da loja podem atualizar catálogo.',
        }),
        {
          status: 403,
          headers: { 'content-type': 'application/json; charset=utf-8', ...cors },
        }
      );
    }
  }

  // 3. Load server-side Catalog Worker Token
  const workerUrl = getCatalogWorkerUrl(request);
  const workerToken = getCatalogWorkerToken(request);

  if (!workerToken) {
    const errorMsg = 'Catalog API: CATALOG_WORKER_TOKEN não configurado no servidor. O Ingestion Engine requer este segredo para operar.';
    console.error(`[CatalogProxy] ${errorMsg}`);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMsg,
        isAuthError: true,
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json; charset=utf-8', ...cors },
      }
    );
  }

  const upstreamUrl = `${workerUrl}${targetPath}${url.search}`;
  const forwardHeaders = new Headers();

  const contentType = request.headers.get('content-type');
  if (contentType) forwardHeaders.set('content-type', contentType);

  const accept = request.headers.get('accept');
  if (accept) forwardHeaders.set('accept', accept);

  // Attach server-side token for upstream worker
  forwardHeaders.set('authorization', `Bearer ${workerToken}`);

  let body: BodyInit | null = null;
  if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
    body = await request.clone().arrayBuffer();
  }

  try {
    const fetcher = (envObj['CATALOG_WORKER'] && typeof envObj['CATALOG_WORKER'].fetch === 'function')
      ? envObj['CATALOG_WORKER']
      : { fetch: globalThis.fetch };

    const upstreamResponse = await fetcher.fetch(upstreamUrl, {
      method: request.method,
      headers: forwardHeaders,
      body,
    });

    const responseHeaders = new Headers(upstreamResponse.headers);
    responseHeaders.set('content-type', 'application/json; charset=utf-8');
    for (const [k, v] of Object.entries(cors)) {
      responseHeaders.set(k, v);
    }

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Falha ao conectar com Catalog Worker: ${err?.message || String(err)}`,
      }),
      {
        status: 502,
        headers: { 'content-type': 'application/json; charset=utf-8', ...cors },
      }
    );
  }
}
