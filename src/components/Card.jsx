import React from "react";

const Card = ({ freelancer }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 my-4 w-full">
      <div className="flex mb-6 w-full">
        <div className="w-1/4">
          <img
            src={freelancer.picture}
            alt="Freelancer"
            className="mt-4  w-35 h-30"
          />
        </div>
        <div className="w-full  flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 ">
            <div className="flex items-center">
              <img
                src={freelancer.picture}
                alt="Freelancer"
                className="rounded-full w-10 h-10 mr-2"
              />
              <div>
                <h4 className="font-bold">{freelancer.name}</h4>
                <p>
                  {freelancer.location} | {freelancer.field}
                </p>
                <p className="text-gray-600">{freelancer.skills.join(" | ")}</p>
              </div>
            </div>
            <button className="bg-[#4BCBEB] text-white px-4 py-2 rounded">
              Invite a Job
            </button>
          </div>
          <div className="flex items-center mb-2 ml-12">
            <span className="font-semibold">${freelancer.rate}/hr</span>
            <span className="ml-2 text-green-500">
              {freelancer.successRate}% Success
            </span>
            <span className="ml-2">${freelancer.amountEarned} earned</span>
          </div>
          <div className="flex flex-wrap mb-1">
            {freelancer.skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-semibold mr-2 ml-12"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="text-gray-700 mb-8 ml-12">{freelancer.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
