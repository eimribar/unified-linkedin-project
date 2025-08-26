// =====================================================
// URL HELPERS
// Ensures production URLs are always used for OAuth
// =====================================================

/**
 * Get the proper base URL for OAuth redirects
 * Uses current origin in development for mobile testing
 */
export function getProductionUrl(): string {
  if (import.meta.env.PROD) {
    // Remove ALL spaces and trim thoroughly
    return 'https://www.agentss.app'.replace(/\s+/g, '').trim();
  }
  
  // In development, use current origin to support mobile testing
  // This allows OAuth to work with IP addresses like 192.168.1.245:8080
  return window.location.origin.replace(/\s+/g, '').trim();
}

/**
 * Get the base URL for the application
 * Returns production URL in production, current origin in dev
 */
export function getBaseUrl(): string {
  if (import.meta.env.PROD) {
    // Remove ALL spaces and trim thoroughly
    return 'https://www.agentss.app'.replace(/\s+/g, '').trim();
  }
  
  // In development, use current origin
  return window.location.origin.replace(/\s+/g, '').trim();
}

/**
 * Build an OAuth redirect URL with optional parameters
 */
export function buildOAuthRedirectUrl(
  path: string = '/auth/callback',
  params?: Record<string, string>
): string {
  const baseUrl = getProductionUrl(); // ALWAYS use production for OAuth
  // Ensure path starts with / and remove any spaces
  const cleanPath = path.replace(/\s+/g, '').startsWith('/') ? path.replace(/\s+/g, '') : `/${path.replace(/\s+/g, '')}`;
  let url = (baseUrl + cleanPath).replace(/\s+/g, '').trim();
  
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);
    url += '?' + searchParams.toString();
  }
  
  // Final aggressive space removal and trim
  return url.replace(/\s+/g, '').trim();
}