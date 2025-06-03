
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Heart, Users, AlertTriangle, MessageCircle, Eye } from "lucide-react";

const CommunityGuidelines = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Guidelines</h1>
            <p className="text-xl text-gray-600">
              Building a safe, respectful, and vibrant community for everyone
            </p>
          </div>

          <div className="space-y-8">
            {/* Core Values */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  Our Core Values
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  LifeFlow is built on the foundation of meaningful connections and positive interactions. 
                  Our community thrives when everyone feels safe, respected, and valued.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Respect:</strong> Treat all members with dignity and kindness</li>
                  <li>• <strong>Authenticity:</strong> Be genuine in your interactions and posts</li>
                  <li>• <strong>Inclusivity:</strong> Welcome people of all backgrounds and perspectives</li>
                  <li>• <strong>Safety:</strong> Maintain a secure environment for everyone</li>
                </ul>
              </CardContent>
            </Card>

            {/* Expected Behavior */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-green-500" />
                  Expected Behavior
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">✅ Do:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Be kind and respectful in all interactions</li>
                      <li>• Share meaningful and appropriate content</li>
                      <li>• Respect others' privacy and boundaries</li>
                      <li>• Report violations when you see them</li>
                      <li>• Give constructive feedback and support</li>
                      <li>• Use appropriate language and tone</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">❌ Don't:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Engage in harassment or bullying</li>
                      <li>• Share inappropriate or offensive content</li>
                      <li>• Spam or flood the platform</li>
                      <li>• Share personal information of others</li>
                      <li>• Use hate speech or discriminatory language</li>
                      <li>• Impersonate others or create fake accounts</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-blue-500" />
                  Content Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Appropriate Content</h4>
                    <p className="text-gray-700">
                      Share content that is relevant, respectful, and adds value to our community. 
                      This includes personal experiences, helpful advice, interesting discussions, 
                      and positive interactions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Prohibited Content</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Illegal activities or content</li>
                      <li>• Adult or sexually explicit material</li>
                      <li>• Violence, threats, or self-harm content</li>
                      <li>• Hate speech, discrimination, or harassment</li>
                      <li>• Misinformation or harmful false information</li>
                      <li>• Spam, scams, or fraudulent activities</li>
                      <li>• Copyright infringing material</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Safety */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-6 w-6 text-purple-500" />
                  Privacy & Safety
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Age Requirements</h4>
                    <p className="text-gray-700">
                      You must be at least 16 years old to use LifeFlow. We take age verification 
                      seriously and may request verification if needed.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Personal Information</h4>
                    <p className="text-gray-700">
                      Never share personal information such as home addresses, phone numbers, 
                      financial information, or passwords. Keep your personal details private 
                      and report anyone who asks for this information.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Meeting Safety</h4>
                    <p className="text-gray-700">
                      If you choose to meet someone from our platform in person, always meet in 
                      public places, tell someone where you're going, and trust your instincts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enforcement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  Enforcement & Consequences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Violations of these guidelines may result in the following actions:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-800">Warning</h4>
                      <p className="text-sm text-yellow-700 mt-2">
                        First-time minor violations receive a warning and guidance
                      </p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-800">Temporary Suspension</h4>
                      <p className="text-sm text-orange-700 mt-2">
                        Repeated or serious violations result in temporary restrictions
                      </p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-800">Permanent Ban</h4>
                      <p className="text-sm text-red-700 mt-2">
                        Severe or continued violations lead to permanent removal
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reporting */}
            <Card>
              <CardHeader>
                <CardTitle>Reporting Violations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  If you see content or behavior that violates these guidelines, please report it 
                  immediately. You can report violations by:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Using the report button on posts or profiles</li>
                  <li>• Contacting our moderation team directly</li>
                  <li>• Using the community feedback form</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  All reports are reviewed promptly and confidentially. We appreciate your help 
                  in maintaining a positive community environment.
                </p>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card>
              <CardHeader>
                <CardTitle>Guidelines Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  These guidelines may be updated from time to time to reflect changes in our 
                  community, legal requirements, or platform features. We will notify users of 
                  significant changes and encourage regular review of these guidelines.
                </p>
                <p className="text-gray-600 text-sm mt-4">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CommunityGuidelines;
