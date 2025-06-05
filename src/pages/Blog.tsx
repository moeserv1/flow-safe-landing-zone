
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BlogSystem from '@/components/BlogSystem';

const Blog = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="pt-16">
        <BlogSystem />
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
