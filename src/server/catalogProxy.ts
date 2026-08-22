export async function handleCatalogProxy(request: Request, env?: unknown): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;

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
    return new Response(JSON.stringify({ error: 'Not Found: Invalid catalog route' }), { status: 404 });
  }

  const envObj = (typeof env === 'object' && env !== null ? env : {}) as Record<string, any>;
  const workerUrl = (
    envObj['CATALOG_WORKER_URL'] ||
    process.env['CATALOG_WORKER_URL'] ||
    envObj['VITE_CATALOG_API_URL'] ||
    process.env['VITE_CATALOG_API_URL'] ||
    'https://pub-ecom-catalog-worker.contato-pubcore.workers.dev'
  ).replace(/\/+$/, '');

  const workerToken = (
    envObj['CATALOG_WORKER_TOKEN'] ||
    process.env['CATALOG_WORKER_TOKEN'] ||
    ''
  ).trim();

  if (!workerToken) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Catalog API: CATALOG_WORKER_TOKEN não configurado no servidor do Preview.',
        isAuthError: true,
      }),
      {
        status: 401,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      }
    );
  }

  const upstreamUrl = `${workerUrl}${targetPath}${url.search}`;
  const forwardHeaders = new Headers();

  const contentType = request.headers.get('content-type');
  if (contentType) forwardHeaders.set('content-type', contentType);

  const accept = request.headers.get('accept');
  if (accept) forwardHeaders.set('accept', accept);

  forwardHeaders.set('authorization', `Bearer ${workerToken}`);

  let body: BodyInit | null = null;
  if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
    body = await request.clone().arrayBuffer();
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers: forwardHeaders,
      body,
    });

    const responseHeaders = new Headers(upstreamResponse.headers);
    responseHeaders.set('content-type', 'application/json; charset=utf-8');

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
        headers: { 'content-type': 'application/json; charset=utf-8' },
      }
    );
  }
}
