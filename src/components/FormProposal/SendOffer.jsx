import React, { useState } from "react";
import TextField from "../TextField/TextField";
import CrossIcon from "../../svg coponents/CrossIcon";
import PlusIcon from "../../svg coponents/PlusIcon";
import RateIcon from "../../svg coponents/RateIcon";
import ProfileIcon from "../../svg coponents/ProfileIcon";
import "./SendOffer.scss"; // Import the Sass file
import SearchIcon from "../../svg coponents/SearchIcon";
import TextArea from "../TextArea/TextArea";

const SkillBadge = ({ skill, onRemove }) => (
  <span className="skill-badge">
    {skill}
    <CrossIcon
      className="ml-1 cursor-pointer"
      onClick={() => onRemove(skill)}
    />
  </span>
);

const SkillOption = ({ skill, onAdd }) => (
  <button onClick={() => onAdd(skill)} className="skill-option">
    {skill}
    <PlusIcon className="ml-1" />
  </button>
);

const RateSelection = ({ selectedRate, onSelectRate }) => (
  <div className="rate-selection">
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
  <button className="attach-file-button">
    Attach File
    <svg className="ml-2" width="16" height="16" viewBox="0 0 24 24">
      {/* SVG Path for attachment icon */}
    </svg>
  </button>
);

const SubmitButtons = () => (
  <div className="submit-buttons">
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
  <div className="profile-info">
    <div className="profile-header">
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
    <div className="experience">
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
  const [description, setDescription] = useState("");
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
    <div className="container send-offer">
      <div className="w-full w-2-3 p-4 form-container">
        <h2 className="text-2xl font-bold mb-4 font-poppins">Send an offer</h2>
        <TextField
          label="Enter job title: "
          placeholder="UI/UX Designer"
          className="input-fieldes  "
        />
        <TextArea
          label="Description"
          placeholder="Enter About Your Project Details"
          className="input-fieldes"
          // value={description}
          // onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Search Skills or add you own"
          value={searchTerm}
          onChange={setSearchTerm}
          icon={<SearchIcon className="InputFieldsIcon" />}
          className="input-fieldes "
        />
        <h3 className="text-xl font-semibold mb-2">Selected Skills</h3>
        <div className="selected-skills">
          {selectedSkills.map((skill) => (
            <SkillBadge
              key={skill}
              skill={skill}
              onRemove={handleRemoveSkill}
            />
          ))}
        </div>

        <h3 className="text-xl font-semibold mb-2">
          Popular skills for UI/UX Designs
        </h3>
        <div className="popular-skills">
          {popularSkills.map((skill) => (
            <SkillOption key={skill} skill={skill} onAdd={handleAddSkill} />
          ))}
        </div>

        <RateSelection selectedRate={rateType} onSelectRate={setRateType} />
        <TextField
          label="Amount"
          placeholder="Enter amount"
          className="input-field"
        />
        <AttachFileButton />
        <SubmitButtons />
      </div>

      <ProfileInfo profile={profile} className="profile-container" />
    </div>
  );
};

export default SendOffer;
