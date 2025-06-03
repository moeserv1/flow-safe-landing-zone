
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies</h2>
              <p className="text-gray-700 leading-relaxed">
                Cookies are small text files that are stored on your computer or mobile device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and analyzing how you use our site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Essential Cookies</h3>
                  <p className="text-gray-700">These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Analytics Cookies</h3>
                  <p className="text-gray-700">We use Google Analytics to understand how visitors interact with our website. This helps us improve our service.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Advertising Cookies</h3>
                  <p className="text-gray-700">We use Google AdSense to display relevant advertisements. These cookies help personalize ads based on your interests.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-700 leading-relaxed">
                We work with third-party partners including Google AdSense and Google Analytics. 
                These services may set their own cookies to provide their functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Cookies</h2>
              <p className="text-gray-700 leading-relaxed">
                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer 
                and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually 
                adjust some preferences every time you visit our site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about our Cookie Policy, please contact us at privacy@lifeflow.com
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
