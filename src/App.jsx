import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ProfileView, Proposal, JobsPage, SignIn, Signup , FreelancersDoneJobsPage} from "./Pages/index";
// import SendOffer from "./components/FormProposal/OfferForm";
import FreelancerCards from "./components/FreelancerCards";
import Header from "./components/Common/Header";
import DashboardPage from "./Pages/ClientDashboard";
import ErrorPage from "./Pages/ErrorPage";
import SignUpSection from "./Pages/SignUpSection";
import OfferForm from "./Pages/FormProposal";
import PostJob from "./Pages/PostAJob";
import JobDetails from "./Pages/JobDetails";
import MyProfile from "./Pages/Profile";
import DescriptionPage from "./Pages/JobDescription";
import SkillSelection from "./Pages/SkilSection";
import SkillManagement from "./Pages/SkilSection";
import Budget from "./Pages/Budget";
import ProjectDuration from "./Pages/ProjectDuration";
import Attachment from "./Pages/Attachment";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FreelancerCard from "./Pages/FreeLanceCard";
import ApplyJob from "./Pages/ApplyNow";
import FreelanceDashboardPage from "./Pages/FreelancerDashboard";
// import OfferForm from "./components/FormProposal/OfferForm";


const freelancers = [
  {
    name: 'Usman Shahid',
    location: 'Pakistan',
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
    smallProfilePic:'https://randomuser.me/api/portraits/women/2.jpg',

    roles: ['UI/UX Designer', 'Figma Expert', 'WordPress', 'Graphic Designer'],
    rate: '$12/hr',
    successRate: '96% Job Success',
    earnings: '$10k+ earned',
    skills: ['Mobile app design', 'Wireframe', 'Mockup', 'Prototyping', 'Figma', 'User flow', '+10'],
    description: 'I am an Upwork Verified and Experienced UI/UX/Graphic Designer with over 10+ years of quality experience in Websites, Mobile Apps, Branding, Editorials, Marketing Collateral, and much more...'
  },
  {
    name: 'Sara Khan',
    location: 'India',
    profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
    smallProfilePic:'https://randomuser.me/api/portraits/women/1.jpg',
    roles: ['UI/UX Designer', 'Web Developer'],
    rate: '$15/hr',
    successRate: '98% Job Success',
    earnings: '$15k+ earned',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Photoshop', '+8'],
    description: 'Passionate about creating seamless web experiences. With over 8 years in the industry, I specialize in front-end development, ensuring responsive and visually appealing designs.'
  },
  {
    name: 'Sara Khan',
    location: 'India',
    profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
    smallProfilePic:'https://randomuser.me/api/portraits/women/1.jpg',
    roles: ['UI/UX Designer', 'Web Developer'],
    rate: '$15/hr',
    successRate: '98% Job Success',
    earnings: '$15k+ earned',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Photoshop', '+8'],
    description: 'Passionate about creating seamless web experiences. With over 8 years in the industry, I specialize in front-end development, ensuring responsive and visually appealing designs.'
  },
  {
    name: 'Usman Shahid',
    location: 'Pakistan',
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
    smallProfilePic:'https://randomuser.me/api/portraits/women/2.jpg',

    roles: ['UI/UX Designer', 'Figma Expert', 'WordPress', 'Graphic Designer'],
    rate: '$12/hr',
    successRate: '96% Job Success',
    earnings: '$10k+ earned',
    skills: ['Mobile app design', 'Wireframe', 'Mockup', 'Prototyping', 'Figma', 'User flow', '+10'],
    description: 'I am an Upwork Verified and Experienced UI/UX/Graphic Designer with over 10+ years of quality experience in Websites, Mobile Apps, Branding, Editorials, Marketing Collateral, and much more...'
  },

  // Add more freelancers as needed
];



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/proposal" element={<Proposal />} />
        <Route path="/matchingjobs" element={<JobsPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/freelancersjobpage" element={<FreelancersDoneJobsPage />} />
        <Route path="/offerform" element={<OfferForm/>} />
        <Route path="/FreelanceDashBoard" element={<FreelanceDashboardPage/>} />
        <Route path="/ApplyJob" element={<ApplyJob/>} />
        <Route path="/FreelanceCard" element={ <FreelancerCard heading="UI/UX Designer" freelancers={freelancers} />} />
        <Route path="/signup" element={<SignUpSection/>} />
        <Route path="/ClientDashboard" element={<DashboardPage/>} />
        <Route path="/JobPosting" element={<PostJob/>} /> 
        <Route path="/JobDescription" element={<DescriptionPage/>} />
        <Route path="/PreferredSkills" element={<SkillManagement/>} /> 
        <Route path="/Budget" element={<Budget/>} /> 
        <Route path="/ProjectDuration" element={<ProjectDuration/>} /> 
        <Route path="/Attachment" element={<Attachment/>} /> 
        <Route path="/ProjectDetails" element={<JobDetails/>} /> 
        <Route path="/myProfile" element={<MyProfile/>} /> 
        <Route path="/ErrorPage" element={<ErrorPage/>} /> 
      </Routes>
    </Router>
  );
}

export default App;






