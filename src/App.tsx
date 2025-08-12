import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PortalSwitcher from "./components/PortalSwitcher";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Approvals from "./pages/Approvals";
import UserAnalytics from "./pages/UserAnalytics";
import Onboarding from "./pages/Onboarding";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Welcome from "./pages/Welcome";
import WelcomeComplete from "./pages/WelcomeComplete";
import ContentIdeas from "./pages/ContentIdeas";
import ContentLake from "./pages/ContentLake";
import ContentGeneration from "./pages/ContentGeneration";
import OnboardingLayout from "./layouts/OnboardingLayout";
import Strategy from "./pages/Strategy";
import UserLayout from "./layouts/UserLayout";
import Profile from "./pages/Profile";
import Test from "./pages/Test";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes - Sign up/in flow */}
              <Route path="/test" element={<Test />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              {/* Force rebuild: Sign-in component added 2024 */}
              
              {/* Onboarding flow - requires auth but not completed onboarding */}
              <Route path="/welcome" element={
                <ProtectedRoute requireOnboarding={false}>
                  <OnboardingLayout><Welcome /></OnboardingLayout>
                </ProtectedRoute>
              } />
              <Route path="/onboarding" element={
                <ProtectedRoute requireOnboarding={false}>
                  <OnboardingLayout><Onboarding /></OnboardingLayout>
                </ProtectedRoute>
              } />
              <Route path="/welcome-complete" element={
                <ProtectedRoute requireOnboarding={false}>
                  <OnboardingLayout><WelcomeComplete /></OnboardingLayout>
                </ProtectedRoute>
              } />
              
              {/* User Portal Routes - require auth and completed onboarding */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserLayout><Profile /></UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/strategy" element={
                <ProtectedRoute>
                  <UserLayout><Strategy /></UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/approve" element={
                <ProtectedRoute>
                  <UserLayout><Approvals /></UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/user-analytics" element={
                <ProtectedRoute>
                  <UserLayout><UserAnalytics /></UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/ideas" element={
                <ProtectedRoute>
                  <UserLayout><ContentIdeas /></UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/content-lake" element={
                <ProtectedRoute>
                  <UserLayout><ContentLake /></UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/generate" element={
                <ProtectedRoute>
                  <UserLayout><ContentGeneration /></UserLayout>
                </ProtectedRoute>
              } />
              {/* Redirects */}
              <Route path="/approvals" element={<Navigate to="/approve" replace />} />
              <Route path="/" element={<Navigate to="/signup" replace />} />
              
              {/* Fallback for unknown routes */}
              <Route path="*" element={<Navigate to="/signup" replace />} />
            </Routes>
          </BrowserRouter>
          <PortalSwitcher />
        </>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
