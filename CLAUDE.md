# CLAUDE.md - User Portal Documentation

## Project Overview
**User Portal** (unified-linkedin-project) - Client-facing LinkedIn content management portal. Part of a dual-portal system with the Ghostwriter Portal for admin/content creation.

## Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 5.4.19
- **Styling**: Tailwind CSS with zinc/black/white design system
- **UI Components**: shadcn/ui components
- **Database**: Supabase (shared with Ghostwriter Portal)
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Deployment**: Vercel

## Project Structure
```
unified-linkedin-project/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components
│   │   ├── swipe/           # Approval swipe components
│   │   └── PortalSwitcher.tsx # Navigate to Ghostwriter
│   ├── contexts/
│   │   ├── AuthContext.tsx  # Local auth state
│   │   └── SupabaseAuthContext.tsx # Supabase auth
│   ├── data/
│   │   ├── sampleProfile.ts # Sample LinkedIn data
│   │   └── sampleOnboarding.ts # Onboarding questions
│   ├── lib/
│   │   ├── supabase.ts     # Supabase client
│   │   └── utils.ts         # Utility functions
│   ├── pages/
│   │   ├── SignUp.tsx       # Combined Sign Up/Sign In with tab switcher
│   │   ├── Import.tsx       # Content import functionality
│   │   ├── Welcome.tsx      # Post-signup welcome
│   │   ├── Onboarding.tsx   # 10-question flow
│   │   ├── WelcomeComplete.tsx # Onboarding complete
│   │   ├── Profile.tsx      # LinkedIn profile view
│   │   ├── Strategy.tsx     # Content strategy
│   │   ├── ContentIdeas.tsx # Idea collection
│   │   ├── Approve.tsx      # Content approval (Tinder-style swipe)
│   │   └── UserAnalytics.tsx # Performance metrics
│   ├── services/
│   │   └── database.service.ts # Client-filtered queries
│   └── App.tsx              # Main app with routing
├── .env.local              # Local environment variables
└── vercel.json            # Vercel configuration
```

## Environment Variables

### Required for Production (Set in Vercel Dashboard)
```bash
# Supabase Configuration (shared with Ghostwriter Portal)
VITE_SUPABASE_URL=https://ifwscuvbtdokljwwbvex.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Key Features

### 1. Authentication Flow
- **SignUp** (`/signup`) - Combined Sign Up/Sign In page with tab switcher
  - Toggle between Sign Up and Sign In modes
  - Sign Up flow: Registration → Welcome → Onboarding
  - Sign In flow: Login → Profile
  - Admin bypass: URL param `?admin=true` or keyboard shortcut `Ctrl+Shift+A`
- **Welcome** (`/welcome`) - Post-signup greeting
- **Onboarding** (`/onboarding`) - 10-question story capture
- **WelcomeComplete** (`/welcome-complete`) - Success celebration

### 2. Main Portal Pages
- **Import** (`/import`) - Upload existing content (CSV, XLSX, JSON)
- **Profile** (`/profile`) - LinkedIn profile management
- **Ideas** (`/ideas`) - Content idea collection with drag-drop
- **Approvals** (`/approve`) - Tinder-style content approval for admin-approved content
- **Analytics** (`/user-analytics`) - Performance dashboard

Note: Navigation shows only these 5 essential pages

### 3. Design System

#### Color Palette (Zinc-based)
```css
--white: 0 0% 100%;
--zinc-50: 250 10% 98%;
--zinc-100: 240 5% 96%;
--zinc-200: 240 6% 90%;
--zinc-300: 240 5% 84%;
--zinc-400: 240 5% 65%;
--zinc-500: 240 4% 46%;
--zinc-600: 240 5% 34%;
--zinc-700: 240 5% 26%;
--zinc-800: 240 4% 16%;
--zinc-900: 240 6% 10%;
--black: 0 0% 0%;
```

#### Design Principles
- Clean & minimal with generous white space
- No heavy shadows (use shadow-sm or none)
- No gradient backgrounds (removed in latest update)
- Typography hierarchy through size/weight
- Consistent zinc color system throughout

### 4. Portal Integration
- **Portal Switcher**: Bottom-right button to Ghostwriter Portal
- **Shared Database**: Same Supabase instance
- **Client Filtering**: Content filtered by client_id
- **URLs**:
  - Dev: http://localhost:8080
  - Prod: https://unified-linkedin-project.vercel.app

## Database Integration

### Client-Filtered Services
```typescript
// Get approved content for specific client
clientContentService.getApprovedContent(clientId)

