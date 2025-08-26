# Changelog - User Portal

All notable changes to the User Portal (unified-linkedin-project) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.0] - 2025-08-26 - MOBILE PWA RELEASE 📱

### 🚀 Major Features Added
- **Complete Mobile PWA Implementation**: Tinder-like swipe interface for content review
- **Critical OAuth URL Fixes**: Resolved all domain redirect issues and authentication errors
- **Cross-Portal URL Updates**: Fixed broken portal switching between admin and client portals

### 📱 Mobile PWA Features
- **Swipe Gestures**: Right=Approve, Left=Decline, Up=Edit with smooth animations
- **Service Worker**: Offline functionality and background sync capabilities
- **PWA Installation**: Custom install prompts for iOS and Android devices
- **Mobile-Specific Routing**: Smart device detection and appropriate redirects
- **Touch-Optimized UI**: Large buttons, haptic feedback simulation, safe area support

### 🔧 Critical Fixes
- **OAuth URL Spaces**: Fixed Supabase OAuth error with aggressive space removal
- **Portal Switching**: Updated all hardcoded URLs from broken vercel.app domains to production domains
- **Mobile Authentication**: Resolved mobile-specific redirect issues

### 📁 New Files Added
- `src/hooks/useSwipeGestures.ts` - Touch gesture handling
- `src/components/mobile/SwipeCard.tsx` - Swipeable content cards
- `src/components/mobile/ActionBar.tsx` - Touch-friendly action buttons  
- `src/components/mobile/ReviewStack.tsx` - Card stack management
- `src/pages/MobileReview.tsx` - Main mobile interface
- `src/styles/mobile.css` - Mobile-specific styling
- `public/sw.js` - Service worker for PWA functionality
- `public/pwa-install-prompt.js` - Custom PWA install prompts

### 🌐 URL & Domain Updates
- **Production URLs**: All references updated to use `www.agentss.app`
- **Portal URLs**: Ghostwriter portal updated to use `admin.agentss.app`
- **OAuth Redirects**: Fixed all authentication redirect URLs
- **Email Invitations**: Updated invitation URLs to use correct domains

## [2.0.0] - 2025-08-25 - MAJOR RELEASE 🎉

### 🚀 Major Features
- **Complete Design System Overhaul**: Professional, sophisticated UI replacing childish animations
- **Custom Domain Implementation**: Branded domains (www.agentss.app) for production
- **OAuth Authentication Fix**: Resolved critical 500 error during Google sign-in
- **Performance Optimization**: 98% bundle size reduction (861KB → 15.79KB)

### ✨ New Components
- **CleanStats**: Professional statistics display with subtle color accents
- **CleanContentCard**: Minimal, sophisticated content review cards
- **CleanClientPortal**: Complete portal redesign with modern aesthetics
- **DotMatrixBackground**: Three.js animation component (lazy-loaded)

### 🎨 Design Improvements
- **Color Palette**: Sophisticated slate-based system with strategic accent colors
- **Typography**: Professional hierarchy (4xl → base → sm) with proper tracking
- **Interactions**: Removed excessive animations, added subtle hover states
- **Layout**: Improved spacing, alignment, and responsive behavior

### 🔧 Technical Improvements
- **Code Splitting**: Three.js components lazy-loaded for performance
- **URL Management**: Centralized URL helpers for consistent domain handling
- **Build Optimization**: Manual chunking configuration for optimal loading
- **Error Handling**: Enhanced OAuth callback processing with retry logic

### 🔒 Authentication Enhancements
- **OAuth Flow**: Fixed 500 errors and improved callback handling
- **Session Management**: Better error recovery and debugging
- **Admin Routing**: Automatic redirection to admin portal for admin users
- **Security**: Improved token validation and session refresh

### 🌐 Domain & Infrastructure
- **Custom Domains**: 
  - Client Portal: `www.agentss.app`
  - Admin Portal: `admin.agentss.app`
- **Professional URLs**: All hardcoded references updated
- **Cross-Portal Navigation**: Seamless switching between client and admin interfaces

### 🗑️ Removed Features
- Irrelevant navigation tabs (About, Features, Contact)
- Terms of Service text from sign-in flow
- Excessive gradient effects and animations
- Redundant StatCard components

