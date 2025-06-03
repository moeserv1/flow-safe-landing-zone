
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Globe, Phone } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Lock className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
          </div>

          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-green-500" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  At LifeFlow, we are committed to protecting your privacy and ensuring the security 
                  of your personal information. This Privacy Policy explains how we collect, use, 
                  disclose, and safeguard your information when you use our platform.
                </p>
                <p className="text-gray-700">
                  By using LifeFlow, you agree to the collection and use of information in accordance 
                  with this Privacy Policy. If you do not agree with our policies and practices, 
                  please do not use our services.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-6 w-6 text-blue-500" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Personal Information</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Name, email address, and date of birth</li>
                      <li>• Profile information including bio, location, and interests</li>
                      <li>• Photos and other content you share</li>
                      <li>• Communication preferences and settings</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Usage Information</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• How you interact with our platform and features</li>
                      <li>• Time spent on different sections of the app</li>
                      <li>• Device information and technical specifications</li>
                      <li>• IP address and general location data</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Cookies and Tracking</h4>
                    <p className="text-gray-700">
                      We use cookies and similar technologies to enhance your experience, 
                      analyze usage patterns, and provide personalized content. You can 
                      control cookie settings through your browser preferences.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-6 w-6 text-purple-500" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Primary Uses</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Provide and maintain our services</li>
                      <li>• Facilitate connections and communications</li>
                      <li>• Personalize your experience</li>
                      <li>• Process transactions and payments</li>
                      <li>• Send important updates and notifications</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Secondary Uses</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Improve our platform and develop new features</li>
                      <li>• Conduct analytics and research</li>
                      <li>• Ensure safety and prevent fraud</li>
                      <li>• Comply with legal obligations</li>
                      <li>• Provide customer support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-orange-500" />
                  Information Sharing and Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    We do not sell, trade, or rent your personal information to third parties. 
                    We may share your information only in the following circumstances:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">With Your Consent</h4>
                      <p className="text-gray-700">
                        When you explicitly agree to share information with specific third parties 
                        or integrate with external services.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Service Providers</h4>
                      <p className="text-gray-700">
                        With trusted service providers who help us operate our platform, 
                        such as hosting, analytics, and customer support services.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Legal Requirements</h4>
                      <p className="text-gray-700">
                        When required by law, court order, or to protect the rights, 
                        property, or safety of LifeFlow, our users, or others.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-6 w-6 text-red-500" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    We implement industry-standard security measures to protect your personal information:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Technical Safeguards</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• SSL/TLS encryption for data transmission</li>
                        <li>• Encrypted data storage</li>
                        <li>• Regular security audits and updates</li>
                        <li>• Secure access controls and authentication</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Operational Safeguards</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Limited access to personal data</li>
                        <li>• Employee training on data protection</li>
                        <li>• Regular backup and recovery procedures</li>
                        <li>• Incident response and monitoring</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle>Your Privacy Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  You have the following rights regarding your personal information:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <strong>Access:</strong> Request a copy of the personal information we hold about you
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <strong>Correction:</strong> Request correction of inaccurate or incomplete information
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <strong>Deletion:</strong> Request deletion of your personal information
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <strong>Portability:</strong> Request transfer of your data to another service
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <strong>Objection:</strong> Object to certain processing of your information
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-6 w-6 text-green-500" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy or want to exercise your privacy rights, 
                  please contact us:
                </p>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> privacy@lifeflow.com</p>
                    <p><strong>Address:</strong> LifeFlow Privacy Team, 123 Main Street, City, State 12345</p>
                    <p><strong>Response Time:</strong> We aim to respond to all privacy inquiries within 30 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card>
              <CardHeader>
                <CardTitle>Policy Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, 
                  technology, legal requirements, or other factors. We will notify you of any material 
                  changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
                <p className="text-gray-600 text-sm">
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

export default PrivacyPolicy;
