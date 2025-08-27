import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SimpleAuthProvider } from "./contexts/SimpleAuthContext";
import SimpleProtectedRoute from "./components/auth/SimpleProtectedRoute";
import PortalSwitcher from "./components/PortalSwitcher";
import UserLayout from "./layouts/UserLayout";

// Lazy load pages for better code splitting
// Using simplified auth pages for cleaner flow
const Auth = lazy(() => import("./pages/AuthSimple"));
const AuthCallback = lazy(() => import("./pages/AuthCallbackSimple"));
const Approve = lazy(() => import("./pages/Approve"));
const UserAnalytics = lazy(() => import("./pages/UserAnalytics"));
const ContentIdeas = lazy(() => import("./pages/ContentIdeas"));
const Profile = lazy(() => import("./pages/Profile"));
const Import = lazy(() => import("./pages/Import"));
const ClientApproval = lazy(() => import("./pages/ClientApproval"));
const SwipeApproval = lazy(() => import("./pages/SwipeApproval"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SimpleAuthProvider>
        <>
          <Toaster />
          <Sonner />
          <HotToaster position="top-center" />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Authentication Routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Protected Client Portal Routes */}
              <Route path="/client-approve" element={
                <SimpleProtectedRoute>
                  <ClientApproval />
                </SimpleProtectedRoute>
              } />
              <Route path="/swipe" element={
                <SimpleProtectedRoute>
                  <SwipeApproval />
                </SimpleProtectedRoute>
              } />
              
              {/* Protected Main Portal Routes */}
              <Route path="/approve" element={
                <SimpleProtectedRoute>
                  <UserLayout><Approve /></UserLayout>
                </SimpleProtectedRoute>
              } />
              <Route path="/user-analytics" element={
                <SimpleProtectedRoute>
                  <UserLayout><UserAnalytics /></UserLayout>
                </SimpleProtectedRoute>
              } />
              <Route path="/ideas" element={
                <SimpleProtectedRoute>
                  <UserLayout><ContentIdeas /></UserLayout>
                </SimpleProtectedRoute>
              } />
              <Route path="/import" element={
                <SimpleProtectedRoute>
                  <UserLayout><Import /></UserLayout>
                </SimpleProtectedRoute>
              } />
              <Route path="/profile" element={
                <SimpleProtectedRoute>
                  <UserLayout><Profile /></UserLayout>
                </SimpleProtectedRoute>
              } />
              
              {/* Legacy Redirects */}
              <Route path="/client-login" element={<Navigate to="/auth" replace />} />
              <Route path="/approvals" element={<Navigate to="/approve" replace />} />
              
              {/* Root redirect - Changed to /auth to prevent blank page issues */}
              <Route path="/" element={<Navigate to="/auth" replace />} />
              
              {/* Fallback for unknown routes */}
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
            </Suspense>
          </BrowserRouter>
          <PortalSwitcher />
        </>
      </SimpleAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