### ⚠️ Breaking Changes
- Complete design system overhaul
- Domain changes require Supabase configuration updates
- Several components renamed/replaced
- OAuth settings require manual updates

## [1.5.1] - 2025-08-25

### 🐛 Critical Bug Fixes
- **OAuth Bundle Size**: Fixed 500 error caused by 861KB bundle size
- **URL Parsing**: Resolved spaces in OAuth redirect URLs
- **Session Handling**: Improved callback processing and error recovery

### 🔧 Performance Improvements
- Lazy loading implementation for Three.js components
- Bundle size optimization through code splitting
- Manual chunking configuration for optimal loading

## [2024.12.13.2] - 2024-12-13

### Added
- Import page (`/import`) for content upload functionality (CSV, XLSX, JSON)
- Admin bypass for onboarding via URL param `?admin=true` or keyboard shortcut `Ctrl+Shift+A`
- Combined Sign Up and Sign In functionality in single page with tab switcher
- Comprehensive CLAUDE.md documentation file with full technical specifications
- CHANGELOG.md for tracking all major changes going forward

### Changed
- Navigation simplified to 5 essential items: Import, Profile, Ideas, Approvals, Analytics
- SignUp page now handles both sign up and sign in with toggle UI
- Updated routing to redirect `/signin` to `/signup`
- CLAUDE.md updated with recent changes and two-step approval flow documentation
- Content approval flow clarified: draft → admin_approved → client_approved → published

### Removed
- Separate SignIn.tsx component (functionality merged into SignUp.tsx)
- Strategy page from main navigation

### Fixed
- Authentication flow properly handles onboarding requirements
- Content generation now requires client selection
- Database tables properly created for content management

## [2024.12.13] - 2024-12-13

### Changed
- User portal remains stable while database fixes applied to ghostwriter portal
- No code changes required as database schema fixes were backend-only

## [2024.12.12] - 2024-12-12

### Added
- Portal Switcher component for navigation to Ghostwriter Portal
- Client-filtered database services for content isolation
- Environment variable configuration for Vercel deployment

### Changed
- Simplified SignUp and SignIn components to fix blank page issue
- Updated all UI components to use zinc color palette
- Replaced gradient text classes with solid colors for visibility
- Modified button variants (premium, hero) to use zinc colors

### Fixed
- Blank white page on localhost:8080
- Invisible text on onboarding questions
- Invisible numbers and button on WelcomeComplete page
- Stats not displaying on welcome completion
- Continue button missing on welcome completion page

### Security
- Removed all hardcoded Supabase credentials
- Implemented environment-only credential management
- Updated to use shared Supabase instance with Ghostwriter Portal

## [2024.12.11] - 2024-12-11

### Added
- Initial portal setup with React 18 and TypeScript
- Vite 5.4.19 build configuration
- Shadcn/ui component library integration
- Framer Motion for animations
- Supabase authentication context

### Features
- User registration and sign-in pages
- Welcome flow with onboarding questionnaire
- 10-question story capture system
- Profile management page
- Content strategy overview
- Ideas collection with drag-and-drop
- Tinder-style content approval interface
- Analytics dashboard for performance metrics

### UI Components
- Custom button component with multiple variants
- Badge component with gradient support
- Navigation bar with logo
- Sidebar navigation
- Card components for content display
- Swipe interface for approvals

## [2024.12.10] - 2024-12-10

### Initial Setup
- Project initialization with React + Vite
- Tailwind CSS configuration with custom zinc palette
- React Router v6 setup
- Basic authentication flow
- Sample data structures for LinkedIn profiles

### Design System
- Zinc/black/white color palette implementation
- Typography scale configuration
- Spacing and layout utilities
- Shadow utilities (minimal approach)
- Component styling foundations

---

## Version History

- **Current**: Development version (unreleased)
- **2024.12.12**: UI fixes and portal integration
- **2024.12.11**: Core features implementation
- **2024.12.10**: Initial project setup

## Links

- [GitHub Repository](https://github.com/eimribar/unified-linkedin-project)
- [Production URL](https://unified-linkedin-project.vercel.app)
- [Ghostwriter Portal](https://ghostwriter-portal.vercel.app)
- [Documentation](./CLAUDE.md)