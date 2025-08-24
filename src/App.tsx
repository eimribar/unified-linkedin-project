import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SupabaseAuthProvider } from "./contexts/SupabaseAuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PortalSwitcher from "./components/PortalSwitcher";
import ImpersonationBanner from "./components/ImpersonationBanner";
import UserLayout from "./layouts/UserLayout";

// Lazy load pages for better code splitting
const Auth = lazy(() => import("./pages/Auth"));
const Approve = lazy(() => import("./pages/Approve"));
const UserAnalytics = lazy(() => import("./pages/UserAnalytics"));
const ContentIdeas = lazy(() => import("./pages/ContentIdeas"));
const Profile = lazy(() => import("./pages/Profile"));
const Import = lazy(() => import("./pages/Import"));
const ClientApproval = lazy(() => import("./pages/ClientApproval"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SupabaseAuthProvider>
        <>
          <Toaster />
          <Sonner />
          <ImpersonationBanner />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Authentication Route */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected Client Portal Routes */}
              <Route path="/client-approve" element={
                <ProtectedRoute>
                  <ClientApproval />
                </ProtectedRoute>
              } />
              
              {/* Protected Main Portal Routes */}
              <Route path="/approve" element={
                <ProtectedRoute>
                  <UserLayout><Approve /></UserLayout>
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
              <Route path="/import" element={
                <ProtectedRoute>
                  <UserLayout><Import /></UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserLayout><Profile /></UserLayout>
                </ProtectedRoute>
              } />
              
              {/* Legacy Redirects */}
              <Route path="/client-login" element={<Navigate to="/auth" replace />} />
              <Route path="/approvals" element={<Navigate to="/approve" replace />} />
              
              {/* Root redirect */}
              <Route path="/" element={<Navigate to="/client-approve" replace />} />
              
              {/* Fallback for unknown routes */}
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
            </Suspense>
          </BrowserRouter>
          <PortalSwitcher />
        </>
      </SupabaseAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
