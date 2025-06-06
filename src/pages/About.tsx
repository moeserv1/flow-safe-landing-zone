
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, Globe, Zap, Shield, Rocket } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Community First",
      description: "Build meaningful connections with like-minded individuals from around the world."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Authentic Relationships",
      description: "Foster genuine relationships through shared interests and experiences."
    },
    {
      icon: <Globe className="h-8 w-8 text-green-500" />,
      title: "Global Reach",
      description: "Connect with people across the globe and expand your network internationally."
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Real-time Interactions",
      description: "Experience instant messaging, live streams, and real-time updates."
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-500" />,
      title: "Privacy & Security",
      description: "Your data is protected with enterprise-grade security and privacy controls."
    },
    {
      icon: <Rocket className="h-8 w-8 text-orange-500" />,
      title: "Innovation",
      description: "Cutting-edge features and continuous improvements to enhance your experience."
    }
  ];

  const stats = [
    { label: "Active Users", value: "100K+" },
    { label: "Communities", value: "500+" },
    { label: "Countries", value: "50+" },
    { label: "Success Stories", value: "1000+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              About LifeFlow
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              LifeFlow is more than just a social platform – it's a comprehensive ecosystem designed to connect, 
              inspire, and empower individuals to build meaningful relationships and share their passions with the world.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mission Section */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                We believe in the power of human connection. Our mission is to create a safe, inclusive, 
                and innovative platform where people can discover new friendships, share their creativity, 
                learn new skills, and build communities that matter. We're committed to fostering authentic 
                relationships and providing tools that help people grow both personally and professionally.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">What Makes Us Different</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {feature.icon}
                      <h3 className="text-xl font-semibold ml-3">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold mb-3 flex items-center">
                    <Badge variant="outline" className="mr-2">Authenticity</Badge>
                  </h4>
                  <p className="text-gray-600">
                    We encourage genuine connections and authentic self-expression. Be yourself, 
                    share your truth, and connect with others who appreciate the real you.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-3 flex items-center">
                    <Badge variant="outline" className="mr-2">Inclusivity</Badge>
                  </h4>
                  <p className="text-gray-600">
                    Everyone deserves a place to belong. We celebrate diversity and create 
                    spaces where all people feel welcome, valued, and heard.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-3 flex items-center">
                    <Badge variant="outline" className="mr-2">Innovation</Badge>
                  </h4>
                  <p className="text-gray-600">
                    We continuously evolve and improve our platform with cutting-edge technology 
                    to provide the best possible experience for our community.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-3 flex items-center">
                    <Badge variant="outline" className="mr-2">Privacy</Badge>
                  </h4>
                  <p className="text-gray-600">
                    Your privacy and security are paramount. We implement robust measures to 
                    protect your data and give you control over your information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Growing Community</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Whether you're looking to make new friends, share your creativity, learn new skills, 
              or build your professional network, LifeFlow provides the tools and community to help you thrive.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">Social Networking</Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">Content Creation</Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">Live Streaming</Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">Events & Meetups</Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">Professional Growth</Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">Community Building</Badge>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
