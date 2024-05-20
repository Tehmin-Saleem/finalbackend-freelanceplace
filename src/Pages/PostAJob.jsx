//src/pages/PostJob.js
import React from "react";
// import Header from "../components/Header";
// import GreaterThan from "../svg coponents/GreaterThan";

const PostJob = () => {
  const steps = [
    { label: "", color: "#4BCBEB" }, // Blue
    { label: "", color: "#FF7F50" }, // Coral
    { label: "", color: "#3CB371" }, // Medium Sea Green
    { label: "D", color: "#FFD700" }, // Gold
    { label: "E", color: "#8A2BE2" }, // Blue Violet
    { label: "F", color: "#FF4500" }, // Orange Red
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Header /> */}
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 -mt-8 relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-2xl font-bold pl-8">Jobs</h2>
            {/* <GreaterThan /> */}
            <h2 className="text-2xl font-bold">Post a Job</h2>
          </div>
          <div className="relative mb-6 mt-10 ml-12 mr-12">
            <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-300"></div>
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center"
                >
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: step.color }}
                  >
                    <span className="text-white">{step.label}</span>
                  </div>
                  <div
                    className="absolute bottom-6 text-sm"
                    style={{ color: step.color }}
                  >
                    {`Label ${step.label}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-4">1/6 Job Title</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold">
                Let’s start with a strong title.
              </h4>
              <p className="text-gray-600 mt-2">
                This helps your job post stand out to the right candidates. It’s
                the first thing they’ll see, so make it count!
              </p>
            </div>
            <div>
              <label htmlFor="jobTitle" className="block text-gray-700">
                Enter job title:
              </label>
              <input
                type="text"
                id="jobTitle"
                className="mt-2 p-2 border border-gray-300 rounded w-full"
                placeholder="UI/UX Designer"
              />
              <div className="mt-2 text-gray-600">
                <strong>Example titles:</strong>
                <ul className="list-disc pl-5 mt-1">
                  <li>
                    Build responsive WordPress site with booking/payment
                    functionality
                  </li>
                  <li>
                    AR experience needed for virtual product demos (ARCore)
                  </li>
                  <li>
                    Developer needed to update Android app UI for new OS/device
                    specs
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600">
              Back
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
              Next: Description
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
