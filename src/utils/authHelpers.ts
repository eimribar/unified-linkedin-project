// =====================================================
// AUTH HELPERS
// Security utilities for access control
// =====================================================

// Admin email - only this user has admin access
const ADMIN_EMAIL = 'eimri@webloom.ai';

/**
 * Check if user is the admin
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

/**
 * Get the appropriate redirect URL based on user type
 */
export function getAuthRedirect(email: string | null | undefined, isRegisteredClient: boolean): string {
  // Admin always goes to ghostwriter portal
  if (isAdmin(email)) {
    return 'https://ghostwriter-portal.vercel.app';
  }
  
  // Registered clients go to client portal
  if (isRegisteredClient) {
    return '/client-approve';
  }
  
  // Unauthorized users go back to auth
  return '/auth?error=unauthorized';
}

/**
 * Check if user is authorized to access the platform
 */
export function isAuthorizedUser(email: string | null | undefined, isRegisteredClient: boolean): boolean {
  return isAdmin(email) || isRegisteredClient;
}