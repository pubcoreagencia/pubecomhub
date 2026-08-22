import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleCatalogProxy, validateSupabaseCaller } from '../src/server/catalogProxy';

describe('Catalog Proxy Authentication & RBAC Forensics (HTTP real)', () => {
  const MASTER_TOKEN = 'mock-jwt-master-token';
  const LOJISTA_TOKEN = 'mock-jwt-lojista-token';
  const FORNECEDOR_TOKEN = 'mock-jwt-fornecedor-token';
  const INFLUENCER_TOKEN = 'mock-jwt-influencer-token';
  const INVALID_TOKEN = 'mock-jwt-invalid-token';

  const mockEnv = {
    SUPABASE_URL: 'https://test-project.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
    CATALOG_WORKER_URL: 'https://pub-ecom-catalog-worker.contato-pubcore.workers.dev',
    CATALOG_WORKER_TOKEN: 'valid-worker-token-12345',
  };

  beforeEach(() => {
    vi.restoreAllMocks();

    // Mock global fetch for upstream worker and Supabase calls
    global.fetch = vi.fn(async (input: any, init?: any) => {
      const urlStr = String(typeof input === 'string' ? input : input.url || '');

      // Supabase Auth getUser mock
      if (urlStr.includes('/auth/v1/user')) {
        const authHeader = init?.headers?.Authorization || init?.headers?.get?.('Authorization');
        if (authHeader?.includes(MASTER_TOKEN)) {
          return new Response(JSON.stringify({ id: 'uid-master', email: 'admin@pub.com' }), { status: 200 });
        }
        if (authHeader?.includes(LOJISTA_TOKEN)) {
          return new Response(JSON.stringify({ id: 'uid-lojista', email: 'lojista@pub.com' }), { status: 200 });
        }
        if (authHeader?.includes(FORNECEDOR_TOKEN)) {
          return new Response(JSON.stringify({ id: 'uid-fornecedor', email: 'forn@pub.com' }), { status: 200 });
        }
        if (authHeader?.includes(INFLUENCER_TOKEN)) {
          return new Response(JSON.stringify({ id: 'uid-influencer', email: 'inf@pub.com' }), { status: 200 });
        }
        return new Response(JSON.stringify({ message: 'Invalid JWT' }), { status: 401 });
      }

      // Supabase Profiles query mock
      if (urlStr.includes('/rest/v1/profiles')) {
        if (urlStr.includes('uid-master')) {
          return new Response(JSON.stringify([{ role: 'MASTER' }]), { status: 200, headers: { 'content-type': 'application/json' } });
        }
        if (urlStr.includes('uid-lojista')) {
          return new Response(JSON.stringify([{ role: 'LOJISTA' }]), { status: 200, headers: { 'content-type': 'application/json' } });
        }
        if (urlStr.includes('uid-fornecedor')) {
          return new Response(JSON.stringify([{ role: 'FORNECEDOR' }]), { status: 200, headers: { 'content-type': 'application/json' } });
        }
        if (urlStr.includes('uid-influencer')) {
          return new Response(JSON.stringify([{ role: 'INFLUENCER' }]), { status: 200, headers: { 'content-type': 'application/json' } });
        }
        return new Response(JSON.stringify([]), { status: 200, headers: { 'content-type': 'application/json' } });
      }

      // Upstream Catalog Worker mock
      if (urlStr.includes('pub-ecom-catalog-worker.contato-pubcore.workers.dev')) {
        const auth = init?.headers?.get?.('authorization') || init?.headers?.authorization;
        if (auth === 'Bearer valid-worker-token-12345') {
          return new Response(JSON.stringify({ success: true, message: 'Proxied successfully' }), { status: 200, headers: { 'content-type': 'application/json' } });
        }
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized worker token' }), { status: 401 });
      }

      return new Response('Not found', { status: 404 });
    });
  });

  describe('1. Unauthenticated Proxy Prevention (Finding 2)', () => {
    it('ANON request to /ingestion/shopee is rejected with HTTP 401 Unauthorized', async () => {
      const req = new Request('https://pubecomhub.com/ingestion/shopee', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ shopId: '12345' }),
      });

      const res = await handleCatalogProxy(req, mockEnv);
      expect(res).not.toBeNull();
      expect(res!.status).toBe(401);
      const json = await res!.json();
      expect(json.isAuthError).toBe(true);
      expect(json.error).toContain('Unauthorized');
    });

    it('Invalid JWT request to /ingestion/shopee is rejected with HTTP 401 Unauthorized', async () => {
      const req = new Request('https://pubecomhub.com/ingestion/shopee', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${INVALID_TOKEN}`,
        },
        body: JSON.stringify({ shopId: '12345' }),
      });

      const res = await handleCatalogProxy(req, mockEnv);
      expect(res).not.toBeNull();
      expect(res!.status).toBe(401);
    });
  });

  describe('2. Role-Based Scraping Authorization (Finding 2 & Finding 7)', () => {
    it('Authenticated LOJISTA is rejected with HTTP 403 Forbidden when calling /ingestion/shopee', async () => {
      const req = new Request('https://pubecomhub.com/ingestion/shopee', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${LOJISTA_TOKEN}`,
        },
        body: JSON.stringify({ shopId: '12345' }),
      });

      const res = await handleCatalogProxy(req, mockEnv);
      expect(res).not.toBeNull();
      expect(res!.status).toBe(403);
      const json = await res!.json();
      expect(json.requiredRole).toBe('MASTER');
      expect(json.currentRole).toBe('LOJISTA');
    });

    it('Authenticated FORNECEDOR is rejected with HTTP 403 Forbidden when calling /ingestion/shopee', async () => {
      const req = new Request('https://pubecomhub.com/ingestion/shopee', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${FORNECEDOR_TOKEN}`,
        },
        body: JSON.stringify({ shopId: '12345' }),
      });

      const res = await handleCatalogProxy(req, mockEnv);
      expect(res).not.toBeNull();
      expect(res!.status).toBe(403);
    });

    it('Authenticated INFLUENCER is rejected with HTTP 403 Forbidden when calling /ingestion/shopee', async () => {
      const req = new Request('https://pubecomhub.com/ingestion/shopee', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${INFLUENCER_TOKEN}`,
        },
        body: JSON.stringify({ shopId: '12345' }),
      });

      const res = await handleCatalogProxy(req, mockEnv);
      expect(res).not.toBeNull();
      expect(res!.status).toBe(403);
    });

    it('MASTER is ALLOWED (HTTP 200) to trigger /ingestion/shopee', async () => {
      const req = new Request('https://pubecomhub.com/ingestion/shopee', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${MASTER_TOKEN}`,
        },
        body: JSON.stringify({ shopId: '12345' }),
      });

      const res = await handleCatalogProxy(req, mockEnv);
      expect(res).not.toBeNull();
      expect(res!.status).toBe(200);
      const json = await res!.json();
      expect(json.success).toBe(true);
      expect(json.message).toBe('Proxied successfully');
    });

    it('Authenticated LOJISTA is ALLOWED to read standard catalog routes /v1/catalog/stores', async () => {
      const req = new Request('https://pubecomhub.com/v1/catalog/stores', {
        method: 'GET',
        headers: {
          'authorization': `Bearer ${LOJISTA_TOKEN}`,
        },
      });

      const res = await handleCatalogProxy(req, mockEnv);
      expect(res).not.toBeNull();
      expect(res!.status).toBe(200);
    });

    it('ANON is REJECTED (HTTP 401) on /v1/catalog/stores', async () => {
      const req = new Request('https://pubecomhub.com/v1/catalog/stores', {
        method: 'GET',
      });

      const res = await handleCatalogProxy(req, mockEnv);
      expect(res).not.toBeNull();
      expect(res!.status).toBe(401);
    });
  });
});
