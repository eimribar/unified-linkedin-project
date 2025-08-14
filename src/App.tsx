import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PortalSwitcher from "./components/PortalSwitcher";
import Approve from "./pages/Approve";
import UserAnalytics from "./pages/UserAnalytics";
import ContentIdeas from "./pages/ContentIdeas";
import UserLayout from "./layouts/UserLayout";
import Profile from "./pages/Profile";
import Import from "./pages/Import";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main Portal Routes - No authentication required */}
            <Route path="/approve" element={
              <UserLayout><Approve /></UserLayout>
            } />
            <Route path="/user-analytics" element={
              <UserLayout><UserAnalytics /></UserLayout>
            } />
            <Route path="/ideas" element={
              <UserLayout><ContentIdeas /></UserLayout>
            } />
            <Route path="/import" element={
              <UserLayout><Import /></UserLayout>
            } />
            <Route path="/profile" element={
              <UserLayout><Profile /></UserLayout>
            } />
            
            {/* Redirects */}
            <Route path="/approvals" element={<Navigate to="/approve" replace />} />
            <Route path="/" element={<Navigate to="/approve" replace />} />
            
            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/approve" replace />} />
          </Routes>
        </BrowserRouter>
        <PortalSwitcher />
      </>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
