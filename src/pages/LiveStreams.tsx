
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LiveStream from '@/components/LiveStream';

const LiveStreams = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="pt-16">
        <LiveStream />
      </div>
      <Footer />
    </div>
  );
};

export default LiveStreams;
