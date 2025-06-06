
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DiscussionBoard from '@/components/DiscussionBoard';

const Discussions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="pt-16">
        <DiscussionBoard />
      </div>
      <Footer />
    </div>
  );
};

export default Discussions;
