
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LiveStream from '@/components/LiveStream';

const LiveStreams = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Live Streams</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Go live and connect with your audience in real-time. Stream from your mobile or desktop with camera and microphone access.
            </p>
          </div>
          <LiveStream />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LiveStreams;
