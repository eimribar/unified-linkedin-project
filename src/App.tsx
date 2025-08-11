import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Lake from "./pages/Lake";
import Ideas from "./pages/Ideas";
import Generate from "./pages/Generate";
import Approvals from "./pages/Approvals";
import Schedule from "./pages/Schedule";
import Analytics from "./pages/Analytics";
import Onboarding from "./pages/Onboarding";
import MainLayout from "./layouts/MainLayout";
import OnboardingLayout from "./layouts/OnboardingLayout";
import ImportPage from "./pages/Import";
import Strategy from "./pages/Strategy";
import UserLayout from "./layouts/UserLayout";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout><Index /></MainLayout>} />
            <Route path="/lake" element={<MainLayout><Lake /></MainLayout>} />
            <Route path="/ideas" element={<MainLayout><Ideas /></MainLayout>} />
            <Route path="/generate" element={<MainLayout><Generate /></MainLayout>} />
            <Route path="/import" element={<MainLayout><ImportPage /></MainLayout>} />
            <Route path="/onboarding" element={<OnboardingLayout><Onboarding /></OnboardingLayout>} />
            <Route path="/strategy" element={<UserLayout><Strategy /></UserLayout>} />
            <Route path="/approve" element={<UserLayout><Approvals /></UserLayout>} />
            <Route path="/approvals" element={<Navigate to="/approve" replace />} />
            <Route path="/profile" element={<UserLayout><Profile /></UserLayout>} />
            <Route path="/schedule" element={<MainLayout><Schedule /></MainLayout>} />
            <Route path="/analytics" element={<MainLayout><Analytics /></MainLayout>} />
            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/lake" replace />} />
          </Routes>
        </BrowserRouter>
      </>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
