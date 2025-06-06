
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VideoUpload from '@/components/VideoUpload';

const Videos = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="pt-16">
        <VideoUpload />
      </div>
      <Footer />
    </div>
  );
};

export default Videos;
