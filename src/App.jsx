import "./App.css";
// import SignUpSection from "./Pages/SignUpSection";
// import Dummy2 from "./Pages/SignUpSection";
// import ClientDashboard from "./Pages/ClientDashboard";
// import SignUpForm from "./Pages/SignUp";
import React from "react";
import Card from "./components/Card";
import FreelancerCards from "./components/FreelancerCards";
import SendOffer from "./components/SendOffer";

const freelancers = [
  {
    id: 1,
    picture: "https://picsum.photos/200/300",
    name: "John Doe",
    location: "New York, USA",
    field: ["Web Development", "Figma expert"],
    skills: ["HTML", "CSS", "JavaScript", "React", "Mongodb"],
    rate: 50,
    successRate: 95,
    amountEarned: 20000,
    description: "Act as a senior frontend developer...",
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
    </>
  );
}

export default App;
