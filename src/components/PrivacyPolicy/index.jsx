import React from 'react';
import { Link } from 'react-router-dom';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-[#4BCBEB] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/" className="text-white hover:text-gray-200 mb-6 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-100">
            Last updated: January 2024
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 font-Poppins">
        {/* Introduction Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <p className="text-gray-600 leading-relaxed">
            At our freelance marketplace, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information. Please read this policy carefully to understand our practices regarding your personal data.
          </p>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <section className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-[#4BCBEB] text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                1
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Information We Collect</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Personal Information",
                  items: ["Name", "Email address", "Phone number"]
                },
                {
                  title: "Professional Information",
                  items: ["Skills", "Work history", "Portfolio"]
                },
                {
                  title: "Payment Information",
                  items: ["Banking details", "Transaction history"]
                },
                {
                  title: "Communication Data",
                  items: ["Messages", "Proposals", "Reviews"]
                }
              ].map((category, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-[#4BCBEB] mb-2">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <span className="text-[#4BCBEB] mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-[#4BCBEB] text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                2
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">How We Use Your Information</h2>
            </div>
            <ul className="space-y-4">
              {[
                "To facilitate matches between freelancers and clients",
                "To process payments and maintain financial records",
                "To improve our platform services and user experience",
                "To communicate important updates and notifications",
                "To prevent fraud and ensure platform security"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#4BCBEB] mr-3">•</span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-[#4BCBEB] text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                3
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Information Sharing</h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <ul className="space-y-4">
                {[
                  "Between clients and freelancers for project purposes",
                  "With payment processors for transaction processing",
                  "With law enforcement when required by law",
                  "With service providers who assist our operations"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#4BCBEB] mr-3">•</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-[#4BCBEB] text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                4
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Data Security</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "We use encryption to protect sensitive data",
                "Regular security audits and updates",
                "Secure payment processing systems",
                "Limited access to personal information by employees"
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="text-[#4BCBEB] mr-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Your Rights */}
          <section className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-[#4BCBEB] text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                5
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Your Rights</h2>
            </div>
            <ul className="space-y-4">
              {[
                "Access your personal data",
                "Request data correction or deletion",
                "Opt-out of marketing communications",
                "Export your data"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#4BCBEB] mr-3">•</span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-[#4BCBEB] text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                6
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Cookies and Tracking</h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <ul className="space-y-4">
                {[
                  "We use cookies to improve user experience",
                  "Analytics tools to monitor platform usage",
                  "You can control cookie preferences in your browser"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#4BCBEB] mr-3">•</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-[#4BCBEB] bg-opacity-10 rounded-lg p-8 border border-[#4BCBEB] border-opacity-20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <a href="mailto:privacy@yourplatform.com" className="text-[#4BCBEB] hover:underline">
            privacy@freelanceMarketPlace.com
          </a>
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            This Privacy Policy is subject to change. We will notify users of any material changes via email or through the platform.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;