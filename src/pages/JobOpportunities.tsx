
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import JobFestival from '@/components/JobFestival';

const JobOpportunities = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="pt-16">
        <JobFestival />
      </div>
      <Footer />
    </div>
  );
};

export default JobOpportunities;
