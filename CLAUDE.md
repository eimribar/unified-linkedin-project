# CLAUDE.md - AI Assistant Guidelines

## Project Overview
**LinkedIn Content Engine** - A premium content management portal for LinkedIn creators, built with React, TypeScript, and Tailwind CSS.

## Tech Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Deployment**: Vercel
- **Icons**: Lucide React

## Project Structure
```
src/
├── components/
│   ├── ui/              # Reusable UI components (shadcn)
│   ├── layout/          # Layout components (UserNav, etc.)
│   └── swipe/           # Approval swipe components
├── pages/               # Page components
├── contexts/            # React contexts (AuthContext)
├── data/               # Sample data and fixtures
├── layouts/            # Layout wrappers
├── lib/                # Utilities
└── hooks/              # Custom React hooks
```

## Key Features

### Authentication Flow
1. **SignUp** (`/signup`) - Clean minimal design with emerald theme
2. **SignIn** (`/signin`) - Clean minimal design with blue theme
3. **Welcome** (`/welcome`) - Post-signup welcome screen
4. **Onboarding** (`/onboarding`) - 10-question flow with vanishing input
5. **Welcome Complete** (`/welcome-complete`) - Celebration with confetti

### Main Portal Pages
- **Profile** (`/profile`) - User LinkedIn profile and story
- **Strategy** (`/strategy`) - Content strategy with brand gradient accents
- **Ideas** (`/ideas`) - Content idea collector with drag-drop support
- **Approvals** (`/approve`) - Tinder-style content approval
- **Analytics** (`/user-analytics`) - Performance dashboard

## Design System

### Brand Colors (Gradient)
- **Primary**: Blue (#3B82F6)
- **Secondary**: Amber (#F59E0B)  
- **Tertiary**: Green (#10B981)
- **Gradient**: `from-blue-500 via-amber-500 to-green-500`

### Design Principles
- **Clean & Minimal**: Generous white space, subtle borders
- **No Heavy Shadows**: Use `shadow-sm` or none, avoid `shadow-xl`
- **Gradient Accents**: Use as thin lines/borders, not backgrounds
- **Typography Hierarchy**: Size and weight for emphasis, not colors
- **Consistent Spacing**: Use Tailwind's spacing scale

### Component Guidelines
- **Buttons**: Black/white primary, outline secondary
- **Cards**: White/zinc-900 background with subtle borders
- **Inputs**: Rounded with gray borders, focus states
- **Animations**: Subtle, smooth transitions (Framer Motion)

## Important Context

### Authentication
- Uses `AuthContext` for session management
- Sample profile: Amnon Cohen (VP Product at Bounce AI)
- LinkedIn import uses mock data from `sampleProfile.ts`
- Session persists in localStorage

### Content Features
- **NO AI-GENERATED CONTENT MENTIONS** - Never reference AI generation
- Content is "created", "crafted", or "written" - not "generated"
- Focus on human creativity and strategy

### Routing
- Protected routes require authentication
- Root (`/`) redirects to `/signup`
- Unknown routes redirect to `/signup`
- Service provider routes are commented out (deployment is user portal only)

## Development Commands
```bash
npm run dev        # Start dev server (port 8080)
npm run build      # Build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## Deployment
- **Platform**: Vercel
- **URL**: https://unified-linkedin-project.vercel.app
- **Auto-deploy**: Pushes to `main` branch trigger deployment
- **Config**: `vercel.json` handles routing and build settings

## Common Tasks

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/layout/UserNav.tsx`
4. Follow existing page structure for consistency

### Updating Styles
- Use existing Tailwind classes
- Follow gradient accent pattern (thin lines, not fills)
- Maintain clean, minimal aesthetic
- Test dark mode compatibility

### Working with Forms
- Use controlled components with useState
- Add proper validation and error messages
- Include loading states
- Provide keyboard navigation (Enter to submit)

## Code Style Guidelines
- **TypeScript**: Use proper types, avoid `any`
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions
- **Imports**: Group by type (React, libraries, local)
- **Comments**: Minimal - code should be self-documenting

## Testing Checklist
- [ ] Build succeeds without errors
- [ ] No TypeScript errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark mode works correctly
- [ ] Forms have proper validation
- [ ] Navigation works as expected
- [ ] Protected routes redirect properly

## Known Issues & Solutions
- **Vercel not updating**: Add comment to force rebuild
- **Vanishing animation**: Needs 800ms delay for completion
- **Gradient backgrounds**: Only on auth pages (signup/signin)

## Contact & Resources
- **GitHub**: https://github.com/eimribar/unified-linkedin-project
- **Design Language**: Clean, minimal, professional
- **User**: eimribar
- **Primary Use Case**: LinkedIn content strategy and management

## Remember
- This is a premium, professional tool
- User experience is paramount
- Keep it clean, keep it simple
- No AI generation references
- Focus on human creativity and strategy