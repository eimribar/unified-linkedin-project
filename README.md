# AgentSS Client Portal

LinkedIn Content Management Client Portal - where clients review and approve their AI-generated LinkedIn content.

## 🚀 Production URLs
- **Client Portal**: https://www.agentss.app
- **Admin Portal**: https://admin.agentss.app

## 📋 Project Overview

This is the client-facing portal of the AgentSS LinkedIn content management system. Clients log in here to:
- Review AI-generated LinkedIn content
- Approve/reject/edit content before publication  
- View content analytics and performance
- Manage their content preferences

## 🏗️ Architecture

### Two-Portal System:
1. **This Repository (Client Portal)**: Where clients review content
2. **Admin Portal**: Where admins/ghostwriters create and manage content

### Content Flow:
```
Admin creates content → Admin approves → Client reviews → Client approves → Auto-published
```

## 🔧 Technologies

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel
- **Animations**: Framer Motion

## 🎯 Key Features

### ✅ Recently Implemented
- **Admin Impersonation**: Admins can view any client's portal for testing/support
- **Manual Content Creation**: Admins can create custom content alongside AI generation
- **Unified UI/UX**: Consistent design language across both portals
- **Mobile Responsive**: Optimized for all device sizes
- **Real-time Updates**: Live content status updates

### 🔑 Core Features
- **Content Approval Workflow**: Review, approve, reject, or request edits
- **Authentication**: Simple email/password + Google OAuth
- **Content Analytics**: Track performance metrics
- **Profile Management**: Client onboarding and preferences
- **Content Ideas**: Clients can submit ideas for content

## 🔐 Admin Impersonation System

Admins can securely view any client's portal:

1. **From Admin Portal**: Click "View Portal" on any client
2. **Secure Tokens**: Time-limited impersonation sessions (4-hour expiry)
3. **Visual Indicators**: Purple banner shows "Admin Mode" when impersonating
4. **Easy Exit**: One-click return to admin portal

### Database Tables:
- `admin_impersonation_sessions` - Tracks active admin sessions
- RPC Functions: `create_impersonation_token`, `validate_impersonation_token`

## 🚀 Development Setup

```bash
# Clone repository
git clone https://github.com/eimribar/unified-linkedin-project.git
cd unified-linkedin-project

# Install dependencies  
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components
│   └── auth/            # Authentication components
├── pages/               # Route components
│   ├── ClientApproval.tsx   # Main content approval page
│   ├── UserAnalytics.tsx    # Analytics dashboard
│   └── AuthSimple.tsx       # Authentication page
├── contexts/            # React contexts
│   └── SimpleAuthContext.tsx # Authentication state
├── services/            # API and business logic
└── lib/                 # Utilities and configuration
```

## 🔄 Recent Major Updates

### August 2025 - Impersonation Feature
- Implemented secure admin impersonation system
- Added visual indicators for admin mode
- Consolidated client auth management
- Fixed mobile responsiveness issues

### Key Commits:
- `dc39b9b7`: Fixed impersonation to bypass auth page
- `b07a7847`: Added impersonation detection and banner
- `561e81e9`: Restored manual content creation (reverted to stable state)

## 🐛 Troubleshooting

### Common Issues:
1. **Auth Issues**: Check Supabase connection and RLS policies
2. **Impersonation Failures**: Ensure RPC functions exist in database
3. **Build Failures**: Check TypeScript errors and dependencies

### Environment Variables:
Required in production:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` 
- OAuth provider keys for Google authentication

## 📞 Support

For development questions or admin access issues, check the admin portal or contact the development team.
<!-- Trigger Vercel deployment -->
