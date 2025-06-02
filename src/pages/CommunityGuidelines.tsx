
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const CommunityGuidelines = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-24 pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Community Guidelines
          </h1>
          <p className="text-gray-600 mb-8">Creating a safe, respectful, and inclusive environment for everyone</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Our Community Values</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                LifeFlow is built on the principles of respect, safety, and authentic connection. 
                We believe that everyone deserves to feel welcome and secure in our community.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">🤝 Respect</h3>
                  <p className="text-blue-700 text-sm">Treat all members with dignity and kindness</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">🛡️ Safety</h3>
                  <p className="text-green-700 text-sm">Maintain a secure environment for everyone</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">💙 Authenticity</h3>
                  <p className="text-purple-700 text-sm">Be genuine in your interactions</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">✅ What We Encourage</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-3">
                <li><strong>Respectful Communication:</strong> Use kind and thoughtful language in all interactions</li>
                <li><strong>Constructive Discussions:</strong> Share ideas and engage in meaningful conversations</li>
                <li><strong>Support Others:</strong> Offer help, encouragement, and positive feedback</li>
                <li><strong>Report Issues:</strong> Help us maintain safety by reporting inappropriate content</li>
                <li><strong>Celebrate Diversity:</strong> Embrace different perspectives, backgrounds, and experiences</li>
                <li><strong>Be Authentic:</strong> Share genuine thoughts and experiences</li>
                <li><strong>Follow Guidelines:</strong> Help maintain a positive environment for all</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">❌ What's Not Allowed</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-800 mb-2">Harassment & Bullying</h3>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Targeted harassment or intimidation</li>
                    <li>• Cyberbullying or persistent unwanted contact</li>
                    <li>• Doxxing or sharing personal information without consent</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-800 mb-2">Hate Speech & Discrimination</h3>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Content that promotes hatred based on race, ethnicity, religion, gender, sexuality, or disability</li>
                    <li>• Discriminatory language or slurs</li>
                    <li>• Content that dehumanizes or marginalizes groups</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-800 mb-2">Inappropriate Content</h3>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Adult content or sexually explicit material</li>
                    <li>• Graphic violence or disturbing imagery</li>
                    <li>• Content involving minors in inappropriate contexts</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-800 mb-2">Illegal Activities</h3>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Promoting or facilitating illegal activities</li>
                    <li>• Sharing copyrighted content without permission</li>
                    <li>• Fraud, scams, or deceptive practices</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-red-800 mb-2">Spam & Misuse</h3>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Excessive posting or repetitive content</li>
                    <li>• Unauthorized advertising or promotion</li>
                    <li>• Creating fake accounts or impersonating others</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">🚨 Reporting & Enforcement</h2>
              <div className="bg-yellow-50 p-6 rounded-lg mb-4">
                <h3 className="font-semibold text-yellow-800 mb-2">How to Report</h3>
                <p className="text-yellow-700 text-sm mb-2">
                  If you encounter content or behavior that violates our guidelines:
                </p>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Use the report button on any post or message</li>
                  <li>• Contact our moderation team at moderation@lifeflow.com</li>
                  <li>• For urgent safety concerns, email safety@lifeflow.com</li>
                </ul>
              </div>

              <h3 className="font-semibold text-gray-800 mb-3">Enforcement Actions</h3>
              <p className="text-gray-700 mb-4">Violations may result in:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Warning:</strong> First-time minor violations</li>
                <li><strong>Content Removal:</strong> Violating posts will be deleted</li>
                <li><strong>Temporary Suspension:</strong> Account restrictions for repeated violations</li>
                <li><strong>Permanent Ban:</strong> Severe or repeated violations</li>
                <li><strong>Legal Action:</strong> For illegal activities or serious harm</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">🛡️ Safety Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">Privacy Controls</h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Block and report users</li>
                    <li>• Control who can contact you</li>
                    <li>• Manage your visibility settings</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">Moderation Tools</h3>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• AI-powered content screening</li>
                    <li>• 24/7 human moderation team</li>
                    <li>• Community reporting system</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">📞 Need Help?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our community support team is here to help. Don't hesitate to reach out if you have questions 
                about these guidelines or need assistance with any community-related issues.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">General Support</h4>
                    <p className="text-gray-700 text-sm">support@lifeflow.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Safety Concerns</h4>
                    <p className="text-gray-700 text-sm">safety@lifeflow.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Content Moderation</h4>
                    <p className="text-gray-700 text-sm">moderation@lifeflow.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Legal Issues</h4>
                    <p className="text-gray-700 text-sm">legal@lifeflow.com</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Thank you for helping us build a positive community! 💙
              </h3>
              <p className="text-gray-700">
                These guidelines evolve with our community. We appreciate your feedback and commitment 
                to making LifeFlow a safe, welcoming space for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CommunityGuidelines;
