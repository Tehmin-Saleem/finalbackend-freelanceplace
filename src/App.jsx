import "./App.css";
import React from "react";
// import SendOffer from "./components/FormProposal/OfferForm";
import FreelancerCards from "./components/FreelancerCards/index";
import Header from "./components/Common/Header";
import DashboardPage from "./Pages/ClientDashboard";
import ErrorPage from "./Pages/ErrorPage";
import SignUpSection from "./Pages/SignUpSection";
// import OfferForm from "./components/FormProposal/OfferForm";
const freelancers = [
  {
    id: 1,
    picture: "https://picsum.photos/200/300",
    name: "Usman Shahid ",
    location: "Pakistan",
    field: ["UI/UX Designer| Figma Expert| Word Press|,Graphic Designer"],
    skills: [
      "Mobile app design",
      "Mobile app design",
      "Mockup",
      "Prototyping",
      "Figma",
      "User flow",
      "10",
    ],
    rate: "12",
    successRate: "96 Job ",
    amountEarned: "10k + ",
    description:
      "I am an Upwork Verified and Experienced UI/UX/Graphic Designer with over 10+ years of quality experience in Websites, Mobile Apps, Branding, Editorials, Marketing Collateral and much more.",
  },

  // Add more freelancer objects as needed
];
function App() {
  return (
    <>
      <div>
        <FreelancerCards freelancers={freelancers} />
      </div>
      {/* <Header /> */}
      {/* <DashboardPage /> */}
      {/* <ErrorPage /> */}
      {/* <SignUpSection /> */}
    </>
  );
}

export default App;
