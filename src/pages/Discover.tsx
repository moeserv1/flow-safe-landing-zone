
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SearchDiscovery from '@/components/SearchDiscovery';

const Discover = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find new content, creators, and communities to connect with
            </p>
          </div>
          <SearchDiscovery />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Discover;
