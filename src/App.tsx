
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Community from "./pages/Community";
import JobOpportunities from "./pages/JobOpportunities";
import Blog from "./pages/Blog";
import About from "./pages/About";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Community />} />
          <Route path="/jobs" element={<JobOpportunities />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/community-guidelines" element={<CommunityGuidelines />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
