
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import RealTimeSocialFeed from '@/components/RealTimeSocialFeed';
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-center mb-4">Welcome back to LifeFlow!</h1>
              <p className="text-center text-gray-600">Stay connected with your community</p>
            </div>
            <RealTimeSocialFeed />
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
