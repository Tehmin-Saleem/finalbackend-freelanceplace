import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";
import { ProfileView, Proposal, JobsPage, SignIn, Signup,ClientDashboard , FreelancersDoneJobsPage ,ErrorPage , SignUpSection, OfferForm, PostJob, JobDetails, MyProfile , DescriptionPage, SkillManagement, Budget, ProjectDuration, Attachment , FreeLancerCard, ApplyJob , FreelanceDashboardPage, AllJobsPage} from "./Pages/index";
// import SendOffer from "./components/FormProposal/OfferForm";
import {Header, FreelancerCards} from "./components/index";
import SubmitProposal from "./Pages/SubmitProposal";
import Notification from "./Pages/Notifications";
import Chat from "./Pages/ChatPage";
// import OfferForm from "./components/FormProposal/OfferForm";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentMethod from "./Pages/PaymentMethod";
import ProposalPopup from "./components/PopUps/PropsalSubmit";
import Popup from "./components/PopUps/PropsalSubmit";
import ReviewPopup from "./components/PopUps/ReviewPopup";
// import PaymentMethod from './components/PaymentMethod';

// Load your Stripe public key
const stripePromise = loadStripe('your-stripe-publishable-key-here');


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

      <Route path="/Chat" element={<Chat/>} />
        <Route path="/Notifications" element={<Notification/>} />      
          <Route path="/" element={<SignUpSection />} />
        {/* <Route path="/profile" element={<ProfileView />} /> */}
        <Route path="/proposals" element={<Proposal />} />
        <Route path="/proposals/:jobId" element={<Proposal />} />
        <Route path="/alljobs" element={<AllJobsPage />} />
        <Route path="/matchingjobs" element={<JobsPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/freelancersjobpage" element={<FreelancersDoneJobsPage />} />
        <Route path="/offerform" element={<OfferForm/>} />
        <Route path="/FreelanceDashBoard" element={<FreelanceDashboardPage/>} />
        <Route path="/ApplyJob" element={<ApplyJob/>} />
        <Route path="/ApplyJob/:jobPostId" element={<ApplyJob />} />
        <Route path="/FreelanceCard" element={ <FreeLancerCard heading="UI/UX Designer" freelancers={freelancers} />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/ClientDashboard" element={<ClientDashboard/>} />
        <Route path="/JobPosting" element={<PostJob/>} /> 
        <Route path="/JobDescription" element={<DescriptionPage/>} />
        <Route path="/PreferredSkills" element={<SkillManagement/>} /> 
        <Route path="/Budget" element={<Budget/>} /> 
        <Route path="/ProjectDuration" element={<ProjectDuration/>} /> 
        <Route path="/Attachment" element={<Attachment/>} /> 
        <Route path="/ProjectDetails" element={<JobDetails/>} /> 
        <Route path="/myProfile" element={<MyProfile/>} /> 
        <Route path="/ErrorPage" element={<ErrorPage/>} /> 
        <Route path="/profile/:userId" element={<ProfileView />} />
        
        <Route path="/SubmitProposal/:jobPostId" element={<SubmitProposal/>} /> 
        <Route path="/SubmitProposal" element={<SubmitProposal/>} /> 
        <Route path="*" element={<ErrorPage />} />
        <Route path="/Payment" element={ <PaymentMethod/>}/>
        <Route path="/propsalPopUp" element={<Popup/>} />
        <Route path="/ReviewPopUp" element={<ReviewPopup/>} />
        <Route path="/Alljobspage" element={<AllJobsPage/>} /> 


      </Routes>
    </Router>
  );
}

export default App;






