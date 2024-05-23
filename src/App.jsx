import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Sign-up/Login";
import ProfileView from "./Pages/FreelancerProfileView/ProfileView";
import Proposal from "./Pages/ProposalsPage/Proposal";

function App() {
  return (
    <>
      {/* <Login /> */}
      <ProfileView />
      {/* <Proposal /> */}
    </>
  );
}

export default App;