// Get scheduled posts for client
clientContentService.getScheduledPosts(clientId)

// Get content ideas for client
clientContentService.getContentIdeas(clientId)

// Get analytics for client
clientContentService.getContentAnalytics(clientId)
```

## Onboarding Questions

The portal captures 10 strategic questions across 4 categories:

1. **Your Experiences** (Questions 1-3)
   - Big wins and achievements
   - Failures and lessons learned
   - Hardest problems solved

2. **Your Beliefs** (Questions 4-6)
   - Contrarian takes
   - Core principles
   - Terrible common advice

3. **Your Company Story** (Questions 7-9)
   - Surprising discoveries
   - Unique approaches
   - Recent aha moments

4. **Your Vision** (Question 10)
   - Industry predictions

## Development Commands
```bash
# Install dependencies
npm install

# Start development server (port 8080)
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## Deployment Process

### Vercel Deployment
1. Push to GitHub main branch
2. Auto-deploys via Vercel integration
3. Environment variables required in Vercel Dashboard
4. Redeploy after environment variable changes

### Local Development
1. Create `.env.local` with Supabase credentials
2. Run `npm run dev`
3. Access at http://localhost:8080

## Recent UI Fixes (December 2024)

### Visibility Issues Resolved
- Fixed invisible gradient text components
- Replaced all `text-gradient-brand` with `text-zinc-900`
- Replaced all `bg-gradient-brand` with solid zinc colors
- Updated button variants to use zinc colors
- Fixed WelcomeComplete page stats and button visibility

### Components Updated
- Onboarding.tsx - Question text now visible
- WelcomeComplete.tsx - Stats and button fixed
- Button.tsx - Premium/hero variants updated
- Badge.tsx - Gradient variant fixed
- NavBar.tsx - Logo background updated

## Security Updates

### API Key Management
- Removed all hardcoded Supabase credentials
- Credentials now only from environment variables
- `.env.local` for local development (gitignored)
- Production credentials in Vercel Dashboard

## Common Issues & Solutions

### Issue: Blank white page on production
**Solution**: Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel

### Issue: Invisible text on onboarding
**Solution**: Already fixed - gradient text replaced with zinc colors

### Issue: Can't navigate between portals
**Solution**: Check PortalSwitcher component and URLs

## Testing Checklist
- [ ] Sign up flow completes successfully
- [ ] Onboarding questions are visible
- [ ] Profile data saves correctly
- [ ] Portal switcher navigates to Ghostwriter
- [ ] Client can view their approved content
- [ ] Analytics dashboard loads
- [ ] No console errors
- [ ] Responsive on mobile/tablet

## Integration with Ghostwriter Portal

### Shared Components
- Same Supabase database
- Same authentication system
- Compatible data structures
- Synchronized content flow

### Two-Step Approval Flow
1. Ghostwriter creates content → Status: 'draft'
2. Admin reviews in Ghostwriter Portal
3. Admin approves → Status: 'admin_approved'
4. Content appears in client's Approval queue
5. Client approves → Status: 'client_approved'
6. Auto-scheduled for publication
7. Published → Status: 'published'

## Recent Updates (December 2024)

### Authentication Improvements
- Combined Sign Up and Sign In into single page with tab switcher
- Added admin bypass for onboarding (URL param or Ctrl+Shift+A)
- Improved authentication flow with proper routing

### Navigation Updates
- Simplified navigation to 5 essential items
- Removed Strategy page from main navigation
- Added Import page for content upload
- Mobile navigation pending implementation

### Database & Content Flow
- Fixed generated_content table creation
- Implemented two-step approval flow (admin → client)
- Added client selection requirement in Ghostwriter Portal
- Status progression: draft → admin_approved → client_approved → published

### Code Cleanup
- Removed duplicate SignIn component
- Cleaned up unused page components
- Updated routing with proper redirects
- Improved TypeScript typing throughout

## Next Steps & Roadmap
- [ ] Implement real-time updates with Supabase subscriptions
- [ ] Add client-specific branding options
- [ ] Create mobile app version
- [ ] Add export functionality for content
- [ ] Implement commenting system
- [ ] Add notification system for approvals

## Contact & Support
- **GitHub**: https://github.com/eimribar/unified-linkedin-project
- **Ghostwriter Portal**: https://github.com/eimribar/ghostwriter-portal
- **Primary Use Case**: Client portal for LinkedIn content management