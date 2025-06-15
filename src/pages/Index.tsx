
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import SocialFeed from '@/components/SocialFeed';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Navigation />
        <div className="pt-16 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
            </div>
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="pt-16">
        {user ? (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Welcome back to LifeFlow!
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Stay connected with your community and discover what's happening
              </p>
            </div>
            <SocialFeed />
          </div>
        ) : (
          <>
            <HeroSection />
            <FeaturesSection />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Index;
