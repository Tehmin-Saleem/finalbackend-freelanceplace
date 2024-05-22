// SendOffer.js

import React, { useState } from "react";
import TextField from "../TextField"; // Assuming you have already created this component
import CrossIcon from "../../svg coponents/CrossIcon";
import PlusIcon from "../../svg coponents/PlusIcon";
import RateIcon from "../../svg coponents/RateIcon";

import ProfileIcon from "../../svg coponents/ProfileIcon";

const SkillBadge = ({ skill, onRemove }) => (
  <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2 flex items-center skill-badge">
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
    className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2 flex items-center skill-option"
  >
    {skill}
    <PlusIcon className="ml-1" />
  </button>
);

const RateSelection = ({ selectedRate, onSelectRate }) => (
  <div className="flex items-center mb-4 rate-selection">
    <div
      className={`rate-type ${selectedRate === "hourly" ? "selected" : ""}`}
      onClick={() => onSelectRate("hourly")}
    >
      <RateIcon className="mr-2" />
      Hourly Rate
    </div>
    <div
      className={`rate-type ${selectedRate === "fixed" ? "selected" : ""}`}
      onClick={() => onSelectRate("fixed")}
    >
      <RateIcon className="mr-2" />
      Fixed Price
    </div>
  </div>
);

const AttachFileButton = () => (
  <button className="bg-[#4BCBEB] text-white px-4 py-2 rounded flex items-center attach-file-button">
    Attach File
    <svg className="ml-2" width="16" height="16" viewBox="0 0 24 24">
      {/* SVG Path for attachment icon */}
    </svg>
  </button>
);

const SubmitButtons = () => (
  <div className="flex justify-between mt-4 submit-buttons">
    <button className="bg-gray-500 text-white px-4 py-2 rounded">Back</button>
    <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
      Send Invite
      <svg className="ml-2" width="16" height="16" viewBox="0 0 24 24">
        {/* SVG Path for send icon */}
      </svg>
    </button>
  </div>
);

const ProfileInfo = ({ profile }) => (
  <div className="w-full lg:w-1/3 p-4 bg-gray-100 rounded-lg shadow-md profile-info">
    <div className="flex items-center mb-4 profile-header">
      <ProfileIcon className="w-12 h-12 mr-4" />
      <div>
        <h3 className="text-xl font-bold">{profile.name}</h3>
        <p>{profile.location}</p>
      </div>
    </div>
    <p className="mb-2">
      <span className="text-green-500">{profile.successRate}% Success</span> |
      Top Rated
    </p>
    <div className="mt-4 experience">
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
    <div className="container mx-auto p-4 flex flex-col lg:flex-row send-offer">
      <div className="w-full  p-4">
        <h2 className="text-2xl font-bold mb-4 font-poppins">Send an offer</h2>
        <TextField
          className={StyleSheet.Inputfield}
          // label="Enter job title:"
          // placeholder="UI/UX Designer"
          // className="font-Roboto"
        />
        <TextField label="Description" placeholder="Enter job description" />
        <TextField
          label="Search Skills"
          value={searchTerm}
          onChange={setSearchTerm}
        />

        <div className="flex flex-wrap mb-2 selected-skills">
          {selectedSkills.map((skill) => (
            <SkillBadge
              key={skill}
              skill={skill}
              onRemove={handleRemoveSkill}
            />
          ))}
        </div>

        <h3 className="text-xl font-semibold mb-2">Popular Skills</h3>
        <div className="flex flex-wrap mb-4 popular-skills">
          {popularSkills.map((skill) => (
            <SkillOption key={skill} skill={skill} onAdd={handleAddSkill} />
          ))}
        </div>

        <RateSelection selectedRate={rateType} onSelectRate={setRateType} />
        <TextField label="Amount" placeholder="Enter amount" />
        <AttachFileButton />
        <SubmitButtons />
      </div>

      <ProfileInfo profile={profile} />
    </div>
  );
};

export default SendOffer;
