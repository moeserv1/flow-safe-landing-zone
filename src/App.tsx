
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SecurityProvider } from "@/components/SecurityProvider";
import { AuthProvider } from "@/hooks/useAuth";
import Community from "./pages/Community";
import JobOpportunities from "./pages/JobOpportunities";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Auth from "./pages/Auth";
import SocialMedia from "./pages/SocialMedia";
import Profile from "./pages/Profile";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { generateCSPContent } from "@/utils/security";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

const App = () => {
  useEffect(() => {
    // Add Google AdSense script
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7512720812981009";
    script.crossOrigin = "anonymous";
    script.setAttribute('data-allowed', 'true');
    document.head.appendChild(script);

    // Set security headers via meta tags
    const securityHeaders = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'SAMEORIGIN' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=(self)' },
    ];

    securityHeaders.forEach(({ name, content }) => {
      const meta = document.createElement('meta');
      meta.httpEquiv = name;
      meta.content = content;
      document.head.appendChild(meta);
    });

    // Set Content Security Policy
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = generateCSPContent();
    document.head.appendChild(cspMeta);

    // Validate environment
    if (!import.meta.env.VITE_APP_NAME) {
      console.warn('VITE_APP_NAME not set in environment variables');
    }

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SecurityProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Community />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/social" element={<SocialMedia />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/jobs" element={<JobOpportunities />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/about" element={<About />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/community-guidelines" element={<CommunityGuidelines />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </SecurityProvider>
    </QueryClientProvider>
  );
};

export default App;
