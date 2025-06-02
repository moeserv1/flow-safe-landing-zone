
import { MessageCircle, Shield, Users, Globe, Lock, CheckCircle } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "Safe Communication",
      description: "Secure messaging with built-in moderation and community guidelines enforcement."
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "Your data is protected with enterprise-grade security and GDPR compliance."
    },
    {
      icon: Users,
      title: "Community Moderation",
      description: "Expert moderation team ensuring a respectful and positive environment."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with like-minded individuals from around the world."
    },
    {
      icon: Lock,
      title: "Secure Platform",
      description: "End-to-end encryption and regular security audits keep you safe."
    },
    {
      icon: CheckCircle,
      title: "Verified Members",
      description: "Identity verification system ensures authentic community interactions."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Why Choose LifeFlow?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built with safety, security, and community at its core. Every feature is designed to protect and empower our users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <feature.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
