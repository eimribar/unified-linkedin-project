// =====================================================
// URL HELPERS
// Ensures production URLs are always used for OAuth
// =====================================================

/**
 * Get the proper base URL for OAuth redirects
 * NEVER returns localhost - always uses production URL
 */
export function getProductionUrl(): string {
  // ALWAYS use production URL for OAuth redirects
  // This prevents localhost issues and ensures OAuth always works
  // Trim to prevent any accidental spaces
  return 'https://www.agentss.app'.trim();
}

/**
 * Get the base URL for the application
 * Returns production URL in production, allows localhost in dev
 */
export function getBaseUrl(): string {
  if (import.meta.env.PROD) {
    return 'https://www.agentss.app'.trim();
  }
  
  // In development, still use production for OAuth-related stuff
  // but allow localhost for other purposes
  return window.location.origin.trim();
}

/**
 * Build an OAuth redirect URL with optional parameters
 */
export function buildOAuthRedirectUrl(
  path: string = '/auth/callback',
  params?: Record<string, string>
): string {
  const baseUrl = getProductionUrl(); // ALWAYS use production for OAuth
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  let url = (baseUrl + cleanPath).trim();
  
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);
    url += '?' + searchParams.toString();
  }
  
  // Final trim to ensure no spaces
  return url.trim();
}