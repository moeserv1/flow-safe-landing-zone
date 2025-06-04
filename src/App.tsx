
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SecurityProvider } from "@/components/SecurityProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import SocialMedia from "./pages/SocialMedia";
import Uploads from "./pages/Uploads";
import LiveStreams from "./pages/LiveStreams";
import Blog from "./pages/Blog";
import JobOpportunities from "./pages/JobOpportunities";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import NotFound from "./pages/NotFound";
import "./App.css";
import { useEffect } from "react";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const appName = import.meta.env.VITE_APP_NAME;
    if (!appName) {
      console.warn('VITE_APP_NAME not set in environment variables');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SecurityProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/community" element={<Community />} />
                <Route path="/social" element={<SocialMedia />} />
                <Route path="/uploads" element={<Uploads />} />
                <Route path="/live" element={<LiveStreams />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/jobs" element={<JobOpportunities />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                <Route path="/community-guidelines" element={<CommunityGuidelines />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </SecurityProvider>
    </QueryClientProvider>
  );
}

export default App;
