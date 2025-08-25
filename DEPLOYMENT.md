# 🚀 Deploying LinkedIn User Portal to Vercel

## Quick Deploy (Recommended)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Visit Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in with your GitHub account

2. **Import Project:**
   - Click "Add New Project"
   - Import your GitHub repository: `unified-linkedin-project`
   - Vercel will auto-detect the Vite configuration

3. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete (usually 1-2 minutes)
   - Your app will be live at: `https://your-project.vercel.app`

### Option 2: Deploy via CLI

1. **Login to Vercel:**
   ```bash
   npx vercel login
   ```

2. **Run the deployment script:**
   ```bash
   ./deploy.sh
   ```

   Or manually:
   ```bash
   npm run build
   npx vercel --prod
   ```

3. **Answer the prompts:**
   - Set up and deploy? **Y**
   - Which scope? **Select your account**
   - Link to existing project? **N** (first time) or **Y** (updates)
   - Project name? **unified-linkedin-portal** (or your choice)
   - Directory? **./dist**
   - Override settings? **N**

## What's Deployed

The user portal includes:
- ✅ Sign-up page with LinkedIn import
- ✅ 10-question onboarding flow
- ✅ User Profile page
- ✅ Content Strategy page
- ✅ Approvals (Tinder-style)
- ✅ Analytics Dashboard

## Environment Variables (Optional)

If you need to add environment variables later:

1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add any needed variables
4. Redeploy for changes to take effect

## Testing Your Deployment

1. **Sign Up Flow:**
   - Visit your deployment URL
   - Try both LinkedIn import and email sign-up
   - Complete onboarding questions

2. **Portal Features:**
   - Check Profile page displays correctly
   - Verify Strategy page personalization
   - Test Approvals swipe interface
   - Review Analytics dashboard

## Updating Your Deployment

After making changes:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically redeploy when you push to GitHub.

Or manually redeploy:
```bash
npm run build
npx vercel --prod
```

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

- **Build errors:** Check `npm run build` locally first
- **404 errors:** Ensure `vercel.json` has the rewrite rules
- **Auth issues:** Clear localStorage in browser DevTools
- **Deployment fails:** Check Node version compatibility (use Node 18+)

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)Mon Aug 25 07:17:44 IDT 2025
Force deployment at Mon Aug 25 07:17:44 IDT 2025
