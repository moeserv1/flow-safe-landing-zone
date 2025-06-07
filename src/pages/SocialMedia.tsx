
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SocialFeed from '@/components/SocialFeed';

const SocialMedia = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="pt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              LifeFlow Social
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with friends, share your moments, and discover what's happening in your community
            </p>
          </div>
          <SocialFeed />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SocialMedia;
