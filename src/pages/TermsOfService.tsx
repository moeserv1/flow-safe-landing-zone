
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, AlertCircle, Users, Shield, Gavel } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-600">
              Please read these terms carefully before using LifeFlow
            </p>
          </div>

          <div className="space-y-8">
            {/* Agreement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-6 w-6 text-blue-500" />
                  Agreement to Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  By accessing and using LifeFlow ("the Service"), you accept and agree to be bound by 
                  the terms and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>
                <p className="text-gray-700">
                  These Terms of Service ("Terms") govern your use of our social media and community 
                  platform operated by LifeFlow ("us", "we", or "our").
                </p>
              </CardContent>
            </Card>

            {/* Eligibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-green-500" />
                  Eligibility and Registration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Age Requirements</h4>
                    <p className="text-gray-700">
                      You must be at least 16 years old to use LifeFlow. By using our service, 
                      you represent and warrant that you meet this age requirement.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Account Registration</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• You must provide accurate and complete information during registration</li>
                      <li>• You are responsible for maintaining the security of your account</li>
                      <li>• You must not create multiple accounts or impersonate others</li>
                      <li>• We reserve the right to suspend or terminate accounts that violate these terms</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acceptable Use */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-purple-500" />
                  Acceptable Use Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    You agree to use LifeFlow in a manner consistent with all applicable laws and regulations. 
                    You agree NOT to:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-red-600">Prohibited Content</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Post illegal, harmful, or offensive content</li>
                        <li>• Share adult or sexually explicit material</li>
                        <li>• Engage in harassment or bullying</li>
                        <li>• Spread misinformation or false claims</li>
                        <li>• Violate intellectual property rights</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-red-600">Prohibited Activities</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Attempt to hack or compromise security</li>
                        <li>• Use automated tools to access the service</li>
                        <li>• Spam or flood the platform with content</li>
                        <li>• Impersonate others or create fake accounts</li>
                        <li>• Engage in commercial activities without permission</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content and Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle>Content and Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Your Content</h4>
                    <p className="text-gray-700">
                      You retain ownership of the content you post on LifeFlow. However, by posting 
                      content, you grant us a non-exclusive, worldwide, royalty-free license to use, 
                      display, and distribute your content in connection with the service.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Our Content</h4>
                    <p className="text-gray-700">
                      The LifeFlow platform, including its design, features, and underlying technology, 
                      is protected by intellectual property laws. You may not copy, modify, or 
                      distribute our content without permission.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Copyright Compliance</h4>
                    <p className="text-gray-700">
                      We respect intellectual property rights and expect our users to do the same. 
                      We will respond to valid copyright infringement notices in accordance with 
                      applicable law.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy and Data */}
            <Card>
              <CardHeader>
                <CardTitle>Privacy and Data Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Our collection and use of your personal information 
                  is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800">
                    <strong>Important:</strong> By using LifeFlow, you also agree to our Privacy Policy 
                    and Cookie Policy. Please review these documents to understand how we handle your data.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                  Disclaimers and Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Service Availability</h4>
                    <p className="text-gray-700">
                      We strive to provide reliable service, but we cannot guarantee uninterrupted 
                      access. The service is provided "as is" without warranties of any kind.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">User-Generated Content</h4>
                    <p className="text-gray-700">
                      We are not responsible for content posted by users. Users are solely responsible 
                      for their own content and interactions with other users.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Third-Party Links</h4>
                    <p className="text-gray-700">
                      Our service may contain links to third-party websites. We are not responsible 
                      for the content or practices of these external sites.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-6 w-6 text-red-500" />
                  Termination
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Your Right to Terminate</h4>
                    <p className="text-gray-700">
                      You may terminate your account at any time by contacting us or using the 
                      account deletion feature in your settings.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Our Right to Terminate</h4>
                    <p className="text-gray-700">
                      We may suspend or terminate your account if you violate these Terms, engage 
                      in harmful behavior, or for any reason at our discretion with appropriate notice.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Effect of Termination</h4>
                    <p className="text-gray-700">
                      Upon termination, your right to use the service will cease immediately. 
                      Some provisions of these Terms may survive termination.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle>Governing Law and Disputes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    These Terms are governed by and construed in accordance with the laws of the 
                    jurisdiction where LifeFlow operates, without regard to conflict of law principles.
                  </p>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Dispute Resolution</h4>
                    <p className="text-gray-700">
                      Any disputes arising from these Terms or your use of the service will be 
                      resolved through binding arbitration, except where prohibited by law.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact and Changes */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information and Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Contact Us</h4>
                    <p className="text-gray-700">
                      If you have questions about these Terms, please contact us at legal@lifeflow.com 
                      or through our support channels.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Changes to Terms</h4>
                    <p className="text-gray-700">
                      We may update these Terms from time to time. We will notify users of material 
                      changes and the updated terms will be effective upon posting.
                    </p>
                  </div>
                  
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">
                      <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      <strong>Effective date:</strong> {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
