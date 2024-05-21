// Import necessary components
import React, { useState } from "react";
import TextField from "./TextField"; // Assuming you have already created this component
// import JobDropdwon from '../svg coponents/JobDropdwon';
import { ReactComponent as PlusIcon } from "../svg coponents/PlusIcon";
import { ReactComponent as CrossIcon } from "../svg coponents/CrossIcon";

const SkillBadge = ({ skill, onRemove }) => (
  <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2 flex items-center">
    {skill}
    <CrossIcon
      className="ml-1 cursor-pointer"
      onClick={() => onRemove(skill)}
    />
  </span>
);

const SkillOption = ({ skill, onAdd }) => (
  <button
    onClick={() => onAdd(skill)}
    className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2 flex items-center"
  >
    {skill}
    <PlusIcon className="ml-1" />
  </button>
);

const RateSelection = ({ selectedRate, onSelectRate }) => (
  <div className="flex items-center mb-4">
    <label className="flex items-center mr-4">
      <input
        type="radio"
        name="rate"
        value="hourly"
        checked={selectedRate === "hourly"}
        onChange={() => onSelectRate("hourly")}
      />
      <span className="ml-2">Hourly Rate</span>
    </label>
    <label className="flex items-center">
      <input
        type="radio"
        name="rate"
        value="fixed"
        checked={selectedRate === "fixed"}
        onChange={() => onSelectRate("fixed")}
      />
      <span className="ml-2">Fixed Price</span>
    </label>
  </div>
);

const AttachFileButton = () => (
  <button className="bg-[#4BCBEB] text-white px-4 py-2 rounded flex items-center">
    Attach File
    <svg className="ml-2" width="16" height="16" viewBox="0 0 24 24">
      {/* SVG Path for attachment icon */}
      <path
        fill="currentColor"
        d="M18.364 6.364a3.488 3.488 0 00-2.121-.879 3.48 3.48 0 00-2.828 1.414l-5.657 5.657c-1.172 1.172-1.172 3.071 0 4.243 1.172 1.172 3.071 1.172 4.243 0l5.657-5.657a.999.999 0 00-1.414-1.414l-5.657 5.657a1.001 1.001 0 01-1.415 0 1.001 1.001 0 010-1.414l5.657-5.657a1.493 1.493 0 011.061-.439c.383 0 .747.148 1.02.415s.415.637.415 1.02a1.493 1.493 0 01-.439 1.061l-5.657 5.657a2.997 2.997 0 01-4.243 0 2.997 2.997 0 010-4.243l5.657-5.657c.391-.391.902-.586 1.414-.586s1.023.195 1.414.586c.391.391.586.902.586 1.414s-.195 1.023-.586 1.414l-5.657 5.657a.999.999 0 00-.293.707c0 .256.098.512.293.707a.999.999 0 001.414 0l5.657-5.657c.781-.781 1.219-1.805 1.219-2.829s-.438-2.048-1.219-2.829z"
      />
    </svg>
  </button>
);

const SubmitButtons = () => (
  <div className="flex justify-between mt-4">
    <button className="bg-gray-500 text-white px-4 py-2 rounded">Back</button>
    <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
      Send Invite
      <svg className="ml-2" width="16" height="16" viewBox="0 0 24 24">
        {/* SVG Path for send icon */}
        <path fill="currentColor" d="M2.01 21l21-9L2.01 3v7l15 2-15 2z" />
      </svg>
    </button>
  </div>
);

const ProfileInfo = ({ profile }) => (
  <div className="w-full lg:w-1/3 p-4 bg-gray-100 rounded-lg shadow-md">
    <img
      src={profile.picture}
      alt="Profile"
      className="w-full h-48 object-cover rounded-lg mb-4"
    />
    <h3 className="text-xl font-bold">{profile.name}</h3>
    <p>{profile.location}</p>
    <p className="mt-2">
      <span className="text-green-500">{profile.successRate}% Success</span> |
      Top Rated
    </p>
    <div className="mt-4">
      <h4 className="font-bold">Experience:</h4>
      <div className="flex justify-between">
        <div className="text-center">
          <p className="text-xl font-bold">{profile.totalJobs}</p>
          <p>Total Jobs</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{profile.totalHours}</p>
          <p>Total Hours</p>
        </div>
      </div>
    </div>
  </div>
);

const SendOffer = () => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [rateType, setRateType] = useState("hourly");
  const [searchTerm, setSearchTerm] = useState("");
  const profile = {
    picture: "https://picsum.photos/200/300",
    name: "Jane Doe",
    location: "San Francisco, USA",
    successRate: 96,
    totalJobs: 198,
    totalHours: 1134,
  };

  const popularSkills = [
    "React",
    "JavaScript",
    "CSS",
    "HTML",
    "Node.js",
    "Python",
    "Django",
  ];

  const handleAddSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRemoveSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row">
      <div className="w-full lg:w-2/3 p-4">
        <h2 className="text-2xl font-bold mb-4">Send an Offer</h2>
        <TextField label="Title" placeholder="Enter job title" />
        <TextField label="Description" placeholder="Enter job description" />
        <TextField
          label="Search Skills"
          value={searchTerm}
          onChange={setSearchTerm}
        />

        <div className="flex flex-wrap mb-2">
          {selectedSkills.map((skill) => (
            <SkillBadge
              key={skill}
              skill={skill}
              onRemove={handleRemoveSkill}
            />
          ))}
        </div>

        <h3 className="text-xl font-semibold mb-2">Popular Skills</h3>
        <div className="flex flex-wrap mb-4">
          {popularSkills.map((skill) => (
            <SkillOption key={skill} skill={skill} onAdd={handleAddSkill} />
          ))}
        </div>

        <RateSelection selectedRate={rateType} onSelectRate={setRateType} />
        <InputField label="Amount" placeholder="Enter amount" />
        <AttachFileButton />
        <SubmitButtons />
      </div>

      <ProfileInfo profile={profile} />
    </div>
  );
};

export default SendOffer;
