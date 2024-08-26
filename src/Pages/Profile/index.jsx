// import React, { useState } from 'react';
// import './styles.scss';
// import { CrossIcon, IconSearchBar, UploadIcon, PlusIcon, DollarIcon } from '../../svg/index';
// import {Header} from "../../components/index"; // Ensure this path is correct

// const MyProfile = () => {
//   const [skills, setSkills] = useState([]);
//   const [skillInput, setSkillInput] = useState('');
//   const [selectedSkills, setSelectedSkills] = useState([]);

//   const handleAddSkill = () => {
//     if (skillInput && !selectedSkills.includes(skillInput)) {
//       setSelectedSkills([...selectedSkills, skillInput]);
//       setSkillInput('');
//     }
//   };

//   const handleRemoveSkill = (skill) => {
//     setSelectedSkills(selectedSkills.filter(s => s !== skill));
//   };

//   const popularSkills = [
//     'React', 'UI/UX Design', 'JavaScript', 'CSS', 'HTML', 'Figma'
//   ];

//   return (
//     <div className="my-profile">
//       <Header />

//       <div className="container">
//         <h1>My Profile</h1>

//         <div className="form-group">
//           <div className="labels-group">
//             <label>Enter your first name:</label>
//             <label className="ml-2">Enter your last name:</label>
//           </div>
//           <div className="input-group">
//             <input type="text" placeholder="First Name" />
//             <input type="text" placeholder="Last Name" />
//           </div>
//         </div>

//         <div className="form-group">
//           <p>Upload your profile image</p>
//           <div className="profile-image">
//             <img src="https://picsum.photos/seed/picsum/150" alt="Profile" />
//             <div className="upload-overlay">
//               <UploadIcon />
//               <span>Reupload</span>
//             </div>
//           </div>
//         </div>

//         <div className="field-group">
//           <label>Enter your title</label>
//           <input type="text" placeholder="Your Title" />
//         </div>

//         <div className="field-group">
//           <label>Experience</label>
//           <input type="text" placeholder="Experience" />
//         </div>

//         <div className="field-group">
//           <label>Enter hourly rate</label>
//           <div className="input-with-icon">
//             <span className="icon">$</span>
//             <input type="text" placeholder="Hourly Rate" />
//           </div>
//         </div>

//         <div className="form-group">
//           <h2>Profile Overview</h2>
//           <textarea placeholder="Enter your profile overview"></textarea>
//         </div>

//         <div className="form-group">
//           <h2>Search Skills or add your own:</h2>
//           <div className="search-bar">
//             <IconSearchBar alt="Search" />
//             <input
//               type="text"
//               value={skillInput}
//               onChange={(e) => setSkillInput(e.target.value)}
//               placeholder="Search skills..."
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <h2>Selected Skills</h2>
//           <div className="selected-skills">
//             {selectedSkills.map(skill => (
//               <div className="skill-badge" key={skill}>
//                 {skill}
//                 <CrossIcon
//                   alt="Remove"
//                   className="remove-skill"
//                   onClick={() => handleRemoveSkill(skill)}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="form-group">
//           <h2>Popular Skills for UI/UX Design</h2>
//           <div className="popular-skills">
//             {popularSkills.map(skill => (
//               <div
//                 className="skill-badge"
//                 key={skill}
//                 onClick={() => setSelectedSkills([...selectedSkills, skill])}
//               >
//                 {skill}
//                 <PlusIcon alt="Add" className="add-skill" />
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="form-group">
//           <h2>Add Your Portfolio</h2>
//           <div className="portfolio">
//             <div className="portfolio-box">
//               <img src="https://picsum.photos/seed/picsum/150" alt="Portfolio" />
//             </div>
//             <div className="portfolio-box add-box">
//               <PlusIcon />
//               <p>Add</p>
//             </div>
//           </div>
//         </div>

//         <button className="save-button">Save</button>
//       </div>
//     </div>
//   );
// };

// export default MyProfile;

// ========================================================
import React, { useState } from 'react';
import './styles.scss';
import { Cross, IconSearchBar, UploadIcon, PlusIcon } from '../../svg/index';
import { Header } from "../../components/index"; 


const MyProfile = () => {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleAddSkill = () => {
    if (skillInput && !selectedSkills.includes(skillInput)) {
      setSelectedSkills([...selectedSkills, skillInput]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const popularSkills = [
    'React', 'UI/UX Design', 'JavaScript', 'CSS', 'HTML', 'Figma'
  ];

  return (
    <div className="my-profile">
      <Header />

      <div className="profile-container">
        <h1>My Profile</h1>

        <div className="form-section">
          <div className="input-row">
            <div className="input-group">
              <label>Enter your first name:</label>
              <input type="text" placeholder="Usman" />
            </div>
            <div className="input-group">
              <label>Enter your last name:</label>
              <input type="text" placeholder="Shahid" />
            </div>
          </div>

          <div className="profile-image-section">
            <p>Upload your profile image</p>
            <div className='img-format'>
            <span>Support Format: PNG, JPEJ  </span>
            <span> Maximun Size: 5MB</span>
            </div>
            <div className="profile-image">
              <img src="https://picsum.photos/seed/picsum/150" alt="Profile" />
              <div className="upload-overlay">
                <UploadIcon />
                <span >Reupload</span>
              </div>
            </div>
          </div>

          <div className="field-group">
            <label>Enter your title</label>
            <input type="text" placeholder="UI/UX Designer, Graphic Designer" />
          </div>

          <div className="field-group">
            <label>Experience</label>
            <input type="text" placeholder="Enter your project completed" />
          </div>

          <div className="field-group">
            <label>Enter hourly rate</label>
            <div className="input-with-icon">
              <span className="icon">$</span>
              <input type="text" placeholder="120.00/hour" />
            </div>
          </div>

          <div className="form-group">
            <label>Profile Overview</label>
            <textarea placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."></textarea>
          </div>

          <div className="form-group">
            <label>Search Skills or add your own:</label>
            <div className="search-bar">
              <IconSearchBar alt="Search" />
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Search skills..."
              />
            </div>
          </div>

          <div className="form-group">
            <label>Selected Skills</label>
            <div className="selected-skills">
              {selectedSkills.map(skill => (
                <div className="skill-badge" key={skill}>
                  {skill}
                  <Cross
                    alt="Remove"
                    className="remove-skill"
                    onClick={() => handleRemoveSkill(skill)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Popular Skills for UI/UX Design</label>
            <div className="popular-skills">
              {popularSkills.map(skill => (
                <div
                  className="skill-badge"
                  key={skill}
                  onClick={() => setSelectedSkills([...selectedSkills, skill])}
                >
                  {skill}
                  <PlusIcon alt="Add" className="add-skill" />
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Add Your Portfolio</label>
            <div className="portfolio">
              <div className="portfolio-box">
                <div className='portfolio-title'>Enable Life-Care </div>
                <img src="https://picsum.photos/seed/picsum/150" alt="Portfolio" />
              </div>
              <div className="portfolio-box add-box">
                <PlusIcon />
                <p>Add</p>
              </div>
            </div>
          </div>

          <button className="save-button">Save</button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
