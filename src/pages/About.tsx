
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Globe, Award, Lock, CheckCircle2 } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "Enterprise-grade security with SOC 2 certification and GDPR compliance ensuring your data is always protected."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by professionals, for professionals. Our platform prioritizes authentic connections and meaningful interactions."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting professionals worldwide while maintaining local relevance and cultural sensitivity."
    },
    {
      icon: Award,
      title: "Quality Standards",
      description: "Rigorous content moderation and verification processes ensure high-quality discussions and opportunities."
    }
  ];

  const certifications = [
    "SOC 2 Type II Certified",
    "GDPR Compliant",
    "SSL Secured (256-bit encryption)",
    "ISO 27001 Certified",
    "DMCA Protected",
    "Cookie Policy Compliant"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              About LifeFlow
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              LifeFlow is a professional community platform designed to foster meaningful connections, 
              facilitate career growth, and provide a secure environment for professionals to collaborate, 
              learn, and succeed together.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe that professional success is amplified through community. LifeFlow was created 
                to bridge the gap between networking and meaningful professional relationships, providing 
                a platform where authenticity meets opportunity.
              </p>
              <p className="text-lg text-gray-600">
                Our commitment extends beyond connecting professionals—we're dedicated to maintaining 
                the highest standards of security, compliance, and user protection while fostering 
                an environment of growth and collaboration.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900">50k+</div>
                  <div className="text-gray-600">Active Members</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900">120+</div>
                  <div className="text-gray-600">Countries</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything we do is guided by our commitment to security, community, and professional excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="h-full">
                <CardContent className="pt-6">
                  <value.icon className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Security & Compliance</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your security and privacy are our top priorities. We maintain the highest industry standards 
              and undergo regular audits to ensure complete compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{cert}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Data Protection</h3>
                <p className="text-gray-600">End-to-end encryption and secure data handling protocols</p>
              </div>
              <div>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Regular Audits</h3>
                <p className="text-gray-600">Third-party security assessments and compliance verification</p>
              </div>
              <div>
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Industry Standards</h3>
                <p className="text-gray-600">Adherence to international security and privacy frameworks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Compliance Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Legal Framework</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            LifeFlow operates under comprehensive legal frameworks designed to protect our users and 
            maintain platform integrity. Our policies are regularly updated to reflect current regulations.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Card className="p-4">
              <div className="text-sm font-medium text-gray-900">Terms of Service</div>
              <div className="text-xs text-gray-600">Last updated: Current</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-medium text-gray-900">Privacy Policy</div>
              <div className="text-xs text-gray-600">GDPR Compliant</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-medium text-gray-900">Community Guidelines</div>
              <div className="text-xs text-gray-600">Enforced 24/7</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-medium text-gray-900">DMCA Policy</div>
              <div className="text-xs text-gray-600">Copyright Protected</div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
