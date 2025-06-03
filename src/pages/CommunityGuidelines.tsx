
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, Users, AlertTriangle, Eye, Flag } from "lucide-react";

const CommunityGuidelines = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-3 rounded-full">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Guidelines</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              LifeFlow is a place where hearts connect. These guidelines help us maintain a positive, 
              safe, and welcoming environment for everyone.
            </p>
          </div>

          <div className="space-y-8">
            {/* Core Values */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="h-6 w-6 text-red-500" />
                  <h2 className="text-2xl font-semibold text-gray-900">Our Core Values</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-medium mb-2">Safety First</h3>
                    <p className="text-sm text-gray-600">We prioritize the safety and security of all our community members.</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-medium mb-2">Respect & Inclusion</h3>
                    <p className="text-sm text-gray-600">We celebrate diversity and treat everyone with dignity and respect.</p>
                  </div>
                  <div className="text-center">
                    <Heart className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <h3 className="font-medium mb-2">Authentic Connections</h3>
                    <p className="text-sm text-gray-600">We encourage genuine interactions and meaningful relationships.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Rules */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Community Rules</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">1. Be Respectful and Kind</h3>
                    <ul className="text-gray-700 space-y-2 ml-4">
                      <li>• Treat all members with courtesy and respect</li>
                      <li>• Use appropriate language and tone in all communications</li>
                      <li>• Respect different opinions, backgrounds, and perspectives</li>
                      <li>• Be constructive in feedback and discussions</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">2. No Harassment or Bullying</h3>
                    <ul className="text-gray-700 space-y-2 ml-4">
                      <li>• Harassment, intimidation, or bullying of any kind is prohibited</li>
                      <li>• Do not engage in personal attacks or targeted harassment</li>
                      <li>• Respect boundaries when someone asks you to stop</li>
                      <li>• Report any harassment to our moderation team immediately</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">3. Appropriate Content Only</h3>
                    <ul className="text-gray-700 space-y-2 ml-4">
                      <li>• Share content that is appropriate for all audiences</li>
                      <li>• No explicit, violent, or disturbing content</li>
                      <li>• Avoid controversial topics that may cause conflict</li>
                      <li>• Keep discussions relevant to the community purpose</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">4. Privacy and Safety</h3>
                    <ul className="text-gray-700 space-y-2 ml-4">
                      <li>• Protect your personal information and that of others</li>
                      <li>• Do not share contact information publicly</li>
                      <li>• Report suspicious or unsafe behavior</li>
                      <li>• Use privacy settings to control your information visibility</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">5. No Spam or Self-Promotion</h3>
                    <ul className="text-gray-700 space-y-2 ml-4">
                      <li>• Avoid repetitive or irrelevant posts</li>
                      <li>• Do not use the platform solely for commercial promotion</li>
                      <li>• Share valuable content that benefits the community</li>
                      <li>• Follow our guidelines for business-related posts</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Age Requirements */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                  <h2 className="text-2xl font-semibold text-gray-900">Age Requirements & Legal Compliance</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Minimum Age Requirement</h3>
                    <p className="text-gray-700">
                      You must be at least 18 years old to create an account and use LifeFlow. 
                      This age verification is required for legal compliance and to ensure appropriate interactions.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Age Verification</h3>
                    <p className="text-gray-700">
                      During registration, you must provide your date of birth. False information 
                      regarding age will result in immediate account suspension.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Legal Compliance</h3>
                    <p className="text-gray-700">
                      Our platform complies with international data protection laws including GDPR, 
                      CCPA, and other applicable regulations. All users must agree to our terms and privacy policy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reporting & Enforcement */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Flag className="h-6 w-6 text-red-500" />
                  <h2 className="text-2xl font-semibold text-gray-900">Reporting & Enforcement</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">How to Report Violations</h3>
                    <ul className="text-gray-700 space-y-2 ml-4">
                      <li>• Use the report button on posts, comments, or profiles</li>
                      <li>• Contact our support team directly for serious violations</li>
                      <li>• Provide detailed information about the violation</li>
                      <li>• Include screenshots or evidence when possible</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Enforcement Actions</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-amber-600">Warning:</span>
                          <span className="text-gray-700 ml-2">First-time minor violations receive a warning</span>
                        </div>
                        <div>
                          <span className="font-medium text-orange-600">Temporary Suspension:</span>
                          <span className="text-gray-700 ml-2">Repeated violations result in temporary account suspension</span>
                        </div>
                        <div>
                          <span className="font-medium text-red-600">Permanent Ban:</span>
                          <span className="text-gray-700 ml-2">Serious violations lead to permanent account termination</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Appeal Process</h3>
                    <p className="text-gray-700">
                      If you believe an enforcement action was taken in error, you may appeal within 30 days. 
                      Contact our support team with your case details for review.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Eye className="h-6 w-6 text-green-500" />
                  <h2 className="text-2xl font-semibold text-gray-900">Need Help?</h2>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-700 mb-4">
                    If you have questions about these guidelines or need to report a violation, 
                    our community team is here to help.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Community Support:</strong> community@lifeflow.com
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Legal Inquiries:</strong> legal@lifeflow.com
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Emergency Reports:</strong> Use in-app reporting for immediate assistance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Last Updated */}
            <div className="text-center text-sm text-gray-500">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p>These guidelines may be updated periodically. Users will be notified of significant changes.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CommunityGuidelines;
