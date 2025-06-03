
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Settings, Eye, BarChart, Shield, Globe } from "lucide-react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Cookie className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
            <p className="text-xl text-gray-600">
              Learn about how we use cookies and similar technologies on LifeFlow
            </p>
          </div>

          <div className="space-y-8">
            {/* What are Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-6 w-6 text-orange-500" />
                  What are Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Cookies are small text files that are stored on your device when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences, 
                  keeping you logged in, and helping us understand how you use our platform.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Similar Technologies</h4>
                  <p className="text-blue-700 text-sm">
                    We also use similar technologies like web beacons, pixels, and local storage 
                    to enhance your experience and gather insights about our platform usage.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Types of Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-6 w-6 text-purple-500" />
                  Types of Cookies We Use
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Essential Cookies</h4>
                      <p className="text-green-700 text-sm mb-2">
                        These cookies are necessary for the website to function properly.
                      </p>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• Authentication and login</li>
                        <li>• Security and fraud prevention</li>
                        <li>• Shopping cart functionality</li>
                        <li>• Form submission</li>
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">Performance Cookies</h4>
                      <p className="text-yellow-700 text-sm mb-2">
                        These help us understand how visitors interact with our website.
                      </p>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        <li>• Page load times</li>
                        <li>• Error tracking</li>
                        <li>• Popular content analysis</li>
                        <li>• User journey mapping</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Functional Cookies</h4>
                      <p className="text-blue-700 text-sm mb-2">
                        These enhance functionality and personalization.
                      </p>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Language preferences</li>
                        <li>• Theme settings</li>
                        <li>• Customized content</li>
                        <li>• Social media integration</li>
                      </ul>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Marketing Cookies</h4>
                      <p className="text-purple-700 text-sm mb-2">
                        These help us show you relevant advertisements.
                      </p>
                      <ul className="text-purple-700 text-sm space-y-1">
                        <li>• Targeted advertising</li>
                        <li>• Cross-platform tracking</li>
                        <li>• Campaign effectiveness</li>
                        <li>• Retargeting</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-blue-500" />
                  Third-Party Cookies and Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We use several third-party services that may set their own cookies on your device:
                </p>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold mb-2">Google Analytics</h4>
                    <p className="text-gray-700 text-sm">
                      Helps us understand website traffic and user behavior to improve our platform.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold mb-2">Google AdSense</h4>
                    <p className="text-gray-700 text-sm">
                      Enables us to display relevant advertisements to support our platform.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold mb-2">Social Media Platforms</h4>
                    <p className="text-gray-700 text-sm">
                      Allow you to share content and interact with social media features.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold mb-2">Content Delivery Networks</h4>
                    <p className="text-gray-700 text-sm">
                      Help us deliver content faster and more reliably to users worldwide.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Managing Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-6 w-6 text-gray-500" />
                  Managing Your Cookie Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Browser Settings</h4>
                    <p className="text-gray-700 mb-4">
                      You can control cookies through your browser settings. Here's how to manage 
                      cookies in popular browsers:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <strong>Chrome:</strong> Settings → Privacy and Security → Cookies
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <strong>Firefox:</strong> Settings → Privacy & Security → Cookies
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <strong>Safari:</strong> Preferences → Privacy → Cookies
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <strong>Edge:</strong> Settings → Cookies and Site Permissions
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Our Cookie Consent Tool</h4>
                    <p className="text-gray-700 mb-4">
                      When you first visit LifeFlow, you'll see a cookie consent banner where you 
                      can choose which types of cookies to accept. You can change your preferences 
                      at any time by:
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Clicking the "Cookie Settings" link in our footer</li>
                      <li>• Visiting your account settings page</li>
                      <li>• Contacting our support team</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Impact of Disabling */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-6 w-6 text-yellow-500" />
                  Impact of Disabling Cookies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  While you can disable cookies, please note that this may affect your experience on LifeFlow:
                </p>
                
                <div className="space-y-4">
                  <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Essential Cookies Disabled</h4>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• You may not be able to log in or stay logged in</li>
                      <li>• Security features may not work properly</li>
                      <li>• Some forms may not function correctly</li>
                    </ul>
                  </div>
                  
                  <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Performance Cookies Disabled</h4>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• We can't improve the platform based on usage data</li>
                      <li>• Error tracking may be limited</li>
                      <li>• Performance optimizations may not work</li>
                    </ul>
                  </div>
                  
                  <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Functional Cookies Disabled</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Your preferences won't be remembered</li>
                      <li>• Personalization features may not work</li>
                      <li>• Social media integration may be limited</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-6 w-6 text-green-500" />
                  Cookie Data Retention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Different types of cookies are stored for different periods:
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-3 text-left">Cookie Type</th>
                          <th className="border border-gray-300 p-3 text-left">Retention Period</th>
                          <th className="border border-gray-300 p-3 text-left">Purpose</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-3">Session Cookies</td>
                          <td className="border border-gray-300 p-3">Until browser closes</td>
                          <td className="border border-gray-300 p-3">Temporary functionality</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">Authentication</td>
                          <td className="border border-gray-300 p-3">30 days</td>
                          <td className="border border-gray-300 p-3">Keep you logged in</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">Preferences</td>
                          <td className="border border-gray-300 p-3">1 year</td>
                          <td className="border border-gray-300 p-3">Remember your settings</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">Analytics</td>
                          <td className="border border-gray-300 p-3">2 years</td>
                          <td className="border border-gray-300 p-3">Usage analysis</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">Marketing</td>
                          <td className="border border-gray-300 p-3">90 days</td>
                          <td className="border border-gray-300 p-3">Advertising</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact and Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-blue-500" />
                  Contact Us and Policy Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Questions About Cookies</h4>
                    <p className="text-gray-700">
                      If you have any questions about our use of cookies or this Cookie Policy, 
                      please contact us at privacy@lifeflow.com or through our support channels.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Policy Updates</h4>
                    <p className="text-gray-700">
                      We may update this Cookie Policy from time to time to reflect changes in 
                      our practices or applicable laws. We will notify you of any material changes.
                    </p>
                  </div>
                  
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">
                      <strong>Last updated:</strong> {new Date().toLocaleDateString()}
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

export default CookiePolicy;
