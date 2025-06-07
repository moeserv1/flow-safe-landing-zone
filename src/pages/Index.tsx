
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import SocialFeed from '@/components/SocialFeed';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();

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
