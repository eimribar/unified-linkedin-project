# Production OAuth Deployment Guide

## 🔐 Security-First OAuth Implementation

This guide documents the production-ready OAuth signup flow with invitation system. All components are designed with security, scalability, and monitoring in mind.

## Prerequisites

- [ ] Supabase project with proper RLS policies
- [ ] Google Cloud Console OAuth credentials configured
- [ ] GitHub OAuth App created (optional)
- [ ] Vercel deployment pipeline set up
- [ ] Error tracking service (Sentry/LogRocket) configured

## 🚀 Deployment Steps

### Step 1: Deploy Database Function

1. **Access Supabase SQL Editor**
   ```
   https://supabase.com/dashboard/project/ifwscuvbtdokljwwbvex/sql
   ```

2. **Run the OAuth Signup Function**
   - Copy the entire contents of `/database/complete_oauth_signup.sql`
   - Execute in SQL editor
   - Verify successful creation:
   ```sql
   SELECT proname, pronargs 
   FROM pg_proc 
   WHERE proname = 'complete_oauth_signup';
   ```

3. **Verify Permissions**
   ```sql
   SELECT 
     grantee, 
     privilege_type 
   FROM information_schema.routine_privileges 
   WHERE routine_name = 'complete_oauth_signup';
   ```

### Step 2: Configure OAuth Providers

#### Google OAuth Setup

1. **Google Cloud Console**
   - Go to: https://console.cloud.google.com
   - Select your project
   - Navigate to: APIs & Services → Credentials
   
2. **OAuth 2.0 Client Configuration**
   - Authorized JavaScript origins:
     ```
     https://unified-linkedin-project.vercel.app
     https://ifwscuvbtdokljwwbvex.supabase.co
     ```
   - Authorized redirect URIs:
     ```
     https://ifwscuvbtdokljwwbvex.supabase.co/auth/v1/callback
     ```

3. **Supabase Configuration**
   - Go to: Authentication → Providers → Google
   - Enable Google provider
   - Add Client ID and Client Secret
   - Save configuration

#### GitHub OAuth Setup (Optional)

1. **GitHub OAuth App**
   - Go to: Settings → Developer settings → OAuth Apps
   - Create new OAuth App
   - Authorization callback URL:
     ```
     https://ifwscuvbtdokljwwbvex.supabase.co/auth/v1/callback
     ```

2. **Configure in Supabase**
   - Enable GitHub provider
   - Add Client ID and Client Secret

### Step 3: Environment Variables

**Vercel Production Environment:**
```bash
# Already configured (verify these exist)
VITE_SUPABASE_URL=https://ifwscuvbtdokljwwbvex.supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]

# Optional: Error tracking
VITE_SENTRY_DSN=[your-sentry-dsn]
VITE_ENVIRONMENT=production
```

### Step 4: Deploy Frontend Changes

1. **Commit Changes**
   ```bash
   git add -A
   git commit -m "feat: Production-ready OAuth with secure database function"
   git push origin main
   ```

2. **Vercel Auto-Deploy**
   - Changes will automatically deploy via Vercel
   - Monitor deployment: https://vercel.com/dashboard

3. **Verify Deployment**
   - Check build logs for errors
   - Ensure all environment variables are set
   - Test OAuth flow in production

## 🧪 Testing Checklist

### Pre-Production Testing

- [ ] Test with valid invitation token
- [ ] Test with expired invitation token
- [ ] Test with mismatched email
- [ ] Test with already linked account
- [ ] Test OAuth timeout scenarios
- [ ] Test network failure scenarios

### Production Testing

1. **Create Test Invitation**
   - Use Ghostwriter Portal to create client
   - Send invitation to test email
   
2. **Test OAuth Flow**
   - Click invitation link
   - Sign up with Google
   - Verify account linking
   - Confirm access to portal

3. **Monitor Logs**
   - Check Supabase logs for function execution
   - Review Vercel function logs
   - Monitor error tracking dashboard

## 📊 Monitoring & Alerts

### Key Metrics to Track

1. **OAuth Completion Rate**
   - Invitations sent vs. accounts created
   - Time to complete signup
   - Provider preference (Google vs. GitHub)

2. **Error Rates**
   - Database function failures
   - OAuth provider errors
   - Client linking failures

3. **Performance Metrics**
   - Function execution time
   - OAuth callback latency
   - Page load times

### Alert Conditions

Set up alerts for:
- OAuth completion rate < 80%
- Database function errors > 5 per hour
- OAuth callback failures > 2 per hour
- Any security-related errors

## 🔒 Security Considerations

### Data Protection

1. **Invitation Tokens**
   - Cryptographically secure random generation
   - 24-hour expiration
   - Single-use enforcement
   - Stored hashed in database

2. **OAuth State**
   - Minimal data in localStorage
   - Cleared immediately after use
   - No sensitive information exposed

3. **Database Function**
   - SECURITY DEFINER for controlled access
   - Input validation at every step
   - SQL injection prevention
   - Comprehensive error handling

### Audit Trail

All OAuth signups are logged with:
- Timestamp
- User ID
- Client ID
- OAuth provider
- IP address (when available)
- User agent

## 🚨 Rollback Plan

If issues arise:

1. **Immediate Mitigation**
   ```sql
   -- Disable the function temporarily
   REVOKE EXECUTE ON FUNCTION complete_oauth_signup FROM authenticated;
   ```

2. **Revert Frontend**
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Re-enable Previous Flow**
   - Users can still use email/password signup
   - Manual account linking by admin if needed

## 📝 Troubleshooting

### Common Issues

1. **"Invalid or expired invitation"**
   - Check invitation expiration time
   - Verify token hasn't been used
   - Confirm email matches

2. **"Failed to link account"**
   - Check RLS policies
   - Verify database function exists
   - Review Supabase logs

3. **OAuth redirect loop**
   - Clear browser cookies
   - Check redirect URL configuration
   - Verify OAuth provider settings

### Debug Commands

```sql
-- Check recent function calls
SELECT * FROM auth_audit_log 
WHERE event_type = 'oauth_signup_completed' 
ORDER BY created_at DESC 
LIMIT 10;

-- Check invitation status
SELECT * FROM client_invitations 
WHERE client_id IN (
  SELECT id FROM clients WHERE email = '[user-email]'
);

-- Verify client linking
SELECT id, email, auth_user_id, auth_status, invitation_status 
FROM clients 
WHERE email = '[user-email]';
```

## 📞 Support Escalation

1. **Level 1**: Check this documentation
2. **Level 2**: Review Supabase and Vercel logs
3. **Level 3**: Database team for function issues
4. **Level 4**: Security team for auth concerns

## ✅ Post-Deployment Verification

- [ ] OAuth signup works for new users
- [ ] Existing users can still sign in
- [ ] Error tracking is capturing events
- [ ] Performance metrics are acceptable
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Team notified of changes

---

**Last Updated**: December 24, 2024
**Version**: 1.0.0
**Status**: Production-Ready