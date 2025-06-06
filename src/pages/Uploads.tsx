
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SocialVideoUpload from '@/components/SocialVideoUpload';

const Uploads = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="pt-16">
        <SocialVideoUpload />
      </div>
      <Footer />
    </div>
  );
};

export default Uploads;
