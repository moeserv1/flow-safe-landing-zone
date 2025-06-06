
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Heart, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const CommunityGuidelines = () => {
  const guidelines = [
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Be Respectful",
      description: "Treat everyone with kindness and respect. We're all here to connect and learn from each other.",
      dos: ["Use polite language", "Listen to different viewpoints", "Give constructive feedback"],
      donts: ["Use hate speech or slurs", "Bully or harass others", "Make personal attacks"]
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Foster Inclusion",
      description: "Create an environment where everyone feels welcome regardless of their background, beliefs, or identity.",
      dos: ["Welcome newcomers", "Celebrate diversity", "Use inclusive language"],
      donts: ["Discriminate based on identity", "Exclude others", "Make assumptions about people"]
    },
    {
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: "Keep Everyone Safe",
      description: "Help maintain a safe space by reporting inappropriate content and protecting personal information.",
      dos: ["Report suspicious activity", "Protect privacy", "Use content warnings when needed"],
      donts: ["Share personal information", "Engage in dangerous activities", "Threaten others"]
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-purple-500" />,
      title: "Share Authentic Content",
      description: "Be genuine in your interactions and share content that adds value to the community.",
      dos: ["Share original content", "Give proper credit", "Be authentic"],
      donts: ["Plagiarize content", "Spread misinformation", "Create fake accounts"]
    }
  ];

  const violations = [
    {
      severity: "Minor",
      examples: ["Spam", "Off-topic posts", "Excessive self-promotion"],
      consequences: ["Warning", "Content removal", "Temporary restrictions"],
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      severity: "Moderate",
      examples: ["Harassment", "Inappropriate content", "Doxxing"],
      consequences: ["Temporary suspension", "Account restrictions", "Content removal"],
      color: "bg-orange-100 text-orange-800"
    },
    {
      severity: "Severe",
      examples: ["Hate speech", "Threats", "Illegal content"],
      consequences: ["Permanent ban", "Account termination", "Legal action if necessary"],
      color: "bg-red-100 text-red-800"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Community Guidelines
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our community guidelines help create a safe, inclusive, and positive environment for everyone. 
              By participating in LifeFlow, you agree to follow these guidelines.
            </p>
          </div>

          {/* Core Guidelines */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Core Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {guidelines.map((guideline, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {guideline.icon}
                      {guideline.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">{guideline.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Do
                        </h4>
                        <ul className="space-y-1">
                          {guideline.dos.map((item, i) => (
                            <li key={i} className="text-sm text-gray-600">• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 mb-2 flex items-center">
                          <XCircle className="h-4 w-4 mr-1" />
                          Don't
                        </h4>
                        <ul className="space-y-1">
                          {guideline.donts.map((item, i) => (
                            <li key={i} className="text-sm text-gray-600">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Violations and Consequences */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Violations and Consequences</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {violations.map((violation, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge className={violation.color}>{violation.severity}</Badge>
                      Violations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Examples:</h4>
                      <ul className="space-y-1">
                        {violation.examples.map((example, i) => (
                          <li key={i} className="text-sm text-gray-600">• {example}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Consequences:</h4>
                      <ul className="space-y-1">
                        {violation.consequences.map((consequence, i) => (
                          <li key={i} className="text-sm text-gray-600">• {consequence}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Reporting */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
                Reporting Violations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">How to Report</h3>
                  <ol className="space-y-2 text-gray-600">
                    <li>1. Use the report button on any post, comment, or profile</li>
                    <li>2. Select the type of violation from the dropdown menu</li>
                    <li>3. Provide additional context if needed</li>
                    <li>4. Submit your report for review</li>
                  </ol>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">What Happens Next</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Reports are reviewed within 24 hours</li>
                    <li>• We investigate all reports thoroughly</li>
                    <li>• Action is taken based on our guidelines</li>
                    <li>• You'll receive updates on serious violations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appeal Process */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Appeal Process</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you believe your account has been penalized unfairly, you can appeal the decision:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Submit Appeal</h4>
                  <p className="text-sm text-gray-600">Contact our support team with details about your case</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Review Process</h4>
                  <p className="text-sm text-gray-600">We'll review your case within 3-5 business days</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Decision</h4>
                  <p className="text-sm text-gray-600">You'll receive our final decision via email</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CommunityGuidelines;
