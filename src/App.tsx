import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Lake from "./pages/Lake";
import Ideas from "./pages/Ideas";
import Generate from "./pages/Generate";
import Approvals from "./pages/Approvals";
import Schedule from "./pages/Schedule";
import Analytics from "./pages/Analytics";
import UserAnalytics from "./pages/UserAnalytics";
import Onboarding from "./pages/Onboarding";
import SignUp from "./pages/SignUp";
import Welcome from "./pages/Welcome";
import WelcomeComplete from "./pages/WelcomeComplete";
import ContentIdeas from "./pages/ContentIdeas";
import MainLayout from "./layouts/MainLayout";
import OnboardingLayout from "./layouts/OnboardingLayout";
import ImportPage from "./pages/Import";
import Strategy from "./pages/Strategy";
import UserLayout from "./layouts/UserLayout";
import Profile from "./pages/Profile";

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
              {/* Public routes - Sign up flow */}
              <Route path="/signup" element={<SignUp />} />
              
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
              
              {/* Service Provider Routes - Commented out for user portal deployment */}
              {/* <Route path="/lake" element={<MainLayout><Lake /></MainLayout>} />
              <Route path="/ideas" element={<MainLayout><Ideas /></MainLayout>} />
              <Route path="/generate" element={<MainLayout><Generate /></MainLayout>} />
              <Route path="/import" element={<MainLayout><ImportPage /></MainLayout>} />
              <Route path="/schedule" element={<MainLayout><Schedule /></MainLayout>} />
              <Route path="/analytics" element={<MainLayout><Analytics /></MainLayout>} /> */}
              
              {/* Redirects */}
              <Route path="/approvals" element={<Navigate to="/approve" replace />} />
              <Route path="/" element={<Navigate to="/signup" replace />} />
              
              {/* Fallback for unknown routes */}
              <Route path="*" element={<Navigate to="/signup" replace />} />
            </Routes>
          </BrowserRouter>
        </>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
