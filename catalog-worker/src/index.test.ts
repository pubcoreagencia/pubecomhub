import { describe, it, expect, vi } from 'vitest';

// Mock chromium from @cloudflare/playwright
vi.mock('@cloudflare/playwright', () => ({
  chromium: {
    launch: vi.fn(),
    sessions: vi.fn(),
    history: vi.fn(),
    limits: vi.fn(),
  }
}));

import worker from './index';

const env = {
  BROWSER: {},
  CATALOG_WORKER_TOKEN: 'test-token'
};

describe('Catalog Worker CORS', () => {
  it('should handle preflight OPTIONS request', async () => {
    const req = new Request('http://localhost/ingestion/shopee', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:8080',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Authorization, Content-Type'
      }
    });

    const resp = await worker.fetch(req, env as any);
    expect(resp.status).toBe(204);
    expect(resp.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:8080');
    expect(resp.headers.get('Access-Control-Allow-Methods')).toContain('POST');
  });

  it('should add CORS to unauthorized responses', async () => {
    const req = new Request('http://localhost/ingestion/shopee', {
      method: 'POST',
      headers: {
        'Origin': 'http://localhost:8080',
        'Authorization': 'Bearer wrong-token'
      }
    });

    const resp = await worker.fetch(req, env as any);
    expect(resp.status).toBe(401);
    expect(resp.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:8080');
  });

  it('should not allow unauthorized origins', async () => {
    const req = new Request('http://localhost/health', {
      method: 'GET',
      headers: {
        'Origin': 'https://malicious.com'
      }
    });

    const resp = await worker.fetch(req, env as any);
    expect(resp.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  it('should allow Lovable preview origins', async () => {
    const req = new Request('http://localhost/health', {
      method: 'GET',
      headers: {
        'Origin': 'https://id-preview--5a549c2b-43f8-4f2a-a8f0-ecc3df73320e.lovable.app'
      }
    });

    const resp = await worker.fetch(req, env as any);
    expect(resp.headers.get('Access-Control-Allow-Origin')).toBe('https://id-preview--5a549c2b-43f8-4f2a-a8f0-ecc3df73320e.lovable.app');
  });
});
