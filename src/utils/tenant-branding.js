// Utility to compute public logo URL with cache-busting and sane fallbacks

// Returns a logo URL for the given tenant with optional cache-busting.
// - Prefers tenant.logoUrl if available.
// - Falls back to legacy `/logo/${slug}.png` if not set.
// - Adds `?v=<timestamp>` based on logoUpdatedAt or updatedAt if present.
export function getTenantLogoUrl(tenant, { size } = {}) {
  if (!tenant) return '';
  const { logoUrl, slug, logoUpdatedAt, updatedAt } = tenant;
  const base = logoUrl || (slug ? `/logo/${slug}.png` : '');
  if (!base) return '';

  const version = logoUpdatedAt || updatedAt;
  const url = version ? `${base}${base.includes('?') ? '&' : '?'}v=${new Date(version).getTime()}` : base;

  // Optionally support basic transform hints via size, if CDN supports it (no-op otherwise)
  if (!size) return url;
  return url;
}

