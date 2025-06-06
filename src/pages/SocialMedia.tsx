
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import RealTimeSocialFeed from '@/components/RealTimeSocialFeed';

const SocialMedia = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="pt-16 py-8">
        <div className="container mx-auto px-4">
          <RealTimeSocialFeed />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SocialMedia;
