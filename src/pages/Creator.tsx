
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CreatorDashboard from '@/components/CreatorDashboard';

const Creator = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="pt-16">
        <CreatorDashboard />
      </div>
      <Footer />
    </div>
  );
};

export default Creator;
