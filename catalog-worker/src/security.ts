/**
 * SSRF Protection and Target URL Validator for the Catalog Worker.
 * Mirrors src/lib/ingestion/security/urlValidator.ts from the main app.
 * Enforces strict protocol, domain allow-listing, and IP restriction
 * BEFORE the headless browser navigates anywhere.
 */

const ALLOWED_DOMAIN_PATTERNS = [
  /^([a-zA-Z0-9-]+\.)*shopee\.com\.br$/,
  /^([a-zA-Z0-9-]+\.)*shopee\.com$/,
  /^([a-zA-Z0-9-]+\.)*shopee\.com\.my$/,
  /^([a-zA-Z0-9-]+\.)*shopee\.co\.id$/,
  /^([a-zA-Z0-9-]+\.)*shopee\.sg$/,
  /^([a-zA-Z0-9-]+\.)*shopee\.co\.th$/,
  /^([a-zA-Z0-9-]+\.)*shopee\.ph$/,
  /^([a-zA-Z0-9-]+\.)*shopee\.vn$/,
  /^([a-zA-Z0-9-]+\.)*shopee\.tw$/,
];

const BLOCKED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '169.254.169.254', // Cloud instance metadata
  'metadata.google.internal',
  'instance-data',
]);

function isPrivateIp(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
    return false;
  }
  if (parts[0] === 127) return true; // Loopback
  if (parts[0] === 10) return true; // Private
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true; // Private
  if (parts[0] === 192 && parts[1] === 168) return true; // Private
  if (parts[0] === 169 && parts[1] === 254) return true; // Link-local / metadata
  if (parts[0] === 0) return true;
  return false;
}

export function isAllowedTargetUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;

  const trimmed = rawUrl.trim();
  if (!/^https?:\/\//i.test(trimmed)) return false;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return false;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;

  // Reject credentials in URL (e.g., http://user:pass@host)
  if (parsed.username || parsed.password) return false;

  const hostname = parsed.hostname.toLowerCase().trim();

  if (BLOCKED_HOSTS.has(hostname)) return false;
  if (isPrivateIp(hostname)) return false;

  // Reject IPv6 loopback / link-local / private
  if (hostname.includes(':') || hostname.startsWith('[') || hostname.endsWith(']')) return false;

  return ALLOWED_DOMAIN_PATTERNS.some(pattern => pattern.test(hostname));
}
