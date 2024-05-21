import React from "react";
import Card from "../components/Card"; // Adjust the path as necessary
import JobDropdwon from "../svg coponents/JobDropdwon";

const FreelancerCards = ({ freelancers }) => {
  return (
    <div className="container mx-auto p-12">
      <div className="flex flex-wrap justify-between items-center mb-4 w-full">
        <h3 className="text-xl font-semibold flex items-center w-full md:w-auto mb-2 md:mb-0 mr-2">
          Skills
          <JobDropdwon />
        </h3>
        <h3 className="text-xl font-semibold flex items-center w-full md:w-auto mb-2 md:mb-0 mr-2">
          Categories
          <JobDropdwon />
        </h3>
        <h3 className="text-xl font-semibold flex items-center w-full md:w-auto mb-2 md:mb-0 mr-2">
          Availability
          <JobDropdwon />
        </h3>
        <h3 className="text-xl font-semibold flex items-center w-full md:w-auto mb-2 md:mb-0 mr-2">
          Location
          <JobDropdwon />
        </h3>
        <h3 className="text-xl font-semibold flex items-center w-full md:w-auto mb-2 md:mb-0">
          Ratings
          <JobDropdwon />
        </h3>
      </div>

      <div className="flex flex-wrap -mx-2">
        {freelancers.map((freelancer) => (
          <div key={freelancer.id} className="w-full  p-2">
            <Card freelancer={freelancer} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreelancerCards;
