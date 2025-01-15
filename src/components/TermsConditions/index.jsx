import React from 'react';
import { Link } from 'react-router-dom';

function TermsConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-[#4BCBEB] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/" className="text-white hover:text-gray-200 mb-6 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
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
            Welcome to our freelance marketplace. Please read these terms and conditions carefully before using our platform. By accessing or using our service, you agree to be bound by these terms.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {/* Account Terms */}
          <section className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-[#4BCBEB] text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                1
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Account Terms</h2>
            </div>
            <ul className="space-y-4">
              {[
                "You must be 18 years or older to use this service.",
                "You must provide valid and accurate information during registration.",
                "You are responsible for maintaining the security of your account credentials.",
                "You are responsible for all activities that occur under your account."
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#4BCBEB] mr-3">•</span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Freelancer Terms */}
          <section className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-[#4BCBEB] text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                2
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Freelancer Terms</h2>
            </div>
            <ul className="space-y-4">
              {[
                "Freelancers must deliver work as described in their proposals.",
                "Freelancers must maintain professional communication with clients.",
                "Freelancers must respect intellectual property rights.",
                "Service fees will be deducted from payments as per current platform rates."
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#4BCBEB] mr-3">•</span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Client Terms */}
          <section className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-[#4BCBEB] text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                3
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Client Terms</h2>
            </div>
            <ul className="space-y-4">
              {[
                "Clients must provide clear project requirements.",
                "Clients must pay for completed work as agreed.",
                "Clients must respond to freelancer communications in a timely manner.",
                "Payment disputes must be raised within the platform's specified timeframe."
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#4BCBEB] mr-3">•</span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Payment Terms */}
          <section className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-[#4BCBEB] text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                4
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Payment Terms</h2>
            </div>
            <ul className="space-y-4">
              {[
                "All payments must be processed through our platform.",
                "Platform fees are non-refundable.",
                "Refunds are subject to our dispute resolution process.",
                "Payment release terms vary by project type and agreement."
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#4BCBEB] mr-3">•</span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Prohibited Activities */}
          <section className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-[#4BCBEB] text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                5
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Prohibited Activities</h2>
            </div>
            <ul className="space-y-4">
              {[
                "Circumventing platform payment systems.",
                "Sharing personal contact information before contract agreement.",
                "Harassment or discriminatory behavior.",
                "Posting false or misleading information."
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#4BCBEB] mr-3">•</span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            These terms and conditions are subject to change. We will notify users of any material changes via email or through the platform.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsConditions;