
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CommunityDashboard from '@/components/CommunityDashboard';
import CommunityChat from '@/components/CommunityChat';

const Community = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="pt-16">
        <CommunityDashboard />
        <CommunityChat />
      </div>
      <Footer />
    </div>
  );
};

export default Community;
