
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import UserProfilePage from "./pages/UserProfile";
import Community from "./pages/Community";
import Videos from "./pages/Videos";
import LiveStreams from "./pages/LiveStreams";
import SocialMedia from "./pages/SocialMedia";
import JobOpportunities from "./pages/JobOpportunities";
import Blog from "./pages/Blog";
import About from "./pages/About";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import Settings from "./pages/Settings";
import Creator from "./pages/Creator";
import CommunitySpacesPage from "./pages/CommunitySpacesPage";
import Discover from "./pages/Discover";
import Discussions from "./pages/Discussions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user-profile/:userId?" element={<UserProfilePage />} />
            <Route path="/community" element={<Community />} />
            <Route path="/spaces" element={<CommunitySpacesPage />} />
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/live-streams" element={<LiveStreams />} />
            <Route path="/social" element={<SocialMedia />} />
            <Route path="/jobs" element={<JobOpportunities />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/creator" element={<Creator />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/guidelines" element={<CommunityGuidelines />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
