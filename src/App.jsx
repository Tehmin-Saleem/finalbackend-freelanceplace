import "./App.css";
import React from "react";
import SendOffer from "./components/FormProposal/SendOffer";
import FreelancerCards from "./components/FreelanceCardDropdown/FreelancerCards";
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
      {/* <div className="container mx-auto p-4">
        {freelancers.map((freelancer, index) => (
          <Card key={index} freelancer={freelancer} />
        ))}
      </div> */}

      {/* <div>
        <FreelancerCards freelancers={freelancers} />
      </div> */}

      {/* <SignUpSection/> */}
      {/* <Dummy2/>   */}
      {/* <ClientDashboard/>  */}
      {/* <SignUpForm /> */}
      {/* <App /> */}
      <SendOffer />
      {/* <Textfield /> */}
    </>
  );
}

export default App;
