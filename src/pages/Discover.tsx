
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SearchDiscovery from '@/components/SearchDiscovery';

const Discover = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="pt-16">
        <SearchDiscovery />
      </div>
      <Footer />
    </div>
  );
};

export default Discover;
