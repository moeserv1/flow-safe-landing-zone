
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Shield, Heart } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <div className="flex items-center space-x-1">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-green-600 font-medium text-sm">Verified & Secure</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center space-x-1">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-blue-600 font-medium text-sm">Community Driven</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-fade-in">
            Welcome to LifeFlow
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in">
            A thriving community platform where connections flourish, ideas flow, and meaningful relationships are built on trust and respect.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3">
              Join Our Community
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-2">
              Learn More
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-fade-in">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">50k+ Members</h3>
              <p className="text-gray-600">Active community members sharing and growing together</p>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">100% Secure</h3>
              <p className="text-gray-600">Enterprise-grade security with full legal compliance</p>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Trusted Platform</h3>
              <p className="text-gray-600">Built with integrity, transparency, and user safety first</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
