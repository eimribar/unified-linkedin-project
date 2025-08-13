# Changelog - User Portal

All notable changes to the User Portal (unified-linkedin-project) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive CLAUDE.md documentation file with full technical specifications
- CHANGELOG.md for tracking all major changes going forward

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