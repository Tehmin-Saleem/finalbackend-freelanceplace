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
// import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentMethod from "./Pages/PaymentMethod";
import ProposalPopup from "./components/PopUps/PropsalSubmit";
import Popup from "./components/PopUps/PropsalSubmit";
import ReviewPopup from "./components/PopUps/ReviewPopup";
import JobPostedPopup from "./components/PopUps/JobPosted";
import ChatProvider from "./context/ChatProvider.jsX";

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
        <Route path="/" element={<SignUpSection />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/proposals" element={<Proposal />} />
        <Route path="/proposals/:jobId" element={<Proposal />} />
        <Route path="/alljobs" element={<AllJobsPage />} />
        <Route path="/matchingjobs" element={<JobsPage />} />
        <Route path="/freelancersjobpage" element={<FreelancersDoneJobsPage />} />
        <Route path="/offerform" element={<OfferForm />} />
        <Route path="/freelancedashboard" element={<FreelanceDashboardPage />} />
        <Route path="/applyjob" element={<ApplyJob />} />
        <Route path="/applyjob/:jobPostId" element={<ApplyJob />} />
        <Route
          path="/freelancercard"
          element={<FreeLancerCard heading="UI/UX Designer" freelancers={freelancers} />}
        />
        <Route path="/clientdashboard" element={<ClientDashboard />} />
        <Route path="/jobposting" element={<PostJob />} />
        <Route path="/jobdescription" element={<DescriptionPage />} />
        <Route path="/preferredskills" element={<SkillManagement />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/projectduration" element={<ProjectDuration />} />
        <Route path="/attachment" element={<Attachment />} />
        <Route path="/projectdetails" element={<JobDetails />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/submitproposal/:jobPostId" element={<SubmitProposal />} />
        <Route path="/submitproposal" element={<SubmitProposal />} />
        <Route path="/payment" element={<PaymentMethod />} />
        <Route path="/proposalpopup" element={<Popup />} />
        <Route path="/reviewpopup" element={<ReviewPopup />} />
        <Route path="/jobpopup" element={<JobPostedPopup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />

        {/* Chat Route with ChatProvider */}
        <Route
          path="/chat"
          element={
            <ChatProvider>
              <Chat />
            </ChatProvider>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
    );
}

export default App;






